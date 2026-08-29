(() => {
  document.documentElement.classList.add('motion-ready');
  const projects = {
    pocket:{title:'Pocket Watch',type:'PRODUCT VISUALIZATION / 01',description:'A detailed pocket-watch study showing the finished object, exploded construction, internal movement and modeling wireframe.',image:'assets/portfolio/watch/watch-render-hires.webp',images:['assets/portfolio/watch/watch-render-hires.webp','assets/portfolio/watch/watch-exploded-hires.webp','assets/portfolio/watch/watch-movement-hires.webp','assets/portfolio/watch/watch-wireframe-hires.png'],role:'3D Artist & Modeler',focus:'Modeling · Materials · Mechanical Detail',output:'Product Visualization'},
    interior:{title:'Interior & Exterior',type:'SPACE / ENVIRONMENT / 02',description:'Interior and exterior visualization studies covering residential spaces, materials, lighting and architectural presentation.',image:'assets/portfolio/interior-exterior/interior-living-hires.webp',images:['assets/portfolio/interior-exterior/interior-living-hires.webp', 'assets/portfolio/interior-exterior/interior-kitchen-hires.webp', 'assets/portfolio/interior-exterior/interior-lounge-hires.webp', 'assets/portfolio/interior-exterior/exterior-building-hires.webp'],role:'3D Visualizer',focus:'Environment · Lighting · Composition',output:'Architectural Visualization'},
    transformer:{title:'Transformer',type:'HARD SURFACE / 03',description:'A detailed mechanical character study built around hard-surface form, complexity and silhouette.',image:'assets/portfolio/transformer/transformer-full-hires.webp',images:['assets/portfolio/transformer/transformer-full-hires.webp','assets/portfolio/transformer/transformer-closeup-hires.webp','assets/portfolio/transformer/transformer-wireframe-hires.webp'],role:'3D Modeler',focus:'Hard Surface · Form · Detail',output:'Character / Mechanical Model'},
    coffee:{title:'Noomf Coffee',type:'PRODUCT / PACKAGING / 04',description:'Product and packaging visualization designed to present brand, material and form in a polished visual system.',image:'assets/portfolio/noomf/noomf-hero-hires.webp',images:['assets/portfolio/noomf/noomf-hero-hires.webp','assets/portfolio/noomf/noomf-back-hires.webp','assets/portfolio/noomf/noomf-mushroom-hires.webp'],role:'3D Artist',focus:'Product · Packaging · Rendering',output:'Campaign Visuals'},
    castle:{title:'Castle',type:'ENVIRONMENT / 05',description:'A conceptual environment piece focused on structure, mood and fantasy-world composition.',image:'assets/images/castle.png',role:'3D Artist & Modeler',focus:'Environment · Concept · Modeling',output:'Environment Visualization'},
    throne:{title:'Throne Chair',type:'OBJECT MODELING / 06',description:'Decorative object modeling with an emphasis on proportion, detail and material presentation.',image:'assets/images/throne.png',role:'3D Modeler',focus:'Object · Detail · Materials',output:'Furniture Visualization'}
  };
  const order = Object.keys(projects);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;
  const cursor = document.querySelector('.cursor');
  const progress = document.querySelector('.scroll-progress i');
  const heroStage = document.querySelector('#heroStage');
  const cubeShell = document.querySelector('#portfolioCubeShell');
  const portfolioCube = document.querySelector('#portfolioCube');
  const cards = [...document.querySelectorAll('.work-card')];
  const view = document.querySelector('#projectView');
  const close = document.querySelector('.project-close');
  const next = document.querySelector('.project-next');
  const wireCube = null;
  const portrait = document.querySelector('.portrait-orbit');
  const contactSculpture = document.querySelector('#contactSculpture');
  const rings = contactSculpture ? [...contactSculpture.querySelectorAll('.ring')] : [];
  let activeKey = null;
  let pointer = {x:0, y:0, tx:0, ty:0, vx:0, vy:0};

  document.querySelector('#year').textContent = new Date().getFullYear();

  // Smooth inertial cursor — it follows the visitor rather than snapping to them.
  if (finePointer) {
    window.addEventListener('pointermove', e => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      if (!pointer.x && !pointer.y) { pointer.x = e.clientX; pointer.y = e.clientY; }
      cursor.style.opacity = '1';
    }, {passive:true});
    const cursorLoop = () => {
      const ox = pointer.x, oy = pointer.y;
      pointer.x += (pointer.tx - pointer.x) * .18;
      pointer.y += (pointer.ty - pointer.y) * .18;
      pointer.vx = pointer.x - ox; pointer.vy = pointer.y - oy;
      cursor.style.left = pointer.x + 'px'; cursor.style.top = pointer.y + 'px';
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();
  }

  const interactive = [...cards, ...document.querySelectorAll('.contact-row a,.hero-link')];
  interactive.forEach(el => {
    el.addEventListener('pointerenter',()=>cursor && cursor.classList.add('active'));
    el.addEventListener('pointerleave',()=>cursor && cursor.classList.remove('active'));
  });

  // Hero portfolio cube: direct drag, soft inertia, then a non-spinning idle drift around its resting angle.
  if (cubeShell && portfolioCube) {
    let rotX = -12, rotY = 28;
    let velocityX = 0, velocityY = 0;
    let dragging = false, moved = false;
    let lastX = 0, lastY = 0, lastTime = performance.now();
    let restX = rotX, restY = rotY;
    let idleAmount = reduceMotion ? 0 : 1;

    const normalizeVelocity = (delta, dt) => delta * Math.min(2.2, 16 / Math.max(dt, 8));

    cubeShell.addEventListener('pointerdown', e => {
      dragging = true; moved = false; idleAmount = 0;
      velocityX = velocityY = 0;
      lastX = e.clientX; lastY = e.clientY; lastTime = performance.now();
      cubeShell.setPointerCapture?.(e.pointerId);
      cubeShell.classList.add('is-dragging');
      if (cursor) { cursor.classList.add('active'); const label=cursor.querySelector('span'); if(label) label.textContent='DRAG'; }
    });
    cubeShell.addEventListener('pointermove', e => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.abs(dx)+Math.abs(dy) > 1) moved = true;
      rotY += dx * .34;
      rotX -= dy * .30;
      velocityY = normalizeVelocity(dx * .34, now-lastTime);
      velocityX = normalizeVelocity(-dy * .30, now-lastTime);
      lastX = e.clientX; lastY = e.clientY; lastTime = now;
    });
    const releaseCube = e => {
      if (!dragging) return;
      dragging = false; restX = rotX; restY = rotY;
      cubeShell.classList.remove('is-dragging');
      if (moved) cubeShell.classList.add('has-dragged');
      try { cubeShell.releasePointerCapture?.(e.pointerId); } catch(_) {}
      if (cursor) { const label=cursor.querySelector('span'); if(label) label.textContent='VIEW'; }
      window.setTimeout(()=>{ if(!dragging) idleAmount=reduceMotion?0:1; }, 900);
    };
    cubeShell.addEventListener('pointerup', releaseCube);
    cubeShell.addEventListener('pointercancel', releaseCube);
    cubeShell.addEventListener('lostpointercapture', e => { if(dragging) releaseCube(e); });
    cubeShell.addEventListener('pointerenter',()=>{ if(cursor){cursor.classList.add('active');const label=cursor.querySelector('span');if(label)label.textContent='DRAG';} });
    cubeShell.addEventListener('pointerleave',()=>{ if(!dragging && cursor){cursor.classList.remove('active');const label=cursor.querySelector('span');if(label)label.textContent='VIEW';} });

    const cubeLoop = now => {
      if (!dragging) {
        rotX += velocityX; rotY += velocityY;
        velocityX *= .935; velocityY *= .935;
        if (Math.abs(velocityX) < .005) velocityX = 0;
        if (Math.abs(velocityY) < .005) velocityY = 0;
        if (!velocityX && !velocityY) { restX += (rotX-restX)*.08; restY += (rotY-restY)*.08; }
      }
      const t = now * .00045;
      const driftX = Math.sin(t*.83) * 2.2 * idleAmount;
      const driftY = Math.sin(t*.57 + 1.2) * 3.2 * idleAmount;
      portfolioCube.style.transform = `rotateX(${rotX + driftX}deg) rotateY(${rotY + driftY}deg)`;
      requestAnimationFrame(cubeLoop);
    };
    requestAnimationFrame(cubeLoop);
  }

  // Gallery stays intentionally calm: no magnetic tilting; images carry a very slow cinematic zoom.
  cards.forEach(card => {
    card.addEventListener('click',()=>openProject(card.dataset.project, card));
  });

  function populateProject(key){
    const p=projects[key]; if(!p)return; activeKey=key;
    const img=document.querySelector('#projectImage');
    img.src=p.image; img.alt=p.title;
    document.querySelector('#projectTitle').textContent=p.title;
    document.querySelector('#projectType').textContent=p.type;
    document.querySelector('#projectDescription').textContent=p.description;
    document.querySelector('#projectRole').textContent=p.role;
    document.querySelector('#projectFocus').textContent=p.focus;
    document.querySelector('#projectOutput').textContent=p.output;
    const gallery=p.images||[p.image,p.image,p.image,p.image];
    img.src=gallery[0]||p.image;
    const bg=document.querySelector('#projectImageBg');
    if(bg) bg.src=img.src;
    img.classList.remove('is-revealed');
    void img.offsetWidth;
    requestAnimationFrame(()=>img.classList.add('is-revealed'));
    document.querySelector('#detailOne').src=gallery[1]||gallery[0]||p.image;
    document.querySelector('#detailTwo').src=gallery[2]||gallery[0]||p.image;
    document.querySelector('#detailThree').src=gallery[3]||gallery[0]||p.image;
  }
  function openProject(key, sourceCard){
    const run=()=>{
      populateProject(key);
      view.classList.add('open');
      document.body.classList.add('project-open');
      const mobileNav=document.querySelector('#mainNav');
      const mobileToggle=document.querySelector('#navToggle');
      mobileNav?.classList.remove('is-open');
      mobileToggle?.classList.remove('is-open');
      mobileToggle?.setAttribute('aria-expanded','false');
      mobileToggle?.setAttribute('aria-label','Open menu');
      document.documentElement.classList.remove('nav-open');
      view.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
      view.scrollTop=0;
    };
    // Native View Transition where available = card expands into the project instead of a generic fade.
    if (document.startViewTransition && sourceCard && !reduceMotion) {
      const sourceImg=sourceCard.querySelector('img');
      sourceImg.style.viewTransitionName='project-art';
      document.querySelector('#projectImage').style.viewTransitionName='project-art';
      const t=document.startViewTransition(run);
      t.finished.finally(()=>{sourceImg.style.viewTransitionName='';document.querySelector('#projectImage').style.viewTransitionName=''});
    } else run();
    setTimeout(()=>close.focus(),350);
  }
  function closeProject(){view.classList.remove('open');document.body.classList.remove('project-open');view.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  close.addEventListener('click',closeProject);
  view.addEventListener('click',e=>{ if(e.target===view) closeProject(); });
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&view.classList.contains('open'))closeProject()});
  next.addEventListener('click',()=>{const i=order.indexOf(activeKey);openProject(order[(i+1)%order.length]);});

  // Intersection reveals are staggered based on entry — no continuous looping.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      });
    },{threshold:.16,rootMargin:'0px 0px -7% 0px'});
    document.querySelectorAll('.section-intro,.work-card,.about-copy,.about-object,.contact-copy,.contact-sculpture').forEach(el=>observer.observe(el));
  } else document.querySelectorAll('.section-intro,.work-card,.about-copy,.about-object,.contact-copy,.contact-sculpture').forEach(el=>el.classList.add('in-view'));

  // Scroll driven objects: their state follows the page, then eases into place.
  let scrollTarget=0, scrollSmooth=0;
  const updateScrollObjects=()=>{
    scrollTarget=scrollY;
    scrollSmooth += (scrollTarget-scrollSmooth)*.075;
    const vh=Math.max(innerHeight,1);
    const about=document.querySelector('.about');
    const contact=document.querySelector('.contact');
    if(wireCube && about){
      const p=Math.max(-1,Math.min(1,(scrollSmooth-about.offsetTop+vh*.3)/vh));
      const px=finePointer ? (pointer.tx/Math.max(innerWidth,1)-.5) : 0;
      wireCube.style.transform=`rotateX(${-10+p*18}deg) rotateY(${p*75+px*20}deg) rotateZ(${p*-5}deg) translate3d(${px*10}px,${Math.abs(p)*-8}px,0)`;
      if(portrait) portrait.style.transform=`translate3d(${px*-14}px,${p*12}px,0) rotate(${p*2}deg)`;
    }
    if(contactSculpture && contact){
      const p=Math.max(-1,Math.min(1,(scrollSmooth-contact.offsetTop+vh*.4)/vh));
      const px=finePointer ? (pointer.tx/Math.max(innerWidth,1)-.5) : 0;
      const py=finePointer ? (pointer.ty/Math.max(innerHeight,1)-.5) : 0;
      rings.forEach((ring,i)=>{
        const mult=i===0?1:i===1?-1:.65;
        ring.style.transform=`rotateX(${(i===0?70:i===2?45:0)+py*18}deg) rotateY(${(i===1?70:i===2?45:0)+px*24}deg) rotateZ(${p*90*mult}deg)`;
      });
    }
    requestAnimationFrame(updateScrollObjects);
  };
  if(!reduceMotion) updateScrollObjects();

  // Scroll progress and hero camera pullback.
  let ticking=false;
  window.addEventListener('scroll',()=>{
    if(ticking)return; ticking=true;
    requestAnimationFrame(()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      progress.style.width=(max>0?(scrollY/max)*100:0)+'%';
      if(heroStage && scrollY<innerHeight*1.15){
        const p=Math.min(scrollY/innerHeight,1);
        heroStage.style.setProperty('--heroScrollY',`${p*56}px`);
        heroStage.style.setProperty('--heroScrollScale',String(1-p*.065));
        heroStage.style.opacity=String(1-p*.38);
      }
      ticking=false;
    });
  },{passive:true});


  // Reusable particle geometry renderer. All shapes share the same drag,
  // inertia, idle drift, cursor scatter and spring-back behavior.
  function createParticleGeometry(canvas, options={}) {
    if (!canvas) return;
    const ctx=canvas.getContext('2d');
    if(!ctx) return;
    const dark=options.dark!==false;
    const baseOpacity=options.opacity ?? 1;
    const count=reduceMotion ? Math.round((options.count||2400)*.42) : (options.count||2400);
    const shape=options.shape||'cube';
    const state={
      points:[], mx:-9999, my:-9999,
      rx:options.rx??-.34, ry:options.ry??.48,
      vx:0, vy:0, dragging:false,
      lastX:0,lastY:0,lastTime:0,active:false
    };

    const rand=()=>Math.random()*2-1;
    const pointForShape=(i)=>{
      if(shape==='sphere'){
        // Uniformly distributed over a sphere shell.
        const y=rand(), a=Math.random()*Math.PI*2, rr=Math.sqrt(Math.max(0,1-y*y));
        return {x:rr*Math.cos(a),y,z:rr*Math.sin(a)};
      }
      if(shape==='cylinder'){
        // Mix side wall and caps so it reads clearly while rotating.
        if(Math.random()<.76){
          const a=Math.random()*Math.PI*2;
          return {x:Math.cos(a),y:rand(),z:Math.sin(a)};
        }
        const a=Math.random()*Math.PI*2, rr=Math.sqrt(Math.random());
        return {x:rr*Math.cos(a),y:Math.random()<.5?-1:1,z:rr*Math.sin(a)};
      }
      if(shape==='pyramid'){
        // Square pyramid: sample its four triangular sides plus the base.
        if(Math.random()<.82){
          const side=Math.floor(Math.random()*4);
          // Uniform barycentric sample in triangle.
          let u=Math.random(),v=Math.random();
          if(u+v>1){u=1-u;v=1-v}
          const w=1-u-v;
          const apex={x:0,y:-1.18,z:0};
          const corners=[
            [{x:-1,y:1,z:-1},{x:1,y:1,z:-1}],
            [{x:1,y:1,z:-1},{x:1,y:1,z:1}],
            [{x:1,y:1,z:1},{x:-1,y:1,z:1}],
            [{x:-1,y:1,z:1},{x:-1,y:1,z:-1}]
          ][side];
          return {
            x:apex.x*w+corners[0].x*u+corners[1].x*v,
            y:apex.y*w+corners[0].y*u+corners[1].y*v,
            z:apex.z*w+corners[0].z*u+corners[1].z*v
          };
        }
        return {x:rand(),y:1,z:rand()};
      }
      // Cube fallback.
      const face=i%6,u=rand(),v=rand();
      if(face===0)return{x:1,y:u,z:v}; if(face===1)return{x:-1,y:u,z:v};
      if(face===2)return{y:1,x:u,z:v}; if(face===3)return{y:-1,x:u,z:v};
      if(face===4)return{z:1,x:u,y:v}; return{z:-1,x:u,y:v};
    };

    for(let i=0;i<count;i++){
      const p=pointForShape(i);
      state.points.push({...p,ox:0,oy:0,vx:0,vy:0});
    }

    const size=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0)};
    size(); addEventListener('resize',size,{passive:true});

    const localPoint=e=>{const r=canvas.getBoundingClientRect();state.mx=e.clientX-r.left;state.my=e.clientY-r.top;state.active=true;return r};
    canvas.addEventListener('pointerdown',e=>{
      localPoint(e); state.dragging=true; state.vx=state.vy=0;
      state.lastX=e.clientX;state.lastY=e.clientY;state.lastTime=performance.now();
      canvas.setPointerCapture?.(e.pointerId); canvas.style.cursor='grabbing';
    });
    canvas.addEventListener('pointermove',e=>{
      localPoint(e);
      if(!state.dragging) return;
      const now=performance.now(),dt=Math.max(8,now-state.lastTime);
      const dx=e.clientX-state.lastX,dy=e.clientY-state.lastY;
      const drag=options.dragSpeed??.0047;
      state.ry+=dx*drag; state.rx-=dy*drag*.88;
      state.vy=(dx*drag)*(16/dt); state.vx=(-dy*drag*.88)*(16/dt);
      state.lastX=e.clientX;state.lastY=e.clientY;state.lastTime=now;
    });
    const release=e=>{
      if(!state.dragging)return;
      state.dragging=false;canvas.style.cursor='grab';
      try{canvas.releasePointerCapture?.(e.pointerId)}catch(_){}
    };
    canvas.addEventListener('pointerup',release);
    canvas.addEventListener('pointercancel',release);
    canvas.addEventListener('lostpointercapture',e=>{if(state.dragging)release(e)});
    canvas.addEventListener('pointerenter',()=>{canvas.style.cursor=state.dragging?'grabbing':'grab'});
    canvas.addEventListener('pointerleave',()=>{state.active=false;state.mx=state.my=-9999;if(!state.dragging)canvas.style.cursor='grab'});

    const rot=(x,y,z,rx,ry)=>{const cy=Math.cos(ry),sy=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx);const x1=x*cy+z*sy,z1=-x*sy+z*cy,y1=y*cx-z1*sx,z2=y*sx+z1*cx;return[x1,y1,z2]};
    const loop=now=>{
      const r=canvas.getBoundingClientRect();if(!r.width||!r.height){requestAnimationFrame(loop);return}
      ctx.clearRect(0,0,r.width,r.height);

      if(!reduceMotion && !state.dragging){
        state.rx+=state.vx; state.ry+=state.vy;
        state.vx*=.935; state.vy*=.935;
        if(Math.abs(state.vx)<.00005)state.vx=0;
        if(Math.abs(state.vy)<.00005)state.vy=0;
      }

      const t=now*(options.idleSpeed??.00045);
      const driftX=reduceMotion?0:Math.sin(t*.83)*(options.idleX??.038);
      const driftY=reduceMotion?0:Math.sin(t*.57+1.2)*(options.idleY??.056);
      const drawRX=state.rx+driftX;
      const drawRY=state.ry+driftY;
      const sxShape=options.scaleX??1, syShape=options.scaleY??1, szShape=options.scaleZ??1;

      const scale=Math.min(r.width,r.height)*(options.scale??.265),cx=r.width/2,cy=r.height/2,projected=[];
      for(const pt of state.points){
        const [x,y,z]=rot(pt.x*sxShape,pt.y*syShape,pt.z*szShape,drawRX,drawRY),pers=1/(2.9-z*.34);
        let sx=cx+x*scale*pers*2.15,sy=cy+y*scale*pers*2.15,dx=sx-state.mx,dy=sy-state.my,dist=Math.hypot(dx,dy),radius=Math.min(r.width,r.height)*(options.radius??.18);
        if(state.active&&!state.dragging&&dist<radius){const force=(1-dist/radius)*(options.force??1.4);pt.vx+=(dx/(dist||1))*force;pt.vy+=(dy/(dist||1))*force}
        pt.vx+=(-pt.ox)*.05;pt.vy+=(-pt.oy)*.05;pt.vx*=.87;pt.vy*=.87;pt.ox+=pt.vx;pt.oy+=pt.vy;
        projected.push({x:sx+pt.ox,y:sy+pt.oy,z,size:Math.max(.5,(options.dot??1.25)+z*.22)})
      }
      projected.sort((a,b)=>a.z-b.z);
      for(const p of projected){const a=Math.max(.08,Math.min(.9,(.48+p.z*.13)*baseOpacity));ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=dark?`rgba(10,10,11,${a})`:`rgba(240,238,232,${a})`;ctx.fill()}
      requestAnimationFrame(loop)
    };
    canvas.style.touchAction='pan-y';
    canvas.style.cursor='grab';
    requestAnimationFrame(loop);
  }

  // About — oversized interactive particle sphere behind Farah.
  createParticleGeometry(document.querySelector('#aboutParticleSphere'),{
    shape:'sphere',dark:false,count:14500,opacity:.92,scale:.64,radius:.30,force:2.0,dot:.88,
    rx:-.22,ry:.48,dragSpeed:.0044,idleSpeed:.00040,idleX:.034,idleY:.052
  });

  // Contact — pyramid replacing the previous cube.
  createParticleGeometry(document.querySelector('#particlePyramid'),{
    shape:'pyramid',dark:true,count:10500,opacity:.96,scale:.53,radius:.28,force:2.05,dot:.98,
    rx:-.28,ry:.42,dragSpeed:.0047,idleSpeed:.00042,idleX:.038,idleY:.056
  });

  // Gallery complete circles: same motion language as the Hero circles.
  const galleryCircleField=document.querySelector('#galleryCircleField');
  const galleryCircles=galleryCircleField ? [...galleryCircleField.querySelectorAll('.gallery-circle')] : [];
  if(galleryCircleField && galleryCircles.length && !reduceMotion){
    let gx=0,gy=0,gtx=0,gty=0;
    galleryCircleField.addEventListener('pointermove',e=>{
      const r=galleryCircleField.getBoundingClientRect();
      gtx=((e.clientX-r.left)/Math.max(r.width,1)-.5);
      gty=((e.clientY-r.top)/Math.max(r.height,1)-.5);
    });
    galleryCircleField.addEventListener('pointerleave',()=>{gtx=0;gty=0});

    const galleryCircleLoop=()=>{
      gx+=(gtx-gx)*.04;
      gy+=(gty-gy)*.04;

      // Same clearly-visible slow timing used by the Hero orbit system.
      const t=performance.now()*.00022;

      galleryCircles.forEach((circle,i)=>{
        const phase=i*1.33;
        const driftX=Math.sin(t*(1.05+i*.24)+phase)*(20+i*6);
        const driftY=Math.cos(t*(.86+i*.18)+phase)*(15+i*5);
        const mouseX=gx*(i%2===0?28:-20);
        const mouseY=gy*(i%2===0?20:-15);
        const breathe=1+Math.sin(t*(.9+i*.15)+phase)*(.010+i*.002);

        circle.style.transform=
          `translate3d(${driftX+mouseX}px,${driftY+mouseY}px,0) scale(${breathe})`;
      });

      requestAnimationFrame(galleryCircleLoop);
    };
    galleryCircleLoop();
  }

  // Hero stroked circles: light autonomous drift plus cursor response.
  const heroOrbits = heroStage ? [...heroStage.querySelectorAll('.orbit')] : [];
  if (heroStage && heroOrbits.length && !reduceMotion) {
    let ox=0, oy=0, otx=0, oty=0;
    heroStage.addEventListener('pointermove', e => {
      const r=heroStage.getBoundingClientRect();
      otx=((e.clientX-r.left)/Math.max(r.width,1)-.5);
      oty=((e.clientY-r.top)/Math.max(r.height,1)-.5);
    });
    heroStage.addEventListener('pointerleave',()=>{otx=0;oty=0});
    const orbitLoop=()=>{
      ox+=(otx-ox)*.045; oy+=(oty-oy)*.045;
      const t=performance.now()*.00022;
      heroOrbits.forEach((orbit,i)=>{
        const driftX=Math.sin(t*(i+1)*1.7)*(i===0?14:10);
        const driftY=Math.cos(t*(i+1)*1.25)*(i===0?11:8);
        const mx=ox*(i===0?34:-24);
        const my=oy*(i===0?24:-18);
        const breathe=1+Math.sin(t*(i+1))*(i===0?.018:.012);
        orbit.style.transform=`translate3d(${driftX+mx}px,${driftY+my}px,0) scale(${breathe})`;
      });
      requestAnimationFrame(orbitLoop);
    };
    orbitLoop();
  }


  // V3.14 — subtle dimensional movement for the rendered loft background.
  (function initHeroRenderParallax(){
    const hero=document.querySelector('.hero');
    const bg=document.querySelector('#heroRenderBg img');
    if(!hero||!bg||reduceMotion)return;

    let tx=0,ty=0,cx=0,cy=0,scale=1.03,targetScale=1.03;

    hero.addEventListener('pointermove',e=>{
      const r=hero.getBoundingClientRect();
      const nx=(e.clientX-r.left)/Math.max(r.width,1)-.5;
      const ny=(e.clientY-r.top)/Math.max(r.height,1)-.5;
      tx=nx*-12;
      ty=ny*-8;
      targetScale=1.045;
    });

    hero.addEventListener('pointerleave',()=>{
      tx=0;ty=0;targetScale=1.03;
    });

    const loop=()=>{
      cx+=(tx-cx)*.035;
      cy+=(ty-cy)*.035;
      scale+=(targetScale-scale)*.025;
      bg.style.setProperty('--heroBgX',`${cx.toFixed(2)}px`);
      bg.style.setProperty('--heroBgY',`${cy.toFixed(2)}px`);
      bg.style.setProperty('--heroBgScale',scale.toFixed(4));
      requestAnimationFrame(loop);
    };
    loop();
  })();



// V3.27 — continuous wire-circle movement restored to the interactive hero.
// Screen-space by design so the circles remain visible while the camera orbits.
(() => {
  const hero = document.querySelector('.hero');
  const layer = document.querySelector('#heroWireOrbits');
  if(!hero || !layer) return;

  const circles = [...layer.querySelectorAll('.hero-wire-circle')];
  if(!circles.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced) return;

  let px=0, py=0, tx=0, ty=0;

  hero.addEventListener('pointermove', e => {
    const r=hero.getBoundingClientRect();
    tx=((e.clientX-r.left)/Math.max(r.width,1)-.5);
    ty=((e.clientY-r.top)/Math.max(r.height,1)-.5);
  });

  hero.addEventListener('pointerleave', () => {
    tx=0; ty=0;
  });

  const loop = () => {
    px += (tx-px)*.035;
    py += (ty-py)*.035;

    // Same slow but visibly alive timing used by the earlier hero orbit treatment.
    const t=performance.now()*.00022;

    circles.forEach((circle,i)=>{
      const phase=i*1.41;
      const dx=Math.sin(t*(1+i*.28)+phase)*(i===0?18:i===1?13:10);
      const dy=Math.cos(t*(.85+i*.21)+phase)*(i===0?14:i===1?10:8);
      const mx=px*(i===0?32:i===1?-22:16);
      const my=py*(i===0?22:i===1?-16:12);
      const breathe=1+Math.sin(t*(.9+i*.18)+phase)*(i===0?.010:i===1?.008:.006);

      circle.style.transform=
        `translate3d(${dx+mx}px,${dy+my}px,0) scale(${breathe})`;
    });

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
})();



  // V3.30 — automatic homepage project thumbnail slideshows.
  (() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const shows = [...document.querySelectorAll('.work-card .card-slideshow')];
    if (!shows.length) return;

    shows.forEach((show, cardIndex) => {
      const slides = [...show.querySelectorAll('.card-slide')];
      if (slides.length < 2) return;

      // Restart the first frame animation after layout is ready.
      const initial = slides.find(slide => slide.classList.contains('is-active')) || slides[0];
      initial.classList.remove('is-active');
      void initial.offsetWidth;
      initial.classList.add('is-active');

      let index = 0;
      let timer = null;
      const delay = 11200 + (cardIndex % 3) * 650;

      const advance = () => {
        slides[index].classList.remove('is-active');
        index = (index + 1) % slides.length;
        const next = slides[index];
        // Force a reflow so the slow zoom animation always restarts cleanly.
        void next.offsetWidth;
        next.classList.add('is-active');
      };

      // Stagger card start times so the whole gallery doesn't change at once.
      const startDelay = 1200 + cardIndex * 700;

      const start = () => {
        if (timer) return;
        timer = window.setInterval(advance, delay);
      };

      const stop = () => {
        if (!timer) return;
        window.clearInterval(timer);
        timer = null;
      };

      window.setTimeout(start, startDelay);

      // Pause a card when the user is focusing/hovering it,
      // keeping the selected preview stable before opening.
      const card = show.closest('.work-card');
      card?.addEventListener('mouseenter', stop);
      card?.addEventListener('mouseleave', start);
      card?.addEventListener('focusin', stop);
      card?.addEventListener('focusout', start);

      // Avoid animating cards while the page is hidden.
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else start();
      });
    });
  })();



  // V3.49 — scroll-aware active navigation
  (() => {
    const links=[...document.querySelectorAll('.main-nav [data-nav-section]')];
    const ids=['home','work','about','contact'];
    if(!links.length)return;
    const activate=id=>links.forEach(a=>{
      const on=a.dataset.navSection===id;
      a.classList.toggle('is-active',on);
      if(on)a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    const sync=()=>{
      const y=window.scrollY+Math.min(window.innerHeight*.38,320);
      let current='home';
      ids.forEach(id=>{const s=document.getElementById(id);if(s&&s.offsetTop<=y)current=id});
      if(innerHeight+scrollY>=document.documentElement.scrollHeight-8)current='contact';
      activate(current);
    };
    links.forEach(a=>a.addEventListener('click',()=>activate(a.dataset.navSection)));
    addEventListener('scroll',sync,{passive:true});
    addEventListener('resize',sync,{passive:true});
    requestAnimationFrame(sync);
  })();



  // V3.50 — responsive hamburger menu
  (() => {
    const toggle=document.querySelector('#navToggle');
    const nav=document.querySelector('#mainNav');
    if(!toggle || !nav) return;

    const closeMenu=()=>{
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open menu');
      document.documentElement.classList.remove('nav-open');
    };

    const openMenu=()=>{
      toggle.classList.add('is-open');
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close menu');
      document.documentElement.classList.add('nav-open');
    };

    toggle.addEventListener('click',()=>{
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    nav.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click',closeMenu);
    });

    window.addEventListener('keydown',e=>{
      if(e.key==='Escape') closeMenu();
    });

    window.addEventListener('resize',()=>{
      if(window.innerWidth>900) closeMenu();
    },{passive:true});
  })();

})();
