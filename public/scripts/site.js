import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// smooth scroll
const lenis = new Lenis({ smoothWheel:true, duration:1.05 });
function raf(t){ lenis.raf(t); requestAnimationFrame(raf) } requestAnimationFrame(raf);

// reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
revealEls.forEach(el=>{
  const st = ScrollTrigger.create({trigger:el,start:"top 85%",onEnter:()=>el.classList.add("is-in")});
});

// counters
document.querySelectorAll(".counter").forEach(el=>{
  const to = parseInt(el.dataset.to||"0",10);
  ScrollTrigger.create({trigger:el,start:"top 85%", once:true, onEnter:()=>{
    gsap.to({n:0},{n:to,duration:1.2,ease:"power1.out",onUpdate(){ el.textContent = Math.round(this.targets()[0].n) }});
  }});
});

// testimonials auto slider
const track = document.querySelector(".t-slider .track");
if(track){ let x=0; function tick(){ x -= .45; track.style.transform=`translateX(${x}px)`; if(Math.abs(x)>track.scrollWidth/2){x=0} requestAnimationFrame(tick) } tick(); }

// magnetic buttons
document.querySelectorAll(".btn-magnetic,.btn").forEach(btn=>{
  btn.addEventListener("mousemove",(e)=>{
    const r=btn.getBoundingClientRect();
    const x=e.clientX - (r.left + r.width/2);
    const y=e.clientY - (r.top + r.height/2);
    btn.style.transform=`translate(${x*0.06}px, ${y*0.06}px)`;
  });
  btn.addEventListener("mouseleave",()=>btn.style.transform="translate(0,0)");
});

// sticky CTA hide near footer
const sticky = document.getElementById("sticky-cta");
if(sticky){
  const foot = document.querySelector("footer");
  if(foot){
    ScrollTrigger.create({trigger:foot,start:"top bottom",end:"bottom bottom",
      onEnter:()=>sticky.style.display="none",
      onLeaveBack:()=>sticky.style.display=""});
  }
}
