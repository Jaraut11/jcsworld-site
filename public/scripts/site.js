/* JCS World frontend bootstrap */

// Respect users who prefer reduced motion
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 1) Counter on scroll ------------------------------------------------ */
(() => {
  if (REDUCED) return;
  const nodes = document.querySelectorAll('[data-counter]');
  if (!nodes.length) return;

  const animate = (el) => {
    const target = Number(el.getAttribute('data-counter')) || 0;
    const suffix = el.getAttribute('data-suffix') || ''; // e.g., '+', ' yrs'
    const dur = Number(el.getAttribute('data-duration')) || 1200;
    const start = performance.now();
    const startVal = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const val = Math.round(startVal + (target - startVal) * eased);
      el.textContent = val.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });

  nodes.forEach((el) => io.observe(el));
})();

/* ---- 2) Reveal on scroll -------------------------------------------------- */
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (REDUCED) { els.forEach(e => e.classList.add('is-in')); return; }

  const io = new IntersectionObserver((ents, obs) => {
    ents.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach((el) => io.observe(el));
})();

/* ---- 3) Smooth scroll for in-page anchors (not forced on reduced motion) -- */
(() => {
  if (REDUCED) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
})();
