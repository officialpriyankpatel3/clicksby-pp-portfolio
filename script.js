/* ==========================================================
   clicksby.pp - 3D photography portfolio
   Replace the photos below with your own (see README.md).
   ========================================================== */

const PHOTOS = [
  { src: 'https://picsum.photos/seed/clicksby1/600/800',  title: 'Portrait' },
  { src: 'https://picsum.photos/seed/clicksby2/600/800',  title: 'Golden Hour' },
  { src: 'https://picsum.photos/seed/clicksby3/600/800',  title: 'Street' },
  { src: 'https://picsum.photos/seed/clicksby4/600/800',  title: 'Travel' },
  { src: 'https://picsum.photos/seed/clicksby5/600/800',  title: 'Candid' },
  { src: 'https://picsum.photos/seed/clicksby6/600/800',  title: 'Landscape' },
  { src: 'https://picsum.photos/seed/clicksby7/600/800',  title: 'Wedding' },
  { src: 'https://picsum.photos/seed/clicksby8/600/800',  title: 'Details' },
  { src: 'https://picsum.photos/seed/clicksby9/600/800',  title: 'Night' },
  { src: 'https://picsum.photos/seed/clicksby10/600/800', title: 'Nature' },
  { src: 'https://picsum.photos/seed/clicksby11/600/800', title: 'Monochrome' },
  { src: 'https://picsum.photos/seed/clicksby12/600/800', title: 'Moments' }
];

/* ---------- Gallery grid + lightbox ---------- */
const grid = document.getElementById('grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

PHOTOS.forEach((p) => {
  const card = document.createElement('div');
  card.className = 'card reveal';
  card.innerHTML = '<img loading="lazy" alt="' + p.title + '" src="' + p.src + '"><span>' + p.title + '</span>';

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = 'rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 14) + 'deg) scale(1.03)';
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  card.addEventListener('click', () => {
    lightboxImg.src = p.src;
    lightboxImg.alt = p.title;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
  grid.appendChild(card);
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}
lightbox.addEventListener('click', closeLightbox);
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 3D scene (Three.js) ---------- */
(function initScene() {
  const canvas = document.getElementById('bg');
  const loader = document.getElementById('loader');

  if (typeof THREE === 'undefined') {
    // Three.js failed to load - still show the site
    loader.classList.add('done');
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.03);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  let baseZ = 15;

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.PointLight(0xe8c27a, 1.5, 60);
  key.position.set(6, 6, 10);
  scene.add(key);
  const rim = new THREE.PointLight(0x6aa0ff, 0.9, 60);
  rim.position.set(-8, -4, 6);
  scene.add(rim);

  /* --- Camera model built from simple shapes --- */
  const cam = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1b1f, metalness: 0.7, roughness: 0.35 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x8a8a92, metalness: 0.9, roughness: 0.25 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x1c3a6e, metalness: 0.2, roughness: 0.05, emissive: 0x0a1a3a });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe8c27a, metalness: 0.9, roughness: 0.3 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.1, 1.4), dark);
  cam.add(body);
  const hump = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1), dark);
  hump.position.set(0, 1.25, 0);
  cam.add(hump);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.1, 0.5), dark);
  grip.position.set(-1.55, 0, 0.7);
  cam.add(grip);

  const lensRing = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.5, 40), metal);
  lensRing.rotation.x = Math.PI / 2;
  lensRing.position.set(0.1, 0, 0.95);
  cam.add(lensRing);
  const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.85, 0.9, 40), dark);
  lensBarrel.rotation.x = Math.PI / 2;
  lensBarrel.position.set(0.1, 0, 1.45);
  cam.add(lensBarrel);
  const lensGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 40), glass);
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.set(0.1, 0, 1.92);
  cam.add(lensGlass);
  const accent = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.04, 12, 60), gold);
  accent.position.set(0.1, 0, 1.9);
  cam.add(accent);

  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.15, 20), gold);
  button.position.set(1.1, 1.1, 0.2);
  cam.add(button);
  const flash = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.2), metal);
  flash.position.set(-1.0, 1.1, 0.5);
  cam.add(flash);

  cam.scale.setScalar(1.05);
  scene.add(cam);

  /* --- Ring of floating photo frames --- */
  const ring = new THREE.Group();
  scene.add(ring);
  const texLoader = new THREE.TextureLoader();
  texLoader.setCrossOrigin('anonymous');
  const RADIUS = 8;
  const frames = [];

  PHOTOS.forEach((p, i) => {
    const a = (i / PHOTOS.length) * Math.PI * 2;
    const frame = new THREE.Group();

    const border = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 3.4),
      new THREE.MeshBasicMaterial({ color: 0xe8c27a, side: THREE.DoubleSide })
    );
    border.position.z = -0.01;
    frame.add(border);

    const mat = new THREE.MeshBasicMaterial({ color: 0x222226, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.45, 3.25), mat);
    frame.add(plane);

    texLoader.load(p.src, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      mat.map = tex;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
    });

    frame.position.set(Math.sin(a) * RADIUS, Math.sin(i * 1.7) * 1.2, Math.cos(a) * RADIUS);
    frame.rotation.y = a;
    frame.userData.phase = i * 0.8;
    frame.userData.baseY = frame.position.y;
    ring.add(frame);
    frames.push(frame);
  });

  /* --- Floating dust particles --- */
  const COUNT = 700;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xe8c27a, size: 0.06, transparent: true, opacity: 0.6 }));
  scene.add(particles);

  /* --- Interaction --- */
  let scroll = 0, targetScroll = window.scrollY;
  let mx = 0, my = 0;
  addEventListener('scroll', () => { targetScroll = window.scrollY; }, { passive: true });
  addEventListener('pointermove', (e) => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    baseZ = camera.aspect < 0.8 ? 21 : 15;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();

  function tick() {
    const t = clock.getElapsedTime() * (reduced ? 0.2 : 1);
    scroll += (targetScroll - scroll) * 0.06;

    // Ring turns with time and with scrolling
    ring.rotation.y = t * 0.12 + scroll * 0.0032;
    frames.forEach((f) => {
      f.position.y = f.userData.baseY + Math.sin(t * 0.8 + f.userData.phase) * 0.25;
    });

    // Camera model floats and follows the pointer
    cam.position.y = Math.sin(t * 0.9) * 0.2;
    cam.rotation.y += ((mx * 0.7 + Math.sin(t * 0.4) * 0.25) - cam.rotation.y) * 0.05;
    cam.rotation.x += ((my * 0.35) - cam.rotation.x) * 0.05;

    // Camera drifts with pointer and scroll depth
    camera.position.x += (mx * 1.6 - camera.position.x) * 0.03;
    camera.position.y += (-my * 1.0 - camera.position.y) * 0.03;
    camera.position.z = baseZ + Math.sin(scroll * 0.0018) * 2.2;
    camera.lookAt(0, 0, 0);

    particles.rotation.y = t * 0.015;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 600));
  setTimeout(() => loader.classList.add('done'), 3500); // safety
})();
