(() => {
  const projectView = document.querySelector('#projectView');
  if (!projectView) return;

  const style = document.createElement('style');
  style.textContent = `
    #projectView .project-hero > #projectImage,
    #projectView .project-frames img {
      cursor: zoom-in;
    }

    .image-lightbox {
      position: fixed;
      inset: 0;
      z-index: 50000;
      display: grid;
      grid-template-columns: 72px minmax(0, 1fr) 72px;
      grid-template-rows: 72px minmax(0, 1fr) 64px;
      background: rgba(5, 5, 6, .97);
      color: #f4f1e9;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity .28s ease, visibility .28s step-end;
    }

    .image-lightbox.is-open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition: opacity .28s ease, visibility 0s;
    }

    .image-lightbox__stage {
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(72px, 8vw, 112px) clamp(28px, 7vw, 110px) clamp(70px, 8vw, 100px);
      overflow: hidden;
      cursor: zoom-out;
    }

    .image-lightbox__image {
      display: block;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      user-select: none;
      -webkit-user-drag: none;
      transform: scale(.985);
      opacity: 0;
      transition: opacity .32s ease, transform .46s cubic-bezier(.22,.61,.36,1);
      box-shadow: 0 24px 80px rgba(0,0,0,.28);
      cursor: default;
    }

    .image-lightbox.is-open .image-lightbox__image.is-ready {
      opacity: 1;
      transform: scale(1);
    }

    .image-lightbox__close,
    .image-lightbox__nav {
      appearance: none;
      border: 0;
      color: inherit;
      background: transparent;
      font: inherit;
      cursor: pointer;
      z-index: 2;
    }

    .image-lightbox__close {
      position: absolute;
      top: 24px;
      right: 28px;
      padding: 10px 0;
      font-size: 11px;
      letter-spacing: .16em;
      line-height: 1;
    }

    .image-lightbox__close::after {
      content: ' ×';
      font-size: 17px;
      letter-spacing: 0;
      vertical-align: -1px;
    }

    .image-lightbox__nav {
      position: absolute;
      top: 50%;
      width: 52px;
      height: 72px;
      transform: translateY(-50%);
      display: grid;
      place-items: center;
      font-size: 28px;
      font-weight: 200;
      opacity: .62;
      transition: opacity .2s ease, transform .2s ease;
    }

    .image-lightbox__nav:hover { opacity: 1; }
    .image-lightbox__prev { left: 12px; }
    .image-lightbox__next { right: 12px; }
    .image-lightbox__prev:hover { transform: translate(-3px,-50%); }
    .image-lightbox__next:hover { transform: translate(3px,-50%); }

    .image-lightbox__counter {
      position: absolute;
      left: 50%;
      bottom: 25px;
      transform: translateX(-50%);
      font-size: 10px;
      line-height: 1;
      letter-spacing: .2em;
      color: rgba(244,241,233,.55);
      font-variant-numeric: tabular-nums;
      z-index: 2;
    }

    body.image-lightbox-open {
      overflow: hidden !important;
    }

    @media (max-width: 760px) {
      .image-lightbox {
        grid-template-columns: 48px minmax(0,1fr) 48px;
        grid-template-rows: 58px minmax(0,1fr) 52px;
      }
      .image-lightbox__stage {
        padding: 62px 14px 58px;
      }
      .image-lightbox__close {
        top: 14px;
        right: 16px;
      }
      .image-lightbox__nav {
        width: 42px;
        height: 58px;
        font-size: 24px;
        background: rgba(5,5,6,.28);
      }
      .image-lightbox__prev { left: 0; }
      .image-lightbox__next { right: 0; }
      .image-lightbox__counter { bottom: 18px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .image-lightbox,
      .image-lightbox__image {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Project image viewer');
  lightbox.innerHTML = `
    <div class="image-lightbox__stage" data-lightbox-close>
      <img class="image-lightbox__image" alt="" />
    </div>
    <button class="image-lightbox__close" type="button" aria-label="Close image viewer">CLOSE</button>
    <button class="image-lightbox__nav image-lightbox__prev" type="button" aria-label="Previous image">←</button>
    <button class="image-lightbox__nav image-lightbox__next" type="button" aria-label="Next image">→</button>
    <div class="image-lightbox__counter" aria-live="polite"></div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('.image-lightbox__image');
  const closeButton = lightbox.querySelector('.image-lightbox__close');
  const prevButton = lightbox.querySelector('.image-lightbox__prev');
  const nextButton = lightbox.querySelector('.image-lightbox__next');
  const counter = lightbox.querySelector('.image-lightbox__counter');

  let images = [];
  let index = 0;
  let lastTrigger = null;

  function collectImages() {
    const candidates = [
      projectView.querySelector('#projectImage'),
      ...projectView.querySelectorAll('.project-frames img')
    ].filter(Boolean);

    const unique = [];
    const seen = new Set();
    candidates.forEach(img => {
      const src = img.currentSrc || img.src;
      if (!src || seen.has(src)) return;
      seen.add(src);
      unique.push({ src, alt: img.alt || 'Project image', element: img });
    });
    return unique;
  }

  function renderImage() {
    const item = images[index];
    if (!item) return;
    lightboxImage.classList.remove('is-ready');
    lightboxImage.alt = item.alt;
    counter.textContent = `${String(index + 1).padStart(2,'0')} / ${String(images.length).padStart(2,'0')}`;
    const showNav = images.length > 1;
    prevButton.hidden = !showNav;
    nextButton.hidden = !showNav;
    counter.hidden = !showNav;

    const reveal = () => requestAnimationFrame(() => lightboxImage.classList.add('is-ready'));
    lightboxImage.onload = reveal;
    lightboxImage.src = item.src;
    if (lightboxImage.complete) reveal();
  }

  function openLightbox(trigger) {
    images = collectImages();
    if (!images.length) return;
    lastTrigger = trigger;
    const triggerSrc = trigger.currentSrc || trigger.src;
    const found = images.findIndex(item => item.src === triggerSrc);
    index = found >= 0 ? found : 0;
    renderImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('image-lightbox-open');
    closeButton.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('image-lightbox-open');
    lightboxImage.classList.remove('is-ready');
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus?.({ preventScroll: true });
  }

  function move(delta) {
    if (images.length < 2) return;
    index = (index + delta + images.length) % images.length;
    renderImage();
  }

  projectView.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.id !== 'projectImage' && !target.closest('.project-frames')) return;
    event.preventDefault();
    event.stopPropagation();
    openLightbox(target);
  });

  closeButton.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox || event.target.hasAttribute?.('data-lightbox-close')) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  }, true);
})();
