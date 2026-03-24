 /* ============================================
   main.js — Three.js + GSAP Portfolio Logic
   ============================================ */

// ===== GSAP PLUGIN REGISTRATION =====
gsap.registerPlugin(ScrollTrigger);

// ===== THREE.JS STARFIELD + NEBULA SETUP =====
(function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 5;

  // ---- Stars ----
  const starCount = 3000;
  const starPositions = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 1000;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    starSizes[i] = Math.random() * 2.5 + 0.5;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // ---- Nebula Particles ----
  function createNebulaCloud(color, count, spread, offsetX, offsetY) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread + offsetX;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread + offsetY;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 30;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color,
      size: 1.2,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true
    });
    scene.add(new THREE.Points(geo, mat));
  }

  createNebulaCloud(0x00d4ff, 600, 80, -60, 20);
  createNebulaCloud(0x7b5ea7, 600, 80, 60, -20);
  createNebulaCloud(0xff6b6b, 300, 50, 0, 40);

  // ---- Floating Planet ----
  function createPlanet(radius, colorHex, posX, posY, posZ) {
    const geo = new THREE.SphereGeometry(radius, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.6,
      metalness: 0.3,
      emissive: colorHex,
      emissiveIntensity: 0.15
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(posX, posY, posZ);
    scene.add(mesh);

    // Ring
    const ringGeo = new THREE.RingGeometry(radius * 1.4, radius * 2.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    mesh.add(ring);
    return mesh;
  }

  const planet1 = createPlanet(3, 0x00d4ff, 18, 8, -40);
  const planet2 = createPlanet(2, 0x7b5ea7, -22, -10, -50);
  const planet3 = createPlanet(1.5, 0xff6b6b, 10, -18, -35);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x222244, 1.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x00d4ff, 2, 200);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
  const pointLight2 = new THREE.PointLight(0x7b5ea7, 1.5, 200);
  pointLight2.position.set(-10, -10, -10);
  scene.add(pointLight2);

  // ---- Mouse Parallax ----
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---- Scroll-Based Camera ----
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // ---- Resize ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- Animate ----
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Planets rotation
    planet1.rotation.y = t * 0.12;
    planet2.rotation.y = t * 0.08;
    planet3.rotation.y = t * 0.18;

    // Gentle floating
    planet1.position.y = 8 + Math.sin(t * 0.4) * 1.2;
    planet2.position.y = -10 + Math.sin(t * 0.3 + 1) * 0.8;
    planet3.position.y = -18 + Math.sin(t * 0.5 + 2) * 0.6;

    // Scroll camera movement
    camera.position.y = -scrollY * 0.004;
    camera.position.x = mouseX * 0.5;
    camera.position.z = 5 - scrollY * 0.002;

    // Star field gentle rotation
    scene.rotation.y = t * 0.008 + mouseX * 0.02;
    scene.rotation.x = mouseY * 0.015;

    renderer.render(scene, camera);
  }
  animate();
})();

// ===== TYPED TITLE ANIMATION =====
(function typedTitle() {
  const el = document.getElementById('typed-title');
  const lines = ['Frontend Web Developer', 'React.js Enthusiast', 'B.Tech CSE Student', 'Open Source Builder'];
  let lineIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = lines[lineIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 1800);
})();

// ===== HERO ENTRANCE ANIMATION =====
(function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('#name-line-1', { opacity: 1, y: 0, duration: 0.9, delay: 0.3 })
    .to('#name-line-2', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .to('#name-line-3', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .to('.hero-sub', { opacity: 1, duration: 0.8 }, '-=0.3')
    .to('.hero-cta', { opacity: 1, duration: 0.8, y: 0 }, '-=0.5')
    .from('#btn-github', { x: -30, opacity: 0, duration: 0.6 }, '-=0.6')
    .from('#btn-linkedin', { x: 30, opacity: 0, duration: 0.6 }, '-=0.6');
})();

// ===== NAV HAMBURGER =====
(function navMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // close on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

// ===== SCROLL ANIMATIONS =====
(function scrollAnimations() {

  // About card
  ScrollTrigger.create({
    trigger: '#about-card',
    start: 'top 80%',
    onEnter: () => gsap.to('#about-card', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
  });

  // Skills grid tags
  ScrollTrigger.create({
    trigger: '#skills-grid',
    start: 'top 85%',
    onEnter: () => {
      gsap.from('.skill-tag', {
        opacity: 0, scale: 0.7, y: 20,
        duration: 0.5, ease: 'back.out(1.7)',
        stagger: 0.06
      });
    }
  });

  // Project cards
  document.querySelectorAll('.project-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      onEnter: () => gsap.to(card, {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.8, delay: i * 0.2,
        ease: 'power3.out'
      })
    });
  });

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(item, { opacity: 1, x: 0, duration: 0.8, delay: i * 0.2, ease: 'power3.out' });
        // Animate CGPA bars
        setTimeout(() => {
          item.querySelectorAll('.cgpa-fill').forEach(bar => {
            bar.style.width = bar.style.getPropertyValue('--cgpa') || getComputedStyle(bar).getPropertyValue('--cgpa');
          });
        }, i * 200 + 400);
      }
    });
  });

  // Cert cards
  document.querySelectorAll('.cert-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      onEnter: () => gsap.to(card, {
        opacity: 1, scale: 1,
        duration: 0.7, delay: i * 0.2,
        ease: 'back.out(1.4)'
      })
    });
  });

  // Strength nodes
  document.querySelectorAll('.strength-node').forEach((node, i) => {
    ScrollTrigger.create({
      trigger: node,
      start: 'top 90%',
      onEnter: () => gsap.to(node, {
        opacity: 1, scale: 1,
        duration: 0.7, delay: i * 0.15,
        ease: 'back.out(1.7)'
      })
    });
  });

  // Contact panel
  ScrollTrigger.create({
    trigger: '#contact-panel',
    start: 'top 80%',
    onEnter: () => gsap.to('#contact-panel', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
  });

  // CGPA bars fix: update using IntersectionObserver as backup
  const bars = document.querySelectorAll('.cgpa-fill');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const val = getComputedStyle(bar).getPropertyValue('--cgpa').trim();
        if (val) bar.style.width = val;
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barObserver.observe(b));

})();

// ===== NAV HIGHLIGHT ON SCROLL =====
(function navHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--primary)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

// ===== NAVBAR SCROLL GLOW =====
(function navGlow() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.borderBottomColor = 'rgba(0,212,255,0.35)';
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      navbar.style.borderBottomColor = '';
      navbar.style.boxShadow = '';
    }
  });
})();

// ===== CURSOR GLOW EFFECT =====
(function cursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = [
    'position:fixed', 'pointer-events:none', 'z-index:9999',
    'width:300px', 'height:300px',
    'border-radius:50%',
    'background:radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
    'transform:translate(-50%,-50%)',
    'transition:transform 0.1s ease',
    'top:0', 'left:0'
  ].join(';');
  document.body.appendChild(glow);

  // Throttle for performance
  let rafId;
  document.addEventListener('mousemove', e => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  });
})();

console.log('%c🚀 GANESH PRAVIN MACHALE — Portfolio Loaded', 'color:#00d4ff;font-size:1.2rem;font-weight:bold;');

  let p = document.querySelector("#cert1");
    p.addEventListener("click", function(){
      window.location.href="https://www.coursera.org/account/accomplishments/verify/WV6J2Y80H98Q";
    });

    let pa = document.querySelector("#cert2");
    pa.addEventListener("click", function(){
      window.location.href="https://www.coursera.org/account/accomplishments/verify/VEIW7TG2ABQ6";
    });
