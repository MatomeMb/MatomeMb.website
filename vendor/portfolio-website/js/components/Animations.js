/**
 * Animations Component
 * Following Single Responsibility Principle - handles all animation functionality
 * 
 * @fileoverview Animation component with intersection observers and performance optimization
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * Animations class following SRP
 */
class Animations {
    constructor() {
        this.observers = new Map();
        this.animatedElements = null;
        this.skillBars = null;
        this.counters = null;
        this.terminalLines = null;
        this.isInitialized = false;
        
        // Bind methods to preserve context
        this.handleIntersection = this.handleIntersection.bind(this);
    }

    /**
     * Initialize animations component
     * @returns {boolean} True if initialization successful
     */
    initialize() {
        try {
            this.cacheElements();
            this.initializeAOS();
            this.setupIntersectionObservers();
            this.isInitialized = true;
            console.log('Animations component initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Animations component:', error);
            return false;
        }
    }

    /**
     * Cache DOM elements for performance
     * @private
     */
    cacheElements() {
        this.animatedElements = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.ANIMATED_ELEMENTS) || 
                               document.querySelectorAll('[data-aos]');
        this.skillBars = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.SKILL_BARS) || 
                        document.querySelectorAll('.skill-progress');
        this.counters = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.COUNTERS) || 
                       document.querySelectorAll('.metric-value');
        this.terminalLines = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.TERMINAL_LINES) || 
                            document.querySelectorAll('.terminal-line');
    }

    /**
     * Initialize AOS (Animate On Scroll)
     * @private
     */
    initializeAOS() {
        try {
            if (typeof AOS !== 'undefined') {
                const config = window.CONFIG?.AOS_CONFIG || {
                    duration: 800,
                    once: true,
                    offset: 50,
                    easing: 'ease-out-cubic',
                    disable: 'mobile'
                };
                
                AOS.init(config);
                console.log('AOS initialized with config:', config);
            } else {
                console.warn('AOS library not loaded, using fallback animations');
            }
        } catch (error) {
            console.error('Error initializing AOS:', error);
        }
    }

    /**
     * Setup intersection observers for animations
     * @private
     */
    setupIntersectionObservers() {
        this.setupSkillBarsObserver();
        this.setupCountersObserver();
        this.setupTerminalAnimationObserver();
        this.setupGeneralAnimationObserver();
    }

    /**
     * Setup skill bars animation observer
     * @private
     */
    setupSkillBarsObserver() {
        if (!this.skillBars.length) return;

        const skillsSection = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.SKILLS_SECTION) || 
                             document.querySelector('#skills');
        
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, window.CONFIG?.OBSERVER_OPTIONS || {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });

        observer.observe(skillsSection);
        this.observers.set('skillBars', observer);
    }

    /**
     * Setup counters animation observer
     * @private
     */
    setupCountersObserver() {
        if (!this.counters.length) return;

        const metricsGrid = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.METRICS_GRID) || 
                           document.querySelector('.metrics-grid');
        
        if (!metricsGrid) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, window.CONFIG?.OBSERVER_OPTIONS || {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });

        observer.observe(metricsGrid);
        this.observers.set('counters', observer);
    }

    /**
     * Setup terminal animation observer
     * @private
     */
    setupTerminalAnimationObserver() {
        if (!this.terminalLines.length) return;

        const liveDemo = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.LIVE_DEMO) || 
                        document.querySelector('#live-demo');
        
        if (!liveDemo) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTerminal();
                    observer.unobserve(entry.target);
                }
            });
        }, window.CONFIG?.OBSERVER_OPTIONS || {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });

        observer.observe(liveDemo);
        this.observers.set('terminal', observer);
    }

    /**
     * Setup general animation observer
     * @private
     */
    setupGeneralAnimationObserver() {
        if (!this.animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(window.CONFIG?.CSS_CLASSES?.IN_VIEW || 'in-view');
                }
            });
        }, window.CONFIG?.OBSERVER_OPTIONS || {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });

        this.animatedElements.forEach(el => observer.observe(el));
        this.observers.set('general', observer);
    }

    /**
     * Handle intersection observer callback
     * @param {Array} entries - Intersection observer entries
     * @private
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(window.CONFIG?.CSS_CLASSES?.IN_VIEW || 'in-view');
            }
        });
    }

    /**
     * Animate skill bars
     * @private
     */
    animateSkillBars() {
        try {
            this.skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                if (width) {
                    const delay = window.CONFIG?.ANIMATION_CONFIG?.SKILL_BAR_DELAY || 500;
                    setTimeout(() => {
                        window.DOMUtils?.setStyle(bar, 'width', width + '%') ||
                        (bar.style.width = width + '%');
                    }, delay);
                }
            });
        } catch (error) {
            console.error('Error animating skill bars:', error);
        }
    }

    /**
     * Animate counters
     * @private
     */
    animateCounters() {
        try {
            this.counters.forEach(counter => {
                const target = counter.textContent;
                const isPercentage = target.includes('%');
                const isDecimal = target.includes('.');
                const numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
                
                if (isNaN(numericValue)) return;

                let current = 0;
                const increment = numericValue / 100;
                const interval = window.CONFIG?.ANIMATION_CONFIG?.COUNTER_INTERVAL || 20;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        clearInterval(timer);
                    }
                    
                    let displayValue;
                    if (isPercentage) {
                        displayValue = current.toFixed(2) + '%';
                    } else if (isDecimal) {
                        displayValue = current.toFixed(2);
                    } else {
                        displayValue = Math.floor(current);
                    }
                    
                    window.DOMUtils?.setTextContent(counter, displayValue) ||
                    (counter.textContent = displayValue);
                }, interval);
            });
        } catch (error) {
            console.error('Error animating counters:', error);
        }
    }

    /**
     * Animate terminal lines
     * @private
     */
    animateTerminal() {
        try {
            this.terminalLines.forEach((line, index) => {
                const delay = index * (window.CONFIG?.ANIMATION_CONFIG?.TERMINAL_LINE_DELAY || 1000);
                setTimeout(() => {
                    window.DOMUtils?.setStyle(line, 'opacity', '1') ||
                    (line.style.opacity = '1');
                }, delay);
            });
        } catch (error) {
            console.error('Error animating terminal lines:', error);
        }
    }

    /**
     * Trigger terminal animation manually
     * @returns {boolean} True if animation was triggered
     */
    triggerTerminalAnimation() {
        try {
            this.animateTerminal();
            return true;
        } catch (error) {
            console.error('Error triggering terminal animation:', error);
            return false;
        }
    }

    /**
     * Trigger skill bars animation manually
     * @returns {boolean} True if animation was triggered
     */
    triggerSkillBarsAnimation() {
        try {
            this.animateSkillBars();
            return true;
        } catch (error) {
            console.error('Error triggering skill bars animation:', error);
            return false;
        }
    }

    /**
     * Trigger counters animation manually
     * @returns {boolean} True if animation was triggered
     */
    triggerCountersAnimation() {
        try {
            this.animateCounters();
            return true;
        } catch (error) {
            console.error('Error triggering counters animation:', error);
            return false;
        }
    }

    /**
     * Refresh animations (useful for dynamic content)
     * @returns {boolean} True if refresh was successful
     */
    refresh() {
        try {
            this.cacheElements();
            this.setupIntersectionObservers();
            return true;
        } catch (error) {
            console.error('Error refreshing animations:', error);
            return false;
        }
    }

    /**
     * Get animation status
     * @returns {Object} Animation status information
     */
    getAnimationStatus() {
        return {
            isInitialized: this.isInitialized,
            animatedElementsCount: this.animatedElements ? this.animatedElements.length : 0,
            skillBarsCount: this.skillBars ? this.skillBars.length : 0,
            countersCount: this.counters ? this.counters.length : 0,
            terminalLinesCount: this.terminalLines ? this.terminalLines.length : 0,
            observersCount: this.observers.size,
            aosLoaded: typeof AOS !== 'undefined'
        };
    }

    /**
     * Clean up observers and resources
     */
    destroy() {
        try {
            // Disconnect all observers
            this.observers.forEach(observer => {
                observer.disconnect();
            });
            this.observers.clear();

            // Clear references
            this.animatedElements = null;
            this.skillBars = null;
            this.counters = null;
            this.terminalLines = null;
            this.isInitialized = false;

            console.log('Animations component destroyed');
        } catch (error) {
            console.error('Error destroying Animations component:', error);
        }
    }
}

/**
 * Export Animations class
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animations;
} else {
    // Browser environment
    window.Animations = Animations;
}
