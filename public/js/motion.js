(() => {
  const qm = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));

  // Reveal on scroll
  if (!prefersReduced) {
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    qm('.r').forEach(el=>io.observe(el));
  } else {
    qm('.r').forEach(el=>el.classList.add('in'));
  }

  // Stagger children
  qm('[data-stagger]').forEach(sec=>{
    const kids = qm(':scope .r', sec);
    kids.forEach((k,i)=>k.style.transitionDelay = `${clamp(i*60,0,900)}ms`);
  });

  // Counters
  const countEls = qm('.count[data-target]');
  if (countEls.length) {
    const animate = (el) => {
      const target = +String(el.dataset.target).replace(/,/g,'').replace(/\+$/,'');
      const dur = 900; const start = performance.now();
      const fmt = (n) => target >= 1000 ? Math.round(n).toLocaleString() : Math.round(n);
      const tick = (t) => {
        const p = clamp((t-start)/dur, 0, 1);
        el.textContent = fmt(target * (prefersReduced ? 1 : (0.1 + 0.9*p)));
        if (p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if (e.isIntersecting){ animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    countEls.forEach(el=>io.observe(el));
  }

  // Magnetic CTA
  if (!prefersReduced) {
    qm('.btn.mag, .btn-magnetic').forEach(btn=>{
      const rect = () => btn.getBoundingClientRect();
      const over = 10; // px hover pull
      btn.addEventListener('mousemove',(e)=>{
        const r = rect(), x = ((e.clientX - r.left)/r.width - .5)*over, y = ((e.clientY - r.top)/r.height - .5)*over;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      ['mouseleave','blur'].forEach(evt=>btn.addEventListener(evt,()=>btn.style.transform=''));
    });
  }

  // Text scramble rotator
  const scr = qm('[data-scramble]');
  if (scr.length) {
    const glyphs = '!<>-_\\/[]{}—=+*^?#________';
    const rand = m => Math.floor(Math.random()*m);
    const Scrambler = (el, words) => {
      let i = 0, frame=0, queue=[], curr=el.textContent;
      const next = () => { i=(i+1)%words.length; setText(words[i]); };
      const setText = (newText) => {
        const max = Math.max(curr.length, newText.length);
        queue = Array.from({length:max}).map((_,n)=>{
          return { from: curr[n]||'', to: newText[n]||'', start: rand(20), end: rand(20)+20 };
        });
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
        curr = newText;
      };
      const update = (t=0) => {
        let out='', complete=0;
        queue.forEach(({from,to,start,end},n)=>{
          if (t<start) out += from;
          else if (t>=end) { out += to; complete++; }
          else out += glyphs[rand(glyphs.length)];
        });
        el.textContent = out;
        if (complete === queue.length) setTimeout(next, 1800);
        else frame = requestAnimationFrame(update);
      };
      setText(words[0]);
    };
    scr.forEach(el => Scrambler(el, el.dataset.scramble.split('|').map(s=>s.trim()).filter(Boolean)));
  }

  // Subtle hero parallax (background gradient shift)
  const hero = document.querySelector('section.hero');
  if (hero && !prefersReduced) {
    const move = (e)=>{
      const r = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - .5;
      const cy = (e.clientY - r.top) / r.height - .5;
      hero.style.setProperty('--gx', (cx*8).toFixed(2)+'%');
      hero.style.setProperty('--gy', (cy*8).toFixed(2)+'%');
    };
    hero.addEventListener('mousemove', move);
  }
})();

// Smooth fade-up on scroll
const fadeUps = document.querySelectorAll('.fade-up, .r');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeUps.forEach(el => fadeObserver.observe(el));
