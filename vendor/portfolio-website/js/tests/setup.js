/**
 * Jest Test Setup
 * Global test configuration and mocks
 * 
 * @fileoverview Test setup with DOM environment and global mocks
 * @version 1.0.0
 * @author Matome Mbowene
 */

// Mock DOM environment
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>Test Portfolio</title>
</head>
<body>
    <div id="app">
        <nav role="navigation" aria-label="Main navigation">
            <ul role="menubar">
                <li role="none"><a href="#home" role="menuitem">Home</a></li>
                <li role="none"><a href="#projects" role="menuitem">Projects</a></li>
                <li role="none"><a href="#skills" role="menuitem">Skills</a></li>
            </ul>
        </nav>
        
        <button id="mobile-menu-toggle" aria-label="Toggle mobile menu">
            <i class="fas fa-bars"></i>
        </button>
        
        <div id="mobile-menu" role="menubar" aria-hidden="true">
            <a href="#home" role="menuitem">Home</a>
            <a href="#projects" role="menuitem">Projects</a>
        </div>
        
        <div class="project-filter active" data-filter="all" role="tab" aria-selected="true">All Projects</div>
        <div class="project-filter" data-filter="ai-ml" role="tab" aria-selected="false">AI/ML</div>
        
        <div class="skill-accordion" role="region">
            <div class="skill-accordion-header" role="button" aria-expanded="true">AI & Machine Learning</div>
            <div class="skill-accordion-content">Skills content</div>
        </div>
        
        <div class="chat-widget" role="dialog" aria-hidden="true">
            <div class="chat-header">
                <h3>Ask me anything!</h3>
                <button id="close-chat" aria-label="Close chat">×</button>
            </div>
            <div class="chat-body" role="log" aria-live="polite"></div>
            <div class="chat-input-container">
                <input id="chat-input" type="text" aria-label="Type your message">
                <button id="send-message" aria-label="Send message">Send</button>
            </div>
        </div>
        
        <button id="chat-toggle" aria-label="Open chat widget">
            <i class="fas fa-comments"></i>
        </button>
        
        <button id="scroll-to-top" aria-label="Scroll to top">
            <i class="fas fa-arrow-up"></i>
        </button>
        
        <section id="home">Home Section</section>
        <section id="projects">Projects Section</section>
        <section id="skills">Skills Section</section>
    </div>
</body>
</html>
`, {
    url: 'http://localhost',
    referrer: 'http://localhost',
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000
});

// Set up global DOM
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.MouseEvent = dom.window.MouseEvent;
global.Event = dom.window.Event;

// Mock performance API
global.performance = {
    now: jest.fn(() => Date.now()),
    timing: {
        navigationStart: Date.now() - 1000,
        loadEventEnd: Date.now()
    }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock scrollTo
global.window.scrollTo = jest.fn();

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    x: 0,
    y: 0
}));

// Mock getComputedStyle
global.getComputedStyle = jest.fn(() => ({
    getPropertyValue: jest.fn(() => ''),
    setProperty: jest.fn(),
    removeProperty: jest.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock MutationObserver
global.MutationObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(() => [])
}));

// Mock CONFIG object
global.window.CONFIG = {
    ANIMATION_CONFIG: {
        DURATION: 800,
        OFFSET: 50,
        TYPING_DELAY: { MIN: 500, MAX: 1500 }
    },
    CHAT_CONFIG: {
        MAX_MESSAGE_LENGTH: 500,
        RESPONSE_TIMEOUT: 24,
        RATE_LIMIT_DELAY: 1000
    },
    SCROLL_CONFIG: {
        DEBOUNCE_DELAY: 16,
        OBSERVER_MARGIN: '50px',
        SCROLL_TO_TOP_THRESHOLD: 300
    },
    SECURITY_CONFIG: {
        CONTENT_FILTER: {
            MAX_LENGTH: 500,
            BLOCKED_WORDS: ['spam', 'inappropriate', 'malicious'],
            MESSAGE: "Your message contains inappropriate content."
        }
    },
    CSS_CLASSES: {
        ACTIVE: 'active',
        IN_VIEW: 'in-view',
        LOADED: 'loaded'
    },
    SELECTORS: {
        NAV_LINKS: 'nav a[href^="#"]',
        SECTIONS: 'section',
        MOBILE_MENU_TOGGLE: '#mobile-menu-toggle',
        MOBILE_MENU: '#mobile-menu',
        SCROLL_TO_TOP: '#scroll-to-top',
        PROJECT_FILTERS: '.project-filter',
        PROJECT_CARDS: '.project-card',
        SKILL_BARS: '.skill-progress',
        COUNTERS: '.metric-value',
        TERMINAL_LINES: '.terminal-line',
        ANIMATED_ELEMENTS: '[data-aos]',
        LAZY_IMAGES: 'img[data-src]'
    },
    ERROR_MESSAGES: {
        AI_AGENT_ERROR: 'I apologize, but I\'m experiencing technical difficulties.',
        NETWORK_ERROR: 'I\'m having trouble connecting.',
        VALIDATION_ERROR: 'Please enter a valid message.',
        RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment.',
        GENERIC_ERROR: 'Something went wrong. Please try again.'
    }
};

// Mock DOMUtils
global.window.DOMUtils = {
    querySelector: jest.fn((selector) => document.querySelector(selector)),
    querySelectorAll: jest.fn((selector) => document.querySelectorAll(selector)),
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
    toggleClass: jest.fn((element, className) => {
        if (element) {
            element.classList.toggle(className);
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
    setTextContent: jest.fn((element, text) => {
        if (element) {
            element.textContent = text;
            return true;
        }
        return false;
    }),
    setInnerHTML: jest.fn((element, html) => {
        if (element) {
            element.innerHTML = html;
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
    }),
    createElement: jest.fn((tagName, attributes, content) => {
        const element = document.createElement(tagName);
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        if (content) {
            element.textContent = content;
        }
        return element;
    }),
    clearCache: jest.fn(),
    getElementDimensions: jest.fn((element) => {
        if (element) {
            const rect = element.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right
            };
        }
        return null;
    }),
    isElementVisible: jest.fn((element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && 
               rect.bottom <= window.innerHeight && 
               rect.right <= window.innerWidth;
    })
};

// Mock ValidationUtils
global.window.ValidationUtils = {
    validateChatInput: jest.fn((input) => {
        if (typeof input !== 'string') return false;
        return input.length > 0 && input.length <= 500;
    }),
    sanitizeInput: jest.fn((input) => {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>]/g, '');
    }),
    validateEmail: jest.fn((email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }),
    validatePhone: jest.fn((phone) => {
        return /^\+?[1-9]\d{9,14}$/.test(phone.replace(/[^\d+]/g, ''));
    }),
    containsBlockedWords: jest.fn((content) => {
        const blockedWords = ['spam', 'inappropriate', 'malicious'];
        return blockedWords.some(word => content.toLowerCase().includes(word));
    }),
    validateUrl: jest.fn((url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }),
    validateNumericRange: jest.fn((value, min, max) => {
        return typeof value === 'number' && value >= min && value <= max;
    }),
    validateSelector: jest.fn((selector) => {
        return typeof selector === 'string' && selector.length > 0;
    }),
    validateRateLimit: jest.fn((rateLimitData) => {
        if (!rateLimitData) return true;
        const { lastRequest, delay } = rateLimitData;
        return (Date.now() - lastRequest) >= delay;
    }),
    validateConfig: jest.fn((config, requiredKeys) => {
        if (!config || typeof config !== 'object') return false;
        return requiredKeys.every(key => key in config);
    }),
    validateFunction: jest.fn((fn) => typeof fn === 'function'),
    validateElementExists: jest.fn((element) => {
        if (!element) return false;
        if (typeof element === 'string') {
            return document.querySelector(element) !== null;
        }
        return document.contains(element);
    }),
    validateChatMessage: jest.fn((input) => {
        if (!input || typeof input !== 'string') {
            return { success: false, error: 'Invalid input' };
        }
        if (input.length === 0 || input.length > 500) {
            return { success: false, error: 'Invalid length' };
        }
        return { success: true, sanitizedInput: input, error: null };
    })
};

// Mock DebounceUtils
global.window.DebounceUtils = {
    debounce: jest.fn((func, wait, immediate) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }),
    throttle: jest.fn((func, limit) => {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }),
    rafThrottle: jest.fn((func) => {
        let rafId;
        return function executedFunction(...args) {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                func.apply(this, args);
                rafId = null;
            });
        };
    }),
    createDebouncedScrollHandler: jest.fn((handler, delay) => handler),
    createThrottledScrollHandler: jest.fn((handler, limit) => handler),
    createRAFScrollHandler: jest.fn((handler) => handler),
    createDebouncedResizeHandler: jest.fn((handler, delay) => handler),
    createDebouncedInputHandler: jest.fn((handler, delay) => handler),
    createDebouncedSearchHandler: jest.fn((handler, delay) => handler),
    batch: jest.fn((func, delay) => func),
    once: jest.fn((func) => {
        let called = false;
        let result;
        return function executedFunction(...args) {
            if (!called) {
                called = true;
                result = func.apply(this, args);
            }
            return result;
        };
    }),
    memoize: jest.fn((func, keyGenerator) => {
        const cache = new Map();
        return function executedFunction(...args) {
            const key = keyGenerator(...args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        };
    }),
    retry: jest.fn((func, maxRetries, delay) => func)
};

// Mock AOS (Animate On Scroll)
global.AOS = {
    init: jest.fn(),
    refresh: jest.fn(),
    refreshHard: jest.fn()
};

// Mock SecureAIAgent
global.window.SecureAIAgent = jest.fn().mockImplementation(() => ({
    isInitialized: true,
    processMessage: jest.fn().mockResolvedValue('Mock AI response'),
    resetConversation: jest.fn(),
    getStats: jest.fn().mockReturnValue({
        isInitialized: true,
        conversationLength: 0,
        lastRequestTime: 0
    })
}));

// Console mock to reduce test noise
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Global test utilities
global.testUtils = {
    createKeyboardEvent: (key, code, type = 'keydown') => {
        return new dom.window.KeyboardEvent(type, {
            key,
            code,
            bubbles: true,
            cancelable: true
        });
    },
    createMouseEvent: (type, options = {}) => {
        return new dom.window.MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            ...options
        });
    },
    waitFor: (callback, timeout = 1000) => {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (callback()) {
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error('Timeout waiting for condition'));
                } else {
                    setTimeout(check, 10);
                }
            };
            check();
        });
    }
};

// Clean up after each test
afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset DOM state
    document.body.innerHTML = dom.window.document.body.innerHTML;
    
    // Clear any timers
    jest.clearAllTimers();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
