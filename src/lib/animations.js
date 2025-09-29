import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll(){
  const lenis = new Lenis({ smoothWheel:true, duration:1.15 });
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); } requestAnimationFrame(raf);
}
export function revealOnScroll(sel=".reveal"){
  gsap.utils.toArray(sel).forEach((el)=>{
    gsap.from(el,{opacity:0,y:36,duration:.9,ease:"power2.out",
      scrollTrigger:{trigger:el,start:"top 85%"}});
  });
}
export function staggerChildren(sel=".stagger"){
  gsap.utils.toArray(sel).forEach((wrap)=>{
    gsap.from(wrap.children,{opacity:0,y:24,stagger:.08,duration:.6,ease:"power2.out",
      scrollTrigger:{trigger:wrap,start:"top 80%"}});
  });
}
export function parallax(sel=".parallax"){
  gsap.utils.toArray(sel).forEach((el)=>{
    gsap.to(el,{yPercent:18,ease:"none",scrollTrigger:{trigger:el,scrub:true}});
  });
}
export function pinSection(sel=".process"){
  gsap.utils.toArray(sel).forEach((el)=>{
    ScrollTrigger.create({trigger:el,start:"top top",end:"+=200%",pin:true,scrub:true});
  });
}
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
export function marqueeOnce(selector="[data-marquee]"){
  gsap.utils.toArray(selector).forEach((row)=>{
    const speed=parseFloat(row.getAttribute("data-speed")||"36");
    const track=row.querySelector(".marquee-track"); if(!track) return;
    track.innerHTML += track.innerHTML;
    gsap.to(track,{xPercent:-50,repeat:-1,ease:"none",duration:speed});
  });
}
export function heroIntro(){
  const tl = gsap.timeline();
  tl.from(".hero h1",{y:30,opacity:0,duration:.6,ease:"power2.out"})
    .from(".hero .lead",{y:20,opacity:0,duration:.5,ease:"power2.out"},"-=.25")
    .from(".hero .cta > *",{y:14,opacity:0,stagger:.08,duration:.45,ease:"power2.out"},"-=.25");
}
export function magneticButtons(sel=".btn-magnetic"){
  const zone=20;
  document.querySelectorAll(sel).forEach((btn)=>{
    btn.style.transition="transform .12s ease";
    btn.addEventListener("mousemove",(e)=>{
      const r=btn.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      btn.style.transform=`translate(${Math.max(Math.min(x/zone,8),-8)}px, ${Math.max(Math.min(y/zone,8),-8)}px)`;
    });
    btn.addEventListener("mouseleave",()=>{ btn.style.transform="translate(0,0)"; });
  });
}
export function autoSlider(selector=".t-slider"){
  document.querySelectorAll(selector).forEach((wrap)=>{
    const track=wrap.querySelector(".track"); if(!track) return;
    track.innerHTML += track.innerHTML;
    const total = Array.from(track.children).reduce((a,el)=>a+el.getBoundingClientRect().width,0);
    gsap.to(track,{x:-total/2,duration:16,ease:"none",repeat:-1});
  });
}
