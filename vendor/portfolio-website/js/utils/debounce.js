/**
 * Debounce and Throttle Utilities
 * Following performance optimization principles
 * 
 * @fileoverview Utility functions for optimizing event handling performance
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
    if (typeof func !== 'function') {
        throw new TypeError('First argument must be a function');
    }

    if (typeof wait !== 'number' || wait < 0) {
        throw new TypeError('Wait time must be a non-negative number');
    }

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
}

/**
 * Throttle function to limit the rate of function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    if (typeof func !== 'function') {
        throw new TypeError('First argument must be a function');
    }

    if (typeof limit !== 'number' || limit < 0) {
        throw new TypeError('Limit must be a non-negative number');
    }

    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request Animation Frame based throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
function rafThrottle(func) {
    if (typeof func !== 'function') {
        throw new TypeError('First argument must be a function');
    }

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
}

/**
 * Create a debounced scroll handler
 * @param {Function} handler - Scroll handler function
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced scroll handler
 */
function createDebouncedScrollHandler(handler, delay = 16) {
    return debounce(handler, delay);
}

/**
 * Create a throttled scroll handler
 * @param {Function} handler - Scroll handler function
 * @param {number} limit - Throttle limit in milliseconds
 * @returns {Function} Throttled scroll handler
 */
function createThrottledScrollHandler(handler, limit = 16) {
    return throttle(handler, limit);
}

/**
 * Create a RAF throttled scroll handler for smooth performance
 * @param {Function} handler - Scroll handler function
 * @returns {Function} RAF throttled scroll handler
 */
function createRAFScrollHandler(handler) {
    return rafThrottle(handler);
}

/**
 * Create a debounced resize handler
 * @param {Function} handler - Resize handler function
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced resize handler
 */
function createDebouncedResizeHandler(handler, delay = 250) {
    return debounce(handler, delay);
}

/**
 * Create a debounced input handler
 * @param {Function} handler - Input handler function
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced input handler
 */
function createDebouncedInputHandler(handler, delay = 300) {
    return debounce(handler, delay);
}

/**
 * Create a debounced search handler
 * @param {Function} handler - Search handler function
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced search handler
 */
function createDebouncedSearchHandler(handler, delay = 500) {
    return debounce(handler, delay);
}

/**
 * Batch multiple function calls into a single execution
 * @param {Function} func - Function to batch
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Batched function
 */
function batch(func, delay = 0) {
    if (typeof func !== 'function') {
        throw new TypeError('First argument must be a function');
    }

    let timeout;
    let args = [];

    return function executedFunction(...newArgs) {
        args = [...args, ...newArgs];
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
            args = [];
        }, delay);
    };
}

/**
 * Create a once-only function that can only be called once
 * @param {Function} func - Function to make once-only
 * @returns {Function} Once-only function
 */
function once(func) {
    if (typeof func !== 'function') {
        throw new TypeError('First argument must be a function');
    }

    let called = false;
    let result;

    return function executedFunction(...args) {
        if (!called) {
            called = true;
            result = func.apply(this, args);
        }
        return result;
    };
}

/**
 * Create a memoized function that caches results
 * @param {Function} func - Function to memoize
 * @param {Function} keyGenerator - Function to generate cache keys
 * @returns {Function} Memoized function
 */
function memoize(func, keyGenerator = (...args) => JSON.stringify(args)) {
    if (typeof func !== 'function') {
        throw new TypeError('First argument must be a function');
    }

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
}

/**
 * Create a retry function that retries on failure
 * @param {Function} func - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Function} Retry function
 */
function retry(func, maxRetries = 3, delay = 1000) {
    if (typeof func !== 'function') {
        throw new TypeError('First argument must be a function');
    }

    return async function executedFunction(...args) {
        let lastError;
        
        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await func.apply(this, args);
            } catch (error) {
                lastError = error;
                
                if (i < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
    };
}

/**
 * Export debounce utilities
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        rafThrottle,
        createDebouncedScrollHandler,
        createThrottledScrollHandler,
        createRAFScrollHandler,
        createDebouncedResizeHandler,
        createDebouncedInputHandler,
        createDebouncedSearchHandler,
        batch,
        once,
        memoize,
        retry
    };
} else {
    // Browser environment
    window.DebounceUtils = {
        debounce,
        throttle,
        rafThrottle,
        createDebouncedScrollHandler,
        createThrottledScrollHandler,
        createRAFScrollHandler,
        createDebouncedResizeHandler,
        createDebouncedInputHandler,
        createDebouncedSearchHandler,
        batch,
        once,
        memoize,
        retry
    };
}
