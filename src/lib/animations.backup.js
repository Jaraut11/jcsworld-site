import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

export function revealOnScroll(selector = ".reveal") {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });
}

export function pinSection(selector) {
  ScrollTrigger.create({
    trigger: selector,
    start: "top top",
    end: "+=200%",
    pin: true,
    scrub: true,
  });
}

