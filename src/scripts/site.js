import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ smoothWheel:true, duration:1.1 });
function raf(t){ lenis.raf(t); requestAnimationFrame(raf) } requestAnimationFrame(raf);

// reveal on scroll
document.querySelectorAll(".reveal").forEach(el=>{
  gsap.fromTo(el,{y:18,opacity:0},{y:0,opacity:1,duration:.7,ease:"power2.out",
    scrollTrigger:{trigger:el,start:"top 85%"}});
});

// counters
document.querySelectorAll(".counter").forEach(el=>{
  const to = parseInt(el.dataset.to||"0",10);
  ScrollTrigger.create({trigger:el,start:"top 85%", once:true, onEnter:()=>{
    gsap.to({n:0},{n:to,duration:1.2,ease:"power1.out",onUpdate(){ el.textContent = Math.round(this.targets()[0].n) }});
  }});
});

// testimonials auto slider
const slider = document.querySelector(".t-slider .track");
if(slider){
  let x=0; function tick(){ x -= .45; slider.style.transform=`translateX(${x}px)`; if(Math.abs(x)>slider.scrollWidth/2){x=0} requestAnimationFrame(tick) }
  tick();
}
