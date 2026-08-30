import * as THREE from 'three';
import './birthday-card.js';
import './birthday-objects.js';

const root = document.documentElement;
const overlay = document.querySelector('#sitePreloader');
const percentEl = document.querySelector('#preloaderPercent');
const lineEl = document.querySelector('#preloaderLineFill');
const canvas = document.querySelector('#preloaderGeometry');

if (!overlay || !percentEl || !lineEl || !canvas) {
  root.classList.remove('is-loading');
} else {
  root.classList.add('is-loading');

  // Small, clean clay-rendered cube. No morphing.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true,
    alpha:true,
    powerPreference:'low-power'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .98;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31,1,.1,20);
  camera.position.set(0,.04,5.9);

  const group = new THREE.Group();
  group.rotation.set(-.22,.42,.04);
  scene.add(group);

  // Neutral studio lighting for a soft clay-render look.
  scene.add(new THREE.HemisphereLight(0xf4f1eb,0x343330,1.45));
  const key = new THREE.DirectionalLight(0xffffff,2.35);
  key.position.set(3.8,4.8,5.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xaaa69e,.68);
  fill.position.set(-3.6,1.4,2.5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xe8b93f,.16);
  rim.position.set(-2.5,3,-4);
  scene.add(rim);

  // Slightly beveled edges keep the cube from feeling like a raw primitive.
  const geometry = new THREE.BoxGeometry(1.42,1.42,1.42,8,8,8);
  const clay = new THREE.MeshStandardMaterial({
    color:0xb9b5ad,
    roughness:.76,
    metalness:0
  });
  const cube = new THREE.Mesh(geometry,clay);
  group.add(cube);

  // Very subtle grounding shadow beneath the cube.
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(.86,48),
    new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.13,depthWrite:false})
  );
  shadow.rotation.x=-Math.PI/2;
  shadow.scale.set(1,.38,1);
  shadow.position.set(0,-1.02,.08);
  group.add(shadow);

  function resize(){
    const r=canvas.getBoundingClientRect();
    const w=Math.max(1,r.width),h=Math.max(1,r.height);
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize',resize,{passive:true});

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loading progress remains exactly as before.
  let heroProgress=0;
  let imageProgress=0;
  let pageReady=document.readyState==='complete'?1:0;
  let displayed=0;
  let target=0;
  let finished=false;
  const started=performance.now();

  window.addEventListener('farah:hero-progress',e=>{
    heroProgress=Math.max(heroProgress,Number(e.detail?.progress)||0);
  });

  if(!pageReady){
    window.addEventListener('load',()=>{pageReady=1;},{once:true});
  }

  const imageUrls=[...new Set(
    [...document.images].map(img=>img.currentSrc||img.src).filter(Boolean)
  )];

  if(!imageUrls.length){
    imageProgress=1;
  }else{
    let done=0;
    imageUrls.forEach(url=>{
      const img=new Image();
      const settle=()=>{done++;imageProgress=Math.min(1,done/imageUrls.length);};
      img.onload=settle;
      img.onerror=settle;
      img.src=url;
    });
  }

  function computeTarget(){
    const weighted=(heroProgress*.68)+(imageProgress*.24)+(pageReady*.08);
    target=Math.min((heroProgress>=1&&pageReady>=1)?1:.985,weighted);
  }

  function finish(){
    if(finished)return;
    finished=true;
    displayed=1;
    percentEl.textContent='100%';
    lineEl.style.transform='scaleX(1)';
    window.setTimeout(()=>{
      overlay.classList.add('is-leaving');
      root.classList.remove('is-loading');
      window.dispatchEvent(new Event('farah:preloader-complete'));
      window.setTimeout(()=>overlay.remove(),950);
    },280);
  }

  function animate(now){
    computeTarget();
    displayed+=(target-displayed)*.055;
    if(target>.99&&displayed>.985)displayed=1;

    const pct=Math.max(0,Math.min(100,Math.round(displayed*100)));
    percentEl.textContent=`${pct}%`;
    lineEl.style.transform=`scaleX(${displayed.toFixed(4)})`;

    if(!reduceMotion){
      // Calm continuous rotation; no bounce, morph or dramatic movement.
      group.rotation.y=.42+now*.00032;
      group.rotation.x=-.22+Math.sin(now*.00024)*.045;
    }

    renderer.render(scene,camera);

    if(!finished&&heroProgress>=1&&pageReady>=1&&displayed>.985){
      finish();
    }else if(!finished&&now-started>18000){
      finish();
    }

    if(!finished)requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
