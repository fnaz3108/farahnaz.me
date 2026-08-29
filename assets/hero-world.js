import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.querySelector('#hero3DWorld');
const canvas = document.querySelector('#heroWorldCanvas');
const status = document.querySelector('#heroWorldStatus');
const resetBtn = document.querySelector('#heroWorldReset');
const exploreBtn = document.querySelector('#heroWorldExplore');
const heroSection = document.querySelector('.hero');

if (!host || !canvas) throw new Error('3D hero host not found');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias:true,
  alpha:false,
  powerPreference:'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setClearColor(0x09090a, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x09090a);

const camera = new THREE.PerspectiveCamera(53, 1, 0.03, 100);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.rotateSpeed = 0.45;
controls.zoomSpeed = 0.65;
controls.panSpeed = 0.42;
controls.enablePan = true;
controls.enabled = false;
controls.screenSpacePanning = true;
controls.minDistance = 1.45;
controls.maxDistance = 11.0;
controls.minPolarAngle = THREE.MathUtils.degToRad(52);
controls.maxPolarAngle = THREE.MathUtils.degToRad(94);

scene.add(new THREE.HemisphereLight(0xffffff, 0x34343a, 1.6));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(4, 8, 6);
scene.add(key);
const fill = new THREE.DirectionalLight(0x9db8ff, .55);
fill.position.set(-5, 3, 2);
scene.add(fill);

const world = new THREE.Group();
world.scale.setScalar(1.55);
world.position.set(0.35,-0.15,0);
scene.add(world);

const clickable = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();
}

function makeTextTexture({
  width=1024, height=512, lines=[], bg=null, border=null
} = {}) {
  const c = document.createElement('canvas');
  c.width = width; c.height = height;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,width,height);

  if(bg){
    ctx.fillStyle = bg;
    roundedRect(ctx,0,0,width,height,24);
    ctx.fill();
  }
  if(border){
    ctx.strokeStyle=border;
    ctx.lineWidth=2;
    roundedRect(ctx,1,1,width-2,height-2,24);
    ctx.stroke();
  }

  for(const l of lines){
    ctx.save();
    ctx.font = `${l.style || ''} ${l.weight || 400} ${l.size || 48}px ${l.font || 'Arial'}`;
    ctx.fillStyle = l.color || '#f4f1e9';
    ctx.strokeStyle = l.stroke || '#f4f1e9';
    ctx.lineWidth = l.lineWidth || 2;
    ctx.textAlign = l.align || 'left';
    ctx.textBaseline = 'top';
    if(l.letterSpacing){
      // manual spacing for small labels
      let x=l.x||0;
      for(const ch of l.text){
        ctx.fillText(ch,x,l.y||0);
        x += ctx.measureText(ch).width + l.letterSpacing;
      }
    } else {
      if(l.outline){ ctx.strokeText(l.text,l.x||0,l.y||0); } else { ctx.fillText(l.text,l.x||0,l.y||0); }
    }
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function makePlane({
  w=2,h=1,texture,position=[0,0,0],rotation=[0,0,0],
  transparent=true,opacity=1,name='',action=null
}) {
  const mat = new THREE.MeshBasicMaterial({
    map:texture,
    transparent,
    opacity,
    side:THREE.DoubleSide,
    depthWrite:false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.name = name;
  if(action){
    mesh.userData.action=action;
    clickable.push(mesh);
  }
  world.add(mesh);
  return mesh;
}

function makeRing(radius, color, opacity, position, rotation, thickness=.012){
  const geom = new THREE.TorusGeometry(radius, thickness, 12, 128);
  const mat = new THREE.MeshBasicMaterial({
    color, transparent:true, opacity, depthWrite:false
  });
  const ring = new THREE.Mesh(geom,mat);
  ring.position.set(...position);
  ring.rotation.set(...rotation);
  world.add(ring);
  return ring;
}

let rings=[];
let homePosition=new THREE.Vector3(0.20,1.82,-4.85);
let homeTarget=new THREE.Vector3(-0.10,1.22,0.10);

const loader = new GLTFLoader();
loader.load(
  'assets/models/vr_apartment_loft_interior__baked.glb',
  (gltf)=>{
    const model = gltf.scene;
    world.add(model);

    model.traverse(o=>{
      if(o.isMesh && o.material){
        o.material.needsUpdate=true;
      }
    });

    // Keep actual model scale. Position composition slightly right so UI can
    // occupy the left side as part of the same 3D scene.
    model.position.set(.15,-.18,-.10);

    // --------------------
    // 3D BRAND / UI PLANES
    // --------------------
    const nameTex = makeTextTexture({
      width:1400,height:720,
      lines:[
        {text:'3D ARTIST · MODELER · VISUALIZER',x:44,y:34,size:32,font:'Arial',weight:500,color:'#d6d3cc',letterSpacing:4},
        {text:'FARAH',x:40,y:105,size:190,font:'Arial Black',weight:900,color:'#f5f1e8'},
        {text:'NAZ',x:370,y:325,size:150,font:'Arial',weight:500,color:'transparent',stroke:'#f5f1e8',lineWidth:3,outline:true},
        {text:'Objects, spaces and visual worlds — shaped from idea',x:44,y:535,size:34,font:'Arial',weight:400,color:'#d0cdc6'},
        {text:'to final frame.',x:44,y:580,size:34,font:'Arial',weight:400,color:'#d0cdc6'},
      ]
    });
    // V3.22: FARAH / NAZ is restored as the original DOM overlay, not a camera-bound 3D plane.


    const logoTex = makeTextTexture({
      width:256,height:128,
      lines:[{text:'F/N',x:20,y:18,size:56,font:'Arial',weight:800,color:'#f5f1e8'}]
    });
    makePlane({
      w:.68,h:.34,texture:logoTex,
      position:[-3.15,3.42,1.10],
      rotation:[0,THREE.MathUtils.degToRad(13),0],
      name:'logo'
    });

    const navTex = (label)=>makeTextTexture({
      width:300,height:120,bg:'rgba(8,8,10,.30)',
      border:'rgba(255,255,255,.18)',
      lines:[{text:label,x:150,y:35,size:30,font:'Arial',weight:600,color:'#f5f1e8',align:'center'}]
    });

    const navY=3.82;
    makePlane({w:.82,h:.33,texture:navTex('WORK'),position:[-.35,navY,.35],rotation:[0,0,0],name:'nav-work',action:'work'});
    makePlane({w:.82,h:.33,texture:navTex('ABOUT'),position:[.58,navY,.35],rotation:[0,0,0],name:'nav-about',action:'about'});
    makePlane({w:.94,h:.33,texture:navTex('CONTACT'),position:[1.60,navY,.35],rotation:[0,0,0],name:'nav-contact',action:'contact'});

    // V3.23: portfolio CTA removed from the 3D world; the normal HTML CTA remains.

    const availTex=makeTextTexture({
      width:420,height:120,
      lines:[
        {text:'●',x:20,y:25,size:36,font:'Arial',weight:700,color:'#d8ff30'},
        {text:'AVAILABLE',x:70,y:28,size:30,font:'Arial',weight:600,color:'#f5f1e8',letterSpacing:2}
      ]
    });
    makePlane({
      w:1.45,h:.42,texture:availTex,
      position:[2.65,3.48,.30],
      rotation:[0,0,0],
      name:'availability'
    });

    // Large geometric circles, now literally in the 3D scene.
    rings = [
      makeRing(2.25,0xd8ff30,.26,[2.05,2.0,-1.10],[THREE.MathUtils.degToRad(90),0,0],.012),
      makeRing(1.45,0xffffff,.10,[.40,1.15,.20],[THREE.MathUtils.degToRad(88),THREE.MathUtils.degToRad(12),0],.009)
    ];

    camera.position.copy(homePosition);
    controls.target.copy(homeTarget);
    controls.update();

    if(status){
      status.textContent='3D HERO READY';
      status.classList.add('is-ready');
      window.dispatchEvent(new CustomEvent('farah:hero-progress',{detail:{progress:1}}));
      window.dispatchEvent(new Event('farah:hero-ready'));
    }
  },
  (event)=>{
    if(status && event.total){
      const pct=Math.min(99,Math.round(event.loaded/event.total*100));
      window.dispatchEvent(new CustomEvent('farah:hero-progress',{detail:{progress:pct/100}}));
      status.textContent=`BUILDING 3D HERO… ${pct}%`;
    }
  },
  (error)=>{
    console.error(error);
    if(status){
      status.textContent='3D HERO FAILED — CHECK CONSOLE';
      window.dispatchEvent(new CustomEvent('farah:hero-progress',{detail:{progress:1}}));
      status.classList.add('is-error');
    }
  }
);



// Keep the Explore / Exit control available throughout the hero,
// independent of the WebGL camera. Hide it only when the hero itself
// is no longer on screen.
if(heroSection && 'IntersectionObserver' in window){
  const heroVisibility = new IntersectionObserver(([entry])=>{
    heroSection.classList.toggle('hero-out-of-view', !entry.isIntersecting);
  }, { threshold: 0.02 });
  heroVisibility.observe(heroSection);
}

let is3DActive = false;

function set3DMode(active){
  is3DActive = active;
  controls.enabled = active;
  heroSection?.classList.toggle('is-3d-active', active);
  if(exploreBtn){
    exploreBtn.textContent = active ? 'EXIT 3D' : 'EXPLORE 3D';
    exploreBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
}

exploreBtn?.addEventListener('click',()=>{
  set3DMode(!is3DActive);
});


window.addEventListener('scroll',()=>{
  if(!heroSection || !is3DActive) return;
  const r = heroSection.getBoundingClientRect();
  if(r.bottom < 80 || r.top > window.innerHeight - 80){
    set3DMode(false);
  }
},{passive:true});


window.addEventListener('keydown',e=>{
  if(e.key === 'Escape' && is3DActive){
    set3DMode(false);
  }
});

function resetView(){
  camera.position.copy(homePosition);
  controls.target.copy(homeTarget);
  controls.update();
}
resetBtn?.addEventListener('click',resetView);
canvas.addEventListener('dblclick',resetView);

function pointerToNDC(e){
  const r=canvas.getBoundingClientRect();
  pointer.x=((e.clientX-r.left)/r.width)*2-1;
  pointer.y=-((e.clientY-r.top)/r.height)*2+1;
}

canvas.addEventListener('pointermove',e=>{
  if(!is3DActive) return;
  pointerToNDC(e);
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(clickable,false)[0];
  canvas.style.cursor=hit?'pointer':'grab';
});
canvas.addEventListener('click',e=>{
  if(!is3DActive) return;
  pointerToNDC(e);
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(clickable,false)[0];
  if(!hit)return;
  const action=hit.object.userData.action;
  if(action==='work'){ set3DMode(false); document.querySelector('#work')?.scrollIntoView({behavior:'smooth'}); }
  if(action==='about'){ set3DMode(false); document.querySelector('#about')?.scrollIntoView({behavior:'smooth'}); }
  if(action==='contact'){ set3DMode(false); document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}); }
});

function resize(){
  const r=host.getBoundingClientRect();
  const w=Math.max(1,r.width), h=Math.max(1,r.height);
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize',resize,{passive:true});

function animate(now){
  controls.update();

  // Ultra-subtle autonomous circle motion.
  if(rings.length){
    const t=now*.00012;
    rings[0].rotation.z=Math.sin(t)*.08;
    rings[0].position.x=2.5+Math.sin(t*.6)*.06;
    rings[1].rotation.z=-Math.sin(t*.8)*.06;
    rings[1].position.y=1.08+Math.cos(t*.5)*.04;
  }

  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
