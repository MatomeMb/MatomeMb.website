/**
 * DOM Utilities Test Suite
 * Testing DOM manipulation functions for performance and reliability
 * 
 * @fileoverview Unit tests for DOM utilities with caching and error handling
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
    <div id="test-container">
        <button id="test-button" class="btn">Test Button</button>
        <div class="test-class">Test Element</div>
        <input id="test-input" type="text" value="test value">
        <div class="accordion">
            <div class="accordion-header">Header</div>
            <div class="accordion-content">Content</div>
        </div>
    </div>
</body>
</html>
`);

global.window = dom.window;
global.document = dom.window.document;

// Mock CONFIG
global.window.CONFIG = {
    CSS_CLASSES: {
        ACTIVE: 'active',
        IN_VIEW: 'in-view'
    }
};

// Import DOM utilities
const DOMUtils = require('../utils/dom.js');

describe('DOM Utilities', () => {
    beforeEach(() => {
        // Clear cache before each test
        DOMUtils.clearCache();
    });

    describe('querySelector', () => {
        test('should find existing element', () => {
            const element = DOMUtils.querySelector('#test-button');
            expect(element).toBeTruthy();
            expect(element.id).toBe('test-button');
        });

        test('should return null for non-existent element', () => {
            const element = DOMUtils.querySelector('#non-existent');
            expect(element).toBeNull();
        });

        test('should cache elements when useCache is true', () => {
            const element1 = DOMUtils.querySelector('#test-button', true);
            const element2 = DOMUtils.querySelector('#test-button', true);
            expect(element1).toBe(element2); // Same reference
        });

        test('should not cache elements when useCache is false', () => {
            const element1 = DOMUtils.querySelector('#test-button', false);
            const element2 = DOMUtils.querySelector('#test-button', false);
            expect(element1).not.toBe(element2); // Different references
        });

        test('should handle invalid selector gracefully', () => {
            const element = DOMUtils.querySelector(null);
            expect(element).toBeNull();
        });
    });

    describe('querySelectorAll', () => {
        test('should find multiple elements', () => {
            const elements = DOMUtils.querySelectorAll('.test-class');
            expect(elements.length).toBe(1);
        });

        test('should return empty NodeList for non-existent elements', () => {
            const elements = DOMUtils.querySelectorAll('.non-existent');
            expect(elements.length).toBe(0);
        });

        test('should handle invalid selector gracefully', () => {
            const elements = DOMUtils.querySelectorAll(null);
            expect(elements.length).toBe(0);
        });
    });

    describe('addEventListener', () => {
        test('should add event listener successfully', () => {
            const button = document.getElementById('test-button');
            const mockHandler = jest.fn();
            
            const result = DOMUtils.addEventListener(button, 'click', mockHandler);
            expect(result).toBe(true);
            
            button.click();
            expect(mockHandler).toHaveBeenCalled();
        });

        test('should add event listener by selector', () => {
            const mockHandler = jest.fn();
            
            const result = DOMUtils.addEventListener('#test-button', 'click', mockHandler);
            expect(result).toBe(true);
            
            document.getElementById('test-button').click();
            expect(mockHandler).toHaveBeenCalled();
        });

        test('should return false for non-existent element', () => {
            const mockHandler = jest.fn();
            const result = DOMUtils.addEventListener('#non-existent', 'click', mockHandler);
            expect(result).toBe(false);
        });

        test('should return false for invalid handler', () => {
            const button = document.getElementById('test-button');
            const result = DOMUtils.addEventListener(button, 'click', 'not-a-function');
            expect(result).toBe(false);
        });
    });

    describe('setTextContent', () => {
        test('should set text content safely', () => {
            const button = document.getElementById('test-button');
            const result = DOMUtils.setTextContent(button, 'New Text');
            
            expect(result).toBe(true);
            expect(button.textContent).toBe('New Text');
        });

        test('should set text content by selector', () => {
            const result = DOMUtils.setTextContent('#test-button', 'Selector Text');
            
            expect(result).toBe(true);
            expect(document.getElementById('test-button').textContent).toBe('Selector Text');
        });

        test('should prevent XSS attacks', () => {
            const button = document.getElementById('test-button');
            const maliciousText = '<script>alert("xss")</script>';
            
            DOMUtils.setTextContent(button, maliciousText);
            expect(button.textContent).toBe(maliciousText);
            expect(button.innerHTML).not.toContain('<script>');
        });

        test('should return false for non-existent element', () => {
            const result = DOMUtils.setTextContent('#non-existent', 'text');
            expect(result).toBe(false);
        });
    });

    describe('setInnerHTML', () => {
        test('should set inner HTML with sanitization', () => {
            const container = document.getElementById('test-container');
            const result = DOMUtils.setInnerHTML(container, '<p>Safe content</p>');
            
            expect(result).toBe(true);
            expect(container.innerHTML).toContain('<p>Safe content</p>');
        });

        test('should sanitize dangerous scripts', () => {
            const container = document.getElementById('test-container');
            const maliciousHTML = '<p>Content</p><script>alert("xss")</script>';
            
            DOMUtils.setInnerHTML(container, maliciousHTML);
            expect(container.innerHTML).not.toContain('<script>');
        });

        test('should return false for non-existent element', () => {
            const result = DOMUtils.setInnerHTML('#non-existent', '<p>content</p>');
            expect(result).toBe(false);
        });
    });

    describe('addClass', () => {
        test('should add CSS class', () => {
            const button = document.getElementById('test-button');
            const result = DOMUtils.addClass(button, 'new-class');
            
            expect(result).toBe(true);
            expect(button.classList.contains('new-class')).toBe(true);
        });

        test('should add class by selector', () => {
            const result = DOMUtils.addClass('#test-button', 'selector-class');
            
            expect(result).toBe(true);
            expect(document.getElementById('test-button').classList.contains('selector-class')).toBe(true);
        });

        test('should return false for non-existent element', () => {
            const result = DOMUtils.addClass('#non-existent', 'class');
            expect(result).toBe(false);
        });
    });

    describe('removeClass', () => {
        test('should remove CSS class', () => {
            const button = document.getElementById('test-button');
            button.classList.add('test-class');
            
            const result = DOMUtils.removeClass(button, 'test-class');
            
            expect(result).toBe(true);
            expect(button.classList.contains('test-class')).toBe(false);
        });

        test('should return false for non-existent element', () => {
            const result = DOMUtils.removeClass('#non-existent', 'class');
            expect(result).toBe(false);
        });
    });

    describe('toggleClass', () => {
        test('should toggle CSS class', () => {
            const button = document.getElementById('test-button');
            
            // Add class
            DOMUtils.toggleClass(button, 'toggle-class');
            expect(button.classList.contains('toggle-class')).toBe(true);
            
            // Remove class
            DOMUtils.toggleClass(button, 'toggle-class');
            expect(button.classList.contains('toggle-class')).toBe(false);
        });

        test('should return false for non-existent element', () => {
            const result = DOMUtils.toggleClass('#non-existent', 'class');
            expect(result).toBe(false);
        });
    });

    describe('setStyle', () => {
        test('should set style property', () => {
            const button = document.getElementById('test-button');
            const result = DOMUtils.setStyle(button, 'color', 'red');
            
            expect(result).toBe(true);
            expect(button.style.color).toBe('red');
        });

        test('should return false for non-existent element', () => {
            const result = DOMUtils.setStyle('#non-existent', 'color', 'red');
            expect(result).toBe(false);
        });

        test('should return false for invalid property/value', () => {
            const button = document.getElementById('test-button');
            const result = DOMUtils.setStyle(button, 123, 'red');
            expect(result).toBe(false);
        });
    });

    describe('scrollIntoView', () => {
        test('should scroll element into view', () => {
            const button = document.getElementById('test-button');
            const result = DOMUtils.scrollIntoView(button);
            
            expect(result).toBe(true);
        });

        test('should return false for non-existent element', () => {
            const result = DOMUtils.scrollIntoView('#non-existent');
            expect(result).toBe(false);
        });
    });

    describe('createElement', () => {
        test('should create element with attributes', () => {
            const element = DOMUtils.createElement('div', {
                id: 'test-div',
                class: 'test-class'
            }, 'Test content');
            
            expect(element).toBeTruthy();
            expect(element.tagName).toBe('DIV');
            expect(element.id).toBe('test-div');
            expect(element.className).toBe('test-class');
            expect(element.textContent).toBe('Test content');
        });

        test('should create element without attributes', () => {
            const element = DOMUtils.createElement('span');
            
            expect(element).toBeTruthy();
            expect(element.tagName).toBe('SPAN');
        });

        test('should return null for invalid tag name', () => {
            const element = DOMUtils.createElement(null);
            expect(element).toBeNull();
        });
    });

    describe('getElementDimensions', () => {
        test('should get element dimensions', () => {
            const button = document.getElementById('test-button');
            const dimensions = DOMUtils.getElementDimensions(button);
            
            expect(dimensions).toBeTruthy();
            expect(dimensions).toHaveProperty('width');
            expect(dimensions).toHaveProperty('height');
            expect(dimensions).toHaveProperty('top');
            expect(dimensions).toHaveProperty('left');
        });

        test('should return null for non-existent element', () => {
            const dimensions = DOMUtils.getElementDimensions('#non-existent');
            expect(dimensions).toBeNull();
        });
    });

    describe('isElementVisible', () => {
        test('should check element visibility', () => {
            const button = document.getElementById('test-button');
            const isVisible = DOMUtils.isElementVisible(button);
            
            expect(typeof isVisible).toBe('boolean');
        });

        test('should return false for non-existent element', () => {
            const isVisible = DOMUtils.isElementVisible('#non-existent');
            expect(isVisible).toBe(false);
        });
    });

    describe('clearCache', () => {
        test('should clear element cache', () => {
            // Add some elements to cache
            DOMUtils.querySelector('#test-button', true);
            DOMUtils.querySelectorAll('.test-class', true);
            
            // Clear cache
            DOMUtils.clearCache();
            
            // Cache should be empty
            const cachedElement = DOMUtils.getCachedElement('test-button');
            expect(cachedElement).toBeNull();
        });
    });

    describe('Performance Tests', () => {
        test('querySelector should be fast', () => {
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                DOMUtils.querySelector('#test-button');
            }
            const end = performance.now();
            expect(end - start).toBeLessThan(100); // Should complete in under 100ms
        });

        test('cached queries should be faster', () => {
            // First query (not cached)
            const start1 = performance.now();
            DOMUtils.querySelector('#test-button', true);
            const end1 = performance.now();
            const time1 = end1 - start1;

            // Second query (cached)
            const start2 = performance.now();
            DOMUtils.querySelector('#test-button', true);
            const end2 = performance.now();
            const time2 = end2 - start2;

            expect(time2).toBeLessThan(time1);
        });
    });

    describe('Error Handling', () => {
        test('should handle DOM errors gracefully', () => {
            // Mock a DOM error
            const originalQuerySelector = document.querySelector;
            document.querySelector = jest.fn(() => {
                throw new Error('DOM Error');
            });

            const element = DOMUtils.querySelector('#test-button');
            expect(element).toBeNull();

            // Restore original function
            document.querySelector = originalQuerySelector;
        });

        test('should handle invalid parameters gracefully', () => {
            expect(DOMUtils.querySelector()).toBeNull();
            expect(DOMUtils.querySelectorAll()).toBeTruthy();
            expect(DOMUtils.addEventListener()).toBe(false);
            expect(DOMUtils.setTextContent()).toBe(false);
        });
    });
});

module.exports = {
    DOMUtils
};
