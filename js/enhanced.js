/**
 * Enhanced Portfolio Interactions & Animations
 * Handles scroll animations, navigation enhancements, and micro-interactions
 */

(function() {
    'use strict';

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation to improve performance
                // scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initialize scroll animations
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => scrollObserver.observe(el));
    }

    // ============================================
    // NAVIGATION ENHANCEMENTS
    // ============================================

    let navIndicator = null;
    let activeNavLink = null;

    function initNavigation() {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        if (!nav || navLinks.length === 0) return;

        // Create active link indicator
        const navLinksContainer = document.querySelector('.nav-links');
        if (navLinksContainer && !navIndicator) {
            navIndicator = document.createElement('div');
            navIndicator.className = 'nav-indicator';
            navLinksContainer.style.position = 'relative';
            navLinksContainer.appendChild(navIndicator);
        }

        // Update active link on scroll
        function updateActiveNavLink() {
            const scrollY = window.pageYOffset;
            const offset = 100;
            
            let currentSection = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollY >= sectionTop - offset && scrollY < sectionTop + sectionHeight - offset) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                const isActive = href === `#${currentSection}`;
                
                if (isActive) {
                    link.classList.add('active');
                    activeNavLink = link;
                    updateNavIndicator(link);
                } else {
                    link.classList.remove('active');
                }
            });
        }

        function updateNavIndicator(link) {
            if (!navIndicator || !link) return;
            
            const linkRect = link.getBoundingClientRect();
            const containerRect = link.parentElement.getBoundingClientRect();
            
            navIndicator.style.width = `${linkRect.width}px`;
            navIndicator.style.left = `${linkRect.left - containerRect.left}px`;
        }

        // Handle scroll
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveNavLink();
                    
                    // Add scrolled class to nav
                    if (window.scrollY > 50) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateActiveNavLink(); // Initial update
    }

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================

    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Initial update
    }

    // ============================================
    // BUTTON RIPPLE EFFECT
    // ============================================

    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
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
                    background: rgba(255, 255, 255, 0.3);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // Add ripple animation CSS if not present
    if (!document.getElementById('ripple-animation-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // PROJECT CARD TILT EFFECT
    // ============================================

    function initTiltEffect() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.classList.add('tilt-enabled');
            
            card.addEventListener('mousemove', function(e) {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.setProperty('--tilt-x', `${rotateY}deg`);
                card.style.setProperty('--tilt-y', `${rotateX}deg`);
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    // ============================================
    // SKILL PROGRESS ANIMATION
    // ============================================

    function initSkillProgress() {
        const progressBars = document.querySelectorAll('.skill-progress-fill');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width') || '0';
                    entry.target.style.width = `${width}%`;
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || '0';
            bar.style.width = '0%';
            progressObserver.observe(bar);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Account for sticky nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // MOBILE MENU ENHANCEMENTS
    // ============================================

    function initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const nav = document.querySelector('nav');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        if (!navToggle || !nav) return;

        navToggle.addEventListener('click', function() {
            const isOpen = nav.getAttribute('data-menu-open') === 'true';
            nav.setAttribute('data-menu-open', !isOpen);
            navToggle.setAttribute('aria-expanded', !isOpen);
            
            // Animate menu items
            if (!isOpen) {
                navLinks.forEach((link, index) => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                nav.getAttribute('data-menu-open') === 'true' &&
                !nav.contains(e.target) &&
                !navToggle.contains(e.target)) {
                nav.setAttribute('data-menu-open', 'false');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on link click (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.setAttribute('data-menu-open', 'false');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ============================================
    // REDUCED MOTION SUPPORT
    // ============================================

    function initReducedMotion() {
        // Motion toggle is fully handled by inline script in index.html (localStorage, button text, single click handler).
        // Do not add a second click listener here—it would flip the state back and break the button.
    }

    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================

    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback: Intersection Observer
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for resize events
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

    // ============================================
    // PROJECT SEARCH & FILTER
    // ============================================

    function initProjectFiltering() {
        const projectsSection = document.getElementById('projects');
        const searchInput = document.getElementById('projectSearch');
        const filterButtons = Array.from(document.querySelectorAll('.project-filter'));
        const cards = projectsSection
            ? Array.from(projectsSection.querySelectorAll('.project-card'))
            : Array.from(document.querySelectorAll('.project-card'));

        if (!filterButtons.length || !cards.length) return;

        let activeFilter = 'all';
        let searchQuery = '';

        function matchCard(card, q) {
            if (!q) return true;
            const text = (card.textContent || '').toLowerCase();
            const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
            return terms.every(term => text.includes(term));
        }

        function applyFilter() {
            filterButtons.forEach(btn => {
                const filter = btn.dataset.filter || 'all';
                const isActive = filter === activeFilter;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
                btn.setAttribute('tabindex', isActive ? 0 : -1);
            });

            cards.forEach((card, idx) => {
                const category = card.getAttribute('data-category') || '';
                const categoryMatch = activeFilter === 'all' || category === activeFilter;
                const searchMatch = matchCard(card, searchQuery);
                const show = categoryMatch && searchMatch;

                if (show) {
                    card.classList.remove('filtered-out');
                    card.style.opacity = '1';
                    card.style.transform = '';
                } else {
                    card.classList.add('filtered-out');
                }
            });
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activeFilter = btn.dataset.filter || 'all';
                applyFilter();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = (searchInput.value || '').trim();
                applyFilter();
            });
        }

        applyFilter();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all features
        initScrollAnimations();
        initNavigation();
        initScrollProgress();
        initRippleEffect();
        initTiltEffect();
        initSkillProgress();
        initSmoothScroll();
        initMobileMenu();
        initReducedMotion();
        initLazyLoading();
        initProjectFiltering();

        // Remove loading class
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }

    // Start initialization
    init();

    // Export for external use if needed
    window.PortfolioEnhancements = {
        initScrollAnimations,
        initNavigation,
        initScrollProgress,
        initRippleEffect,
        initTiltEffect,
        initSkillProgress
    };

})();
