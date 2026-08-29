// Typography-only layer. Keeps layout and interaction code untouched.
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
document.head.appendChild(fontLink);

const style = document.createElement('style');
style.textContent = `
  :root{--font-sans:'Manrope','Helvetica Neue',Helvetica,sans-serif;}
  body{font-family:var(--font-sans);}
  .hero h1{
    font-family:var(--font-sans);
    font-weight:800;
    letter-spacing:-.065em;
    line-height:.76;
  }
  .brand,
  .site-header nav,
  .availability,
  .kicker,
  .hero-note,
  .hero-link,
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
`;
document.head.appendChild(style);
