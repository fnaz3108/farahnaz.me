const BIRTHDAY_START = new Date('2026-08-31T00:00:00+05:00').getTime();
const BIRTHDAY_END = new Date('2026-09-01T00:00:00+05:00').getTime();
const SECRET_CODE = 'FARAH31';
const now = Date.now();
const inBirthdayWindow = now >= BIRTHDAY_START && now < BIRTHDAY_END;
const params = new URLSearchParams(window.location.search);
const secretRequested = params.get('birthday') === '1';

const css = document.createElement('style');
css.textContent = `
  .birthday-modal{
    position:fixed;inset:0;z-index:180;display:grid;place-items:center;
    background:#0b0b0c;color:#f5f1e8;overflow:hidden;
    opacity:0;visibility:hidden;transition:opacity .7s ease,visibility .7s ease;
  }
  .birthday-modal.is-open{opacity:1;visibility:visible;}
  .birthday-modal::before{
    content:"";position:absolute;inset:-20%;pointer-events:none;
    background:
      radial-gradient(circle at 25% 25%,rgba(232,185,63,.16),transparent 26%),
      radial-gradient(circle at 76% 70%,rgba(255,255,255,.07),transparent 22%),
      radial-gradient(circle at 52% 48%,rgba(232,185,63,.08),transparent 34%);
    filter:blur(16px);
  }
  .birthday-stars{position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:radial-gradient(rgba(255,255,255,.9) .7px,transparent .8px);background-size:34px 34px;mask-image:linear-gradient(to bottom,#000,transparent 92%);}
  .birthday-shape{position:absolute;pointer-events:none;opacity:.9;filter:drop-shadow(0 26px 50px rgba(0,0,0,.34));}
  .birthday-sphere{width:180px;aspect-ratio:1;border-radius:50%;left:6vw;top:12vh;background:radial-gradient(circle at 34% 28%,#d8d3ca 0,#9a968e 44%,#595752 100%);animation:bdayFloat 9s ease-in-out infinite;}
  .birthday-cube{width:142px;height:142px;right:8vw;top:16vh;background:linear-gradient(145deg,#cbc6bd,#7f7b74);border-radius:18px;transform:rotate(22deg);animation:bdayCube 11s ease-in-out infinite;}
  .birthday-pyramid{width:0;height:0;right:10vw;bottom:8vh;border-left:86px solid transparent;border-right:86px solid transparent;border-bottom:150px solid #a39f97;filter:drop-shadow(0 28px 50px rgba(0,0,0,.28));animation:bdayPyramid 10s ease-in-out infinite;}
  @keyframes bdayFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(16px,-20px,0)}}
  @keyframes bdayCube{0%,100%{transform:rotate(22deg) translateY(0)}50%{transform:rotate(34deg) translateY(-18px)}}
  @keyframes bdayPyramid{0%,100%{transform:rotate(-6deg) translateY(0)}50%{transform:rotate(3deg) translateY(-16px)}}
  .birthday-close{position:absolute;right:28px;top:24px;z-index:3;color:#f5f1e8;cursor:pointer;font:700 .64rem/1 'Manrope','Helvetica Neue',sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:10px 0;}
  .birthday-close::after{content:"";position:absolute;left:0;right:0;bottom:3px;height:1px;background:#e8b93f;transform-origin:left;transition:transform .25s ease;}
  .birthday-close:hover::after{transform:scaleX(.45);}
  .birthday-card{position:relative;z-index:2;width:min(980px,88vw);text-align:center;padding:9vh 4vw;}
  .birthday-kicker{margin:0 0 18px;color:#e8b93f;font:700 .64rem/1 'Manrope','Helvetica Neue',sans-serif;letter-spacing:.24em;text-transform:uppercase;}
  .birthday-title{margin:0;font-family:'Manrope','Helvetica Neue',sans-serif;font-weight:800;font-size:clamp(4rem,10vw,9.6rem);line-height:.76;letter-spacing:-.075em;}
  .birthday-title em{display:block;margin-top:.09em;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:.78em;letter-spacing:-.055em;color:#e8b93f;}
  .birthday-rule{width:1px;height:58px;background:linear-gradient(#e8b93f,transparent);margin:34px auto 24px;}
  .birthday-message{max-width:610px;margin:0 auto;color:#c7c2ba;font:500 clamp(.95rem,1.5vw,1.16rem)/1.78 'Manrope','Helvetica Neue',sans-serif;}
  .birthday-signoff{margin-top:30px;color:#f5f1e8;font:700 .7rem/1 'Manrope','Helvetica Neue',sans-serif;letter-spacing:.18em;text-transform:uppercase;}
  .birthday-sound{position:absolute;left:28px;bottom:24px;z-index:3;display:inline-flex;align-items:center;gap:9px;color:#9e9a92;cursor:pointer;font:700 .58rem/1 'Manrope','Helvetica Neue',sans-serif;letter-spacing:.13em;text-transform:uppercase;}
  .birthday-sound i{width:7px;height:7px;border-radius:50%;background:#e8b93f;box-shadow:0 0 12px rgba(232,185,63,.55);}
  .birthday-sound.is-muted i{background:#67635d;box-shadow:none;}
  html.birthday-open,html.birthday-open body{overflow:hidden;}

  .birthday-unlock{position:fixed;inset:0;z-index:181;display:grid;place-items:center;background:rgba(8,8,9,.78);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
  .birthday-unlock-card{width:min(430px,88vw);padding:34px;background:#111113;color:#f5f1e8;border:1px solid rgba(255,255,255,.12);}
  .birthday-unlock-card p{margin:0 0 18px;color:#aaa69e;font:600 .68rem/1.5 'Manrope','Helvetica Neue',sans-serif;letter-spacing:.12em;text-transform:uppercase;}
  .birthday-unlock-card h3{margin:0 0 24px;font:800 2rem/1 'Manrope','Helvetica Neue',sans-serif;letter-spacing:-.04em;}
  .birthday-unlock-row{display:flex;gap:10px;}
  .birthday-unlock-row input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.18);background:#0b0b0c;color:#fff;padding:13px 14px;outline:none;font:600 .8rem/1 'Manrope','Helvetica Neue',sans-serif;text-transform:uppercase;letter-spacing:.08em;}
  .birthday-unlock-row input:focus{border-color:#e8b93f;}
  .birthday-unlock-row button{padding:13px 16px;border-radius:999px;background:#e8b93f;color:#0a0a0b;cursor:pointer;font:800 .62rem/1 'Manrope','Helvetica Neue',sans-serif;letter-spacing:.1em;text-transform:uppercase;}
  .birthday-unlock-error{min-height:16px;margin:12px 0 0!important;color:#e8b93f!important;letter-spacing:.06em!important;text-transform:none!important;}
  @media(max-width:700px){
    .birthday-card{width:92vw;padding:8vh 2vw;}
    .birthday-title{font-size:clamp(3.5rem,19vw,6.8rem);}
    .birthday-message{font-size:.92rem;padding:0 7vw;}
    .birthday-sphere{width:110px;left:-20px;top:10vh;}
    .birthday-cube{width:90px;height:90px;right:-10px;top:18vh;}
    .birthday-pyramid{right:-34px;bottom:8vh;border-left-width:58px;border-right-width:58px;border-bottom-width:104px;}
    .birthday-close{right:18px;top:16px;}
    .birthday-sound{left:18px;bottom:17px;}
  }
`;
document.head.appendChild(css);

const modal = document.createElement('div');
modal.className = 'birthday-modal';
modal.id = 'birthdayModal';
modal.setAttribute('aria-hidden','true');
modal.innerHTML = `
  <div class="birthday-stars" aria-hidden="true"></div>
  <div class="birthday-shape birthday-sphere" aria-hidden="true"></div>
  <div class="birthday-shape birthday-cube" aria-hidden="true"></div>
  <div class="birthday-shape birthday-pyramid" aria-hidden="true"></div>
  <button class="birthday-close" type="button" aria-label="Close birthday card">Close ×</button>
  <main class="birthday-card" role="dialog" aria-modal="true" aria-labelledby="birthdayTitle">
    <p class="birthday-kicker">31 August · A little world for you</p>
    <h1 class="birthday-title" id="birthdayTitle">Happy Birthday<em>Farah.</em></h1>
    <div class="birthday-rule" aria-hidden="true"></div>
    <p class="birthday-message">You spend so much of your time giving shape to ideas, spaces and little worlds. So this year, I wanted to make one for you. A place that celebrates your work, your imagination, and everything you keep creating. Happy birthday — this one is yours.</p>
    <p class="birthday-signoff">Made with love, just for you.</p>
  </main>
  <button class="birthday-sound is-muted" type="button" aria-label="Toggle birthday sound"><i></i><span>Sound off</span></button>
`;
document.body.appendChild(modal);

const closeBtn = modal.querySelector('.birthday-close');
const soundBtn = modal.querySelector('.birthday-sound');
const soundLabel = soundBtn.querySelector('span');
let audioContext = null;
let audioTimer = null;
let audioStarted = false;

const melody = [
  [392,.28],[392,.18],[440,.42],[392,.42],[523,.42],[494,.75],
  [392,.28],[392,.18],[440,.42],[392,.42],[587,.42],[523,.75],
  [392,.28],[392,.18],[784,.42],[659,.42],[523,.42],[494,.42],[440,.68],
  [698,.28],[698,.18],[659,.42],[523,.42],[587,.42],[523,.75]
];

function scheduleMelody(){
  if(!audioContext || audioContext.state !== 'running') return;
  let t = audioContext.currentTime + .06;
  melody.forEach(([freq,dur])=>{
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0,t);
    gain.gain.linearRampToValueAtTime(.035,t+.025);
    gain.gain.exponentialRampToValueAtTime(.001,t+dur);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(t);
    osc.stop(t+dur+.03);
    t += dur + .06;
  });
  const total = (t - audioContext.currentTime + 1.4) * 1000;
  audioTimer = window.setTimeout(scheduleMelody,total);
}

async function startSound(){
  try{
    if(!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
    if(!audioStarted){audioStarted=true;scheduleMelody();}
    soundBtn.classList.remove('is-muted');
    soundLabel.textContent='Sound on';
  }catch(e){
    soundBtn.classList.add('is-muted');
    soundLabel.textContent='Tap for sound';
  }
}

function stopSound(){
  if(audioTimer) window.clearTimeout(audioTimer);
  audioTimer = null;
  audioStarted = false;
  if(audioContext && audioContext.state === 'running') audioContext.suspend();
  soundBtn.classList.add('is-muted');
  soundLabel.textContent='Sound off';
}

function openBirthday(){
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.documentElement.classList.add('birthday-open');
  window.setTimeout(()=>closeBtn.focus(),700);
  startSound();
  const unlockOnFirstGesture=()=>{if(!audioStarted)startSound();};
  modal.addEventListener('pointerdown',unlockOnFirstGesture,{once:true});
}

function closeBirthday(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.documentElement.classList.remove('birthday-open');
  stopSound();
}

closeBtn.addEventListener('click',closeBirthday);
soundBtn.addEventListener('click',()=>{
  if(soundBtn.classList.contains('is-muted')) startSound();
  else stopSound();
});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))closeBirthday();});

function showSecretUnlock(){
  const unlock = document.createElement('div');
  unlock.className = 'birthday-unlock';
  unlock.innerHTML = `
    <div class="birthday-unlock-card" role="dialog" aria-modal="true" aria-labelledby="birthdayUnlockTitle">
      <p>Private birthday card</p>
      <h3 id="birthdayUnlockTitle">Enter the secret code.</h3>
      <div class="birthday-unlock-row"><input type="password" autocomplete="off" aria-label="Secret birthday code"><button type="button">Unlock</button></div>
      <p class="birthday-unlock-error" aria-live="polite"></p>
    </div>`;
  document.body.appendChild(unlock);
  const input=unlock.querySelector('input');
  const button=unlock.querySelector('button');
  const error=unlock.querySelector('.birthday-unlock-error');
  const submit=()=>{
    if(input.value.trim().toUpperCase()===SECRET_CODE){unlock.remove();openBirthday();}
    else{error.textContent='That code is not quite right.';input.select();}
  };
  button.addEventListener('click',submit);
  input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
  window.setTimeout(()=>input.focus(),100);
}

function launchWhenReady(){
  if(inBirthdayWindow){
    window.setTimeout(openBirthday,460);
  }else if(secretRequested){
    window.setTimeout(showSecretUnlock,460);
  }
}

if(document.querySelector('#sitePreloader')){
  window.addEventListener('farah:preloader-complete',launchWhenReady,{once:true});
}else{
  launchWhenReady();
}
