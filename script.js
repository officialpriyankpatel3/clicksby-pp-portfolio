/* clicksby.pp — bold editorial portfolio interactions */
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
const gallery=document.querySelector('#gallery'),lightbox=document.querySelector('#lightbox'),lbImg=lightbox.querySelector('img'),lbCaption=lightbox.querySelector('.lightbox-caption');
let activePhoto=0;
PHOTOS.forEach((photo,i)=>{const card=document.createElement('article');card.className='gallery-card reveal';card.dataset.category=photo.category;const img=document.createElement('img');img.src=photo.src;img.alt=photo.title;img.loading='lazy';img.decoding='async';const meta=document.createElement('div');meta.className='gallery-meta';const title=document.createElement('span');title.textContent=photo.title;const tag=document.createElement('span');tag.textContent=photo.tag;meta.append(title,tag);card.append(img,meta);card.addEventListener('click',()=>openLightbox(i));gallery.append(card)});
function openLightbox(i){activePhoto=i;const p=PHOTOS[i];lbImg.src=p.src;lbImg.alt=p.title;lbCaption.textContent=p.title;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function stepLightbox(d){openLightbox((activePhoto+d+PHOTOS.length)%PHOTOS.length)}
lightbox.querySelector('.lightbox-close').addEventListener('click',closeLightbox);lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>stepLightbox(-1));lightbox.querySelector('.lightbox-next').addEventListener('click',()=>stepLightbox(1));lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(lightbox.classList.contains('open')&&e.key==='ArrowRight')stepLightbox(1);if(lightbox.classList.contains('open')&&e.key==='ArrowLeft')stepLightbox(-1)});
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelector('.filter.active')?.classList.remove('active');btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.gallery-card').forEach(card=>card.classList.toggle('hidden',f!=='all'&&card.dataset.category!==f))}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.desktop-nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const loader=document.getElementById('loader');window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),450));setTimeout(()=>loader.classList.add('done'),2200);
const progress=document.querySelector('.scroll-progress');let ticking=false;window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';ticking=false});ticking=true}},{passive:true});
