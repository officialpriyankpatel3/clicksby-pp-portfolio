import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
const host=document.getElementById('webgl-world');
if(host && !matchMedia('(prefers-reduced-motion: reduce)').matches){
try{
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
 renderer.setSize(innerWidth,innerHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.13;
 host.append(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#7a959e');scene.fog=new THREE.FogExp2('#b0c0c5',.012);
 const camera=new THREE.PerspectiveCamera(53,innerWidth/innerHeight,.1,360);
 const hemi=new THREE.HemisphereLight(0xe9f4f6,0x344657,2.4);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xffe0c1,3.1);sun.position.set(-48,67,-92);scene.add(sun);
 const cool=new THREE.DirectionalLight(0x95c6d9,1.2);cool.position.set(45,40,40);scene.add(cool);
 const snowMat=new THREE.MeshStandardMaterial({color:0xdce6e7,roughness:.99,flatShading:true,side:THREE.DoubleSide});
 const slopeMat=new THREE.MeshStandardMaterial({color:0x89a2af,roughness:1,flatShading:true,side:THREE.DoubleSide});
 const distantMat=new THREE.MeshStandardMaterial({color:0xbacbd0,roughness:1,flatShading:true,side:THREE.DoubleSide});
 function terrain(z,depth,height,seed,material){
  const geometry=new THREE.PlaneGeometry(290,depth,72,19);
  const a=geometry.attributes.position;
  for(let i=0;i<a.count;i++){
   const x=a.getX(i),y=a.getY(i);
   const horizontal=Math.sin(x*.022+seed)*.43+Math.sin(x*.056+seed*2)*.21+Math.sin(x*.11+seed)*.11;
   const jagged=Math.abs(Math.sin(x*.16+seed*5))*.24;
   const ridge=height*(.46+horizontal+jagged);
   const back=(y+depth/2)/depth;
   a.setZ(i,Math.max(-12,ridge)*(Math.pow(Math.max(0,back),1.3))+(Math.sin(x*.15+y*.2+seed)*.9));
  }
  geometry.computeVertexNormals();
  const m=new THREE.Mesh(geometry,material);m.rotation.x=-Math.PI/2;m.position.set(0,-16,z);scene.add(m);
 }
 // Three longitudinal terrain banks give the world its parallax and dimensional scale.
 terrain(-115,130,79,2.1,distantMat);
 terrain(-76,105,55,4.8,slopeMat);
 terrain(-32,80,31,7.3,snowMat);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshStandardMaterial({color:0xcbd9dc,roughness:1}));
 floor.rotation.x=-Math.PI/2;floor.position.y=-16.2;scene.add(floor);
 // A photographic installation with sculptural frames that the camera passes.
 const installation=new THREE.Group();scene.add(installation);
 const frameMat=new THREE.MeshStandardMaterial({color:0x293943,metalness:.35,roughness:.6});
 const edgeMat=new THREE.MeshStandardMaterial({color:0xd9d6cd,metalness:.18,roughness:.6});
 function bar(parent,w,h,d,x,y,z,mat){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 }
 function gateway(x,z,scale){
  const g=new THREE.Group();g.position.set(x,-15,z);g.scale.setScalar(scale);installation.add(g);
  bar(g,.7,11,.8,-8,5.5,0,frameMat);bar(g,.7,11,.8,8,5.5,0,frameMat);
  bar(g,19,.8,1.4,0,11,0,frameMat);bar(g,17,.22,1.1,0,9.9,0,edgeMat);
  bar(g,14,.38,.7,0,8.3,0,frameMat);
  return g;
 }
 gateway(0,25,1);gateway(0,-14,.85);gateway(0,-48,.72);
 const photoSources=[
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=850&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=850&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=850&q=80',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=850&q=80'
 ];
 const panels=[];
 const textureLoader=new THREE.TextureLoader();
 photoSources.forEach((src,i)=>{
  const g=new THREE.Group();g.position.set((i%2===0?-1:1)*15,3,-15-i*20);g.rotation.y=(i%2===0?1:-1)*.28;
  installation.add(g);bar(g,12.7,17.7,.45,0,0,-.28,frameMat);bar(g,12,17,.1,0,0,0,edgeMat);
  const imagePlane=new THREE.Mesh(new THREE.PlaneGeometry(11.4,16.4),new THREE.MeshBasicMaterial({color:0xc2d1d7,side:THREE.DoubleSide}));
  imagePlane.position.z=.12;g.add(imagePlane);panels.push(g);
  textureLoader.load(src,tex=>{
   tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
   imagePlane.material.map=tex;imagePlane.material.color.set(0xffffff);imagePlane.material.needsUpdate=true;
  },undefined,()=>{});
 });
 // Stochastic powder snow drifting between foreground and mountains.
 const count=innerWidth<680?700:1450;
 const positions=new Float32Array(count*3),speeds=new Float32Array(count);
 for(let i=0;i<count;i++){
  positions[i*3]=(Math.random()-.5)*160;
  positions[i*3+1]=Math.random()*90-17;
  positions[i*3+2]=Math.random()*190-100;
  speeds[i]=.2+Math.random()*.75;
 }
 const snowGeometry=new THREE.BufferGeometry();
 snowGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 scene.add(new THREE.Points(snowGeometry,new THREE.PointsMaterial({color:0xf2f7f8,size:.32,transparent:true,opacity:.83,depthWrite:false,sizeAttenuation:true})));
 const path=new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,15,85),new THREE.Vector3(-9,12,52),
  new THREE.Vector3(2,7,21),new THREE.Vector3(10,5,-19),
  new THREE.Vector3(3,4,-55),new THREE.Vector3(0,6,-87)
 ]);
 const lookPath=new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,10,-25),new THREE.Vector3(1,8,-28),
  new THREE.Vector3(1,5,-47),new THREE.Vector3(1,3,-71),
  new THREE.Vector3(0,3,-95),new THREE.Vector3(0,5,-115)
 ]);
 const reducedFPS=innerWidth<680;
 const clock=new THREE.Clock();
 let progress=0,mouseX=0,mouseY=0,running=true;
 window.addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5)*2;mouseY=(e.clientY/innerHeight-.5)*2},{passive:true});
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))}
 addEventListener('resize',resize);
 document.addEventListener('visibilitychange',()=>{running=!document.hidden;clock.getDelta()});
 const p=new THREE.Vector3(),target=new THREE.Vector3();
 function frame(){
  requestAnimationFrame(frame);
  if(!running)return;
  const dt=Math.min(.04,clock.getDelta());
  const wanted=Math.max(0,Math.min(1,window.clicksbyJourneyProgress||0));
  progress+=(wanted-progress)*Math.min(1,dt*2.1);
  const t=clock.elapsedTime;
  path.getPoint(progress,p);lookPath.getPoint(progress,target);
  camera.position.copy(p);
  camera.position.x+=mouseX*(reducedFPS?.45:1.3)+Math.sin(t*.2)*.3;
  camera.position.y-=mouseY*.5;
  camera.lookAt(target);
  camera.rotation.z=Math.sin(progress*Math.PI*2)*.014;
  for(let i=0;i<count;i++){
   positions[i*3+1]-=speeds[i]*dt*1.8;
   positions[i*3]+=.07*dt;
   if(positions[i*3+1]<-16)positions[i*3+1]=75;
  }
  snowGeometry.attributes.position.needsUpdate=true;
  panels.forEach((g,i)=>{g.rotation.y=(i%2===0?1:-1)*.28+Math.sin(t*.25+i)*.035});
  renderer.render(scene,camera);
 }
 host.classList.add('is-ready');frame();
}catch(e){console.warn('Optional WebGL scene unavailable; fallback active.',e);host.style.display='none'}
}
