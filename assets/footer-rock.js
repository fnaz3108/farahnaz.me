const footer = document.querySelector('footer');

if (footer && !footer.querySelector('.footer-rock-signature')) {
  document.documentElement.style.setProperty('--accent', '#e8b93f');

  const style = document.createElement('style');
  style.textContent = `
    .footer-rock-signature{
      position:relative;
      width:min(420px,38vw);
      aspect-ratio:1.55/1;
      flex:0 0 auto;
      margin:-94px 0 -22px auto;
      pointer-events:none;
      isolation:isolate;
    }
    .footer-rock-signature .fr-orbit{
      position:absolute;
      left:4%;right:1%;top:25%;height:48%;
      border:1px solid rgba(232,185,63,.78);
      border-radius:50%;
      transform:rotate(-7deg);
      z-index:1;
    }
    .footer-rock-signature .fr-orbit.fr-orbit-white{
      left:15%;right:10%;top:30%;height:39%;
      border-color:rgba(244,241,233,.34);
      transform:rotate(11deg);
    }
    .footer-rock-signature .fr-rock{
      position:absolute;
      width:50%;height:77%;
      left:27%;top:9%;
      clip-path:polygon(19% 3%,60% 0,88% 16%,100% 47%,88% 82%,61% 99%,25% 93%,4% 70%,0 34%);
      background:
        radial-gradient(circle at 31% 22%,rgba(255,255,255,.13),transparent 13%),
        radial-gradient(circle at 70% 64%,rgba(255,255,255,.07),transparent 18%),
        radial-gradient(circle at 48% 42%,#242426 0,#151517 37%,#09090a 74%),
        linear-gradient(132deg,#343438 0,#101012 34%,#232326 49%,#070708 78%);
      box-shadow:inset -22px -24px 36px rgba(0,0,0,.72),inset 17px 13px 24px rgba(255,255,255,.045),0 28px 50px rgba(0,0,0,.48);
      z-index:2;
    }
    .footer-rock-signature .fr-rock:before,
    .footer-rock-signature .fr-rock:after{
      content:"";position:absolute;inset:0;
      clip-path:inherit;
    }
    .footer-rock-signature .fr-rock:before{
      background:
        linear-gradient(28deg,transparent 15%,rgba(255,255,255,.05) 16%,transparent 18%) 0 0/36px 31px,
        linear-gradient(155deg,transparent 24%,rgba(255,255,255,.04) 25%,transparent 28%) 0 0/47px 42px;
      opacity:.65;
      mix-blend-mode:screen;
    }
    .footer-rock-signature .fr-rock:after{
      background:radial-gradient(circle at 68% 32%,transparent 0 20%,rgba(0,0,0,.24) 21% 42%,transparent 43%);
      opacity:.7;
    }
    .footer-rock-signature .fr-monogram{
      position:absolute;
      left:29%;top:9%;width:48%;height:76%;
      z-index:4;
      font-family:Arial,Helvetica,sans-serif;
      font-weight:900;
      color:#e8b93f;
      filter:drop-shadow(0 4px 2px rgba(0,0,0,.45));
    }
    .footer-rock-signature .fr-letter{
      position:absolute;
      line-height:.78;
      font-size:clamp(72px,7vw,118px);
      letter-spacing:-.09em;
      text-shadow:
        1px 1px 0 #f6d46f,
        2px 2px 0 #c89425,
        3px 3px 0 #9f7218,
        7px 10px 16px rgba(0,0,0,.62);
    }
    .footer-rock-signature .fr-f{left:9%;top:13%;}
    .footer-rock-signature .fr-n{right:6%;bottom:5%;}
    .footer-rock-signature .fr-slash{
      position:absolute;
      left:50%;top:15%;width:5px;height:72%;
      border-radius:999px;
      background:linear-gradient(#f6d46f,#e8b93f 54%,#aa7819);
      transform:rotate(22deg);
      box-shadow:2px 3px 7px rgba(0,0,0,.48);
    }
    .footer-rock-signature .fr-sphere{
      position:absolute;width:23px;height:23px;border-radius:50%;z-index:5;
      background:radial-gradient(circle at 32% 26%,#ffe38a 0 10%,#e8b93f 28%,#9d701b 68%,#221a09 100%);
      box-shadow:0 5px 10px rgba(0,0,0,.42);
    }
    .footer-rock-signature .fr-sphere-one{left:7%;top:39%;}
    .footer-rock-signature .fr-sphere-two{right:2%;top:58%;width:31px;height:31px;}
    .footer-rock-signature .fr-sphere-two:before{
      content:"";position:absolute;width:16px;height:12px;border-radius:50%;background:#121214;left:-3px;top:-2px;transform:rotate(-24deg);
    }
    footer.footer-has-rock{
      position:relative;
      min-height:116px;
      align-items:center;
      overflow:visible;
    }
    footer.footer-has-rock>span{position:relative;z-index:6;}
    @media(max-width:900px){
      footer.footer-has-rock{min-height:150px;align-items:flex-end;}
      .footer-rock-signature{position:absolute;width:230px;right:8px;top:-66px;margin:0;opacity:.88;}
      footer.footer-has-rock>span:last-of-type{max-width:46%;text-align:right;}
    }
    @media(max-width:560px){
      .footer-rock-signature{width:190px;right:-18px;top:-54px;opacity:.72;}
      footer.footer-has-rock{min-height:136px;}
    }
  `;
  document.head.appendChild(style);

  const signature = document.createElement('div');
  signature.className = 'footer-rock-signature';
  signature.setAttribute('aria-hidden', 'true');
  signature.innerHTML = `
    <span class="fr-orbit"></span>
    <span class="fr-orbit fr-orbit-white"></span>
    <span class="fr-sphere fr-sphere-one"></span>
    <span class="fr-sphere fr-sphere-two"></span>
    <span class="fr-rock"></span>
    <span class="fr-monogram">
      <span class="fr-letter fr-f">F</span>
      <span class="fr-slash"></span>
      <span class="fr-letter fr-n">N</span>
    </span>
  `;

  footer.classList.add('footer-has-rock');
  footer.appendChild(signature);
}
