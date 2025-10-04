(() => {
  const ro = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ro) { document.querySelectorAll('.r').forEach(el => el.classList.add('in')); return; }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        if (entry.target.hasAttribute('data-stagger')) {
          [...entry.target.children].forEach((c,i)=>c.style.setProperty('--i', i));
        }
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  document.querySelectorAll('.r').forEach(el => io.observe(el));
})();
