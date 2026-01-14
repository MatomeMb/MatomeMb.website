/**
 * Navigation Component
 * Following Single Responsibility Principle - handles all navigation functionality
 * 
 * @fileoverview Navigation component with smooth scrolling and active state management
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * Navigation class following SRP
 */
class Navigation {
    constructor() {
        this.navLinks = null;
        this.sections = null;
        this.mobileMenuToggle = null;
        this.mobileMenu = null;
        this.scrollToTopBtn = null;
        this.isInitialized = false;
        
        // Bind methods to preserve context
        this.handleScroll = this.handleScroll.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleMobileToggle = this.handleMobileToggle.bind(this);
        this.handleScrollToTop = this.handleScrollToTop.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        
        // Debounced scroll handler for performance
        this.debouncedScrollHandler = (window.DebounceUtils?.createDebouncedScrollHandler || 
            ((fn, delay) => {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => fn.apply(this, args), delay);
                };
            }))(
            this.handleScroll, 
            window.CONFIG?.SCROLL_CONFIG?.DEBOUNCE_DELAY || 16
        );
    }

    /**
     * Initialize navigation component
     * @returns {boolean} True if initialization successful
     */
    initialize() {
        try {
            this.cacheElements();
            this.attachEventListeners();
            this.isInitialized = true;
            console.log('Navigation component initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Navigation component:', error);
            return false;
        }
    }

    /**
     * Cache DOM elements for performance
     * @private
     */
    cacheElements() {
        this.navLinks = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.NAV_LINKS) || 
                       document.querySelectorAll('nav a[href^="#"]');
        this.sections = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.SECTIONS) || 
                       document.querySelectorAll('section');
        this.mobileMenuToggle = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.MOBILE_MENU_TOGGLE) || 
                               document.querySelector('#mobile-menu-toggle');
        this.mobileMenu = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.MOBILE_MENU) || 
                         document.querySelector('#mobile-menu');
        this.scrollToTopBtn = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.SCROLL_TO_TOP) || 
                             document.querySelector('#scroll-to-top');
    }

    /**
     * Attach event listeners
     * @private
     */
    attachEventListeners() {
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            window.DOMUtils?.addEventListener(link, 'click', this.handleNavClick) ||
            link.addEventListener('click', this.handleNavClick);
        });

        // Mobile menu toggle
        if (this.mobileMenuToggle && this.mobileMenu) {
            window.DOMUtils?.addEventListener(this.mobileMenuToggle, 'click', this.handleMobileToggle) ||
            this.mobileMenuToggle.addEventListener('click', this.handleMobileToggle);
        }

        // Scroll to top button
        if (this.scrollToTopBtn) {
            window.DOMUtils?.addEventListener(this.scrollToTopBtn, 'click', this.handleScrollToTop) ||
            this.scrollToTopBtn.addEventListener('click', this.handleScrollToTop);
        }

        // Scroll event for active navigation highlighting
        window.addEventListener('scroll', this.debouncedScrollHandler);

        // Close mobile menu when clicking outside
        document.addEventListener('click', this.handleOutsideClick);
    }

    /**
     * Handle navigation link clicks
     * @param {Event} event - Click event
     * @private
     */
    handleNavClick(event) {
        try {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                this.scrollToSection(targetElement);
                this.closeMobileMenu();
            }
        } catch (error) {
            console.error('Error handling navigation click:', error);
        }
    }

    /**
     * Scroll to a specific section
     * @param {Element} targetElement - Target section element
     * @private
     */
    scrollToSection(targetElement) {
        if (!targetElement) return;

        const scrollOptions = {
            behavior: 'smooth',
            block: 'start'
        };

        window.DOMUtils?.scrollIntoView(targetElement, scrollOptions) ||
        targetElement.scrollIntoView(scrollOptions);
    }

    /**
     * Handle scroll events for active navigation highlighting
     * @private
     */
    handleScroll() {
        try {
            const scrollY = window.pageYOffset;
            const scrollThreshold = window.CONFIG?.SCROLL_CONFIG?.SCROLL_TO_TOP_THRESHOLD || 300;
            
            // Show/hide scroll to top button
            if (this.scrollToTopBtn) {
                if (scrollY > scrollThreshold) {
                    window.DOMUtils?.setStyle(this.scrollToTopBtn, 'display', 'flex') ||
                    (this.scrollToTopBtn.style.display = 'flex');
                } else {
                    window.DOMUtils?.setStyle(this.scrollToTopBtn, 'display', 'none') ||
                    (this.scrollToTopBtn.style.display = 'none');
                }
            }

            // Update active navigation link
            this.updateActiveNavLink();
        } catch (error) {
            console.error('Error handling scroll:', error);
        }
    }

    /**
     * Update active navigation link based on current section
     * @private
     */
    updateActiveNavLink() {
        try {
            const scrollY = window.pageYOffset;
            const offset = window.CONFIG?.ANIMATION_CONFIG?.OFFSET || 50;
            
            let currentSection = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - offset) {
                    currentSection = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${currentSection}`;
                
                if (isActive) {
                    window.DOMUtils?.addClass(link, 'bg-white/20') ||
                    link.classList.add('bg-white/20');
                } else {
                    window.DOMUtils?.removeClass(link, 'bg-white/20') ||
                    link.classList.remove('bg-white/20');
                }
            });
        } catch (error) {
            console.error('Error updating active nav link:', error);
        }
    }

    /**
     * Handle mobile menu toggle
     * @param {Event} event - Click event
     * @private
     */
    handleMobileToggle(event) {
        try {
            event.stopPropagation();
            this.toggleMobileMenu();
        } catch (error) {
            console.error('Error handling mobile toggle:', error);
        }
    }

    /**
     * Toggle mobile menu visibility
     * @private
     */
    toggleMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;

        const isOpen = this.mobileMenu.classList.contains('translate-y-0');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     * @private
     */
    openMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;

        // Add open classes
        window.DOMUtils?.addClass(this.mobileMenu, 'translate-y-0') ||
        this.mobileMenu.classList.add('translate-y-0');
        window.DOMUtils?.addClass(this.mobileMenu, 'opacity-100') ||
        this.mobileMenu.classList.add('opacity-100');
        window.DOMUtils?.addClass(this.mobileMenu, 'visible') ||
        this.mobileMenu.classList.add('visible');
        
        // Remove closed classes
        window.DOMUtils?.removeClass(this.mobileMenu, '-translate-y-full') ||
        this.mobileMenu.classList.remove('-translate-y-full');
        window.DOMUtils?.removeClass(this.mobileMenu, 'opacity-0') ||
        this.mobileMenu.classList.remove('opacity-0');
        window.DOMUtils?.removeClass(this.mobileMenu, 'invisible') ||
        this.mobileMenu.classList.remove('invisible');

        // Update icon
        const icon = this.mobileMenuToggle.querySelector('i');
        if (icon) {
            window.DOMUtils?.removeClass(icon, 'fa-bars') ||
            icon.classList.remove('fa-bars');
            window.DOMUtils?.addClass(icon, 'fa-times') ||
            icon.classList.add('fa-times');
        }
    }

    /**
     * Close mobile menu
     * @private
     */
    closeMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;

        // Add closed classes
        window.DOMUtils?.addClass(this.mobileMenu, '-translate-y-full') ||
        this.mobileMenu.classList.add('-translate-y-full');
        window.DOMUtils?.addClass(this.mobileMenu, 'opacity-0') ||
        this.mobileMenu.classList.add('opacity-0');
        window.DOMUtils?.addClass(this.mobileMenu, 'invisible') ||
        this.mobileMenu.classList.add('invisible');
        
        // Remove open classes
        window.DOMUtils?.removeClass(this.mobileMenu, 'translate-y-0') ||
        this.mobileMenu.classList.remove('translate-y-0');
        window.DOMUtils?.removeClass(this.mobileMenu, 'opacity-100') ||
        this.mobileMenu.classList.remove('opacity-100');
        window.DOMUtils?.removeClass(this.mobileMenu, 'visible') ||
        this.mobileMenu.classList.remove('visible');

        // Update icon
        const icon = this.mobileMenuToggle.querySelector('i');
        if (icon) {
            window.DOMUtils?.addClass(icon, 'fa-bars') ||
            icon.classList.add('fa-bars');
            window.DOMUtils?.removeClass(icon, 'fa-times') ||
            icon.classList.remove('fa-times');
        }
    }

    /**
     * Handle outside clicks to close mobile menu
     * @param {Event} event - Click event
     * @private
     */
    handleOutsideClick(event) {
        try {
            if (window.innerWidth <= 768 && 
                this.mobileMenu && 
                !this.mobileMenu.contains(event.target) &&
                !this.mobileMenuToggle.contains(event.target)) {
                this.closeMobileMenu();
            }
        } catch (error) {
            console.error('Error handling outside click:', error);
        }
    }

    /**
     * Handle scroll to top button click
     * @param {Event} event - Click event
     * @private
     */
    handleScrollToTop(event) {
        try {
            event.preventDefault();
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        } catch (error) {
            console.error('Error handling scroll to top:', error);
        }
    }

    /**
     * Clean up event listeners and resources
     */
    destroy() {
        try {
            // Remove event listeners
            this.navLinks.forEach(link => {
                link.removeEventListener('click', this.handleNavClick);
            });

            if (this.mobileMenuToggle) {
                this.mobileMenuToggle.removeEventListener('click', this.handleMobileToggle);
            }

            if (this.scrollToTopBtn) {
                this.scrollToTopBtn.removeEventListener('click', this.handleScrollToTop);
            }

            window.removeEventListener('scroll', this.debouncedScrollHandler);
            document.removeEventListener('click', this.handleOutsideClick);

            // Clear references
            this.navLinks = null;
            this.sections = null;
            this.mobileMenuToggle = null;
            this.mobileMenu = null;
            this.scrollToTopBtn = null;
            this.isInitialized = false;

            console.log('Navigation component destroyed');
        } catch (error) {
            console.error('Error destroying Navigation component:', error);
        }
    }

    /**
     * Get component status
     * @returns {Object} Component status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasNavLinks: this.navLinks ? this.navLinks.length : 0,
            hasSections: this.sections ? this.sections.length : 0,
            hasMobileMenu: !!this.mobileMenu,
            hasScrollToTop: !!this.scrollToTopBtn
        };
    }
}

/**
 * Export Navigation class
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
} else {
    // Browser environment
    window.Navigation = Navigation;
}
