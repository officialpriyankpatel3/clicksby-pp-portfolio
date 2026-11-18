/* clicksby.pp — Dark 3D Spiral Gallery */
const PHOTOS=[
{src:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=88',title:'Quiet Confidence',category:'portrait'},
{src:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=88',title:'Golden Light',category:'portrait'},
{src:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=88',title:'The Promise',category:'wedding'},
{src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=88',title:'Further Away',category:'travel'},
{src:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=88',title:'Softness',category:'portrait'},
{src:'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=88',title:'The Night Moves',category:'street'},
{src:'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=88',title:'A Beautiful Day',category:'wedding'},
{src:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=88',title:'Quiet Horizons',category:'travel'},
{src:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=88',title:'Unspoken',category:'portrait'},
{src:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=88',title:'Blue Hour',category:'street'},
{src:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=88',title:'Forever & Always',category:'wedding'},
{src:'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=88',title:'Into the Wild',category:'travel'}
];
window.CLICKS_PHOTOS=PHOTOS;
const gallery=document.getElementById('gallery'),lightbox=document.getElementById('lightbox');
const lightboxImg=lightbox.querySelector('img'),lightboxCaption=lightbox.querySelector('.lightbox-caption');
let active=0,visible=PHOTOS.map((_,i)=>i);
PHOTOS.forEach((p,i)=>{
 const card=document.createElement('button');card.type='button';card.className='gallery-card';card.dataset.category=p.category;card.setAttribute('aria-label','View photograph: '+p.title);
 const img=document.createElement('img');img.src=p.src;img.alt=p.title;img.loading='lazy';img.decoding='async';
 const no=document.createElement('span');no.className='gallery-card-no';no.textContent=String(i+1).padStart(2,'0')+' / FRAME';
 const meta=document.createElement('div');meta.className='gallery-card-info';
 const title=document.createElement('strong');title.textContent=p.title;
 const category=document.createElement('span');category.textContent=p.category.toUpperCase()+' ↗';
 meta.append(title,category);card.append(img,no,meta);card.addEventListener('click',()=>openLightbox(i));gallery.append(card);
});
function setImage(i){active=i;const p=PHOTOS[i];lightboxImg.src=p.src;lightboxImg.alt=p.title;lightboxCaption.textContent=p.title+' / '+p.category.toUpperCase();}
function openLightbox(i){setImage(i);lightbox.classList.add('is-open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lightbox.querySelector('.lightbox-close').focus();}
function closeLightbox(){lightbox.classList.remove('is-open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';}
function stepLightbox(direction){const index=visible.indexOf(active);setImage(visible[(index+direction+visible.length)%visible.length]??visible[0]);}
lightbox.querySelector('.lightbox-close').onclick=closeLightbox;
lightbox.querySelector('.lightbox-prev').onclick=()=>stepLightbox(-1);
lightbox.querySelector('.lightbox-next').onclick=()=>stepLightbox(1);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(lightbox.classList.contains('is-open')){if(e.key==='ArrowRight')stepLightbox(1);if(e.key==='ArrowLeft')stepLightbox(-1);}});
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelector('.filter.is-active')?.classList.remove('is-active');btn.classList.add('is-active');
 visible=[];gallery.querySelectorAll('.gallery-card').forEach((card,i)=>{const show=btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter;card.classList.toggle('is-hidden',!show);if(show)visible.push(i)});
}));
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.getElementById('menu-toggle'),nav=document.getElementById('navigation');
menu.onclick=()=>{const isOpen=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(isOpen));};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false')}));
const glow=document.getElementById('cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.setProperty('--mx',e.clientX+'px');glow.style.setProperty('--my',e.clientY+'px');},{passive:true});
const experience=document.querySelector('.experience');
window.spiralProgress=0;window.spiralDesiredIndex=0;
let lastNotified=-1;
const heroNumber=document.getElementById('hero-frame-index'),heroTitle=document.getElementById('hero-active-title'),heroCategory=document.getElementById('hero-active-category'),heroProgress=document.getElementById('hero-progress');
window.setSpiralFrame=(index)=>{
 const i=((Math.round(index)%PHOTOS.length)+PHOTOS.length)%PHOTOS.length;
 if(i===lastNotified)return;
 lastNotified=i;const p=PHOTOS[i];heroNumber.textContent=String(i+1).padStart(2,'0')+' / '+PHOTOS.length;heroTitle.textContent=p.title;heroCategory.textContent=p.category.toUpperCase()+' / EDITION '+String(i+1).padStart(3,'0');heroProgress.style.width=((i+1)/PHOTOS.length*100)+'%';
};
window.setSpiralFrame(0);
let scrollScheduled=false;
function updateScroll(){
 const total=Math.max(1,experience.offsetHeight-innerHeight);
 window.spiralProgress=Math.max(0,Math.min(1,-experience.getBoundingClientRect().top/total));
 if(!window.spiralReady){window.setSpiralFrame(Math.round(window.spiralProgress*(PHOTOS.length-1)));}
 scrollScheduled=false;
}
window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});
window.addEventListener('resize',updateScroll);updateScroll();
const advance=(direction)=>{window.spiralDesiredIndex+=direction;if(!window.spiralReady)window.setSpiralFrame(window.spiralDesiredIndex);};
document.getElementById('previous-frame').addEventListener('click',()=>advance(-1));
document.getElementById('next-frame').addEventListener('click',()=>advance(1));

/* Make the first screen visibly scrollable, even when 3D is loading. */
document.body.style.overflow='';
addEventListener('pageshow',()=>{if(!lightbox.classList.contains('is-open'))document.body.style.overflow='';});
const scrollForward=document.getElementById('scroll-forward');
scrollForward?.addEventListener('click',()=>window.scrollBy({top:Math.max(280,innerHeight*.68),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
const scrollMeter=document.getElementById('scroll-meter-fill');
const originalUpdateScroll=updateScroll;
updateScroll=function(){originalUpdateScroll();if(scrollMeter)scrollMeter.style.width=(window.spiralProgress*100)+'%';};
updateScroll();
