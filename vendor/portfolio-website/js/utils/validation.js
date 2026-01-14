/**
 * Input Validation Utilities
 * Following defensive programming principles and security best practices
 * 
 * @fileoverview Comprehensive input validation with security checks
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * Validates chat input for security and length constraints
 * @param {string} input - User's chat message
 * @returns {boolean} True if valid, false otherwise
 * @throws {TypeError} If input is not a string
 */
function validateChatInput(input) {
    // Type checking
    if (typeof input !== 'string') {
        throw new TypeError('Input must be a string');
    }

    // Length validation
    if (input.length === 0) {
        return false;
    }

    if (input.length > window.CONFIG?.CHAT_CONFIG?.MAX_MESSAGE_LENGTH || 500) {
        return false;
    }

    // Trim whitespace and check if empty after trimming
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
        return false;
    }

    return true;
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input safe for display
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }

    // Remove potentially dangerous characters and HTML tags
    return input
        .replace(/[<>]/g, '') // Remove < and > characters
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
}

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates phone number format (basic international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
function validatePhone(phone) {
    if (typeof phone !== 'string') {
        return false;
    }

    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Check if it starts with + and has 10-15 digits
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(cleaned);
}

/**
 * Checks for blocked words in content
 * @param {string} content - Content to check
 * @returns {boolean} True if content contains blocked words
 */
function containsBlockedWords(content) {
    if (typeof content !== 'string') {
        return false;
    }

    const blockedWords = window.CONFIG?.SECURITY_CONFIG?.CONTENT_FILTER?.BLOCKED_WORDS || 
                        ['spam', 'inappropriate', 'malicious'];
    
    const lowerContent = content.toLowerCase();
    return blockedWords.some(word => lowerContent.includes(word.toLowerCase()));
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL format
 */
function validateUrl(url) {
    if (typeof url !== 'string') {
        return false;
    }

    try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
        return false;
    }
}

/**
 * Validates that a value is within a numeric range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if value is within range
 */
function validateNumericRange(value, min, max) {
    if (typeof value !== 'number' || isNaN(value)) {
        return false;
    }

    return value >= min && value <= max;
}

/**
 * Validates DOM element selector
 * @param {string} selector - CSS selector to validate
 * @returns {boolean} True if selector is safe
 */
function validateSelector(selector) {
    if (typeof selector !== 'string') {
        return false;
    }

    // Basic validation - no dangerous characters
    const dangerousChars = /[<>'"&]/;
    return !dangerousChars.test(selector) && selector.length > 0;
}

/**
 * Rate limiting validation
 * @param {Object} rateLimitData - Rate limiting data object
 * @param {number} rateLimitData.lastRequest - Timestamp of last request
 * @param {number} rateLimitData.delay - Minimum delay between requests
 * @returns {boolean} True if request is allowed
 */
function validateRateLimit(rateLimitData) {
    if (!rateLimitData || typeof rateLimitData !== 'object') {
        return true; // No rate limiting data, allow request
    }

    const { lastRequest, delay } = rateLimitData;
    const now = Date.now();

    if (typeof lastRequest !== 'number' || typeof delay !== 'number') {
        return true; // Invalid data, allow request
    }

    return (now - lastRequest) >= delay;
}

/**
 * Validates configuration object
 * @param {Object} config - Configuration object to validate
 * @param {Array<string>} requiredKeys - Array of required keys
 * @returns {boolean} True if configuration is valid
 */
function validateConfig(config, requiredKeys = []) {
    if (!config || typeof config !== 'object') {
        return false;
    }

    return requiredKeys.every(key => key in config);
}

/**
 * Validates that a function is callable
 * @param {*} fn - Value to check if it's a function
 * @returns {boolean} True if value is a function
 */
function validateFunction(fn) {
    return typeof fn === 'function';
}

/**
 * Validates that an element exists in the DOM
 * @param {string|Element} element - Element or selector to validate
 * @returns {boolean} True if element exists
 */
function validateElementExists(element) {
    if (!element) {
        return false;
    }

    if (typeof element === 'string') {
        return document.querySelector(element) !== null;
    }

    if (element instanceof Element) {
        return document.contains(element);
    }

    return false;
}

/**
 * Comprehensive input validation for chat messages
 * @param {string} input - Chat message input
 * @returns {Object} Validation result with success status and error message
 */
function validateChatMessage(input) {
    try {
        // Basic validation
        if (!validateChatInput(input)) {
            return {
                success: false,
                error: 'Invalid input: Message must be between 1 and 500 characters'
            };
        }

        // Security validation
        if (containsBlockedWords(input)) {
            return {
                success: false,
                error: window.CONFIG?.SECURITY_CONFIG?.CONTENT_FILTER?.MESSAGE || 
                       'Your message contains inappropriate content.'
            };
        }

        // Sanitize input
        const sanitized = sanitizeInput(input);

        return {
            success: true,
            sanitizedInput: sanitized,
            error: null
        };

    } catch (error) {
        console.error('Validation error:', error);
        return {
            success: false,
            error: 'Validation failed due to an unexpected error'
        };
    }
}

/**
 * Export validation functions
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateChatInput,
        sanitizeInput,
        validateEmail,
        validatePhone,
        containsBlockedWords,
        validateUrl,
        validateNumericRange,
        validateSelector,
        validateRateLimit,
        validateConfig,
        validateFunction,
        validateElementExists,
        validateChatMessage
    };
} else {
    // Browser environment
    window.ValidationUtils = {
        validateChatInput,
        sanitizeInput,
        validateEmail,
        validatePhone,
        containsBlockedWords,
        validateUrl,
        validateNumericRange,
        validateSelector,
        validateRateLimit,
        validateConfig,
        validateFunction,
        validateElementExists,
        validateChatMessage
    };
}
