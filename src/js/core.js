/**
 * Core Portfolio Initialization
 * Handles DOM setup, theme management, and smooth scroll behavior
 */

(function() {
  'use strict';

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Systems Portfolio Initialized');
    initTheme();
    initSmoothScroll();
    initLoadingState();
  });

  /**
   * Theme Management
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  /**
   * Smooth Scroll for Anchor Links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Loading State Management
   */
  function initLoadingState() {
    // Remove loading class and add loaded state
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }

  /**
   * Public API (if needed for external use)
   */
  window.PortfolioCore = {
    applyTheme: applyTheme,
    initTheme: initTheme,
    initSmoothScroll: initSmoothScroll
  };

})();
