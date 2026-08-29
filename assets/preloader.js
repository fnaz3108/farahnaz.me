import * as THREE from 'three';

const root = document.documentElement;
const overlay = document.querySelector('#sitePreloader');
const percentEl = document.querySelector('#preloaderPercent');
const lineEl = document.querySelector('#preloaderLineFill');
const canvas = document.querySelector('#preloaderGeometry');

if (!overlay || !percentEl || !lineEl || !canvas) {
  root.classList.remove('is-loading');
} else {
  root.classList.add('is-loading');

  // ---------------------------
  // Solid clay morph sculpture
  // Sphere -> Cube -> Pyramid
  // ---------------------------
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
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31,1,.1,20);
  camera.position.set(0,.03,5.6);

  const group = new THREE.Group();
  group.rotation.set(-.18,.35,.02);
  scene.add(group);

  scene.add(new THREE.HemisphereLight(0xf4f1eb,0x3a3936,1.6));
  const key = new THREE.DirectionalLight(0xffffff,2.4);
  key.position.set(3.4,4.8,5.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb9b4aa,.72);
  fill.position.set(-4,1.5,2.2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xe8b93f,.28);
  rim.position.set(-2.5,3,-4);
  scene.add(rim);

  // One dense topology is used for all states so the object truly morphs
  // instead of swapping between separate meshes.
  const geom = new THREE.IcosahedronGeometry(1.12,5);
  const base = geom.attributes.position.array;
  const sphere = new Float32Array(base.length);
  const cube = new Float32Array(base.length);
  const pyramid = new Float32Array(base.length);

  const v = new THREE.Vector3();
  for(let i=0;i<base.length;i+=3){
    v.set(base[i],base[i+1],base[i+2]).normalize();

    // Sphere state.
    sphere[i]=v.x*1.08;
    sphere[i+1]=v.y*1.08;
    sphere[i+2]=v.z*1.08;

    // Cube state: radial projection onto a rounded-feeling cube surface.
    const m=Math.max(Math.abs(v.x),Math.abs(v.y),Math.abs(v.z),.0001);
    const cx=v.x/m, cy=v.y/m, cz=v.z/m;
    const round=.84;
    cube[i]=(cx*round + v.x*(1-round))*1.02;
    cube[i+1]=(cy*round + v.y*(1-round))*1.02;
    cube[i+2]=(cz*round + v.z*(1-round))*1.02;

    // Pyramid state: square footprint tapering continuously to a single apex.
    const ny=(v.y+1)*.5; // 0..1
    const py=-.92 + ny*2.05;
    const taper=Math.max(.04,1-ny*.94);
    const sideScale=1.18*taper;
    const denom=Math.max(Math.abs(v.x),Math.abs(v.z),.0001);
    const sx=v.x/denom;
    const sz=v.z/denom;
    const edgeMix=.88;
    pyramid[i]=(sx*edgeMix+v.x*(1-edgeMix))*sideScale;
    pyramid[i+1]=py;
    pyramid[i+2]=(sz*edgeMix+v.z*(1-edgeMix))*sideScale;
  }

  const position = geom.attributes.position.array;
  position.set(sphere);
  geom.attributes.position.needsUpdate=true;
  geom.computeVertexNormals();

  const clay = new THREE.MeshStandardMaterial({
    color:0xb8b3aa,
    roughness:.72,
    metalness:.02,
    flatShading:false
  });
  const mesh = new THREE.Mesh(geom,clay);
  mesh.castShadow=false;
  mesh.receiveShadow=false;
  group.add(mesh);

  // Soft grounding shadow to make the sculpture feel like a studio clay render.
  const shadowMat = new THREE.MeshBasicMaterial({
    color:0x000000,
    transparent:true,
    opacity:.18,
    depthWrite:false
  });
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.18,64),shadowMat);
  shadow.rotation.x=-Math.PI/2;
  shadow.scale.set(1,.42,1);
  shadow.position.set(0,-1.22,.12);
  group.add(shadow);

  function resize(){
    const r=canvas.getBoundingClientRect();
    const w=Math.max(1,r.width), h=Math.max(1,r.height);
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize',resize,{passive:true});

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------
  // Loading progress
  // ---------------------------
  let heroProgress=0;
  let imageProgress=0;
  let pageReady=document.readyState==='complete' ? 1 : 0;
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
      window.setTimeout(()=>overlay.remove(),950);
    },280);
  }

  const shapes=[sphere,cube,pyramid];

  function animate(now){
    computeTarget();
    displayed+=(target-displayed)*.055;
    if(target>.99&&displayed>.985)displayed=1;

    const pct=Math.max(0,Math.min(100,Math.round(displayed*100)));
    percentEl.textContent=`${pct}%`;
    lineEl.style.transform=`scaleX(${displayed.toFixed(4)})`;

    if(!reduceMotion){
      // About 3.2s for a full sphere -> cube -> pyramid -> sphere loop.
      const cycle=(now*.00093)%3;
      const from=Math.floor(cycle);
      const to=(from+1)%3;
      const raw=cycle-from;
      const eased=raw*raw*(3-2*raw);
      const a=shapes[from], b=shapes[to];
      const pos=geom.attributes.position.array;
      for(let i=0;i<pos.length;i++) pos[i]=THREE.MathUtils.lerp(a[i],b[i],eased);
      geom.attributes.position.needsUpdate=true;
      geom.computeVertexNormals();

      group.rotation.y=.35+now*.00016;
      group.rotation.x=-.18+Math.sin(now*.00034)*.055;
      group.position.y=Math.sin(now*.00045)*.035;
      shadow.material.opacity=.15+Math.sin(now*.00045)*.018;
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
