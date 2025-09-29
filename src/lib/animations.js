import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
gsap.registerPlugin(ScrollTrigger);

/** Smooth scrolling */
export function initSmoothScroll(){
  const lenis = new Lenis({ smoothWheel:true, duration:1.15 });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

/** Reveal on scroll */
export function revealOnScroll(sel=".reveal"){
  gsap.utils.toArray(sel).forEach((el)=>{
    gsap.from(el,{opacity:0,y:36,duration:.9,ease:"power2.out",
      scrollTrigger:{trigger:el,start:"top 85%"}
    });
  });
}

/** Stagger children (.stagger > *) */
export function staggerChildren(sel=".stagger"){
  gsap.utils.toArray(sel).forEach((wrap)=>{
    gsap.from(wrap.children,{opacity:0,y:24,stagger:.08,duration:.6,ease:"power2.out",
      scrollTrigger:{trigger:wrap,start:"top 80%"}});
  });
}

/** Parallax any .parallax element */
export function parallax(sel=".parallax"){
  gsap.utils.toArray(sel).forEach((el)=>{
    gsap.to(el,{yPercent:18,ease:"none",scrollTrigger:{trigger:el,scrub:true}});
  });
}

/** Pin sections for scrollytelling */
export function pinSection(sel=".process"){
  gsap.utils.toArray(sel).forEach((el)=>{
    ScrollTrigger.create({trigger:el,start:"top top",end:"+=200%",pin:true,scrub:true});
  });
}

/** Count-up for elements with .counter and data-to="" */
export function countUp(sel=".counter"){
  gsap.utils.toArray(sel).forEach((el)=>{
    const target = parseFloat(el.getAttribute("data-to")||"0");
    const dur = parseFloat(el.getAttribute("data-duration")||"1.2");
    const obj={val:0};
    ScrollTrigger.create({trigger:el,start:"top 85%",onEnter:()=>{
      gsap.to(obj,{val:target,duration:dur,ease:"power2.out",
        onUpdate(){ el.textContent = Math.floor(obj.val).toLocaleString(); }
      });
    }});
  });
}

/** Infinite marquee (logo slider) */
export function marqueeOnce(selector="[data-marquee]"){
  gsap.utils.toArray(selector).forEach((row)=>{
    const speed=parseFloat(row.getAttribute("data-speed")||"40");
    const track=row.querySelector(".marquee-track");
    if(!track) return;
    track.innerHTML += track.innerHTML; // duplicate children
    gsap.to(track,{xPercent:-50,repeat:-1,ease:"none",duration:speed});
  });
}

/** Hero intro animation */
export function heroIntro(){
  const tl = gsap.timeline();
  tl.from(".hero h1",{y:30,opacity:0,duration:.6,ease:"power2.out"})
    .from(".hero .lead",{y:20,opacity:0,duration:.5,ease:"power2.out"},"-=.25")
    .from(".hero .cta > *",{y:14,opacity:0,stagger:.08,duration:.45,ease:"power2.out"},"-=.25");
}

/** Magnetic hover for buttons (.btn-magnetic) */
export function magneticButtons(sel=".btn-magnetic"){
  const zone=20;
  document.querySelectorAll(sel).forEach((btn)=>{
    btn.style.transition="transform .12s ease";
    btn.addEventListener("mousemove",(e)=>{
      const r=btn.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2;
      const y=e.clientY-r.top-r.height/2;
      btn.style.transform=`translate(${Math.max(Math.min(x/zone,8),-8)}px, ${Math.max(Math.min(y/zone,8),-8)}px)`;
    });
    btn.addEventListener("mouseleave",()=>{ btn.style.transform="translate(0,0)"; });
  });
}

/** Simple autoplay slider: .t-slider (slides inside .track) */
export function autoSlider(selector=".t-slider"){
  document.querySelectorAll(selector).forEach((wrap)=>{
    const track = wrap.querySelector(".track");
    if(!track) return;
    // duplicate for seamless loop
    track.innerHTML += track.innerHTML;
    const totalWidth = Array.from(track.children).reduce((acc,el)=>acc+el.getBoundingClientRect().width,0);
    gsap.to(track,{x:-totalWidth/2, duration:16, ease:"none", repeat:-1});
  });
}
