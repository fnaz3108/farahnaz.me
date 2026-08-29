
import * as THREE from 'three';

const root = document.documentElement;
const overlay = document.querySelector('#sitePreloader');
const percentEl = document.querySelector('#preloaderPercent');
const lineEl = document.querySelector('#preloaderLineFill');
const canvas = document.querySelector('#preloaderGeometry');

if (!overlay || !percentEl || !lineEl || !canvas) {
  // Fail open if markup is missing.
  root.classList.remove('is-loading');
} else {
  root.classList.add('is-loading');

  // ---------------------------
  // Small morphing wire geometry
  // ---------------------------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true,
    alpha:true,
    powerPreference:'low-power'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x000000,0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32,1,.1,20);
  camera.position.set(0,0,5.9);

  const group = new THREE.Group();
  scene.add(group);

  // Equal-count segment clouds for Cube -> Sphere -> Pyramid.
  const SEGMENTS = 420;

  function sampleEdge(a,b,t){
    return new THREE.Vector3(
      THREE.MathUtils.lerp(a.x,b.x,t),
      THREE.MathUtils.lerp(a.y,b.y,t),
      THREE.MathUtils.lerp(a.z,b.z,t)
    );
  }

  const cubeVerts = [
    new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,-1,-1),
    new THREE.Vector3(1,1,-1),new THREE.Vector3(-1,1,-1),
    new THREE.Vector3(-1,-1,1),new THREE.Vector3(1,-1,1),
    new THREE.Vector3(1,1,1),new THREE.Vector3(-1,1,1)
  ];
  const cubeEdges = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7]
  ];

  const pyramidVerts = [
    new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,-1,-1),
    new THREE.Vector3(1,-1,1),new THREE.Vector3(-1,-1,1),
    new THREE.Vector3(0,1.16,0)
  ];
  const pyramidEdges = [
    [0,1],[1,2],[2,3],[3,0],
    [0,4],[1,4],[2,4],[3,4]
  ];

  function buildEdgeSegments(verts,edges,count){
    const arr = new Float32Array(count*2*3);
    for(let i=0;i<count;i++){
      const edge=edges[i%edges.length];
      const a=verts[edge[0]], b=verts[edge[1]];
      const t=(Math.floor(i/edges.length)+.15)/(Math.ceil(count/edges.length)+.3);
      const p1=sampleEdge(a,b,THREE.MathUtils.clamp(t,0,1));
      const p2=sampleEdge(a,b,THREE.MathUtils.clamp(t+.075,0,1));
      const o=i*6;
      arr[o]=p1.x;arr[o+1]=p1.y;arr[o+2]=p1.z;
      arr[o+3]=p2.x;arr[o+4]=p2.y;arr[o+5]=p2.z;
    }
    return arr;
  }

  function buildSphereSegments(count){
    const arr = new Float32Array(count*2*3);

    // Build a continuous wire sphere from latitude + longitude loops.
    // We intentionally sample complete loops so it reads as solid wire,
    // not as dotted/disconnected points during the morph.
    const latLoops = 8;
    const lonLoops = 10;
    const totalLoops = latLoops + lonLoops;
    const segsPerLoop = Math.max(8, Math.floor(count / totalLoops));

    let segmentIndex = 0;

    const writeSeg = (p1,p2)=>{
      if(segmentIndex >= count) return;
      const o = segmentIndex * 6;
      arr[o]   = p1.x; arr[o+1] = p1.y; arr[o+2] = p1.z;
      arr[o+3] = p2.x; arr[o+4] = p2.y; arr[o+5] = p2.z;
      segmentIndex++;
    };

    // Latitude rings.
    for(let l=1; l<=latLoops; l++){
      const lat = -Math.PI/2 + (l/(latLoops+1))*Math.PI;
      const r = Math.cos(lat);
      const y = Math.sin(lat);

      for(let s=0; s<segsPerLoop && segmentIndex<count; s++){
        const a1 = (s/segsPerLoop)*Math.PI*2;
        const a2 = ((s+1)/segsPerLoop)*Math.PI*2;

        const p1 = new THREE.Vector3(Math.cos(a1)*r, y, Math.sin(a1)*r);
        const p2 = new THREE.Vector3(Math.cos(a2)*r, y, Math.sin(a2)*r);
        writeSeg(p1,p2);
      }
    }

    // Longitude rings.
    for(let l=0; l<lonLoops; l++){
      const lon = (l/lonLoops)*Math.PI*2;

      for(let s=0; s<segsPerLoop && segmentIndex<count; s++){
        const a1 = -Math.PI/2 + (s/segsPerLoop)*Math.PI*2;
        const a2 = -Math.PI/2 + ((s+1)/segsPerLoop)*Math.PI*2;

        const p1 = new THREE.Vector3(
          Math.cos(a1)*Math.cos(lon),
          Math.sin(a1),
          Math.cos(a1)*Math.sin(lon)
        );
        const p2 = new THREE.Vector3(
          Math.cos(a2)*Math.cos(lon),
          Math.sin(a2),
          Math.cos(a2)*Math.sin(lon)
        );
        writeSeg(p1,p2);
      }
    }

    // Fill any remaining slots by repeating valid continuous segments.
    // This preserves equal morph-buffer length without adding visual gaps.
    let srcSeg = 0;
    while(segmentIndex < count){
      const src = (srcSeg % Math.max(1, segmentIndex)) * 6;
      const dst = segmentIndex * 6;
      for(let j=0;j<6;j++) arr[dst+j] = arr[src+j];
      segmentIndex++;
      srcSeg++;
    }

    return arr;
  }

  const shapes = [
    buildEdgeSegments(cubeVerts,cubeEdges,SEGMENTS),
    buildSphereSegments(SEGMENTS),
    buildEdgeSegments(pyramidVerts,pyramidEdges,SEGMENTS)
  ];

  const positions = new Float32Array(shapes[0]);
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position',new THREE.BufferAttribute(positions,3));

  const mat = new THREE.LineBasicMaterial({
    color:0xe9e6df,
    transparent:true,
    opacity:1
  });

  const lines = new THREE.LineSegments(geom,mat);
  group.add(lines);

  function resize(){
    const r=canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
    camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize',resize,{passive:true});

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------
  // Real-ish loading progress
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
    window.addEventListener('load',()=>{ pageReady=1; },{once:true});
  }

  const imageUrls=[...new Set(
    [...document.images]
      .map(img=>img.currentSrc||img.src)
      .filter(Boolean)
  )];

  if(!imageUrls.length){
    imageProgress=1;
  }else{
    let done=0;
    imageUrls.forEach(url=>{
      const img=new Image();
      const settle=()=>{
        done++;
        imageProgress=Math.min(1,done/imageUrls.length);
      };
      img.onload=settle;
      img.onerror=settle;
      img.src=url;
    });
  }

  function computeTarget(){
    // Heavy hero GLB carries most of the weight.
    const weighted=(heroProgress*.68)+(imageProgress*.24)+(pageReady*.08);
    // Avoid reaching 100 before both browser + hero are actually done.
    target=Math.min((heroProgress>=1 && pageReady>=1) ? 1 : .985, weighted);
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

  function animate(now){
    computeTarget();

    // Smooth visual progress, but don't fake completion.
    displayed += (target-displayed)*.055;
    if(target>.99 && displayed>.985) displayed=1;

    const pct=Math.max(0,Math.min(100,Math.round(displayed*100)));
    percentEl.textContent=`${pct}%`;
    lineEl.style.transform=`scaleX(${displayed.toFixed(4)})`;

    // Morph continuously through cube -> sphere -> pyramid.
    if(!reduceMotion){
      const cycle=(now*.00042)%3;
      const from=Math.floor(cycle);
      const to=(from+1)%3;
      const raw=cycle-from;
      const eased=raw*raw*(3-2*raw);
      const a=shapes[from], b=shapes[to];
      const pos=geom.attributes.position.array;
      for(let i=0;i<pos.length;i++){
        pos[i]=THREE.MathUtils.lerp(a[i],b[i],eased);
      }
      geom.attributes.position.needsUpdate=true;

      group.rotation.x=now*.00013;
      group.rotation.y=now*.00019;
      group.rotation.z=Math.sin(now*.00011)*.08;
    }

    renderer.render(scene,camera);

    if(!finished && heroProgress>=1 && pageReady>=1 && displayed>.985){
      finish();
    }else if(!finished && now-started>18000){
      // Fail-open protection: never trap the user on the loader.
      finish();
    }

    if(!finished) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
