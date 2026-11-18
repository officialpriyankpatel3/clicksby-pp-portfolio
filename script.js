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
const grid=document.getElementById('photography-grid');
const lightbox=document.getElementById('lightbox');
const bigImage=lightbox.querySelector('img');
const bigCaption=lightbox.querySelector('.lightbox-caption');
let current=0, visible=PHOTOS.map((_,i)=>i);
PHOTOS.forEach((p,i)=>{
 const card=document.createElement('button');card.className='photo-card';card.type='button';card.dataset.category=p.category;card.setAttribute('aria-label','View '+p.title);
 const img=document.createElement('img');img.src=p.src;img.loading='lazy';img.decoding='async';img.alt=p.title;
 const meta=document.createElement('span');meta.className='photo-card-label';const title=document.createElement('strong');title.textContent=p.title;const category=document.createElement('small');category.textContent=p.category.toUpperCase()+' ↗';meta.append(title,category);card.append(img,meta);
 card.addEventListener('click',()=>openImage(i));grid.append(card);
});
function showImage(i){current=i;const p=PHOTOS[i];bigImage.src=p.src;bigImage.alt=p.title;bigCaption.textContent=p.title+' / '+p.category.toUpperCase();}
function openImage(i){showImage(i);lightbox.classList.add('is-open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lightbox.querySelector('.lightbox-close').focus();}
function closeImage(){lightbox.classList.remove('is-open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';}
function stepImage(direction){const n=visible.indexOf(current);showImage(visible[(n+direction+visible.length)%visible.length]??visible[0]);}
lightbox.querySelector('.lightbox-close').onclick=closeImage;
lightbox.querySelector('.lightbox-prev').onclick=()=>stepImage(-1);
lightbox.querySelector('.lightbox-next').onclick=()=>stepImage(1);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeImage()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeImage();if(lightbox.classList.contains('is-open')&&e.key==='ArrowRight')stepImage(1);if(lightbox.classList.contains('is-open')&&e.key==='ArrowLeft')stepImage(-1)});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
 const category=button.dataset.filter;document.querySelector('.filter.is-active')?.classList.remove('is-active');button.classList.add('is-active');
 visible=[];grid.querySelectorAll('.photo-card').forEach((card,i)=>{const match=category==='all'||card.dataset.category===category;card.classList.toggle('is-hidden',!match);if(match)visible.push(i)});
}));
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.getElementById('menu-toggle'),nav=document.getElementById('primary-nav');
menu.addEventListener('click',()=>{const isOpen=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(isOpen))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false')}));
const preloader=document.getElementById('preloader');function dismiss(){preloader.classList.add('is-gone');sessionStorage.setItem('clicksby-entered','yes');}
document.getElementById('enter-site').addEventListener('click',dismiss);if(sessionStorage.getItem('clicksby-entered')==='yes')dismiss();
const chapters=[...document.querySelectorAll('.chapter')];
const track=document.querySelector('.experience');
const progress=document.getElementById('hud-progress');
const chapterLabel=document.getElementById('hud-chapter');
let scrollProgress=0;
function updateJourney(){
 const top=track.getBoundingClientRect().top;const total=Math.max(1,track.offsetHeight-innerHeight);
 scrollProgress=Math.max(0,Math.min(1,-top/total));
 let index=Math.min(chapters.length-1,Math.max(0,Math.floor(scrollProgress*chapters.length)));
 chapters.forEach((ch,i)=>ch.classList.toggle('is-active',i===index));
 chapterLabel.textContent='CHAPTER '+String(index+1).padStart(2,'0')+' / 04';
 progress.style.width=(scrollProgress*100).toFixed(1)+'%';
 window.clicksbyJourneyProgress=scrollProgress;
}
let scheduled=false;addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{updateJourney();scheduled=false})},{passive:true});addEventListener('resize',updateJourney);updateJourney();
