import {
  initSmoothScroll,
  revealOnScroll,
  staggerChildren,
  parallax,
  pinSection,
  countUp,
  marqueeOnce,
  heroIntro,
  magneticButtons,
  autoSlider,
} from "/_astro/animations.js"; // Astro will bundle if imported

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll?.();
    heroIntro?.();
    magneticButtons?.();
    revealOnScroll?.();
    staggerChildren?.();
    parallax?.();
    pinSection?.();
    marqueeOnce?.("[data-marquee]");
    autoSlider?.(".t-slider");
    countUp?.();
  });
}

window.document.body.classList.add("js-animate");
