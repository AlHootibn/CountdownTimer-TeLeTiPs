/* =========================================================
   ALEX VEGA — Portfolio interactions
   ========================================================= */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ===============================
     LOADER
     =============================== */
  const loader = document.getElementById('loader');
  const loaderFill = loader?.querySelector('.loader-fill');
  const loaderText = document.getElementById('loaderText');

  const runLoader = () => {
    if (!loader) return Promise.resolve();
    return new Promise((resolve) => {
      let p = 0;
      const tick = () => {
        p += Math.random() * 12 + 4;
        if (p > 100) p = 100;
        if (loaderFill) loaderFill.style.width = p + '%';
        if (loaderText) loaderText.textContent = `INITIALIZING SYSTEM · ${Math.floor(p)}%`;
        if (p >= 100) {
          setTimeout(() => {
            loader.classList.add('is-done');
            resolve();
          }, 250);
        } else {
          setTimeout(tick, 80 + Math.random() * 100);
        }
      };
      tick();
    });
  };

  /* ===============================
     CUSTOM CURSOR
     =============================== */
  const cursor = document.getElementById('cursor');
  const dot = cursor?.querySelector('.cursor-dot');
  const ring = cursor?.querySelector('.cursor-ring');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  const initCursor = () => {
    if (!cursor || isTouch) { if (cursor) cursor.style.display = 'none'; return; }

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mx}px, ${my}px)`;
      }
    });

    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    // hover states
    const hoverables = 'a, button, .tilt, .magnetic, .project, .tag-cloud span, .stat, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
    });
    document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-click'));
  };

  /* ===============================
     MAGNETIC BUTTONS
     =============================== */
  const initMagnetic = () => {
    if (isTouch || prefersReducedMotion) return;
    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = el.dataset.magnetic ? parseFloat(el.dataset.magnetic) : 0.25;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  };

  /* ===============================
     3D TILT
     =============================== */
  const initTilt = () => {
    if (isTouch || prefersReducedMotion) return;
    document.querySelectorAll('.tilt').forEach((el) => {
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (y - 0.5) * -10;
        const ry = (x - 0.5) * 14;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  };

  /* ===============================
     SCROLL REVEAL
     =============================== */
  const initReveal = () => {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Stagger words per line
    document.querySelectorAll('.hero-title .line').forEach((line) => {
      line.querySelectorAll('.reveal').forEach((r, i) => {
        r.style.transitionDelay = `${i * 0.08}s`;
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    items.forEach((el) => io.observe(el));

    // bars
    const bars = document.querySelectorAll('.bar');
    const bio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          bio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach((b) => bio.observe(b));
  };

  /* ===============================
     TYPEWRITER
     =============================== */
  const initTypewriter = () => {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const words = [
      'delightful interfaces',
      'realtime platforms',
      'generative experiences',
      'fast, accessible products',
      'spatial UIs',
    ];

    let wIdx = 0, cIdx = 0, deleting = false;

    const tick = () => {
      const word = words[wIdx];
      if (!deleting) {
        cIdx++;
        el.textContent = word.slice(0, cIdx);
        if (cIdx === word.length) {
          deleting = true;
          return setTimeout(tick, 1800);
        }
        return setTimeout(tick, 60 + Math.random() * 40);
      } else {
        cIdx--;
        el.textContent = word.slice(0, cIdx);
        if (cIdx === 0) {
          deleting = false;
          wIdx = (wIdx + 1) % words.length;
          return setTimeout(tick, 300);
        }
        return setTimeout(tick, 30);
      }
    };

    tick();
  };

  /* ===============================
     COUNT-UP STATS
     =============================== */
  const initCountUp = () => {
    const nums = document.querySelectorAll('.stat-num[data-count]');
    if (!nums.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1500;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  };

  /* ===============================
     NAV SCROLL STATE + ACTIVE LINK
     =============================== */
  const initNav = () => {
    const nav = document.getElementById('nav');
    const links = document.querySelectorAll('.nav-link');
    const sections = [...document.querySelectorAll('section[id]')];

    const onScroll = () => {
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 20);

      // active link based on scroll
      const y = window.scrollY + window.innerHeight * 0.35;
      let active = sections[0]?.id;
      sections.forEach((s) => {
        if (s.offsetTop <= y) active = s.id;
      });
      links.forEach((l) => {
        l.classList.toggle('is-active', l.getAttribute('href') === `#${active}`);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // mobile burger
    const burger = document.getElementById('burger');
    burger?.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.toggle('is-open');
      burger.classList.toggle('is-open');
    });
  };

  /* ===============================
     PARTICLES CANVAS
     =============================== */
  const initParticles = () => {
    const canvas = document.getElementById('particles');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    let particles = [];
    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 18000));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(1, 1);
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    const spawn = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: rand(-0.15, 0.15) * dpr,
          vy: rand(-0.15, 0.15) * dpr,
          r: rand(0.6, 2) * dpr,
          hue: Math.random() < 0.5 ? 185 : 285, // cyan or violet
          a: rand(0.3, 0.9),
        });
      }
    };

    const linkDist = 140 * (dpr || 1);

    const frame = () => {
      ctx.clearRect(0, 0, w, h);

      // update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // connect nearby
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.35;
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 100%, 65%, ${alpha})`;
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // cursor attraction
      if (!isTouch) {
        const cx = mx * (dpr || 1), cy = my * (dpr || 1);
        for (let p of particles) {
          const dx = cx - p.x, dy = cy - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160 * dpr) {
            p.vx += (dx / d) * 0.02;
            p.vy += (dy / d) * 0.02;
          }
          // damping
          p.vx *= 0.992;
          p.vy *= 0.992;
        }
      }

      requestAnimationFrame(frame);
    };

    resize(); spawn(); frame();
    window.addEventListener('resize', () => { resize(); spawn(); });
  };

  /* ===============================
     PARALLAX ORBS
     =============================== */
  const initParallax = () => {
    if (prefersReducedMotion) return;
    const orbs = document.querySelectorAll('.orb');
    const hud = document.querySelector('.hud');

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      orbs.forEach((o, i) => {
        const s = (i + 1) * 12;
        o.style.translate = `${x * s}px ${y * s}px`;
      });
      if (hud) {
        hud.style.translate = `${x * -20}px ${y * -20}px`;
      }
    });
  };

  /* ===============================
     SMOOTH ANCHORS
     =============================== */
  const initAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 60,
          behavior: 'smooth',
        });
      });
    });
  };

  /* ===============================
     KONAMI-LITE EASTER EGG
     =============================== */
  const initEasterEgg = () => {
    const seq = ['a','v'];
    let buf = [];
    window.addEventListener('keydown', (e) => {
      buf.push(e.key.toLowerCase());
      if (buf.length > seq.length) buf.shift();
      if (seq.every((k, i) => buf[i] === k)) {
        document.body.style.animation = 'hue 4s linear infinite';
        buf = [];
        setTimeout(() => { document.body.style.animation = ''; }, 4000);
      }
    });
    const style = document.createElement('style');
    style.textContent = `@keyframes hue { to { filter: hue-rotate(360deg); } }`;
    document.head.appendChild(style);
  };

  /* ===============================
     BOOT
     =============================== */
  const boot = async () => {
    // Init things that don't need loader
    initNav();
    initAnchors();
    initReveal();
    initTypewriter();
    initCountUp();
    initTilt();
    initMagnetic();
    initCursor();
    initParticles();
    initParallax();
    initEasterEgg();

    await runLoader();

    // Trigger hero reveals after loader
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('is-in'));
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
