/* ============================================================
   hero-bg.js — Calm Particle Canvas Hero Background
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -999, y: -999 };

  // ── Resize ──
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  // ── Particle config ──
  const CONFIG = {
    count:        90,
    minRadius:    1,
    maxRadius:    2.5,
    speed:        0.25,
    connectDist:  140,
    mouseRadius:  120,
    accentColor:  'rgba(220, 95, 0,',
    midColor:     'rgba(104, 109, 118,',
  };

  // ── Create particles ──
  function init() {
    particles = Array.from({ length: CONFIG.count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r:  CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      // ~30% are accent colored, rest are mid-gray
      isAccent: Math.random() < 0.3,
      opacity:  0.35 + Math.random() * 0.5,
    }));
  }

  // ── distance ──
  function dist(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ── Draw ──
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ── Subtle radial gradient overlay ──
    const grad = ctx.createRadialGradient(W * 0.2, H * 0.5, 0, W * 0.2, H * 0.5, W * 0.7);
    grad.addColorStop(0, 'rgba(220, 95, 0, 0.04)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ── Connections ──
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = dist(particles[i], particles[j]);
        if (d > CONFIG.connectDist) continue;
        const alpha = (1 - d / CONFIG.connectDist) * 0.18;
        const color = (particles[i].isAccent || particles[j].isAccent)
          ? CONFIG.accentColor : CONFIG.midColor;
        ctx.beginPath();
        ctx.strokeStyle = `${color}${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
      // Mouse connections
      const dm = dist(particles[i], mouse);
      if (dm < CONFIG.mouseRadius) {
        const alpha = (1 - dm / CONFIG.mouseRadius) * 0.4;
        ctx.beginPath();
        ctx.strokeStyle = `${CONFIG.accentColor}${alpha})`;
        ctx.lineWidth = 0.9;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // ── Dots ──
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const color = p.isAccent ? CONFIG.accentColor : CONFIG.midColor;
      ctx.fillStyle = `${color}${p.opacity})`;
      ctx.fill();
    });
  }

  // ── Update ──
  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      // Gentle mouse repulsion
      const dm = dist(p, mouse);
      if (dm < 80) {
        const force = (80 - dm) / 80 * 0.4;
        p.vx += (p.x - mouse.x) / dm * force;
        p.vy += (p.y - mouse.y) / dm * force;
        // dampen velocity
        p.vx *= 0.98;
        p.vy *= 0.98;
      }
    });
  }

  // ── Loop ──
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // ── Mouse tracking ──
  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  // ── Init ──
  window.addEventListener('resize', resize);
  resize();
  loop();
})();
