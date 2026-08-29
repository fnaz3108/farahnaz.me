import * as THREE from 'three';

const host = document.querySelector('#contactSculpture');
const oldCanvas = document.querySelector('#particlePyramid');
if (!host) throw new Error('Footer sculpture host not found');

// Keep the original pyramid intact in code, but replace it visually in the footer only.
if (oldCanvas) oldCanvas.style.display = 'none';

document.documentElement.style.setProperty('--accent', '#e8b93f');

const canvas = document.createElement('canvas');
canvas.setAttribute('aria-hidden','true');
canvas.style.position='absolute';
canvas.style.inset='0';
canvas.style.width='100%';
canvas.style.height='100%';
canvas.style.display='block';
canvas.style.cursor='grab';
canvas.style.touchAction='pan-y';
canvas.style.borderRadius='32px';
canvas.style.background='radial-gradient(circle at 50% 45%, rgba(18,18,20,.94), rgba(6,6,7,.98) 70%)';
host.style.position='relative';
host.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38,1,.1,100);
camera.position.set(0,0.2,8.4);

scene.add(new THREE.HemisphereLight(0xfff8e9,0x1b1710,1.5));
const key = new THREE.DirectionalLight(0xffefb3,3.1);
key.position.set(4.5,5.5,6);
scene.add(key);
const rim = new THREE.DirectionalLight(0xe8b93f,2.3);
rim.position.set(-4,1,-3);
scene.add(rim);

const root = new THREE.Group();
root.position.set(.15,.02,0);
root.rotation.set(-.12,.24,-.04);
scene.add(root);

const gold = new THREE.MeshStandardMaterial({color:0xe8b93f,metalness:.68,roughness:.28});
const goldSoft = new THREE.MeshStandardMaterial({color:0xf0c75a,metalness:.5,roughness:.34});
const dark = new THREE.MeshStandardMaterial({color:0x111113,metalness:.55,roughness:.46});

function box(w,h,d,x,y,z=0,mat=gold){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,3,3,3),mat);
  mesh.position.set(x,y,z);
  root.add(mesh);
  return mesh;
}

// Sculptural F
box(.58,3.15,.48,-1.85,.05,0,gold);
box(1.82,.58,.48,-1.23,1.34,0,gold);
box(1.42,.52,.48,-1.42,.15,0,gold);

// Sculptural N
box(.58,3.15,.48,.9,.05,0,gold);
box(.58,3.15,.48,2.28,.05,0,gold);
const nDiag=box(.52,3.72,.48,1.59,.05,0,gold);
nDiag.rotation.z=-.43;

// Slash between F and N
const slash=box(.18,3.75,.22,.12,.06,.35,goldSoft);
slash.rotation.z=-.23;

function ring(rx,ry,rz,scale,opacity=.55){
  const mat=new THREE.MeshBasicMaterial({color:0xe8b93f,transparent:true,opacity,depthWrite:false});
  const mesh=new THREE.Mesh(new THREE.TorusGeometry(2.9,.017,10,180),mat);
  mesh.rotation.set(rx,ry,rz);
  mesh.scale.set(scale,scale*.72,1);
  root.add(mesh);
  return mesh;
}

const rings=[
  ring(1.12,.12,.26,1.02,.5),
  ring(.82,-.48,-.18,.83,.34),
  ring(1.34,.42,.62,.67,.22)
];

const orbMat=new THREE.MeshStandardMaterial({color:0xe8b93f,metalness:.72,roughness:.2});
const darkOrbMat=new THREE.MeshStandardMaterial({color:0x080809,metalness:.72,roughness:.2});
const orbData=[
  {mesh:new THREE.Mesh(new THREE.SphereGeometry(.16,24,24),orbMat),r:3.02,s:.00034,p:.3,y:.52},
  {mesh:new THREE.Mesh(new THREE.SphereGeometry(.12,20,20),darkOrbMat),r:2.55,s:-.00027,p:2.1,y:-.42},
  {mesh:new THREE.Mesh(new THREE.SphereGeometry(.10,20,20),orbMat),r:2.2,s:.00022,p:4.0,y:.05}
];
orbData.forEach(o=>root.add(o.mesh));

let targetX=0,targetY=0,rotX=root.rotation.x,rotY=root.rotation.y;
let velX=0,velY=0,dragging=false,lastX=0,lastY=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

canvas.addEventListener('pointerdown',e=>{
  dragging=true;lastX=e.clientX;lastY=e.clientY;velX=velY=0;
  canvas.setPointerCapture?.(e.pointerId);canvas.style.cursor='grabbing';
});
canvas.addEventListener('pointermove',e=>{
  const r=canvas.getBoundingClientRect();
  targetX=((e.clientY-r.top)/Math.max(r.height,1)-.5);
  targetY=((e.clientX-r.left)/Math.max(r.width,1)-.5);
  if(!dragging)return;
  const dx=e.clientX-lastX,dy=e.clientY-lastY;
  rotY+=dx*.006;rotX+=dy*.005;
  velY=dx*.0009;velX=dy*.00075;
  lastX=e.clientX;lastY=e.clientY;
});
function release(e){
  if(!dragging)return;dragging=false;canvas.style.cursor='grab';
  try{canvas.releasePointerCapture?.(e.pointerId)}catch(_){}
}
canvas.addEventListener('pointerup',release);
canvas.addEventListener('pointercancel',release);
canvas.addEventListener('pointerleave',()=>{targetX=0;targetY=0;if(!dragging)canvas.style.cursor='grab'});

function resize(){
  const r=host.getBoundingClientRect();
  const w=Math.max(1,r.width),h=Math.max(1,r.height);
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
  root.scale.setScalar(w<520?.82:1);
}
resize();
window.addEventListener('resize',resize,{passive:true});

function animate(now){
  if(!dragging&&!reduced){
    rotX+=velX;rotY+=velY;velX*=.94;velY*=.94;
    rotX+=((-.12+targetX*.16)-rotX)*.022;
    rotY+=((.24+targetY*.22)-rotY)*.022;
  }
  root.rotation.x=rotX;
  root.rotation.y=rotY;
  if(!reduced){
    root.position.y=.02+Math.sin(now*.00048)*.055;
    rings[0].rotation.z=.26+Math.sin(now*.00018)*.12;
    rings[1].rotation.z=-.18-Math.sin(now*.00015)*.1;
    rings[2].rotation.z=.62+Math.cos(now*.00012)*.08;
    orbData.forEach(o=>{
      const a=now*o.s+o.p;
      o.mesh.position.set(Math.cos(a)*o.r,o.y+Math.sin(a*.72)*.34,Math.sin(a)*.95);
    });
  }
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
