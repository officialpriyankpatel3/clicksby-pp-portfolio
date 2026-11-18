/* clicksby.pp — immersive editorial photography portfolio */
const PHOTOS=[
 {src:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=88',title:'Quiet Confidence',category:'portrait',tag:'PORTRAIT'},
 {src:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=88',title:'Golden Hour',category:'portrait',tag:'PORTRAIT'},
 {src:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=88',title:'The Promise',category:'wedding',tag:'WEDDING'},
 {src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=88',title:'Somewhere Far',category:'travel',tag:'TRAVEL'},
 {src:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1100&q=88',title:'Soft Light',category:'portrait',tag:'PORTRAIT'},
 {src:'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1100&q=88',title:'After Dark',category:'street',tag:'STREET'},
 {src:'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1100&q=88',title:'A Day to Remember',category:'wedding',tag:'WEDDING'},
 {src:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=88',title:'Into the Wild',category:'travel',tag:'TRAVEL'},
 {src:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1100&q=88',title:'The Character',category:'portrait',tag:'PORTRAIT'},
 {src:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1100&q=88',title:'City Lights',category:'street',tag:'STREET'},
 {src:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1100&q=88',title:'Forever Starts',category:'wedding',tag:'WEDDING'},
 {src:'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1100&q=88',title:'Earth & Sky',category:'travel',tag:'TRAVEL'}
];
const gallery=document.querySelector('#gallery');
const lightbox=document.querySelector('#lightbox');
const lbImg=lightbox.querySelector('img');
const lbCaption=lightbox.querySelector('.lightbox-caption');
let activePhoto=0;
PHOTOS.forEach((photo,i)=>{
 const card=document.createElement('article');card.className='gallery-card reveal';card.dataset.category=photo.category;
 const img=document.createElement('img');img.src=photo.src;img.alt=photo.title;img.loading='lazy';img.decoding='async';
 const meta=document.createElement('div');meta.className='gallery-meta';
 const title=document.createElement('span');title.textContent=photo.title;
 const tag=document.createElement('span');tag.textContent=photo.tag;
 meta.append(title,tag);card.append(img,meta);card.addEventListener('click',()=>openLightbox(i));
 card.addEventListener('pointermove',e=>{if(matchMedia('(hover:hover)').matches){const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(900px) rotateY('+x*4+'deg) rotateX('+(-y*4)+'deg) translateY(-3px)'}});
 card.addEventListener('pointerleave',()=>card.style.transform='');gallery.append(card);
});
function openLightbox(i){activePhoto=i;const p=PHOTOS[i];lbImg.src=p.src;lbImg.alt=p.title;lbCaption.textContent=p.title;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function stepLightbox(d){openLightbox((activePhoto+d+PHOTOS.length)%PHOTOS.length)}
lightbox.querySelector('.lightbox-close').addEventListener('click',closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>stepLightbox(-1));
lightbox.querySelector('.lightbox-next').addEventListener('click',()=>stepLightbox(1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(lightbox.classList.contains('open')&&e.key==='ArrowRight')stepLightbox(1);if(lightbox.classList.contains('open')&&e.key==='ArrowLeft')stepLightbox(-1)});
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelector('.filter.active')?.classList.remove('active');btn.classList.add('active');
 const filter=btn.dataset.filter;
 document.querySelectorAll('.gallery-card').forEach(card=>card.classList.toggle('hidden',filter!=='all'&&card.dataset.category!==filter));
}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.desktop-nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const glow=document.querySelector('.cursor-glow');
if(matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true})}
const loader=document.getElementById('loader');
window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),500));
setTimeout(()=>loader.classList.add('done'),2400);

/* Three.js: a floating 3D camera, orbiting frames and ambient particles */
(function scene3D(){
 const canvas=document.createElement('canvas');canvas.className='three-bg';canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:.5';
 const hero=document.querySelector('.hero');hero.prepend(canvas);
 if(!window.THREE)return;
 let renderer,scene,camera,rig,ring,particles,frames=[],raf;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(hero.clientWidth,hero.clientHeight);renderer.outputEncoding=THREE.sRGBEncoding;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(48,hero.clientWidth/hero.clientHeight,.1,100);camera.position.set(0,0,13);
 scene.add(new THREE.AmbientLight(0xffffff,.8));const warm=new THREE.PointLight(0xc6a879,2,35);warm.position.set(5,5,7);scene.add(warm);
 rig=new THREE.Group();rig.position.set(2.7,.15,0);scene.add(rig);
 const bodyMat=new THREE.MeshStandardMaterial({color:0x29251f,metalness:.8,roughness:.3});
 const metalMat=new THREE.MeshStandardMaterial({color:0xc6a879,metalness:.9,roughness:.22});
 const glassMat=new THREE.MeshStandardMaterial({color:0x17283a,metalness:.5,roughness:.08,emissive:0x0a1720});
 const body=new THREE.Mesh(new THREE.BoxGeometry(2.5,1.65,.95),bodyMat);rig.add(body);
 const top=new THREE.Mesh(new THREE.BoxGeometry(.85,.35,.75),bodyMat);top.position.set(0,1,0);rig.add(top);
 const lens=new THREE.Mesh(new THREE.CylinderGeometry(.68,.75,.72,48),metalMat);lens.rotation.x=Math.PI/2;lens.position.z=.72;rig.add(lens);
 const inner=new THREE.Mesh(new THREE.CylinderGeometry(.53,.53,.12,48),glassMat);inner.rotation.x=Math.PI/2;inner.position.z=1.13;rig.add(inner);
 const ringGold=new THREE.Mesh(new THREE.TorusGeometry(.68,.045,12,64),metalMat);ringGold.position.z=1.17;rig.add(ringGold);
 ring=new THREE.Group();scene.add(ring);const texLoader=new THREE.TextureLoader();
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2,g=new THREE.Group();const frame=new THREE.Mesh(new THREE.PlaneGeometry(1.35,1.8),new THREE.MeshBasicMaterial({color:0xb99b6b,side:THREE.DoubleSide}));frame.position.z=-.02;g.add(frame);
 const pic=new THREE.Mesh(new THREE.PlaneGeometry(1.22,1.66),new THREE.MeshBasicMaterial({color:0x3a332a,side:THREE.DoubleSide}));g.add(pic);
 texLoader.load(PHOTOS[i].src,t=>{t.encoding=THREE.sRGBEncoding;pic.material.map=t;pic.material.color.set(0xffffff);pic.material.needsUpdate=true});
 g.position.set(Math.sin(a)*5.2,Math.sin(i*1.8)*1.2,Math.cos(a)*4);g.rotation.y=a;g.userData.y=g.position.y;g.userData.phase=i;ring.add(g);frames.push(g)}
 const count=380,pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*25;pos[i*3+1]=(Math.random()-.5)*15;pos[i*3+2]=(Math.random()-.5)*18}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));particles=new THREE.Points(geo,new THREE.PointsMaterial({color:0xc6a879,size:.035,transparent:true,opacity:.65}));scene.add(particles);
 let mx=0,my=0;window.addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
 const clock=new THREE.Clock(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=w<650?17:13;camera.updateProjectionMatrix()}
 window.addEventListener('resize',resize);resize();
 function tick(){raf=requestAnimationFrame(tick);const t=clock.getElapsedTime()*(reduced?.18:1);rig.rotation.y+=(mx*.32+Math.sin(t*.35)*.1-rig.rotation.y)*.035;rig.rotation.x+=(my*.2-rig.rotation.x)*.035;rig.position.y=Math.sin(t*.7)*.18;ring.rotation.y=t*.08;frames.forEach(f=>f.position.y=f.userData.y+Math.sin(t*.8+f.userData.phase)*.18);particles.rotation.y=t*.012;renderer.render(scene,camera)}
 tick();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else tick()});
 }catch(e){canvas.remove()}
})();