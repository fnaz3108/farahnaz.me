const accent = '#e8b93f';
const inquiryRecipient = 'fnaz3108@gmail.com';
const publicContactEmail = 'fnaz3108@gmail.com';

const style = document.createElement('style');
style.textContent = `
  .availability{cursor:pointer;}
  .contact-callout{
    position:fixed;right:24px;bottom:24px;z-index:72;
    display:inline-flex;align-items:center;gap:10px;
    padding:13px 17px;border:1px solid rgba(255,255,255,.2);border-radius:999px;
    background:rgba(12,12,13,.88);color:#f5f1e8;
    backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    font:700 .62rem/1 'Manrope','Helvetica Neue',sans-serif;
    letter-spacing:.12em;text-transform:uppercase;cursor:pointer;
    box-shadow:0 12px 36px rgba(0,0,0,.18);
    transition:transform .25s ease,border-color .25s ease,background .25s ease,color .25s ease;
  }
  .contact-callout i{width:7px;height:7px;border-radius:50%;background:${accent};box-shadow:0 0 14px rgba(232,185,63,.6);}
  .contact-callout:hover{transform:translateY(-3px);background:${accent};color:#0a0a0b;border-color:${accent};}
  .contact-callout:hover i{background:#0a0a0b;box-shadow:none;}

  .inquiry-modal{
    position:fixed;inset:0;z-index:140;display:grid;place-items:center;
    padding:28px;background:rgba(5,5,6,.62);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;
  }
  .inquiry-modal.is-open{opacity:1;visibility:visible;}
  .inquiry-panel{
    position:relative;width:min(760px,100%);max-height:min(820px,calc(100vh - 56px));overflow:auto;
    padding:48px;background:#111113;color:#f3f0e9;border:1px solid rgba(255,255,255,.13);
    box-shadow:0 30px 100px rgba(0,0,0,.45);
    transform:translateY(18px) scale(.985);transition:transform .35s cubic-bezier(.2,.8,.2,1);
  }
  .inquiry-modal.is-open .inquiry-panel{transform:none;}
  .inquiry-close{position:absolute;right:24px;top:22px;color:#aaa69e;cursor:pointer;font-size:.65rem;letter-spacing:.13em;text-transform:uppercase;}
  .inquiry-close:hover{color:#fff;}
  .inquiry-kicker{margin:0 0 18px;color:${accent};font-size:.62rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;}
  .inquiry-panel h2{margin:0 0 14px;max-width:620px;font-size:clamp(2.6rem,6vw,5.2rem);line-height:.88;letter-spacing:-.06em;}
  .inquiry-intro{margin:0 0 36px;max-width:520px;color:#aaa69e;line-height:1.6;font-size:.9rem;}
  .inquiry-form{display:grid;grid-template-columns:1fr 1fr;gap:22px 18px;}
  .inquiry-field{display:flex;flex-direction:column;gap:9px;}
  .inquiry-field.full{grid-column:1/-1;}
  .inquiry-field label{font-size:.58rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#aaa69e;}
  .inquiry-field input,.inquiry-field select,.inquiry-field textarea{
    width:100%;border:0;border-bottom:1px solid rgba(255,255,255,.22);border-radius:0;
    padding:12px 0;background:transparent;color:#f5f1e8;outline:none;
    font:500 .9rem/1.4 'Manrope','Helvetica Neue',sans-serif;
    transition:border-color .2s ease;
  }
  .inquiry-field select{appearance:auto;color-scheme:dark;}
  .inquiry-field textarea{min-height:105px;resize:vertical;}
  .inquiry-field input:focus,.inquiry-field select:focus,.inquiry-field textarea:focus{border-color:${accent};}
  .inquiry-submit{
    grid-column:1/-1;justify-self:start;margin-top:8px;padding:14px 19px;border-radius:999px;
    background:${accent};color:#0a0a0b;cursor:pointer;
    font:800 .62rem/1 'Manrope','Helvetica Neue',sans-serif;letter-spacing:.13em;text-transform:uppercase;
    transition:transform .25s ease,opacity .2s ease;
  }
  .inquiry-submit:hover{transform:translateY(-2px);}
  .inquiry-submit:disabled{opacity:.55;cursor:wait;transform:none;}
  .inquiry-fallback{grid-column:1/-1;margin:4px 0 0;color:#777;font-size:.68rem;line-height:1.6;}
  .inquiry-fallback a{color:#c9c5bc;border-bottom:1px solid rgba(255,255,255,.22);}
  .inquiry-status{grid-column:1/-1;min-height:18px;margin:0;color:${accent};font-size:.68rem;line-height:1.5;}
  html.inquiry-open,html.inquiry-open body{overflow:hidden;}

  @media(max-width:700px){
    .contact-callout{right:14px;bottom:14px;padding:12px 14px;}
    .inquiry-modal{padding:0;align-items:end;}
    .inquiry-panel{width:100%;max-height:92svh;padding:38px 22px 30px;border-left:0;border-right:0;border-bottom:0;}
    .inquiry-form{grid-template-columns:1fr;}
    .inquiry-field.full,.inquiry-submit,.inquiry-fallback,.inquiry-status{grid-column:1;}
  }
`;
document.head.appendChild(style);

const modal = document.createElement('div');
modal.className = 'inquiry-modal';
modal.id = 'inquiryModal';
modal.setAttribute('aria-hidden','true');
modal.innerHTML = `
  <section class="inquiry-panel" role="dialog" aria-modal="true" aria-labelledby="inquiryTitle">
    <button class="inquiry-close" type="button" aria-label="Close contact form">Close ×</button>
    <p class="inquiry-kicker">Available for selected projects</p>
    <h2 id="inquiryTitle">Have a project<br>in mind?</h2>
    <p class="inquiry-intro">Tell me a little about what you're creating and what you need. I'll get back to you as soon as I can.</p>
    <form class="inquiry-form" id="inquiryForm">
      <div class="inquiry-field"><label for="inquiryName">Name</label><input id="inquiryName" name="name" autocomplete="name" required></div>
      <div class="inquiry-field"><label for="inquiryEmail">Email</label><input id="inquiryEmail" name="email" type="email" autocomplete="email" required></div>
      <div class="inquiry-field full"><label for="inquiryType">Project type</label><select id="inquiryType" name="project_type" required><option value="" selected disabled>Select a project type</option><option>3D Modeling</option><option>Product Visualization</option><option>Environment / Interior</option><option>Exhibition / Spatial Design</option><option>Animation / Motion</option><option>Other</option></select></div>
      <div class="inquiry-field full"><label for="inquiryMessage">Tell me about the project</label><textarea id="inquiryMessage" name="message" required></textarea></div>
      <button class="inquiry-submit" type="submit">Send Inquiry ↗</button>
      <p class="inquiry-status" aria-live="polite"></p>
      <p class="inquiry-fallback">Prefer email? <a href="mailto:${publicContactEmail}">${publicContactEmail}</a></p>
    </form>
  </section>`;
document.body.appendChild(modal);

const callout = document.createElement('button');
callout.type = 'button';
callout.className = 'contact-callout';
callout.setAttribute('aria-label','Start a project with Farah Naz');
callout.innerHTML = '<i></i><span>Start a project ↗</span>';
document.body.appendChild(callout);

const availability = document.querySelector('.availability');
const footerEmail = document.querySelector('.contact-row a[href^="mailto:"]');

if (availability) {
  availability.setAttribute('role','button');
  availability.setAttribute('tabindex','0');
  availability.setAttribute('aria-haspopup','dialog');
  availability.setAttribute('aria-controls','inquiryModal');
}
if (footerEmail) {
  footerEmail.setAttribute('aria-haspopup','dialog');
  footerEmail.setAttribute('aria-controls','inquiryModal');
}

const closeBtn = modal.querySelector('.inquiry-close');
const form = modal.querySelector('#inquiryForm');
const status = modal.querySelector('.inquiry-status');
const submitBtn = modal.querySelector('.inquiry-submit');
let lastTrigger = null;

function openModal(trigger){
  lastTrigger = trigger || document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.documentElement.classList.add('inquiry-open');
  window.setTimeout(()=>modal.querySelector('#inquiryName')?.focus(),120);
}
function closeModal(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.documentElement.classList.remove('inquiry-open');
  lastTrigger?.focus?.();
}

callout.addEventListener('click',()=>openModal(callout));
availability?.addEventListener('click',()=>openModal(availability));
availability?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(availability);}});
footerEmail?.addEventListener('click',e=>{e.preventDefault();openModal(footerEmail);});
closeBtn.addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal();});

form.addEventListener('submit',async e=>{
  e.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const payload = {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    project_type: String(data.get('project_type') || '').trim(),
    message: String(data.get('message') || '').trim(),
    _subject: 'New FarahNaz.me portfolio inquiry',
    _template: 'table'
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  status.textContent = 'Sending your inquiry…';

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inquiryRecipient)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(()=>({}));
    if (!response.ok || result.success === false) throw new Error(result.message || 'Submission failed');

    status.textContent = 'Thanks — your inquiry has been sent.';
    form.reset();
    submitBtn.textContent = 'Sent ✓';
    window.setTimeout(()=>{
      closeModal();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry ↗';
      status.textContent = '';
    },1800);
  } catch (error) {
    console.error('Inquiry submission failed:', error);
    status.textContent = 'Could not send right now. Please try again or use Farah’s email below.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Inquiry ↗';
  }
});
