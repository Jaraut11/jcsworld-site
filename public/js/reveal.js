(() => {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // IntersectionObserver: .r -> .in
  if (!prefersReduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries,o)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); o.unobserve(e.target);} });
    },{rootMargin:'0px 0px -10% 0px',threshold:0.1});
    document.querySelectorAll('.r').forEach(el=>io.observe(el));
  } else {
    document.querySelectorAll('.r').forEach(el=>el.classList.add('in'));
  }

  // Counter up (data-count)
const runCount = el=>{
  const target = Number(el.getAttribute('data-count')||0);
  const start = Number(el.getAttribute('data-start')||Math.floor(target*0.7));
  const dur = 900;
  if (prefersReduce || target===0){ el.textContent = String(target); return; }
  try{ el.textContent = start.toLocaleString(); }catch{ el.textContent = String(start); }
  const t0 = performance.now();
  const step = (now)=>{
    const p = Math.min(1,(now-t0)/dur);
    const val = Math.round(start + (target-start)*Math.pow(p,0.85));
    try{ el.textContent = val.toLocaleString(); }catch{ el.textContent = String(val); }
    if(p<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};