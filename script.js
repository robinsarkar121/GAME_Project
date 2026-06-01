/* ═══════════════════════════════════════════
   HYPER SPACE SHOOTER — Presentation Scripts
   ═══════════════════════════════════════════ */
 
/* ══════════════════════════════════════════
   STARFIELD CANVAS
══════════════════════════════════════════ */
const canvas = document.getElementById('stars');
const ctx    = canvas.getContext('2d');
 
let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;
 
const stars = Array.from({ length: 180 }, () => ({
  x:  Math.random() * W,
  y:  Math.random() * H,
  r:  Math.random() * 1.5 + 0.3,
  sp: Math.random() * 0.4 + 0.1,
  b:  Math.random() * 0.7 + 0.2
}));
 
window.addEventListener('resize', () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
});
 
function drawStars() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    s.y += s.sp;
    if (s.y > H) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 210, 255, ${s.b})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
 
drawStars();
 
/* ══════════════════════════════════════════
   SMOOTH CUSTOM CURSOR
   - dot follows mouse exactly via transform
   - ring lerps toward mouse each frame (GPU)
   - no setTimeout, no left/top writes
══════════════════════════════════════════ */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-trail');
 
// Raw mouse position (updated instantly)
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
 
// Ring position (lerped each frame)
let ringX = mouseX;
let ringY = mouseY;
 
// How quickly the ring catches up (0 = never, 1 = instant)
const LERP = 0.12;
 
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });
 
function animateCursor() {
  // Dot snaps instantly — use transform for GPU compositing
  cursorDot.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
 
  // Ring lerps smoothly toward the mouse
  ringX += (mouseX - ringX) * LERP;
  ringY += (mouseY - ringY) * LERP;
  cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
 
  requestAnimationFrame(animateCursor);
}
 
animateCursor();
 
// Scale + colour on interactive elements
let cursorScale = 1;
 
document.querySelectorAll('a, button, .pup, .feat, .enemy, .pkg-card, .side-dot').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.width      = '28px';
    cursorDot.style.height     = '28px';
    cursorDot.style.background = 'var(--purple)';
    cursorDot.style.marginLeft = '-8px';
    cursorDot.style.marginTop  = '-8px';
    cursorRing.style.opacity   = '0';
  }, { passive: true });
 
  el.addEventListener('mouseleave', () => {
    cursorDot.style.width      = '12px';
    cursorDot.style.height     = '12px';
    cursorDot.style.background = 'var(--cyan)';
    cursorDot.style.marginLeft = '0';
    cursorDot.style.marginTop  = '0';
    cursorRing.style.opacity   = '1';
  }, { passive: true });
});
 
/* ══════════════════════════════════════════
   SIDE NAVIGATION DOTS
══════════════════════════════════════════ */
const sections    = document.querySelectorAll('section');
const sideNav     = document.getElementById('sideNav');
const slideLabels = ['Intro', 'About', 'Game', 'Code', 'Enemies', 'Controls', 'Video'];
 
sections.forEach((section, i) => {
  const dot = document.createElement('div');
  dot.className = 'side-dot' + (i === 0 ? ' active' : '');
  dot.title     = slideLabels[i] || '';
  dot.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
  sideNav.appendChild(dot);
});
 
/* ══════════════════════════════════════════
   INTERSECTION OBSERVERS
══════════════════════════════════════════ */
const dots    = document.querySelectorAll('.side-dot');
const reveals = document.querySelectorAll('.reveal');
 
// Update active dot as user scrolls between slides
const slideObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = [...sections].indexOf(entry.target);
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }
  });
}, { threshold: 0.5 });
 
sections.forEach(s => slideObserver.observe(s));
 
// Animate elements as they scroll into view
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 80);
    }
  });
}, { threshold: 0.15 });
 
reveals.forEach(el => revealObserver.observe(el));
 
/* ══════════════════════════════════════════
   SMOOTH ANCHOR LINKS
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
 
/* ══════════════════════════════════════════
   FLOATING PARTICLES (per section)
══════════════════════════════════════════ */
sections.forEach(section => {
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
 
    const size = Math.random() * 3 + 1;
 
    Object.assign(particle.style, {
      width:             size + 'px',
      height:            size + 'px',
      left:              Math.random() * 100 + '%',
      bottom:            '0',
      animationDelay:    Math.random() * 6 + 's',
      animationDuration: (5 + Math.random() * 4) + 's',
      background:        Math.random() > 0.5 ? 'var(--cyan)' : 'var(--purple)'
    });
 
    section.appendChild(particle);
  }
});
 