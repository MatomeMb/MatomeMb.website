/**
 * Scroll Behavior & Intersection Observer
 * Handles scroll animations, progress bar, and lazy reveal effects
 */

(function() {
  'use strict';

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Initialize scroll animations
  document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initScrollProgress();
    updateNavOnScroll();
  });

  /**
   * Initialize Scroll Animations
   */
  function initScrollAnimations() {
    const elements = document.querySelectorAll(
      '.fade-in, .slide-in-left, .slide-in-right, .scale-up, .project-card, .bento-item'
    );
    
    elements.forEach(el => {
      scrollObserver.observe(el);
    });
  }

  /**
   * Scroll Progress Bar
   */
  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', throttle(function() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }, 50));
  }

  /**
   * Update Navigation on Scroll
   */
  function updateNavOnScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', throttle(function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, 50));
  }

  /**
   * Throttle Utility Function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Public API
   */
  window.PortfolioScroll = {
    initScrollAnimations: initScrollAnimations,
    initScrollProgress: initScrollProgress
  };

})();
