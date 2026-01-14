/**
 * DOM Manipulation Utilities
 * Following performance optimization and defensive programming principles
 * 
 * @fileoverview Centralized DOM operations with caching and error handling
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * DOM element cache to avoid repeated queries
 * @type {Map<string, Element>}
 */
const elementCache = new Map();

/**
 * Cached DOM queries for performance optimization
 * @type {Object<string, NodeList|Element>}
 */
let cachedElements = {};

/**
 * Safely query DOM element with caching
 * @param {string} selector - CSS selector
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Element|null} DOM element or null if not found
 */
function querySelector(selector, useCache = true) {
    if (!selector || typeof selector !== 'string') {
        console.warn('Invalid selector provided to querySelector');
        return null;
    }

    if (useCache && elementCache.has(selector)) {
        return elementCache.get(selector);
    }

    try {
        const element = document.querySelector(selector);
        if (element && useCache) {
            elementCache.set(selector, element);
        }
        return element;
    } catch (error) {
        console.error('Error querying selector:', selector, error);
        return null;
    }
}

/**
 * Safely query all DOM elements with caching
 * @param {string} selector - CSS selector
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {NodeList} NodeList of elements
 */
function querySelectorAll(selector, useCache = true) {
    if (!selector || typeof selector !== 'string') {
        console.warn('Invalid selector provided to querySelectorAll');
        return document.createDocumentFragment().querySelectorAll('*'); // Empty NodeList
    }

    const cacheKey = `all:${selector}`;
    if (useCache && elementCache.has(cacheKey)) {
        return elementCache.get(cacheKey);
    }

    try {
        const elements = document.querySelectorAll(selector);
        if (useCache) {
            elementCache.set(cacheKey, elements);
        }
        return elements;
    } catch (error) {
        console.error('Error querying selector:', selector, error);
        return document.createDocumentFragment().querySelectorAll('*'); // Empty NodeList
    }
}

/**
 * Initialize cached elements for performance
 * @param {Object} selectors - Object with selector names and CSS selectors
 */
function initializeCachedElements(selectors) {
    if (!selectors || typeof selectors !== 'object') {
        console.warn('Invalid selectors object provided');
        return;
    }

    Object.entries(selectors).forEach(([name, selector]) => {
        if (typeof selector === 'string') {
            cachedElements[name] = querySelector(selector);
        }
    });
}

/**
 * Get cached element by name
 * @param {string} name - Element name from cache
 * @returns {Element|null} Cached element or null
 */
function getCachedElement(name) {
    return cachedElements[name] || null;
}

/**
 * Safely add event listener with error handling
 * @param {Element|string} element - Element or selector
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {Object} options - Event listener options
 * @returns {boolean} True if listener was added successfully
 */
function addEventListener(element, event, handler, options = {}) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for event listener:', element);
            return false;
        }

        if (typeof handler !== 'function') {
            console.warn('Handler must be a function');
            return false;
        }

        targetElement.addEventListener(event, handler, options);
        return true;
    } catch (error) {
        console.error('Error adding event listener:', error);
        return false;
    }
}

/**
 * Safely remove event listener
 * @param {Element|string} element - Element or selector
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {Object} options - Event listener options
 * @returns {boolean} True if listener was removed successfully
 */
function removeEventListener(element, event, handler, options = {}) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for event listener removal:', element);
            return false;
        }

        targetElement.removeEventListener(event, handler, options);
        return true;
    } catch (error) {
        console.error('Error removing event listener:', error);
        return false;
    }
}

/**
 * Safely set element text content (prevents XSS)
 * @param {Element|string} element - Element or selector
 * @param {string} text - Text content to set
 * @returns {boolean} True if text was set successfully
 */
function setTextContent(element, text) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for text content:', element);
            return false;
        }

        if (typeof text !== 'string') {
            console.warn('Text content must be a string');
            return false;
        }

        targetElement.textContent = text;
        return true;
    } catch (error) {
        console.error('Error setting text content:', error);
        return false;
    }
}

/**
 * Safely set element inner HTML with sanitization
 * @param {Element|string} element - Element or selector
 * @param {string} html - HTML content to set
 * @returns {boolean} True if HTML was set successfully
 */
function setInnerHTML(element, html) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for inner HTML:', element);
            return false;
        }

        if (typeof html !== 'string') {
            console.warn('HTML content must be a string');
            return false;
        }

        // Basic sanitization - in production, use a proper sanitization library
        const sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        targetElement.innerHTML = sanitized;
        return true;
    } catch (error) {
        console.error('Error setting inner HTML:', error);
        return false;
    }
}

/**
 * Safely add CSS class to element
 * @param {Element|string} element - Element or selector
 * @param {string} className - CSS class name to add
 * @returns {boolean} True if class was added successfully
 */
function addClass(element, className) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for adding class:', element);
            return false;
        }

        if (typeof className !== 'string') {
            console.warn('Class name must be a string');
            return false;
        }

        targetElement.classList.add(className);
        return true;
    } catch (error) {
        console.error('Error adding class:', error);
        return false;
    }
}

/**
 * Safely remove CSS class from element
 * @param {Element|string} element - Element or selector
 * @param {string} className - CSS class name to remove
 * @returns {boolean} True if class was removed successfully
 */
function removeClass(element, className) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for removing class:', element);
            return false;
        }

        if (typeof className !== 'string') {
            console.warn('Class name must be a string');
            return false;
        }

        targetElement.classList.remove(className);
        return true;
    } catch (error) {
        console.error('Error removing class:', error);
        return false;
    }
}

/**
 * Safely toggle CSS class on element
 * @param {Element|string} element - Element or selector
 * @param {string} className - CSS class name to toggle
 * @returns {boolean} True if operation was successful
 */
function toggleClass(element, className) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for toggling class:', element);
            return false;
        }

        if (typeof className !== 'string') {
            console.warn('Class name must be a string');
            return false;
        }

        targetElement.classList.toggle(className);
        return true;
    } catch (error) {
        console.error('Error toggling class:', error);
        return false;
    }
}

/**
 * Safely set element style property
 * @param {Element|string} element - Element or selector
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 * @returns {boolean} True if style was set successfully
 */
function setStyle(element, property, value) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for setting style:', element);
            return false;
        }

        if (typeof property !== 'string' || typeof value !== 'string') {
            console.warn('Property and value must be strings');
            return false;
        }

        targetElement.style[property] = value;
        return true;
    } catch (error) {
        console.error('Error setting style:', error);
        return false;
    }
}

/**
 * Safely scroll element into view
 * @param {Element|string} element - Element or selector
 * @param {Object} options - Scroll options
 * @returns {boolean} True if scroll was successful
 */
function scrollIntoView(element, options = {}) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for scrolling:', element);
            return false;
        }

        const defaultOptions = {
            behavior: 'smooth',
            block: 'start'
        };

        targetElement.scrollIntoView({ ...defaultOptions, ...options });
        return true;
    } catch (error) {
        console.error('Error scrolling into view:', error);
        return false;
    }
}

/**
 * Create element with attributes and content
 * @param {string} tagName - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string} content - Element content
 * @returns {Element|null} Created element or null on error
 */
function createElement(tagName, attributes = {}, content = '') {
    try {
        if (typeof tagName !== 'string') {
            console.warn('Tag name must be a string');
            return null;
        }

        const element = document.createElement(tagName);

        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (typeof key === 'string' && value !== null && value !== undefined) {
                element.setAttribute(key, value);
            }
        });

        // Set content
        if (content) {
            if (typeof content === 'string') {
                element.textContent = content;
            } else {
                element.appendChild(content);
            }
        }

        return element;
    } catch (error) {
        console.error('Error creating element:', error);
        return null;
    }
}

/**
 * Clear element cache (useful for dynamic content)
 */
function clearCache() {
    elementCache.clear();
    cachedElements = {};
}

/**
 * Get element dimensions safely
 * @param {Element|string} element - Element or selector
 * @returns {Object|null} Object with width, height, top, left or null on error
 */
function getElementDimensions(element) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            console.warn('Element not found for getting dimensions:', element);
            return null;
        }

        const rect = targetElement.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right
        };
    } catch (error) {
        console.error('Error getting element dimensions:', error);
        return null;
    }
}

/**
 * Check if element is visible in viewport
 * @param {Element|string} element - Element or selector
 * @returns {boolean} True if element is visible
 */
function isElementVisible(element) {
    try {
        const targetElement = typeof element === 'string' ? querySelector(element) : element;
        
        if (!targetElement) {
            return false;
        }

        const rect = targetElement.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    } catch (error) {
        console.error('Error checking element visibility:', error);
        return false;
    }
}

/**
 * Export DOM utilities
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        querySelector,
        querySelectorAll,
        initializeCachedElements,
        getCachedElement,
        addEventListener,
        removeEventListener,
        setTextContent,
        setInnerHTML,
        addClass,
        removeClass,
        toggleClass,
        setStyle,
        scrollIntoView,
        createElement,
        clearCache,
        getElementDimensions,
        isElementVisible
    };
} else {
    // Browser environment
    window.DOMUtils = {
        querySelector,
        querySelectorAll,
        initializeCachedElements,
        getCachedElement,
        addEventListener,
        removeEventListener,
        setTextContent,
        setInnerHTML,
        addClass,
        removeClass,
        toggleClass,
        setStyle,
        scrollIntoView,
        createElement,
        clearCache,
        getElementDimensions,
        isElementVisible
    };
}
