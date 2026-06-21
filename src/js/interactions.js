/**
 * Micro-Interactions & UI Enhancements
 * Handles hover effects, card tilt, and interactive elements
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initCardTilt();
    initButtonRipple();
    initHoverEffects();
  });

  /**
   * Card Tilt Effect (3D Perspective)
   * Adds subtle 3D tilt on hover for project cards
   */
  function initCardTilt() {
    const cards = document.querySelectorAll('.project-card, .arch-card');
    
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(10px)
        `;
      });
      
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  /**
   * Button Ripple Effect
   * Adds ripple animation on button click
   */
  function initButtonRipple() {
    const buttons = document.querySelectorAll('.btn, .terminal-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Don't ripple if it's an anchor that's navigating
        if (this.tagName === 'A') return;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /**
   * General Hover Effects
   */
  function initHoverEffects() {
    const hoverElements = document.querySelectorAll('.hover-lift, .hover-glow');
    
    hoverElements.forEach(element => {
      element.style.transition = 'all 0.3s var(--ease-out)';
    });
  }

  /**
   * Inject Ripple Animation CSS if not present
   */
  function injectRippleCSS() {
    if (document.getElementById('ripple-animation')) return;
    
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Inject CSS on load
  injectRippleCSS();

  /**
   * Public API
   */
  window.PortfolioInteractions = {
    initCardTilt: initCardTilt,
    initButtonRipple: initButtonRipple,
    initHoverEffects: initHoverEffects
  };

})();
