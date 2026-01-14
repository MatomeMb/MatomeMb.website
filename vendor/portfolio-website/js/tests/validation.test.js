/**
 * Validation Utilities Test Suite
 * Following testing best practices for critical security functions
 * 
 * @fileoverview Unit tests for input validation and security functions
 * @version 1.0.0
 * @author Matome Mbowene
 */

// Mock the CONFIG object for testing
const mockConfig = {
    CHAT_CONFIG: {
        MAX_MESSAGE_LENGTH: 500
    },
    SECURITY_CONFIG: {
        CONTENT_FILTER: {
            BLOCKED_WORDS: ['spam', 'inappropriate', 'malicious']
        }
    }
};

// Mock window.CONFIG for browser environment
if (typeof window !== 'undefined') {
    window.CONFIG = mockConfig;
}

// Import validation utilities (adjust path as needed)
const ValidationUtils = require('../utils/validation.js');

describe('Validation Utilities', () => {
    describe('validateChatInput', () => {
        test('should accept valid input', () => {
            const validInput = 'Hello, how are you?';
            expect(ValidationUtils.validateChatInput(validInput)).toBe(true);
        });

        test('should reject empty input', () => {
            expect(ValidationUtils.validateChatInput('')).toBe(false);
            expect(ValidationUtils.validateChatInput('   ')).toBe(false);
        });

        test('should reject input over max length', () => {
            const longInput = 'a'.repeat(501);
            expect(ValidationUtils.validateChatInput(longInput)).toBe(false);
        });

        test('should reject non-string input', () => {
            expect(() => ValidationUtils.validateChatInput(123)).toThrow(TypeError);
            expect(() => ValidationUtils.validateChatInput(null)).toThrow(TypeError);
            expect(() => ValidationUtils.validateChatInput(undefined)).toThrow(TypeError);
        });

        test('should accept input at max length', () => {
            const maxLengthInput = 'a'.repeat(500);
            expect(ValidationUtils.validateChatInput(maxLengthInput)).toBe(true);
        });
    });

    describe('sanitizeInput', () => {
        test('should remove dangerous HTML tags', () => {
            const maliciousInput = '<script>alert("xss")</script>Hello';
            const sanitized = ValidationUtils.sanitizeInput(maliciousInput);
            expect(sanitized).toBe('alert("xss")Hello');
            expect(sanitized).not.toContain('<script>');
        });

        test('should remove javascript: protocol', () => {
            const maliciousInput = 'javascript:alert("xss")';
            const sanitized = ValidationUtils.sanitizeInput(maliciousInput);
            expect(sanitized).toBe('alert("xss")');
        });

        test('should remove event handlers', () => {
            const maliciousInput = '<img onerror="alert(1)" src="x">';
            const sanitized = ValidationUtils.sanitizeInput(maliciousInput);
            expect(sanitized).not.toContain('onerror');
        });

        test('should handle non-string input', () => {
            expect(ValidationUtils.sanitizeInput(123)).toBe('');
            expect(ValidationUtils.sanitizeInput(null)).toBe('');
        });
    });

    describe('containsBlockedWords', () => {
        test('should detect blocked words', () => {
            expect(ValidationUtils.containsBlockedWords('This is spam content')).toBe(true);
            expect(ValidationUtils.containsBlockedWords('inappropriate material')).toBe(true);
            expect(ValidationUtils.containsBlockedWords('malicious code')).toBe(true);
        });

        test('should not flag clean content', () => {
            expect(ValidationUtils.containsBlockedWords('Hello, how are you?')).toBe(false);
            expect(ValidationUtils.containsBlockedWords('Great project!')).toBe(false);
        });

        test('should be case insensitive', () => {
            expect(ValidationUtils.containsBlockedWords('SPAM content')).toBe(true);
            expect(ValidationUtils.containsBlockedWords('Inappropriate')).toBe(true);
        });
    });

    describe('validateEmail', () => {
        test('should validate correct email formats', () => {
            expect(ValidationUtils.validateEmail('test@example.com')).toBe(true);
            expect(ValidationUtils.validateEmail('user.name@domain.co.uk')).toBe(true);
            expect(ValidationUtils.validateEmail('user+tag@example.org')).toBe(true);
        });

        test('should reject invalid email formats', () => {
            expect(ValidationUtils.validateEmail('invalid-email')).toBe(false);
            expect(ValidationUtils.validateEmail('@example.com')).toBe(false);
            expect(ValidationUtils.validateEmail('test@')).toBe(false);
            expect(ValidationUtils.validateEmail('')).toBe(false);
        });
    });

    describe('validatePhone', () => {
        test('should validate correct phone formats', () => {
            expect(ValidationUtils.validatePhone('+27000000000')).toBe(true);
            expect(ValidationUtils.validatePhone('0123456789')).toBe(true);
            expect(ValidationUtils.validatePhone('+1-555-123-4567')).toBe(true);
        });

        test('should reject invalid phone formats', () => {
            expect(ValidationUtils.validatePhone('123')).toBe(false);
            expect(ValidationUtils.validatePhone('abc-def-ghij')).toBe(false);
            expect(ValidationUtils.validatePhone('')).toBe(false);
        });
    });

    describe('validateChatMessage', () => {
        test('should validate clean message', () => {
            const result = ValidationUtils.validateChatMessage('Hello, how are you?');
            expect(result.success).toBe(true);
            expect(result.sanitizedInput).toBe('Hello, how are you?');
            expect(result.error).toBeNull();
        });

        test('should reject message with blocked words', () => {
            const result = ValidationUtils.validateChatMessage('This is spam content');
            expect(result.success).toBe(false);
            expect(result.error).toContain('inappropriate content');
        });

        test('should reject empty message', () => {
            const result = ValidationUtils.validateChatMessage('');
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid input');
        });

        test('should sanitize malicious input', () => {
            const result = ValidationUtils.validateChatMessage('<script>alert("xss")</script>Hello');
            expect(result.success).toBe(true);
            expect(result.sanitizedInput).not.toContain('<script>');
        });
    });

    describe('validateRateLimit', () => {
        test('should allow request after delay', () => {
            const rateLimitData = {
                lastRequest: Date.now() - 2000, // 2 seconds ago
                delay: 1000 // 1 second delay
            };
            expect(ValidationUtils.validateRateLimit(rateLimitData)).toBe(true);
        });

        test('should block request within delay', () => {
            const rateLimitData = {
                lastRequest: Date.now() - 500, // 0.5 seconds ago
                delay: 1000 // 1 second delay
            };
            expect(ValidationUtils.validateRateLimit(rateLimitData)).toBe(false);
        });

        test('should allow request with no rate limit data', () => {
            expect(ValidationUtils.validateRateLimit(null)).toBe(true);
            expect(ValidationUtils.validateRateLimit({})).toBe(true);
        });
    });
});

// Performance tests
describe('Performance Tests', () => {
    test('validateChatInput should be fast', () => {
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            ValidationUtils.validateChatInput('Test message');
        }
        const end = performance.now();
        expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    test('sanitizeInput should be fast', () => {
        const maliciousInput = '<script>alert("xss")</script>Hello World';
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            ValidationUtils.sanitizeInput(maliciousInput);
        }
        const end = performance.now();
        expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });
});

// Edge case tests
describe('Edge Cases', () => {
    test('should handle very long strings efficiently', () => {
        const longString = 'a'.repeat(10000);
        expect(() => ValidationUtils.validateChatInput(longString)).not.toThrow();
    });

    test('should handle special characters', () => {
        const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        expect(ValidationUtils.validateChatInput(specialChars)).toBe(true);
    });

    test('should handle unicode characters', () => {
        const unicodeString = 'Hello 世界 🌍';
        expect(ValidationUtils.validateChatInput(unicodeString)).toBe(true);
    });
});

module.exports = {
    ValidationUtils
};
