/* ============================================================
   Kevin Moses Poddakkal — Portfolio
   Preloader · custom cursor · shader background · 3D companion
   bot · typewriter · split-text reveals · scroll choreography
   ============================================================ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = window.matchMedia('(hover: none)').matches || window.innerWidth < 860;

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ---------------------------------------------------------
   0. SPLIT HEADINGS INTO WORDS (run before any reveal wiring)
--------------------------------------------------------- */
document.querySelectorAll('.split-heading').forEach((h) => {
  const html = h.innerHTML;
  const parts = html.split(/(<br\s*\/?>)/i);
  let out = '';
  parts.forEach((part) => {
    if (/^<br/i.test(part)) { out += part; return; }
    // preserve inner tags like <span class="grad">...</span> as a single unit
    const tmp = document.createElement('div');
    tmp.innerHTML = part;
    tmp.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(' ').filter(Boolean).forEach((word) => {
          out += `<span class="word-wrap"><span class="word">${word}</span></span> `;
        });
      } else {
        out += `<span class="word-wrap"><span class="word">${node.outerHTML}</span></span> `;
      }
    });
  });
  h.innerHTML = out;
});

/* ---------------------------------------------------------
   1. BOOT SEQUENCE — the entrance IS the initializing moment
--------------------------------------------------------- */
const preloader = document.getElementById('preloader');
const bootLinesEl = document.getElementById('boot-lines');
const bootBarFill = document.getElementById('boot-bar-fill');
const bootPercent = document.getElementById('boot-percent');

const BOOT_LINES = [
  { text: 'BOOT_SEQUENCE :: INIT', cls: 'hi' },
  { text: 'loading kernel.sys', cls: 'ok' },
  { text: 'mounting /cloud', cls: 'ok' },
  { text: 'mounting /ai-core', cls: 'ok' },
  { text: 'initializing security_layer', cls: 'ok' },
  { text: 'compiling portfolio.exe', cls: 'ok' },
  { text: '> whoami', cls: 'dim', typed: true },
  { text: 'kevin_moses_poddakkal', cls: 'hi' },
  { text: '> status', cls: 'dim', typed: true },
  { text: 'READY — welcome_', cls: 'ok' }
];

function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function typeInto(el, text, speed = 26) {
  for (let i = 0; i <= text.length; i++) {
    el.textContent = text.slice(0, i);
    await delay(speed);
  }
}

async function runBootSequence() {
  for (let i = 0; i < BOOT_LINES.length; i++) {
    const { text, cls, typed } = BOOT_LINES[i];
    const line = document.createElement('div');
    line.className = 'bl' + (cls ? ' ' + cls : '');
    bootLinesEl.appendChild(line);
    gsap.to(line, { opacity: 1, duration: .2 });

    if (typed) {
      await typeInto(line, text, 24);
    } else {
      line.textContent = text;
      await delay(120);
    }

    const pct = Math.round(((i + 1) / BOOT_LINES.length) * 100);
    bootBarFill.style.width = pct + '%';
    bootPercent.textContent = pct + '%';
  }
  await delay(320);
  runIntro();
}

window.addEventListener('load', () => { runBootSequence(); });

function runIntro() {
  gsap.to(preloader, {
    opacity: 0,
    duration: .7,
    delay: .1,
    ease: 'power2.inOut',
    onComplete: () => { preloader.style.display = 'none'; heroIntro(); }
  });
}

function typewriter(el, text, speed = 42) {
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = '';
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else resolve();
    })();
  });
}

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(['#letterbox-top', '#letterbox-bottom'], { height: 0, duration: 1.1, ease: 'power4.inOut' })
    .from('.boot-line', { opacity: 0, y: 10, duration: .5 }, '-=.5')
    .from('.hero-eyebrow', { y: 20, opacity: 0, duration: .7 }, '-=.2')
    .from('.hero-title .line', { y: '110%', opacity: 0, duration: .9, stagger: .08 }, '-=.4')
    .from('.hero-sub', { y: 24, opacity: 0, duration: .8 }, '-=.5')
    .from('.hero-actions .btn', { y: 20, opacity: 0, duration: .6, stagger: .1 }, '-=.5')
    .from('.hero-meta > div', { y: 16, opacity: 0, duration: .6, stagger: .08 }, '-=.4')
    .from('.id-ring', { scale: .3, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, '-=1')
    .from('.hero-photo', { scale: .7, opacity: 0, duration: .9, ease: 'back.out(1.6)' }, '-=.9')
    .from('.id-corner', { scale: 0, opacity: 0, duration: .5, stagger: .06 }, '-=.6')
    .from('.id-badge', { scale: 0, opacity: 0, duration: .6, stagger: .12, ease: 'back.out(2.2)' }, '-=.5')
    .from('.id-caption', { opacity: 0, y: 8, duration: .5 }, '-=.3')
    .from('.hud-panel', { opacity: 0, x: -16, duration: .7 }, '-=.4')
    .from('.scroll-cue', { opacity: 0, duration: .6 }, '-=.3');

  const tw = document.getElementById('typewriter');
  if (tw) typewriter(tw, 'engineer.exploring(cloud, ai, security)', 34);

  botAppear();
}

/* ---------------------------------------------------------
   2. CUSTOM CURSOR
--------------------------------------------------------- */
if (!IS_TOUCH) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const label = document.getElementById('cursor-label');
  const ringX = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3.out' });
  const labelX = gsap.quickTo(label, 'x', { duration: .3, ease: 'power3.out' });
  const labelY = gsap.quickTo(label, 'y', { duration: .3, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    ringX(e.clientX);
    ringY(e.clientY);
    labelX(e.clientX);
    labelY(e.clientY - 46);
  });

  const hoverables = 'a, button, .btn, .skill-card, .tilt-card, .cert-cell, .lang-chip, .id-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) ring.classList.add('hover');
    const cursorTarget = e.target.closest('[data-cursor]');
    if (cursorTarget) {
      label.textContent = cursorTarget.getAttribute('data-cursor');
      gsap.to(label, { opacity: 1, duration: .25 });
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove('hover');
    if (e.target.closest('[data-cursor]')) gsap.to(label, { opacity: 0, duration: .2 });
  });
}

/* ---------------------------------------------------------
   3. NAV — blur on scroll + active link + smooth anchor offset
--------------------------------------------------------- */
const nav = document.querySelector('nav');
ScrollTrigger.create({
  start: 60,
  onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 40)
});

document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 90 }, ease: 'power3.inOut' });
  });
});

document.querySelectorAll('main section[id]').forEach(sec => {
  ScrollTrigger.create({
    trigger: sec, start: 'top center', end: 'bottom center',
    onToggle: (self) => {
      const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', self.isActive);
    }
  });
});

/* ---------------------------------------------------------
   4. SCROLL PROGRESS BAR
--------------------------------------------------------- */
gsap.to('#scroll-progress', {
  width: '100%', ease: 'none',
  scrollTrigger: { start: 0, end: 'max', scrub: .3 }
});

/* ---------------------------------------------------------
   5. GENERIC SCROLL REVEALS (fade + rise)
--------------------------------------------------------- */
document.querySelectorAll('.reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

/* split-heading words rise in, staggered, whenever their heading scrolls in */
document.querySelectorAll('.split-heading').forEach((h) => {
  gsap.from(h.querySelectorAll('.word'), {
    y: '105%', opacity: 0, duration: .8, ease: 'power3.out', stagger: .035,
    scrollTrigger: { trigger: h, start: 'top 88%' }
  });
});

/* section dividers draw in from center */
document.querySelectorAll('.divider').forEach((d) => {
  gsap.to(d, {
    scaleX: 1, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: d, start: 'top 92%' }
  });
});

/* eyebrow labels — quick scramble-in effect */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#$%01';
function scrambleReveal(el) {
  const final = el.textContent;
  const len = final.length;
  let frame = 0;
  const totalFrames = 14;
  const interval = setInterval(() => {
    frame++;
    let out = '';
    for (let i = 0; i < len; i++) {
      if (i < (frame / totalFrames) * len) out += final[i];
      else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = out;
    if (frame >= totalFrames) { el.textContent = final; clearInterval(interval); }
  }, 28);
}
document.querySelectorAll('.eyebrow').forEach((el) => {
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => { if (!REDUCED_MOTION) scrambleReveal(el); }
  });
});

/* ---------------------------------------------------------
   6. STAT COUNTERS
--------------------------------------------------------- */
document.querySelectorAll('.stat-cell .num').forEach((el) => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const obj = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => {
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString(); }
      });
    }
  });
});

/* ---------------------------------------------------------
   7. SKILL CARDS — staggered pop-in (opacity only; transform is
   owned by the continuous floaty keyframe animation)
--------------------------------------------------------- */
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.setProperty('--fx', (Math.random() * 16 - 8).toFixed(1) + 'px');
  card.style.setProperty('--fy', (Math.random() * 14 - 7).toFixed(1) + 'px');
  card.style.setProperty('--fr', (Math.random() * 4 - 2).toFixed(1) + 'deg');
  card.style.animationDelay = (i * 0.35).toFixed(2) + 's';
  card.style.animationDuration = (6 + Math.random() * 3).toFixed(1) + 's';
  card.style.opacity = '0';
});
ScrollTrigger.create({
  trigger: '#skills-field', start: 'top 85%', once: true,
  onEnter: () => {
    gsap.to('.skill-card', { opacity: 1, duration: .6, stagger: .09, ease: 'power2.out' });
  }
});

/* ---------------------------------------------------------
   8. CERT CELLS — cinematic pinned reveal on desktop,
   scrub-linked stagger on touch devices
--------------------------------------------------------- */
gsap.set('.cert-cell', { opacity: 0, transformPerspective: 800, rotateX: -35, y: 18, transformOrigin: 'top center' });

if (!IS_TOUCH && !REDUCED_MOTION) {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#certs',
      start: 'top top',
      end: '+=90%',
      pin: true,
      scrub: .6
    }
  }).to('.cert-cell', { opacity: 1, rotateX: 0, y: 0, stagger: .5, ease: 'power2.out' });
} else {
  ScrollTrigger.create({
    trigger: '.cert-row', start: 'top 85%', once: true,
    onEnter: () => gsap.to('.cert-cell', { opacity: 1, rotateX: 0, y: 0, duration: .6, stagger: .07, ease: 'power3.out' })
  });
}

/* ---------------------------------------------------------
   9. PROJECT CARDS — scale + rotate entrance
--------------------------------------------------------- */
gsap.set('.project-card', { opacity: 0, scale: .95, transformPerspective: 1000, rotateX: -6 });
document.querySelectorAll('.project-card').forEach((card) => {
  ScrollTrigger.create({
    trigger: card, start: 'top 85%', once: true,
    onEnter: () => gsap.to(card, { opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'power3.out' })
  });
});

/* lang chips — quick stagger pop */
gsap.set('.lang-chip', { opacity: 0, scale: .85 });
ScrollTrigger.create({
  trigger: '.lang-row', start: 'top 88%', once: true,
  onEnter: () => gsap.to('.lang-chip', { opacity: 1, scale: 1, duration: .5, stagger: .08, ease: 'back.out(2)' })
});

/* ---------------------------------------------------------
   10. TILT (project cards) + MAGNETIC BUTTONS
--------------------------------------------------------- */
if (!IS_TOUCH) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: px * 6, rotateX: -py * 6, duration: .4, ease: 'power2.out', transformPerspective: 900 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: .6, ease: 'power3.out' });
    });
  });

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .3;
      const y = (e.clientY - r.top - r.height / 2) * .5;
      gsap.to(btn, { x, y, duration: .3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }));
    btn.addEventListener('mousedown', () => gsap.to(btn, { scale: .9, duration: .15, ease: 'power2.out' }));
    btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1, duration: .5, ease: 'elastic.out(1,.35)' }));
  });

  /* id-card tilt toward cursor */
  const idCard = document.querySelector('.id-card');
  if (idCard) {
    idCard.addEventListener('mousemove', (e) => {
      const r = idCard.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      gsap.to(idCard, { rotateY: px * 14, rotateX: -py * 14, duration: .5, ease: 'power2.out', transformPerspective: 700 });
    });
    idCard.addEventListener('mouseleave', () => gsap.to(idCard, { rotateY: 0, rotateX: 0, duration: .7, ease: 'power3.out' }));
  }
}

/* ---------------------------------------------------------
   11. CINEMATIC PARALLAX — layered depth across the whole page
--------------------------------------------------------- */
if (!REDUCED_MOTION) {
  gsap.to('.id-card', {
    y: -70, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: .6 }
  });
  gsap.to('.hero-title', {
    y: -60, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: .6 }
  });
  gsap.to('.hero-meta', {
    y: -30, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: .6 }
  });
  gsap.to('.marquee-track', {
    x: 180, ease: 'none',
    scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: .5 }
  });

  /* every section's content wrapper drifts as it crosses the viewport —
     this targets .container (not the inner .reveal elements) so it never
     fights with the one-time entrance fades */
  document.querySelectorAll('main section .container').forEach((c) => {
    if (c.closest('section')?.id === 'certs') return;
    gsap.fromTo(c, { y: 50 }, {
      y: -50, ease: 'none',
      scrollTrigger: { trigger: c.closest('section'), start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  });
  document.querySelectorAll('.project-card').forEach((card, i) => {
    gsap.fromTo(card, { y: 90, rotate: i % 2 ? 1.2 : -1.2 }, {
      y: -50, rotate: 0, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  });

  /* skill cards drift at slightly different rates for a loose "field of debris" feel */
  document.querySelectorAll('.skill-card').forEach((card, i) => {
    gsap.fromTo(card, { y: 30 + (i % 3) * 12 }, {
      y: -30 - (i % 3) * 12, ease: 'none',
      scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });

  /* skills orbit spins faster/slower tied directly to scroll through the section */
  const orbit = document.getElementById('chip-motif');
  if (orbit) {
    gsap.to(orbit, {
      rotate: 45, ease: 'none',
      scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom top', scrub: .6 }
    });
  }
}

/* ---------------------------------------------------------
   11b. AMBIENT GLYPH FIELD — floating tech symbols drifting
   past at different depths for the entire scroll length
--------------------------------------------------------- */
if (!REDUCED_MOTION && !IS_TOUCH) {
  const GLYPHS = ['</>', '{ }', '01', '☁', 'λ', 'AI', '#!', 'RAG', 'GPU', '⚡', '∞', '◆', 'ssh~', '404'];
  const COLORS = ['var(--cyan)', 'var(--violet)', 'var(--amber)'];
  const docHeight = () => Math.max(document.body.scrollHeight, window.innerHeight * 3);

  window.addEventListener('load', () => {
    const h = docHeight();
    for (let i = 0; i < 16; i++) {
      const el = document.createElement('span');
      el.className = 'glyph';
      el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      const size = 14 + Math.random() * 22;
      el.style.left = (4 + Math.random() * 90) + '%';
      el.style.top = (Math.random() * h * 0.94) + 'px';
      el.style.fontSize = size.toFixed(0) + 'px';
      el.style.color = COLORS[i % COLORS.length];
      el.style.opacity = (0.05 + Math.random() * 0.09).toFixed(2);
      document.body.appendChild(el);

      const dir = Math.random() > 0.5 ? 1 : -1;
      const dist = 80 + Math.random() * 220;
      gsap.to(el, {
        y: dir * dist,
        rotate: dir * (10 + Math.random() * 20),
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 + Math.random() }
      });
    }
  });
}

/* ===========================================================
   12. SHADER BACKGROUND — three.js full-screen flowing lines
=========================================================== */
(function initShaderBG() {
  const canvas = document.getElementById('bg-shader');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    u_time: { value: 0 },
    u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_cyan: { value: new THREE.Color(0x53d6f0) },
    u_violet: { value: new THREE.Color(0x8f7bff) }
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: `
      void main(){ gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform vec2 u_mouse;
      uniform vec3 u_cyan;
      uniform vec3 u_violet;

      float line(vec2 uv, float offset, float freq, float amp, float thickness){
        float y = sin(uv.x * freq + u_time * 0.18 + offset) * amp;
        y += sin(uv.x * freq * 2.3 - u_time * 0.1 + offset) * amp * 0.35;
        float d = abs((uv.y - 0.5) - y);
        return smoothstep(thickness, 0.0, d);
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 mouse = u_mouse;
        float distMouse = distance(uv, mouse);
        float warp = smoothstep(0.5, 0.0, distMouse) * 0.06;

        vec3 col = vec3(0.0);
        float total = 0.0;

        for(int i = 0; i < 9; i++){
          float fi = float(i);
          vec2 luv = uv;
          luv.y += (fi - 4.0) * 0.09;
          luv.y += warp * sin(fi * 1.7 + u_time * 0.3);
          float l = line(luv, fi * 1.3, 2.4 + fi * 0.15, 0.05 + fi * 0.003, 0.0025 + fi * 0.0004);
          float mixF = fi / 8.0;
          vec3 c = mix(u_cyan, u_violet, mixF);
          col += c * l;
          total += l;
        }

        float alpha = clamp(total, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha * 0.85);
      }
    `
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    uniforms.u_res.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    uniforms.u_mouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    if (!REDUCED_MOTION) uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===========================================================
   13. COMPANION BOT — low-poly 3D mascot that lives in the hero
   then travels to a corner and spins along scroll
=========================================================== */
const botController = (function initBot() {
  const wrap = document.getElementById('bot-wrap');
  const canvas = document.getElementById('bot-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  scene.add(new THREE.AmbientLight(0x9db4ff, 0.7));
  const key = new THREE.DirectionalLight(0x53d6f0, 1.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xffb86b, 1.4, 12);
  rim.position.set(-3, -1, 2);
  scene.add(rim);

  const bot = new THREE.Group();
  scene.add(bot);

  /* chassis — a boxy drone body, not a sphere */
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1b2130, flatShading: true, roughness: .3, metalness: .35 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.92, 0.86), bodyMat);
  bot.add(body);

  const bevelMat = new THREE.MeshStandardMaterial({ color: 0x232a3c, flatShading: true, roughness: .4, metalness: .3 });
  const bevel = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.24, 0.98), bevelMat);
  bevel.position.y = -0.4;
  bot.add(bevel);

  /* visor slit — a single glowing bar, not round eyes */
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x53d6f0, emissive: 0x53d6f0, emissiveIntensity: 1.5, flatShading: true });
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.12, 0.06), visorMat);
  visor.position.set(0, 0.08, 0.44);
  bot.add(visor);

  /* stabilizer wings — flat panels that break any spherical silhouette */
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x2a3142, flatShading: true, roughness: .5, metalness: .2 });
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.46), wingMat);
  wingL.position.set(-0.98, 0.02, 0); wingL.rotation.z = 0.12;
  const wingR = wingL.clone(); wingR.position.x = 0.98; wingR.rotation.z = -0.12;
  bot.add(wingL, wingR);

  /* antenna */
  const antMat = new THREE.MeshStandardMaterial({ color: 0x8f7bff, flatShading: true });
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), antMat);
  antenna.position.set(0, 0.86, 0);
  bot.add(antenna);
  const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), new THREE.MeshStandardMaterial({ color: 0xffb86b, emissive: 0xffb86b, emissiveIntensity: 1.2 }));
  antTip.position.set(0, 1.14, 0);
  bot.add(antTip);

  /* blinking sensor lights on the chassis corners */
  const sensorMat = new THREE.MeshStandardMaterial({ color: 0xffb86b, emissive: 0xffb86b, emissiveIntensity: 1.1 });
  const sensorGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const sensorL = new THREE.Mesh(sensorGeo, sensorMat); sensorL.position.set(-0.58, 0.32, 0.44);
  const sensorR = new THREE.Mesh(sensorGeo, sensorMat.clone()); sensorR.position.set(0.58, 0.32, 0.44);
  bot.add(sensorL, sensorR);

  /* small escort data-packet cubes, orbiting just outside the wingspan */
  const puffGroup = new THREE.Group();
  const puffMat = new THREE.MeshStandardMaterial({ color: 0x53d6f0, flatShading: true, roughness: .4 });
  for (let i = 0; i < 2; i++) {
    const puff = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), puffMat);
    const a = (i / 2) * Math.PI * 2 + 0.6;
    puff.position.set(Math.cos(a) * 1.5, Math.sin(a) * 0.22, Math.sin(a) * 1.5);
    puffGroup.add(puff);
  }
  bot.add(puffGroup);

  function resizeBot() {
    const r = wrap.getBoundingClientRect();
    if (r.width === 0) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resizeBot);
  ro.observe(wrap);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  const clock = new THREE.Clock();
  let scrollRotation = 0;
  let scrollProgress = 0;
  const colorCyan = new THREE.Color(0x53d6f0);
  const colorViolet = new THREE.Color(0x8f7bff);
  const colorAmber = new THREE.Color(0xffb86b);
  const tmpColor = new THREE.Color();

  function animate() {
    const t = clock.getElapsedTime();
    if (!REDUCED_MOTION) {
      bot.rotation.y = Math.sin(t * 0.35) * 0.5 + scrollRotation * 0.3;
      bot.position.y = Math.sin(t * 1.1) * 0.1;
      bot.rotation.z = Math.sin(t * 0.6) * 0.04 + mouseX * 0.18;
      bot.rotation.x = mouseY * 0.15;
      puffGroup.rotation.y = -t * 0.6;
      sensorL.material.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.5;
      sensorR.material.emissiveIntensity = 0.6 + Math.sin(t * 3 + 1.4) * 0.5;

      /* visor glow cycles cyan -> violet -> amber as the whole page is scrolled */
      const cyclePos = (scrollProgress * 3) % 3;
      if (cyclePos < 1) tmpColor.copy(colorCyan).lerp(colorViolet, cyclePos);
      else if (cyclePos < 2) tmpColor.copy(colorViolet).lerp(colorAmber, cyclePos - 1);
      else tmpColor.copy(colorAmber).lerp(colorCyan, cyclePos - 2);
      visorMat.color.copy(tmpColor);
      visorMat.emissive.copy(tmpColor);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  resizeBot();
  animate();

  return {
    setScrollRotation: (v) => { scrollRotation = v; },
    setScrollProgress: (v) => { scrollProgress = v; }
  };
})();

function botAppear() {
  positionBotCorner();
  window.addEventListener('resize', positionBotCorner);
}

function positionBotCorner() {
  const cornerSize = IS_TOUCH ? 84 : 120;
  const cornerRight = IS_TOUCH ? 10 : 40;
  const cornerBottom = IS_TOUCH ? 10 : 40;
  gsap.set('#bot-wrap', {
    left: window.innerWidth - cornerSize - cornerRight,
    top: window.innerHeight - cornerSize - cornerBottom,
    width: cornerSize, height: cornerSize
  });
}

/* the bot only fades in once the hero has scrolled mostly out of view —
   it never appears near the photo */
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: 'bottom top',
  scrub: .6,
  onUpdate: (self) => {
    gsap.set('#bot-wrap', { opacity: gsap.utils.clamp(0, 1, (self.progress - 0.55) / 0.35) });
  }
});

ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: (self) => {
    botController.setScrollRotation(Math.min(Math.abs(self.getVelocity()) / 1200, 3));
    botController.setScrollProgress(self.progress);
  }
});

/* ===========================================================
   14. SCENE SLATE — storyboard chapter-break transitions.
   Each section entry briefly flashes a "clapperboard" slate
   naming the scene, reinforcing the whole page as a reel.
=========================================================== */
if (!REDUCED_MOTION) {
  const SCENES = [
    { id: 'about', num: '01', title: 'ORIGIN' },
    { id: 'skills', num: '02', title: 'LOADOUT' },
    { id: 'projects', num: '03', title: 'MISSIONS' },
    { id: 'certs', num: '04', title: 'ACHIEVEMENTS' },
    { id: 'volunteer', num: '05', title: 'SIDE QUEST' },
    { id: 'languages', num: '06', title: 'COMMS' },
    { id: 'contact', num: '07', title: 'TRANSMISSION' }
  ];

  const slate = document.getElementById('scene-slate');
  const slateNum = document.getElementById('scene-slate-num');
  const slateTitle = document.getElementById('scene-slate-title');
  let slateBusy = false;

  function playSlate(scene) {
    if (slateBusy) return;
    slateBusy = true;
    slateNum.textContent = scene.num;
    slateTitle.textContent = scene.title;
    gsap.timeline({ onComplete: () => { slateBusy = false; } })
      .set(slate, { x: '-105%' })
      .to(slate, { x: '0%', duration: .45, ease: 'power3.out' })
      .to(slate, { x: '105%', duration: .45, ease: 'power3.in', delay: .35 });
  }

  SCENES.forEach((scene) => {
    ScrollTrigger.create({
      trigger: '#' + scene.id,
      start: 'top 65%',
      onEnter: () => playSlate(scene)
    });
  });
}