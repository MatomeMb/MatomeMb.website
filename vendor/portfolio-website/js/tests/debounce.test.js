/**
 * Debounce Utilities Test Suite
 * Testing debouncing and throttling functions for performance optimization
 * 
 * @fileoverview Unit tests for debounce, throttle, and performance utilities
 * @version 1.0.0
 * @author Matome Mbowene
 */

// Import debounce utilities
const DebounceUtils = require('../utils/debounce.js');

describe('Debounce Utilities', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('debounce', () => {
        test('should debounce function calls', () => {
            const mockFn = jest.fn();
            const debouncedFn = DebounceUtils.debounce(mockFn, 100);

            // Call function multiple times quickly
            debouncedFn();
            debouncedFn();
            debouncedFn();

            // Function should not be called yet
            expect(mockFn).not.toHaveBeenCalled();

            // Fast-forward time
            jest.advanceTimersByTime(100);

            // Function should be called once
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should call function immediately when immediate is true', () => {
            const mockFn = jest.fn();
            const debouncedFn = DebounceUtils.debounce(mockFn, 100, true);

            debouncedFn();

            // Function should be called immediately
            expect(mockFn).toHaveBeenCalledTimes(1);

            // Additional calls should be debounced
            debouncedFn();
            debouncedFn();

            jest.advanceTimersByTime(100);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should pass arguments correctly', () => {
            const mockFn = jest.fn();
            const debouncedFn = DebounceUtils.debounce(mockFn, 100);

            debouncedFn('arg1', 'arg2');
            jest.advanceTimersByTime(100);

            expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
        });

        test('should maintain context (this)', () => {
            const context = { value: 'test' };
            const mockFn = jest.fn(function() {
                return this.value;
            });
            const debouncedFn = DebounceUtils.debounce(mockFn, 100);

            debouncedFn.call(context);
            jest.advanceTimersByTime(100);

            expect(mockFn).toHaveBeenCalledWith();
        });

        test('should throw error for invalid function', () => {
            expect(() => DebounceUtils.debounce('not-a-function', 100)).toThrow(TypeError);
            expect(() => DebounceUtils.debounce(null, 100)).toThrow(TypeError);
        });

        test('should throw error for invalid wait time', () => {
            const mockFn = jest.fn();
            expect(() => DebounceUtils.debounce(mockFn, -1)).toThrow(TypeError);
            expect(() => DebounceUtils.debounce(mockFn, 'invalid')).toThrow(TypeError);
        });
    });

    describe('throttle', () => {
        test('should throttle function calls', () => {
            const mockFn = jest.fn();
            const throttledFn = DebounceUtils.throttle(mockFn, 100);

            // Call function multiple times quickly
            throttledFn();
            throttledFn();
            throttledFn();

            // Function should be called once immediately
            expect(mockFn).toHaveBeenCalledTimes(1);

            // Fast-forward time
            jest.advanceTimersByTime(100);

            // Call again
            throttledFn();
            expect(mockFn).toHaveBeenCalledTimes(2);
        });

        test('should pass arguments correctly', () => {
            const mockFn = jest.fn();
            const throttledFn = DebounceUtils.throttle(mockFn, 100);

            throttledFn('arg1', 'arg2');
            jest.advanceTimersByTime(100);
            throttledFn('arg3', 'arg4');

            expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
            expect(mockFn).toHaveBeenCalledWith('arg3', 'arg4');
        });

        test('should throw error for invalid function', () => {
            expect(() => DebounceUtils.throttle('not-a-function', 100)).toThrow(TypeError);
        });

        test('should throw error for invalid limit', () => {
            const mockFn = jest.fn();
            expect(() => DebounceUtils.throttle(mockFn, -1)).toThrow(TypeError);
        });
    });

    describe('rafThrottle', () => {
        test('should throttle using requestAnimationFrame', () => {
            const mockFn = jest.fn();
            const rafThrottledFn = DebounceUtils.rafThrottle(mockFn);

            // Mock requestAnimationFrame
            const mockRAF = jest.fn((callback) => {
                setTimeout(callback, 16); // ~60fps
            });
            global.requestAnimationFrame = mockRAF;

            rafThrottledFn();
            rafThrottledFn();
            rafThrottledFn();

            // Should only schedule one RAF call
            expect(mockRAF).toHaveBeenCalledTimes(1);

            // Execute the callback
            jest.advanceTimersByTime(16);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should throw error for invalid function', () => {
            expect(() => DebounceUtils.rafThrottle('not-a-function')).toThrow(TypeError);
        });
    });

    describe('createDebouncedScrollHandler', () => {
        test('should create debounced scroll handler', () => {
            const mockHandler = jest.fn();
            const debouncedHandler = DebounceUtils.createDebouncedScrollHandler(mockHandler, 16);

            expect(typeof debouncedHandler).toBe('function');

            // Test the handler
            debouncedHandler();
            debouncedHandler();
            debouncedHandler();

            expect(mockHandler).not.toHaveBeenCalled();

            jest.advanceTimersByTime(16);
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('createThrottledScrollHandler', () => {
        test('should create throttled scroll handler', () => {
            const mockHandler = jest.fn();
            const throttledHandler = DebounceUtils.createThrottledScrollHandler(mockHandler, 16);

            expect(typeof throttledHandler).toBe('function');

            // Test the handler
            throttledHandler();
            throttledHandler();
            throttledHandler();

            expect(mockHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('createRAFScrollHandler', () => {
        test('should create RAF throttled scroll handler', () => {
            const mockHandler = jest.fn();
            const rafHandler = DebounceUtils.createRAFScrollHandler(mockHandler);

            expect(typeof rafHandler).toBe('function');
        });
    });

    describe('createDebouncedResizeHandler', () => {
        test('should create debounced resize handler', () => {
            const mockHandler = jest.fn();
            const debouncedHandler = DebounceUtils.createDebouncedResizeHandler(mockHandler, 250);

            expect(typeof debouncedHandler).toBe('function');

            // Test the handler
            debouncedHandler();
            debouncedHandler();

            expect(mockHandler).not.toHaveBeenCalled();

            jest.advanceTimersByTime(250);
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('createDebouncedInputHandler', () => {
        test('should create debounced input handler', () => {
            const mockHandler = jest.fn();
            const debouncedHandler = DebounceUtils.createDebouncedInputHandler(mockHandler, 300);

            expect(typeof debouncedHandler).toBe('function');

            // Test the handler
            debouncedHandler();
            debouncedHandler();

            expect(mockHandler).not.toHaveBeenCalled();

            jest.advanceTimersByTime(300);
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('createDebouncedSearchHandler', () => {
        test('should create debounced search handler', () => {
            const mockHandler = jest.fn();
            const debouncedHandler = DebounceUtils.createDebouncedSearchHandler(mockHandler, 500);

            expect(typeof debouncedHandler).toBe('function');

            // Test the handler
            debouncedHandler();
            debouncedHandler();

            expect(mockHandler).not.toHaveBeenCalled();

            jest.advanceTimersByTime(500);
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('batch', () => {
        test('should batch multiple function calls', () => {
            const mockFn = jest.fn();
            const batchedFn = DebounceUtils.batch(mockFn, 100);

            // Call function multiple times
            batchedFn('arg1');
            batchedFn('arg2');
            batchedFn('arg3');

            expect(mockFn).not.toHaveBeenCalled();

            jest.advanceTimersByTime(100);

            // Function should be called once with all arguments
            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(mockFn).toHaveBeenCalledWith(['arg1', 'arg2', 'arg3']);
        });

        test('should throw error for invalid function', () => {
            expect(() => DebounceUtils.batch('not-a-function', 100)).toThrow(TypeError);
        });
    });

    describe('once', () => {
        test('should call function only once', () => {
            const mockFn = jest.fn();
            const onceFn = DebounceUtils.once(mockFn);

            onceFn();
            onceFn();
            onceFn();

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should return same result on subsequent calls', () => {
            const mockFn = jest.fn(() => 'result');
            const onceFn = DebounceUtils.once(mockFn);

            const result1 = onceFn();
            const result2 = onceFn();
            const result3 = onceFn();

            expect(result1).toBe('result');
            expect(result2).toBe('result');
            expect(result3).toBe('result');
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should throw error for invalid function', () => {
            expect(() => DebounceUtils.once('not-a-function')).toThrow(TypeError);
        });
    });

    describe('memoize', () => {
        test('should memoize function results', () => {
            const mockFn = jest.fn((x) => x * 2);
            const memoizedFn = DebounceUtils.memoize(mockFn);

            const result1 = memoizedFn(5);
            const result2 = memoizedFn(5);
            const result3 = memoizedFn(5);

            expect(result1).toBe(10);
            expect(result2).toBe(10);
            expect(result3).toBe(10);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should use custom key generator', () => {
            const mockFn = jest.fn((x, y) => x + y);
            const keyGenerator = (x, y) => `${x}-${y}`;
            const memoizedFn = DebounceUtils.memoize(mockFn, keyGenerator);

            const result1 = memoizedFn(1, 2);
            const result2 = memoizedFn(1, 2);

            expect(result1).toBe(3);
            expect(result2).toBe(3);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should throw error for invalid function', () => {
            expect(() => DebounceUtils.memoize('not-a-function')).toThrow(TypeError);
        });
    });

    describe('retry', () => {
        test('should retry failed function calls', async () => {
            let attempts = 0;
            const mockFn = jest.fn(async () => {
                attempts++;
                if (attempts < 3) {
                    throw new Error('Temporary failure');
                }
                return 'success';
            });

            const retryFn = DebounceUtils.retry(mockFn, 3, 100);

            const result = await retryFn();

            expect(result).toBe('success');
            expect(mockFn).toHaveBeenCalledTimes(3);
        });

        test('should throw error after max retries', async () => {
            const mockFn = jest.fn(async () => {
                throw new Error('Permanent failure');
            });

            const retryFn = DebounceUtils.retry(mockFn, 2, 100);

            await expect(retryFn()).rejects.toThrow('Permanent failure');
            expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });

        test('should throw error for invalid function', () => {
            expect(() => DebounceUtils.retry('not-a-function', 3, 100)).toThrow(TypeError);
        });
    });

    describe('Performance Tests', () => {
        test('debounce should be efficient', () => {
            const mockFn = jest.fn();
            const debouncedFn = DebounceUtils.debounce(mockFn, 0);

            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                debouncedFn();
            }
            const end = performance.now();

            expect(end - start).toBeLessThan(50); // Should complete quickly
        });

        test('throttle should be efficient', () => {
            const mockFn = jest.fn();
            const throttledFn = DebounceUtils.throttle(mockFn, 0);

            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                throttledFn();
            }
            const end = performance.now();

            expect(end - start).toBeLessThan(50); // Should complete quickly
        });
    });

    describe('Edge Cases', () => {
        test('should handle zero delay', () => {
            const mockFn = jest.fn();
            const debouncedFn = DebounceUtils.debounce(mockFn, 0);

            debouncedFn();
            jest.advanceTimersByTime(0);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should handle very large delay', () => {
            const mockFn = jest.fn();
            const debouncedFn = DebounceUtils.debounce(mockFn, 10000);

            debouncedFn();
            jest.advanceTimersByTime(10000);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should handle function with no arguments', () => {
            const mockFn = jest.fn();
            const debouncedFn = DebounceUtils.debounce(mockFn, 100);

            debouncedFn();
            jest.advanceTimersByTime(100);

            expect(mockFn).toHaveBeenCalledWith();
        });
    });
});

module.exports = {
    DebounceUtils
};
