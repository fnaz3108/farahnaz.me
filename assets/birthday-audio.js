function initBirthdayAudio(){
  const modal=document.querySelector('#birthdayModal');
  const soundBtn=modal?.querySelector('.birthday-sound');
  const label=soundBtn?.querySelector('span');
  if(!modal||!soundBtn||!label)return;

  const track=new Audio('assets/birthday-happy.mp3');
  track.preload='auto';
  track.loop=true;
  track.volume=.16;

  let customReady=false;
  let bypassNative=false;
  let captureAttached=false;

  const setUi=on=>{
    soundBtn.classList.toggle('is-muted',!on);
    label.textContent=on?'Sound on':'Sound off';
  };

  track.addEventListener('canplaythrough',()=>{customReady=true;},{once:true});
  track.addEventListener('error',()=>{customReady=false;},{once:true});

  async function playCustom(){
    if(!customReady && track.readyState<2)return false;
    try{
      await track.play();
      setUi(true);
      return true;
    }catch(e){
      setUi(false);
      label.textContent='Tap for sound';
      return false;
    }
  }

  function stopNativeSound(){
    if(soundBtn.classList.contains('is-muted'))return;
    bypassNative=true;
    soundBtn.click();
  }

  function attachCapture(){
    if(captureAttached)return;
    captureAttached=true;
    soundBtn.addEventListener('click',e=>{
      if(bypassNative){bypassNative=false;return;}
      if(!customReady && track.readyState<2)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if(track.paused){playCustom();}
      else{track.pause();setUi(false);}
    },true);
  }

  const observer=new MutationObserver(()=>{
    const open=modal.classList.contains('is-open');
    if(open){
      window.setTimeout(async()=>{
        if(!customReady && track.readyState<2)return;
        stopNativeSound();
        attachCapture();
        track.currentTime=0;
        await playCustom();
      },60);
    }else{
      track.pause();
      track.currentTime=0;
    }
  });
  observer.observe(modal,{attributes:true,attributeFilter:['class']});

  track.load();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initBirthdayAudio,{once:true});
}else{
  initBirthdayAudio();
}
