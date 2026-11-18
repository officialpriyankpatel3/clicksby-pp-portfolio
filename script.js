const photos=[
{src:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=88',title:'Quiet Confidence',cat:'portrait'},
{src:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=88',title:'Golden Hour',cat:'fashion'},
{src:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88',title:'The Promise',cat:'wedding'},
{src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=88',title:'Somewhere Far',cat:'travel'},
{src:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=88',title:'Soft Light',cat:'portrait'},
{src:'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=88',title:'After Dark',cat:'street'},
{src:'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=88',title:'A Day to Remember',cat:'wedding'},
{src:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=88',title:'Into the Wild',cat:'travel'},
{src:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=88',title:'The Character',cat:'portrait'},
{src:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=88',title:'City Lights',cat:'street'},
{src:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=88',title:'Forever Starts',cat:'wedding'},
{src:'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=88',title:'Earth & Sky',cat:'travel'}
];
const gallery=document.querySelector('#gallery'),box=document.querySelector('#lightbox'),boxImg=box.querySelector('img'),boxTitle=box.querySelector('p');let current=0;
photos.forEach((p,i)=>{const card=document.createElement('article');card.className='photo';card.dataset.cat=p.cat;const img=document.createElement('img');img.src=p.src;img.alt=p.title;img.loading='lazy';img.decoding='async';const caption=document.createElement('span');caption.className='photo-caption';caption.textContent=p.title;card.append(img,caption);card.addEventListener('click',()=>show(i));gallery.append(card)});
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.filters .active').classList.remove('active');b.classList.add('active');gallery.querySelectorAll('.photo').forEach(el=>el.classList.toggle('hidden',b.dataset.filter!=='all'&&el.dataset.cat!==b.dataset.filter))}));
function show(i){current=i;boxImg.src=photos[i].src;boxImg.alt=photos[i].title;boxTitle.textContent=photos[i].title;box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow=''}function step(n){show((current+n+photos.length)%photos.length)}
box.querySelector('.close').onclick=close;box.querySelector('.prev').onclick=()=>step(-1);box.querySelector('.next').onclick=()=>step(1);box.addEventListener('click',e=>{if(e.target===box)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(box.classList.contains('open')&&e.key==='ArrowRight')step(1);if(box.classList.contains('open')&&e.key==='ArrowLeft')step(-1)});
const menu=document.querySelector('.menu'),nav=document.querySelector('.nav');menu.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();const loader=document.getElementById('loader');window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),350));setTimeout(()=>loader.classList.add('done'),1800);
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section-top,.about-copy,.about-image,.specialties article,.contact>*').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});
