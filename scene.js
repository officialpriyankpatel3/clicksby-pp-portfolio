/* clicksby.pp — immersive helix of photographic prints, powered by Three.js */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const host=document.getElementById('webgl-gallery');
const fallback=document.getElementById('fallback-composition');
const photos=window.CLICKS_PHOTOS||[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(host && photos.length && !reduced){
 let renderer;
 try{
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,180);
  camera.position.set(0,0,27);
  const light=new THREE.AmbientLight(0xffffff,2.1);scene.add(light);
  const redLight=new THREE.PointLight(0xc44b5c,45,48,2);redLight.position.set(9,6,6);scene.add(redLight);
  const silverLight=new THREE.PointLight(0xc9bfbc,36,55,2);silverLight.position.set(-10,-8,15);scene.add(silverLight);
  const helix=new THREE.Group();scene.add(helix);
  const FRAME_W=4.25,FRAME_H=5.65,STEP=.73,DY=3.48,RADIUS=6.15;
  const mobile=innerWidth<720;
  let centerX=mobile?0:8.2;
  helix.position.x=centerX;
  const borderMaterial=new THREE.MeshStandardMaterial({color:0x30292d,metalness:.58,roughness:.3,side:THREE.DoubleSide});
  const edgeMaterial=new THREE.MeshStandardMaterial({color:0x8d6268,metalness:.65,roughness:.3,side:THREE.DoubleSide});
  const imageFallback=new THREE.MeshBasicMaterial({color:0x302831,side:THREE.DoubleSide});
  const borderGeo=new THREE.BoxGeometry(FRAME_W+.2,FRAME_H+.2,.2);
  const lipGeo=new THREE.BoxGeometry(FRAME_W+.34,FRAME_H+.34,.05);
  const photoGeo=new THREE.PlaneGeometry(FRAME_W,FRAME_H);
  const textureLoader=new THREE.TextureLoader();
  const textures=new Map();
  const cards=[];
  function getTexture(index){
   if(textures.has(index))return textures.get(index);
   const url=photos[index].src.replace('w=1400','w='+(mobile?700:1000));
   const promise=new Promise(resolve=>textureLoader.load(url,texture=>{
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    const img=texture.image;
    const imgAspect=img.width/img.height,cardAspect=FRAME_W/FRAME_H;
    if(imgAspect>cardAspect){texture.repeat.set(cardAspect/imgAspect,1);texture.offset.x=(1-texture.repeat.x)/2;}
    else{texture.repeat.set(1,imgAspect/cardAspect);texture.offset.y=(1-texture.repeat.y)/2;}
    resolve(texture);
   },undefined,()=>resolve(null)));
   textures.set(index,promise);return promise;
  }
  for(let i=-3;i<photos.length+4;i++){
   const index=(i%photos.length+photos.length)%photos.length;
   const card=new THREE.Group();
   const angle=i*STEP;
   card.position.set(Math.sin(angle)*RADIUS,-i*DY,Math.cos(angle)*RADIUS-5.5);
   card.rotation.y=angle;
   card.rotation.z=Math.sin(i*1.35)*.055;
   const shadow=new THREE.Mesh(lipGeo,new THREE.MeshBasicMaterial({color:0x09080b,transparent:true,opacity:.48,side:THREE.DoubleSide}));shadow.position.set(.13,-.13,-.19);card.add(shadow);
   const rim=new THREE.Mesh(borderGeo,borderMaterial);card.add(rim);
   const lip=new THREE.Mesh(lipGeo,edgeMaterial);lip.position.z=.115;card.add(lip);
   const image=new THREE.Mesh(photoGeo,imageFallback.clone());image.position.z=.151;card.add(image);
   // The photo texture is shared between repeated turns of the spiral.
   getTexture(index).then(tex=>{if(tex){image.material.map=tex;image.material.color.set(0xffffff);image.material.needsUpdate=true}});
   const edge=new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W+.2,.045),new THREE.MeshBasicMaterial({color:0xd0a8a8,transparent:true,opacity:.8,side:THREE.DoubleSide}));
   edge.position.set(0,-FRAME_H/2-.065,.163);card.add(edge);
   helix.add(card);cards.push({card,i});
  }
  // A fine burgundy metal thread winds through the photo installation.
  const curvePoints=[];
  for(let n=-3*16;n<(photos.length+4)*16;n++){
   const i=n/16,a=i*STEP;
   curvePoints.push(new THREE.Vector3(Math.sin(a)*(RADIUS+.35),-i*DY,Math.cos(a)*(RADIUS+.35)-5.5));
  }
  const lineGeo=new THREE.BufferGeometry().setFromPoints(curvePoints);
  helix.add(new THREE.Line(lineGeo,new THREE.LineBasicMaterial({color:0x7b3946,transparent:true,opacity:.3,depthWrite:false})));
  // Delicate points for cinematic depth, no external textures required.
  const dotCount=mobile?180:360;
  const dots=new Float32Array(dotCount*3);
  for(let i=0;i<dotCount;i++){dots[i*3]=(Math.random()-.5)*44;dots[i*3+1]=(Math.random()-.5)*70;dots[i*3+2]=(Math.random()-.5)*35-10;}
  const dotGeo=new THREE.BufferGeometry();dotGeo.setAttribute('position',new THREE.BufferAttribute(dots,3));
  const particles=new THREE.Points(dotGeo,new THREE.PointsMaterial({color:0x9b717a,size:.05,transparent:true,opacity:.54,depthWrite:false}));scene.add(particles);
  let manualIndex=0,lastUserOffset=0,hoverX=0,hoverY=0;
  let smoothIndex=0,smoothAngle=0,lastDisplay=-1,previous=performance.now();
  function viewport(){const m=innerWidth<720;centerX=m?0:8.2;camera.fov=m?53:43;camera.aspect=innerWidth/innerHeight;camera.position.z=m?32:27;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))}
  viewport();window.addEventListener('resize',viewport);
  window.spiralReady=true;
  function normalize(index){return(index%photos.length+photos.length)%photos.length;}
  function changeBy(amount){manualIndex+=amount;lastUserOffset=performance.now();}
  const previousBtn=document.getElementById('previous-frame'),nextBtn=document.getElementById('next-frame');
  previousBtn.addEventListener('click',()=>changeBy(-1));
  nextBtn.addEventListener('click',()=>changeBy(1));
  // Hand dragging turns the helix; touch gestures on mobiles still scroll normally.
  let down=null;
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId)});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down)return;const delta=e.clientX-down.x;if(Math.abs(delta)>28)changeBy(Math.round(-delta/90)||Math.sign(-delta));down=null;});
  renderer.domElement.addEventListener('pointermove',e=>{hoverX=(e.clientX/innerWidth-.5)*2;hoverY=(e.clientY/innerHeight-.5)*2;});
  renderer.domElement.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>18){changeBy(Math.sign(e.deltaX));}},{passive:true});
  let visible=true;document.addEventListener('visibilitychange',()=>visible=!document.hidden);
  let elapsed=0;
  function render(now){
   requestAnimationFrame(render);
   if(!visible)return;
   const dt=Math.min(.05,(now-previous)/1000||0);previous=now;elapsed+=dt;
   const scrollIndex=(window.spiralProgress||0)*(photos.length-1);
   // After explicit navigation, keep the chosen frame until the visitor scrolls again.
   const target=scrollIndex+manualIndex;
   const amt=1-Math.exp(-dt*3.6);
   smoothIndex+=(target-smoothIndex)*amt;
   const phase=smoothIndex*STEP;
   smoothAngle+=((-phase)-smoothAngle)*amt;
   helix.position.x+=(centerX-helix.position.x)*amt;
   helix.position.y=smoothIndex*DY;
   helix.rotation.y=smoothAngle+Math.sin(elapsed*.12)*.035+hoverX*.045;
   helix.rotation.x=Math.sin(elapsed*.17)*.015-hoverY*.018;
   // Fade distant frames to keep the hero editorial, not cluttered.
   cards.forEach(({card,i})=>{
    const distance=Math.abs(i-smoothIndex);
    const scale=1+(Math.max(0,1-distance)*.1);
    card.scale.setScalar(scale);
    card.visible=distance<6;
   });
   particles.rotation.y=elapsed*.006;
   const shown=normalize(Math.round(smoothIndex));
   if(shown!==lastDisplay){lastDisplay=shown;window.setSpiralFrame?.(shown);}
   renderer.render(scene,camera);
  }
  host.classList.add('is-ready');fallback?.classList.add('is-hidden');
  requestAnimationFrame(render);
 }catch(err){
  console.warn('Optional 3D gallery could not be initialized; still gallery is available.',err);
  host.style.display='none';fallback?.classList.remove('is-hidden');
  if(renderer){renderer.dispose();}
 }
}
