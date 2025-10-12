(function() {
  'use strict';
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    revealElements.forEach(el => revealObserver.observe(el));
  }
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.ceil(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    updateCounter();
  }
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          entry.target.classList.add('counted');
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));
  }
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      });
    });
  }
  function initFormAnimations() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('input-focused');
      });
      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('input-focused');
        if (input.value) {
          input.parentElement?.classList.add('input-filled');
        } else {
          input.parentElement?.classList.remove('input-filled');
        }
      });
    });
  }
  function init() {
    document.body.classList.add('page-transition');
    initScrollReveal();
    initSmoothScroll();
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initCounters();
        initFormAnimations();
      });
    } else {
      setTimeout(() => {
        initCounters();
        initFormAnimations();
      }, 1);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
