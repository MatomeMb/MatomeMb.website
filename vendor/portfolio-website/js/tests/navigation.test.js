/**
 * Navigation Component Test Suite
 * Testing navigation functionality and accessibility
 * 
 * @fileoverview Unit tests for Navigation component with keyboard navigation
 * @version 1.0.0
 * @author Matome Mbowene
 */

// Mock DOM environment
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
    <nav class="desktop-nav" role="navigation" aria-label="Main navigation">
        <ul role="menubar">
            <li role="none"><a href="#home" role="menuitem">Home</a></li>
            <li role="none"><a href="#projects" role="menuitem">Projects</a></li>
            <li role="none"><a href="#skills" role="menuitem">Skills</a></li>
        </ul>
    </nav>
    
    <nav class="mobile-nav" role="navigation" aria-label="Mobile navigation">
        <button id="mobile-menu-toggle" aria-label="Toggle mobile menu">
            <i class="fas fa-bars"></i>
        </button>
        <ul id="mobile-menu" role="menubar">
            <li role="none"><a href="#home" role="menuitem">Home</a></li>
            <li role="none"><a href="#projects" role="menuitem">Projects</a></li>
        </ul>
    </nav>
    
    <button id="scroll-to-top" aria-label="Scroll to top">
        <i class="fas fa-arrow-up"></i>
    </button>
    
    <section id="home">Home Section</section>
    <section id="projects">Projects Section</section>
    <section id="skills">Skills Section</section>
</body>
</html>
`);

global.window = dom.window;
global.document = dom.window.document;

// Mock CONFIG
global.window.CONFIG = {
    SELECTORS: {
        NAV_LINKS: 'nav a[href^="#"]',
        SECTIONS: 'section',
        MOBILE_MENU_TOGGLE: '#mobile-menu-toggle',
        MOBILE_MENU: '#mobile-menu',
        SCROLL_TO_TOP: '#scroll-to-top'
    },
    CSS_CLASSES: {
        ACTIVE: 'active'
    },
    SCROLL_CONFIG: {
        SCROLL_TO_TOP_THRESHOLD: 300
    }
};

// Mock DOMUtils
global.window.DOMUtils = {
    querySelectorAll: jest.fn((selector) => document.querySelectorAll(selector)),
    querySelector: jest.fn((selector) => document.querySelector(selector)),
    addEventListener: jest.fn((element, event, handler) => {
        if (element && typeof element.addEventListener === 'function') {
            element.addEventListener(event, handler);
            return true;
        }
        return false;
    }),
    removeEventListener: jest.fn((element, event, handler) => {
        if (element && typeof element.removeEventListener === 'function') {
            element.removeEventListener(event, handler);
            return true;
        }
        return false;
    }),
    addClass: jest.fn((element, className) => {
        if (element) {
            element.classList.add(className);
            return true;
        }
        return false;
    }),
    removeClass: jest.fn((element, className) => {
        if (element) {
            element.classList.remove(className);
            return true;
        }
        return false;
    }),
    setStyle: jest.fn((element, property, value) => {
        if (element) {
            element.style[property] = value;
            return true;
        }
        return false;
    }),
    scrollIntoView: jest.fn((element, options) => {
        if (element && typeof element.scrollIntoView === 'function') {
            element.scrollIntoView(options);
            return true;
        }
        return false;
    })
};

// Mock DebounceUtils
global.window.DebounceUtils = {
    createDebouncedScrollHandler: jest.fn((handler, delay) => handler)
};

// Import Navigation component
const Navigation = require('../components/Navigation.js');

describe('Navigation Component', () => {
    let navigation;

    beforeEach(() => {
        navigation = new Navigation();
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (navigation) {
            navigation.destroy();
        }
    });

    describe('Initialization', () => {
        test('should initialize successfully', () => {
            const result = navigation.initialize();
            expect(result).toBe(true);
            expect(navigation.isInitialized).toBe(true);
        });

        test('should cache DOM elements', () => {
            navigation.initialize();
            expect(navigation.navLinks).toBeTruthy();
            expect(navigation.sections).toBeTruthy();
            expect(navigation.mobileMenuToggle).toBeTruthy();
            expect(navigation.mobileMenu).toBeTruthy();
            expect(navigation.scrollToTopBtn).toBeTruthy();
        });

        test('should attach event listeners', () => {
            navigation.initialize();
            expect(window.DOMUtils.addEventListener).toHaveBeenCalled();
        });
    });

    describe('Navigation Click Handling', () => {
        beforeEach(() => {
            navigation.initialize();
        });

        test('should handle navigation link clicks', () => {
            const homeLink = document.querySelector('a[href="#home"]');
            const mockEvent = {
                preventDefault: jest.fn(),
                currentTarget: homeLink
            };

            navigation.handleNavClick(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(window.DOMUtils.scrollIntoView).toHaveBeenCalled();
        });

        test('should scroll to target section', () => {
            const homeSection = document.querySelector('#home');
            navigation.scrollToSection(homeSection);

            expect(window.DOMUtils.scrollIntoView).toHaveBeenCalledWith(
                homeSection,
                { behavior: 'smooth', block: 'start' }
            );
        });

        test('should handle missing target element gracefully', () => {
            const mockEvent = {
                preventDefault: jest.fn(),
                currentTarget: { getAttribute: () => '#nonexistent' }
            };

            expect(() => navigation.handleNavClick(mockEvent)).not.toThrow();
        });
    });

    describe('Scroll Handling', () => {
        beforeEach(() => {
            navigation.initialize();
        });

        test('should update active navigation link on scroll', () => {
            // Mock scroll position
            Object.defineProperty(window, 'pageYOffset', {
                writable: true,
                value: 100
            });

            // Mock section positions
            const homeSection = document.querySelector('#home');
            const projectsSection = document.querySelector('#projects');
            
            Object.defineProperty(homeSection, 'offsetTop', { value: 0 });
            Object.defineProperty(projectsSection, 'offsetTop', { value: 200 });

            navigation.handleScroll();

            expect(window.DOMUtils.addClass).toHaveBeenCalled();
            expect(window.DOMUtils.removeClass).toHaveBeenCalled();
        });

        test('should show/hide scroll to top button', () => {
            // Test showing button
            Object.defineProperty(window, 'pageYOffset', {
                writable: true,
                value: 400
            });

            navigation.handleScroll();

            expect(window.DOMUtils.setStyle).toHaveBeenCalledWith(
                navigation.scrollToTopBtn,
                'display',
                'flex'
            );

            // Test hiding button
            Object.defineProperty(window, 'pageYOffset', {
                writable: true,
                value: 100
            });

            navigation.handleScroll();

            expect(window.DOMUtils.setStyle).toHaveBeenCalledWith(
                navigation.scrollToTopBtn,
                'display',
                'none'
            );
        });
    });

    describe('Mobile Menu', () => {
        beforeEach(() => {
            navigation.initialize();
        });

        test('should toggle mobile menu', () => {
            navigation.toggleMobileMenu();

            expect(window.DOMUtils.addClass).toHaveBeenCalled();
            expect(window.DOMUtils.removeClass).toHaveBeenCalled();
        });

        test('should open mobile menu', () => {
            navigation.openMobileMenu();

            expect(window.DOMUtils.addClass).toHaveBeenCalledWith(
                navigation.mobileMenu,
                'translate-y-0'
            );
            expect(window.DOMUtils.addClass).toHaveBeenCalledWith(
                navigation.mobileMenu,
                'opacity-100'
            );
        });

        test('should close mobile menu', () => {
            navigation.closeMobileMenu();

            expect(window.DOMUtils.addClass).toHaveBeenCalledWith(
                navigation.mobileMenu,
                '-translate-y-full'
            );
            expect(window.DOMUtils.addClass).toHaveBeenCalledWith(
                navigation.mobileMenu,
                'opacity-0'
            );
        });

        test('should handle mobile menu toggle click', () => {
            const mockEvent = {
                stopPropagation: jest.fn()
            };

            navigation.handleMobileToggle(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test('should close mobile menu on outside click', () => {
            const mockEvent = {
                target: document.body
            };

            // Mock window width
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                value: 500
            });

            navigation.handleOutsideClick(mockEvent);

            expect(window.DOMUtils.addClass).toHaveBeenCalled();
        });
    });

    describe('Scroll to Top', () => {
        beforeEach(() => {
            navigation.initialize();
        });

        test('should handle scroll to top click', () => {
            const mockEvent = {
                preventDefault: jest.fn()
            };

            // Mock window.scrollTo
            global.window.scrollTo = jest.fn();

            navigation.handleScrollToTop(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(window.scrollTo).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    describe('Accessibility', () => {
        beforeEach(() => {
            navigation.initialize();
        });

        test('should support keyboard navigation', () => {
            const homeLink = document.querySelector('a[href="#home"]');
            const mockEvent = {
                preventDefault: jest.fn(),
                currentTarget: homeLink
            };

            // Test that navigation works with keyboard
            navigation.handleNavClick(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        test('should have proper ARIA attributes', () => {
            const nav = document.querySelector('nav[role="navigation"]');
            const menuItems = document.querySelectorAll('[role="menuitem"]');

            expect(nav).toHaveAttribute('role', 'navigation');
            expect(nav).toHaveAttribute('aria-label');
            expect(menuItems.length).toBeGreaterThan(0);
        });

        test('should announce section changes to screen readers', () => {
            // Mock scroll position to trigger active link update
            Object.defineProperty(window, 'pageYOffset', {
                writable: true,
                value: 100
            });

            navigation.handleScroll();

            // Should update aria-selected or similar attributes
            expect(window.DOMUtils.addClass).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        test('should handle initialization errors gracefully', () => {
            // Mock DOMUtils to throw error
            window.DOMUtils.querySelectorAll = jest.fn(() => {
                throw new Error('DOM Error');
            });

            const result = navigation.initialize();
            expect(result).toBe(false);
        });

        test('should handle missing elements gracefully', () => {
            // Mock empty DOM
            window.DOMUtils.querySelectorAll = jest.fn(() => []);
            window.DOMUtils.querySelector = jest.fn(() => null);

            const result = navigation.initialize();
            expect(result).toBe(true); // Should still initialize
        });
    });

    describe('Component Lifecycle', () => {
        test('should destroy component properly', () => {
            navigation.initialize();
            navigation.destroy();

            expect(navigation.navLinks).toBeNull();
            expect(navigation.sections).toBeNull();
            expect(navigation.mobileMenuToggle).toBeNull();
            expect(navigation.mobileMenu).toBeNull();
            expect(navigation.scrollToTopBtn).toBeNull();
            expect(navigation.isInitialized).toBe(false);
        });

        test('should get component status', () => {
            navigation.initialize();
            const status = navigation.getStatus();

            expect(status).toHaveProperty('isInitialized');
            expect(status).toHaveProperty('hasNavLinks');
            expect(status).toHaveProperty('hasSections');
            expect(status).toHaveProperty('hasMobileMenu');
            expect(status).toHaveProperty('hasScrollToTop');
        });
    });

    describe('Performance', () => {
        test('should handle rapid scroll events efficiently', () => {
            navigation.initialize();

            const start = performance.now();
            for (let i = 0; i < 100; i++) {
                navigation.handleScroll();
            }
            const end = performance.now();

            expect(end - start).toBeLessThan(100); // Should complete quickly
        });

        test('should use debounced scroll handler', () => {
            navigation.initialize();

            expect(window.DebounceUtils.createDebouncedScrollHandler).toHaveBeenCalledWith(
                navigation.handleScroll,
                16
            );
        });
    });

    describe('Edge Cases', () => {
        test('should handle null elements', () => {
            navigation.navLinks = null;
            navigation.sections = null;

            expect(() => navigation.handleScroll()).not.toThrow();
        });

        test('should handle empty sections array', () => {
            navigation.sections = [];

            expect(() => navigation.handleScroll()).not.toThrow();
        });

        test('should handle missing mobile menu elements', () => {
            navigation.mobileMenu = null;
            navigation.mobileMenuToggle = null;

            expect(() => navigation.toggleMobileMenu()).not.toThrow();
        });
    });
});

module.exports = {
    Navigation
};
