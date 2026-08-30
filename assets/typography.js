const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
document.head.appendChild(fontLink);

document.documentElement.style.setProperty('--accent', '#e8b93f');

const style = document.createElement('style');
style.textContent = `
  :root{--font-sans:'Manrope','Helvetica Neue',Helvetica,sans-serif;--accent:#e8b93f;}
  body{font-family:var(--font-sans);}
  .hero h1{
    font-family:var(--font-sans);
    font-weight:800;
    letter-spacing:-.065em;
    line-height:.76;
  }
  .hero h1 span:last-child{
    color:rgba(22,22,23,.96);
    -webkit-text-stroke:1px rgba(255,255,255,.78);
    paint-order:stroke fill;
  }
  .brand,
  .site-header nav,
  .availability,
  .kicker,
  .hero-note,
  .hero-link,
  .resume-download,
  .scroll-label,
  .card-info,
  .card-index,
  .about-copy,
  .skill-cloud,
  .tools,
  .contact-row,
  footer,
  .project-view{
    font-family:var(--font-sans);
  }
  .section-intro h2,
  .about h2,
  .contact h2,
  .project-title-wrap h2{
    font-family:var(--font-sans);
  }
  .section-intro h2 em,
  .about h2 em,
  .contact h2 em{
    font-family:Georgia,'Times New Roman',serif;
  }
  .orbit{border-color:rgba(232,185,63,.5);}
  .face{border-color:rgba(232,185,63,.55);}
  .edge{background:rgba(232,185,63,.55);}
  .webgl-fallback{border-color:rgba(232,185,63,.28);}

  /* Keep the About portrait fully inside its circular mask. */
  .portrait-orbit{
    background:#292b30;
  }
  .portrait-orbit img{
    position:static !important;
    top:auto !important;
    width:100%;
    height:100%;
    object-fit:cover;
    object-position:center center;
  }

  /* Resume download actions */
  .resume-download{
    display:inline-flex;
    align-items:center;
    gap:12px;
    width:max-content;
    padding:11px 15px;
    border:1px solid rgba(255,255,255,.24);
    border-radius:999px;
    font-size:.64rem;
    font-weight:600;
    letter-spacing:.12em;
    text-transform:uppercase;
    transition:background .25s ease,color .25s ease,border-color .25s ease,transform .25s ease;
  }
  .resume-download:hover{
    background:var(--accent);
    color:#0a0a0b;
    border-color:var(--accent);
    transform:translateY(-2px);
  }
  .hero-resume-download{
    pointer-events:auto;
    margin:18px 0 0 12vw;
  }
  .about-resume-download{
    margin-top:24px;
  }
  @media(max-width:900px){
    .hero-resume-download{margin-left:12vw;}
  }
`;
document.head.appendChild(style);

const resumeHref = 'assets/Farah-Naz-Resume.pdf';

const heroWorkLink = document.querySelector('.hero-link');
if (heroWorkLink && !document.querySelector('.hero-resume-download')) {
  const heroResume = document.createElement('a');
  heroResume.className = 'resume-download hero-resume-download';
  heroResume.href = resumeHref;
  heroResume.download = 'Farah-Naz-Resume.pdf';
  heroResume.setAttribute('aria-label', 'Download Farah Naz resume');
  heroResume.innerHTML = 'Download Resume <span>↓</span>';
  heroWorkLink.insertAdjacentElement('afterend', heroResume);
}

const aboutTools = document.querySelector('.about-copy .tools');
if (aboutTools && !document.querySelector('.about-resume-download')) {
  const aboutResume = document.createElement('a');
  aboutResume.className = 'resume-download about-resume-download';
  aboutResume.href = resumeHref;
  aboutResume.download = 'Farah-Naz-Resume.pdf';
  aboutResume.setAttribute('aria-label', 'Download Farah Naz resume');
  aboutResume.innerHTML = 'Download Resume <span>↓</span>';
  aboutTools.insertAdjacentElement('afterend', aboutResume);
}
