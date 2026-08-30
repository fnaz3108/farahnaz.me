import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function initBirthdayObjects(){
  const modal=document.querySelector('#birthdayModal');
  if(!modal || modal.querySelector('.birthday-three-canvas')) return;

  const style=document.createElement('style');
  style.textContent=`
    .birthday-modal .birthday-shape{display:none!important;}
    .birthday-three-canvas{
      position:absolute;inset:0;width:100%;height:100%;z-index:1;
      pointer-events:none;filter:drop-shadow(0 24px 28px rgba(0,0,0,.26));
    }
  `;
  document.head.appendChild(style);

  const canvas=document.createElement('canvas');
  canvas.className='birthday-three-canvas';
  canvas.setAttribute('aria-hidden','true');
  modal.insertBefore(canvas,modal.firstChild);

  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(32,1,.1,30);
  camera.position.set(0,0,9);

  scene.add(new THREE.HemisphereLight(0xfff3c2,0x211406,1.35));
  const key=new THREE.DirectionalLight(0xfff7dd,3.1);
  key.position.set(-4,6,8);
  scene.add(key);
  const fill=new THREE.DirectionalLight(0xe8b93f,1.1);
  fill.position.set(5,1,4);
  scene.add(fill);
  const rim=new THREE.DirectionalLight(0xffc83d,1.2);
  rim.position.set(2,4,-4);
  scene.add(rim);

  const gold=new THREE.MeshPhysicalMaterial({
    color:0xe8b93f,
    roughness:.34,
    metalness:.08,
    clearcoat:.42,
    clearcoatRoughness:.26
  });

  const sphere=new THREE.Mesh(new THREE.SphereGeometry(.82,48,48),gold.clone());
  sphere.material.roughness=.28;
  scene.add(sphere);

  const cube=new THREE.Mesh(new RoundedBoxGeometry(1.45,1.45,1.45,8,.12),gold.clone());
  cube.rotation.set(.44,-.58,.22);
  scene.add(cube);

  const pyramid=new THREE.Mesh(new THREE.ConeGeometry(.98,1.72,4,1,false,Math.PI/4),gold.clone());
  pyramid.rotation.set(-.08,.48,-.08);
  scene.add(pyramid);

  const glowMaterial=new THREE.MeshBasicMaterial({color:0xe8b93f,transparent:true,opacity:.055,depthWrite:false});
  const glowA=new THREE.Mesh(new THREE.SphereGeometry(1.03,24,24),glowMaterial);
  glowA.position.copy(sphere.position);scene.add(glowA);
  const glowB=new THREE.Mesh(new THREE.SphereGeometry(1.08,24,24),glowMaterial.clone());scene.add(glowB);
  const glowC=new THREE.Mesh(new THREE.SphereGeometry(1.15,24,24),glowMaterial.clone());scene.add(glowC);

  function layout(){
    const w=Math.max(1,modal.clientWidth),h=Math.max(1,modal.clientHeight);
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();

    const wide=w>700;
    const spanX=wide?4.25:2.55;
    sphere.position.set(-spanX,wide?2.05:2.7,0);
    cube.position.set(spanX,wide?1.95:2.35,-.15);
    pyramid.position.set(wide?3.95:2.45,wide?-2.55:-3.0,.05);

    sphere.scale.setScalar(wide?1:0.68);
    cube.scale.setScalar(wide?1:0.68);
    pyramid.scale.setScalar(wide?1:0.68);

    glowA.position.copy(sphere.position);glowA.scale.copy(sphere.scale);
    glowB.position.copy(cube.position);glowB.scale.copy(cube.scale);
    glowC.position.copy(pyramid.position);glowC.scale.copy(pyramid.scale);
  }
  layout();
  window.addEventListener('resize',layout,{passive:true});

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf=0;
  function animate(t){
    const s=t*.001;
    if(!reduceMotion){
      sphere.position.y+=(Math.sin(s*.72)*.004);
      sphere.rotation.y=s*.16;

      cube.rotation.x=.44+Math.sin(s*.42)*.15;
      cube.rotation.y=-.58+s*.22;
      cube.rotation.z=.22+Math.sin(s*.34)*.08;

      pyramid.rotation.y=.48+s*.18;
      pyramid.rotation.z=-.08+Math.sin(s*.46)*.08;
      pyramid.rotation.x=-.08+Math.sin(s*.31)*.05;
    }
    renderer.render(scene,camera);
    raf=requestAnimationFrame(animate);
  }
  raf=requestAnimationFrame(animate);

  const observer=new MutationObserver(()=>{
    if(!document.body.contains(modal)){
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',layout);
      observer.disconnect();
      renderer.dispose();
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initBirthdayObjects,{once:true});
}else{
  initBirthdayObjects();
}
