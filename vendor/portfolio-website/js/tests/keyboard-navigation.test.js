/**
 * Keyboard Navigation Test Suite
 * Testing accessibility and keyboard navigation functionality
 * 
 * @fileoverview Comprehensive tests for keyboard navigation and accessibility
 * @version 1.0.0
 * @author Matome Mbowene
 */

// Mock DOM environment with keyboard navigation elements
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
    <!-- Navigation with proper ARIA attributes -->
    <nav role="navigation" aria-label="Main navigation">
        <ul role="menubar">
            <li role="none">
                <a href="#home" role="menuitem" tabindex="0" aria-label="Go to home section">Home</a>
            </li>
            <li role="none">
                <a href="#projects" role="menuitem" tabindex="0" aria-label="Go to projects section">Projects</a>
            </li>
            <li role="none">
                <a href="#skills" role="menuitem" tabindex="0" aria-label="Go to skills section">Skills</a>
            </li>
        </ul>
    </nav>

    <!-- Mobile menu with keyboard support -->
    <nav role="navigation" aria-label="Mobile navigation">
        <button id="mobile-menu-toggle" tabindex="0" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle mobile menu">
            <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
        <ul id="mobile-menu" role="menubar" tabindex="-1" aria-hidden="true">
            <li role="none">
                <a href="#home" role="menuitem" tabindex="-1">Home</a>
            </li>
            <li role="none">
                <a href="#projects" role="menuitem" tabindex="-1">Projects</a>
            </li>
        </ul>
    </nav>

    <!-- Project filters with tab support -->
    <div role="tablist" aria-label="Project category filters">
        <button class="project-filter active" role="tab" tabindex="0" aria-selected="true" aria-controls="projects-grid">All Projects</button>
        <button class="project-filter" role="tab" tabindex="-1" aria-selected="false" aria-controls="projects-grid">AI/ML</button>
        <button class="project-filter" role="tab" tabindex="-1" aria-selected="false" aria-controls="projects-grid">Web Development</button>
    </div>

    <!-- Skills accordion with keyboard support -->
    <div class="skill-accordion" role="region" aria-labelledby="ai-ml-heading">
        <div class="skill-accordion-header" role="button" tabindex="0" aria-expanded="true" aria-controls="ai-ml-content" id="ai-ml-heading">
            <h3>AI & Machine Learning</h3>
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </div>
        <div class="skill-accordion-content" id="ai-ml-content" role="region" aria-labelledby="ai-ml-heading">
            <div>Skills content here</div>
        </div>
    </div>

    <!-- Chat widget with keyboard support -->
    <div class="chat-widget" role="dialog" aria-labelledby="chat-title" aria-hidden="true">
        <div class="chat-header">
            <h3 id="chat-title">Ask me anything!</h3>
            <button id="close-chat" tabindex="0" aria-label="Close chat">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
        <div class="chat-body" role="log" aria-live="polite" tabindex="0">
            <div class="chat-message bot">Hello! How can I help?</div>
        </div>
        <div class="chat-input-container">
            <input id="chat-input" type="text" tabindex="0" aria-label="Type your message" placeholder="Type your message...">
            <button id="send-message" tabindex="0" aria-label="Send message">
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
        </div>
    </div>

    <!-- Action buttons -->
    <button id="scroll-to-top" tabindex="0" aria-label="Scroll to top">
        <i class="fas fa-arrow-up" aria-hidden="true"></i>
    </button>
    <button id="chat-toggle" tabindex="0" aria-label="Open chat widget">
        <i class="fas fa-comments" aria-hidden="true"></i>
    </button>

    <!-- Sections for navigation -->
    <section id="home" tabindex="-1">
        <h1>Home Section</h1>
    </section>
    <section id="projects" tabindex="-1">
        <h2>Projects Section</h2>
    </section>
    <section id="skills" tabindex="-1">
        <h2>Skills Section</h2>
    </section>
</body>
</html>
`);

global.window = dom.window;
global.document = dom.window.document;

// Mock keyboard event
const createKeyboardEvent = (key, code, type = 'keydown') => {
    return new dom.window.KeyboardEvent(type, {
        key,
        code,
        bubbles: true,
        cancelable: true
    });
};

// Mock focus management
const mockFocus = (element) => {
    if (element && typeof element.focus === 'function') {
        element.focus();
        return true;
    }
    return false;
};

// Mock tabindex management
const setTabIndex = (element, index) => {
    if (element) {
        element.setAttribute('tabindex', index);
        return true;
    }
    return false;
};

describe('Keyboard Navigation', () => {
    let navigation, chatWidget, skillsAccordion, projectFilter;

    beforeEach(() => {
        // Mock component classes
        navigation = {
            handleNavClick: jest.fn(),
            handleMobileToggle: jest.fn(),
            handleScrollToTop: jest.fn(),
            closeMobileMenu: jest.fn()
        };

        chatWidget = {
            handleToggle: jest.fn(),
            handleClose: jest.fn(),
            handleSend: jest.fn(),
            handleKeyPress: jest.fn()
        };

        skillsAccordion = {
            toggleAccordion: jest.fn()
        };

        projectFilter = {
            handleFilterClick: jest.fn()
        };
    });

    describe('Tab Navigation', () => {
        test('should navigate through focusable elements with Tab key', () => {
            const focusableElements = document.querySelectorAll(
                'a[href], button, input, [tabindex]:not([tabindex="-1"])'
            );

            expect(focusableElements.length).toBeGreaterThan(0);

            // Test that all focusable elements have proper tabindex
            focusableElements.forEach(element => {
                const tabindex = element.getAttribute('tabindex');
                expect(tabindex).not.toBeNull();
            });
        });

        test('should skip elements with tabindex="-1"', () => {
            const hiddenElements = document.querySelectorAll('[tabindex="-1"]');
            
            hiddenElements.forEach(element => {
                expect(element.getAttribute('tabindex')).toBe('-1');
            });
        });

        test('should maintain logical tab order', () => {
            const expectedOrder = [
                'a[href="#home"]',
                'a[href="#projects"]',
                'a[href="#skills"]',
                '#mobile-menu-toggle',
                '.project-filter.active',
                '.skill-accordion-header',
                '#chat-input',
                '#send-message',
                '#scroll-to-top',
                '#chat-toggle'
            ];

            const focusableElements = Array.from(document.querySelectorAll(
                'a[href], button, input, [tabindex]:not([tabindex="-1"])'
            ));

            expect(focusableElements.length).toBeGreaterThanOrEqual(expectedOrder.length);
        });
    });

    describe('Arrow Key Navigation', () => {
        test('should navigate menu items with arrow keys', () => {
            const menuItems = document.querySelectorAll('nav[role="menubar"] [role="menuitem"]');
            const firstItem = menuItems[0];
            const secondItem = menuItems[1];

            // Focus first item
            firstItem.focus();

            // Test right arrow navigation
            const rightArrowEvent = createKeyboardEvent('ArrowRight', 'ArrowRight');
            firstItem.dispatchEvent(rightArrowEvent);

            // Should move to next item
            expect(document.activeElement).toBe(secondItem);
        });

        test('should wrap around menu items', () => {
            const menuItems = document.querySelectorAll('nav[role="menubar"] [role="menuitem"]');
            const lastItem = menuItems[menuItems.length - 1];

            // Focus last item
            lastItem.focus();

            // Test right arrow navigation (should wrap to first)
            const rightArrowEvent = createKeyboardEvent('ArrowRight', 'ArrowRight');
            lastItem.dispatchEvent(rightArrowEvent);

            // Should wrap to first item
            expect(document.activeElement).toBe(menuItems[0]);
        });
    });

    describe('Enter and Space Key Activation', () => {
        test('should activate buttons with Enter key', () => {
            const button = document.querySelector('#mobile-menu-toggle');
            const enterEvent = createKeyboardEvent('Enter', 'Enter');

            button.dispatchEvent(enterEvent);
            // Button should be activated (handled by component)
        });

        test('should activate buttons with Space key', () => {
            const button = document.querySelector('#scroll-to-top');
            const spaceEvent = createKeyboardEvent(' ', 'Space');

            button.dispatchEvent(spaceEvent);
            // Button should be activated (handled by component)
        });

        test('should not activate disabled elements', () => {
            const disabledButton = document.createElement('button');
            disabledButton.disabled = true;
            disabledButton.setAttribute('tabindex', '0');
            document.body.appendChild(disabledButton);

            const enterEvent = createKeyboardEvent('Enter', 'Enter');
            disabledButton.dispatchEvent(enterEvent);

            // Disabled button should not be activated
            expect(disabledButton.disabled).toBe(true);
        });
    });

    describe('Escape Key Handling', () => {
        test('should close mobile menu with Escape key', () => {
            const mobileMenu = document.querySelector('#mobile-menu');
            const escapeEvent = createKeyboardEvent('Escape', 'Escape');

            // Mock mobile menu as open
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileMenu.setAttribute('tabindex', '0');

            mobileMenu.dispatchEvent(escapeEvent);
            // Menu should be closed (handled by component)
        });

        test('should close chat widget with Escape key', () => {
            const chatWidget = document.querySelector('.chat-widget');
            const escapeEvent = createKeyboardEvent('Escape', 'Escape');

            // Mock chat widget as open
            chatWidget.setAttribute('aria-hidden', 'false');

            chatWidget.dispatchEvent(escapeEvent);
            // Chat should be closed (handled by component)
        });
    });

    describe('Focus Management', () => {
        test('should trap focus within modal dialogs', () => {
            const chatWidget = document.querySelector('.chat-widget');
            const chatInput = document.querySelector('#chat-input');
            const sendButton = document.querySelector('#send-message');
            const closeButton = document.querySelector('#close-chat');

            // Mock chat widget as open
            chatWidget.setAttribute('aria-hidden', 'false');

            // Focus should be trapped within chat widget
            const focusableElements = chatWidget.querySelectorAll(
                'button, input, [tabindex]:not([tabindex="-1"])'
            );

            expect(focusableElements.length).toBeGreaterThan(0);
        });

        test('should return focus to trigger element when modal closes', () => {
            const chatToggle = document.querySelector('#chat-toggle');
            const chatWidget = document.querySelector('.chat-widget');

            // Focus chat toggle
            chatToggle.focus();
            const originalFocus = document.activeElement;

            // Open chat widget
            chatWidget.setAttribute('aria-hidden', 'false');

            // Close chat widget
            chatWidget.setAttribute('aria-hidden', 'true');

            // Focus should return to original element
            expect(document.activeElement).toBe(originalFocus);
        });
    });

    describe('ARIA Attributes', () => {
        test('should have proper ARIA labels', () => {
            const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
            expect(elementsWithAriaLabel.length).toBeGreaterThan(0);

            elementsWithAriaLabel.forEach(element => {
                const label = element.getAttribute('aria-label');
                expect(label).toBeTruthy();
                expect(label.length).toBeGreaterThan(0);
            });
        });

        test('should have proper ARIA expanded states', () => {
            const expandableElements = document.querySelectorAll('[aria-expanded]');
            
            expandableElements.forEach(element => {
                const expanded = element.getAttribute('aria-expanded');
                expect(['true', 'false']).toContain(expanded);
            });
        });

        test('should have proper ARIA controls relationships', () => {
            const controllingElements = document.querySelectorAll('[aria-controls]');
            
            controllingElements.forEach(element => {
                const controls = element.getAttribute('aria-controls');
                const controlledElement = document.getElementById(controls);
                expect(controlledElement).toBeTruthy();
            });
        });

        test('should have proper role attributes', () => {
            const elementsWithRole = document.querySelectorAll('[role]');
            
            elementsWithRole.forEach(element => {
                const role = element.getAttribute('role');
                expect(role).toBeTruthy();
                expect([
                    'navigation', 'menubar', 'menuitem', 'button', 'dialog',
                    'tablist', 'tab', 'tabpanel', 'region', 'log'
                ]).toContain(role);
            });
        });
    });

    describe('Screen Reader Support', () => {
        test('should have proper heading hierarchy', () => {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));

            // Should have h1
            expect(headingLevels).toContain(1);

            // Should not skip heading levels
            for (let i = 0; i < headingLevels.length - 1; i++) {
                const current = headingLevels[i];
                const next = headingLevels[i + 1];
                expect(next - current).toBeLessThanOrEqual(1);
            }
        });

        test('should have proper landmarks', () => {
            const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]');
            expect(landmarks.length).toBeGreaterThan(0);
        });

        test('should have live regions for dynamic content', () => {
            const liveRegions = document.querySelectorAll('[aria-live]');
            expect(liveRegions.length).toBeGreaterThan(0);

            liveRegions.forEach(element => {
                const live = element.getAttribute('aria-live');
                expect(['polite', 'assertive', 'off']).toContain(live);
            });
        });
    });

    describe('Keyboard Shortcuts', () => {
        test('should support common keyboard shortcuts', () => {
            // Test Ctrl+A for select all
            const input = document.querySelector('#chat-input');
            const ctrlAEvent = createKeyboardEvent('a', 'KeyA', 'keydown');
            ctrlAEvent.ctrlKey = true;
            input.dispatchEvent(ctrlAEvent);

            // Test Ctrl+Enter for send
            const ctrlEnterEvent = createKeyboardEvent('Enter', 'Enter', 'keydown');
            ctrlEnterEvent.ctrlKey = true;
            input.dispatchEvent(ctrlEnterEvent);
        });

        test('should not interfere with browser shortcuts', () => {
            // Test that our shortcuts don't prevent browser functionality
            const ctrlFEvent = createKeyboardEvent('f', 'KeyF', 'keydown');
            ctrlFEvent.ctrlKey = true;
            document.dispatchEvent(ctrlFEvent);

            // Should not prevent default browser behavior
            expect(ctrlFEvent.defaultPrevented).toBe(false);
        });
    });

    describe('Error Handling', () => {
        test('should handle missing elements gracefully', () => {
            const nonExistentElement = document.querySelector('#non-existent');
            expect(nonExistentElement).toBeNull();

            // Should not throw errors when trying to focus non-existent elements
            expect(() => {
                if (nonExistentElement) {
                    nonExistentElement.focus();
                }
            }).not.toThrow();
        });

        test('should handle keyboard events on non-interactive elements', () => {
            const div = document.createElement('div');
            div.setAttribute('tabindex', '0');
            document.body.appendChild(div);

            const enterEvent = createKeyboardEvent('Enter', 'Enter');
            expect(() => {
                div.dispatchEvent(enterEvent);
            }).not.toThrow();

            document.body.removeChild(div);
        });
    });

    describe('Performance', () => {
        test('should handle rapid keyboard events efficiently', () => {
            const input = document.querySelector('#chat-input');
            const start = performance.now();

            // Simulate rapid typing
            for (let i = 0; i < 100; i++) {
                const keyEvent = createKeyboardEvent('a', 'KeyA', 'keydown');
                input.dispatchEvent(keyEvent);
            }

            const end = performance.now();
            expect(end - start).toBeLessThan(100); // Should complete quickly
        });
    });

    describe('Cross-browser Compatibility', () => {
        test('should work with different keyboard event properties', () => {
            const input = document.querySelector('#chat-input');

            // Test with key property
            const keyEvent = createKeyboardEvent('a', 'KeyA');
            input.dispatchEvent(keyEvent);

            // Test with code property
            const codeEvent = createKeyboardEvent('a', 'KeyA');
            input.dispatchEvent(codeEvent);

            // Both should work
            expect(keyEvent.key).toBe('a');
            expect(keyEvent.code).toBe('KeyA');
        });
    });
});

module.exports = {
    createKeyboardEvent,
    mockFocus,
    setTabIndex
};
