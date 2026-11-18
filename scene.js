import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
const host=document.getElementById('webgl-world');
if(host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
try{
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#a8c2d3');scene.fog=new THREE.FogExp2('#c2d3dd',.012);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,500);camera.position.set(0,12,65);
scene.add(new THREE.HemisphereLight(0xe8f4ff,0x536779,2.6));
const sun=new THREE.DirectionalLight(0xfff3df,2.4);sun.position.set(-50,80,-90);scene.add(sun);
const mountainMaterial=new THREE.MeshStandardMaterial({color:0xa2b9c8,roughness:1,flatShading:true});
const farMaterial=new THREE.MeshStandardMaterial({color:0xd1dfe6,roughness:1,flatShading:true});
const snowMaterial=new THREE.MeshStandardMaterial({color:0xe7eef2,roughness:1,flatShading:true});
function ridge(z,peak,mat,seed){const shape=new THREE.BufferGeometry(),v=[],idx=[];const count=72;for(let i=0;i<=count;i++){const x=(i/count-.5)*260;const y=peak*(.25+.75*Math.pow(Math.abs(Math.sin(i*.19+seed)*Math.cos(i*.067+seed)),1.2))+Math.sin(i*.57+seed)*3;v.push(x,y,z,x,-32,z+8);if(i<count){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}}shape.setAttribute('position',new THREE.Float32BufferAttribute(v,3));shape.setIndex(idx);shape.computeVertexNormals();const mesh=new THREE.Mesh(shape,mat);scene.add(mesh)}
ridge(-115,58,farMaterial,1.7);ridge(-75,42,mountainMaterial,2.9);ridge(-40,26,snowMaterial,4.2);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500,60,60),new THREE.MeshStandardMaterial({color:0xd5e3e9,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-12;scene.add(ground);
const snowCount=innerWidth<700?500:1200;const positions=new Float32Array(snowCount*3),speeds=new Float32Array(snowCount);
for(let i=0;i<snowCount;i++){positions[i*3]=(Math.random()-.5)*190;positions[i*3+1]=Math.random()*105-12;positions[i*3+2]=(Math.random()-.5)*150;speeds[i]=.02+Math.random()*.06}
const snowGeo=new THREE.BufferGeometry();snowGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));const flakes=new THREE.Points(snowGeo,new THREE.PointsMaterial({color:0xffffff,size:.55,transparent:true,opacity:.8,sizeAttenuation:true,depthWrite:false}));scene.add(flakes);
const archGroup=new THREE.Group();scene.add(archGroup);const dark=new THREE.MeshStandardMaterial({color:0x263a49,roughness:.75}),pale=new THREE.MeshStandardMaterial({color:0xd9e8ed,roughness:.8});
function block(w,h,d,x,y,z,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);archGroup.add(mesh)}
block(1.4,16,1.4,-10,-2,12,dark);block(1.4,16,1.4,10,-2,12,dark);block(24,1.5,2,0,6,12,dark);block(21,.35,1.6,0,4.7,12,pale);
const clock=new THREE.Clock();let scrollTarget=0,scrollValue=0;
function scroll(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);scrollTarget=scrollY/max}addEventListener('scroll',scroll,{passive:true});scroll();
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))}addEventListener('resize',resize);
let active=true;document.addEventListener('visibilitychange',()=>{active=!document.hidden;if(active)clock.getDelta()});
function animate(){requestAnimationFrame(animate);if(!active)return;const dt=Math.min(clock.getDelta(),.05);scrollValue+=(scrollTarget-scrollValue)*Math.min(1,dt*2.5);const t=clock.elapsedTime;camera.position.x=Math.sin(t*.08)*2+Math.sin(scrollValue*Math.PI*2)*8;camera.position.y=12-scrollValue*9+Math.sin(t*.16)*.7;camera.position.z=65-scrollValue*92;camera.lookAt(Math.sin(scrollValue*4)*6,8-scrollValue*6,-55-scrollValue*35);archGroup.rotation.y=Math.sin(t*.18)*.035;for(let i=0;i<snowCount;i++){const y=i*3+1;positions[y]-=speeds[i]*dt*60;if(positions[y]<-13)positions[y]=90}snowGeo.attributes.position.needsUpdate=true;renderer.render(scene,camera)}
host.classList.add('ready');animate();
}catch(error){console.warn('3D scene unavailable; showing static design',error);host.remove()}
}