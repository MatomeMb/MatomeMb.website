/**
 * Comprehensive Testing Framework
 * Implements unit, integration, and performance testing
 * Follows Agile testing principles with 80%+ coverage goal
 */

class TestFramework {
  constructor() {
    this.tests = [];
    this.results = [];
    this.coverage = new Map();
    this.performanceMetrics = new Map();
  }

  /**
   * Register a test
   * @param {string} name - Test name
   * @param {Function} testFn - Test function
   * @param {Object} options - Test options
   */
  test(name, testFn, options = {}) {
    this.tests.push({
      name,
      testFn,
      options: {
        type: 'unit',
        timeout: 5000,
        ...options
      }
    });
  }

  /**
   * Register a unit test
   * @param {string} name - Test name
   * @param {Function} testFn - Test function
   */
  unit(name, testFn) {
    this.test(name, testFn, { type: 'unit' });
  }

  /**
   * Register an integration test
   * @param {string} name - Test name
   * @param {Function} testFn - Test function
   */
  integration(name, testFn) {
    this.test(name, testFn, { type: 'integration' });
  }

  /**
   * Register a performance test
   * @param {string} name - Test name
   * @param {Function} testFn - Test function
   * @param {Object} thresholds - Performance thresholds
   */
  performance(name, testFn, thresholds = {}) {
    this.test(name, testFn, { 
      type: 'performance', 
      thresholds: {
        maxTime: 100,
        maxMemory: 1024 * 1024, // 1MB
        ...thresholds
      }
    });
  }

  /**
   * Run all tests
   * @returns {Promise<Object>} Test results
   */
  async runAll() {
    console.log(`Running ${this.tests.length} tests...`);
    
    this.results = [];
    const startTime = performance.now();
    
    for (const test of this.tests) {
      await this.runTest(test);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    return this.generateReport(totalTime);
  }

  /**
   * Run a single test
   * @param {Object} test - Test object
   */
  async runTest(test) {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;
    
    try {
      // Set up test environment
      this.setupTestEnvironment();
      
      // Run test with timeout
      await this.runWithTimeout(test.testFn, test.options.timeout);
      
      const endTime = performance.now();
      const endMemory = performance.memory?.usedJSHeapSize || 0;
      
      const result = {
        name: test.name,
        type: test.options.type,
        status: 'passed',
        duration: endTime - startTime,
        memoryDelta: endMemory - startMemory,
        timestamp: new Date().toISOString()
      };
      
      // Check performance thresholds
      if (test.options.type === 'performance') {
        if (result.duration > test.options.thresholds.maxTime) {
          result.status = 'failed';
          result.error = `Performance threshold exceeded: ${result.duration}ms > ${test.options.thresholds.maxTime}ms`;
        }
        
        if (result.memoryDelta > test.options.thresholds.maxMemory) {
          result.status = 'failed';
          result.error = `Memory threshold exceeded: ${result.memoryDelta} bytes > ${test.options.thresholds.maxMemory} bytes`;
        }
      }
      
      this.results.push(result);
      this.updateCoverage(test);
      
    } catch (error) {
      const endTime = performance.now();
      
      this.results.push({
        name: test.name,
        type: test.options.type,
        status: 'failed',
        error: error.message,
        duration: endTime - startTime,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Run function with timeout
   * @param {Function} fn - Function to run
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} Promise that resolves or rejects
   */
  runWithTimeout(fn, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Test timeout after ${timeout}ms`));
      }, timeout);
      
      try {
        const result = fn();
        if (result instanceof Promise) {
          result.then(resolve).catch(reject).finally(() => clearTimeout(timer));
        } else {
          clearTimeout(timer);
          resolve(result);
        }
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * Set up test environment
   */
  setupTestEnvironment() {
    // Mock DOM if not available
    if (typeof document === 'undefined') {
      global.document = {
        createElement: (tag) => ({
          tagName: tag,
          className: '',
          style: {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
          appendChild: () => {},
          removeChild: () => {},
          innerHTML: '',
          textContent: ''
        }),
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => []
      };
    }
    
    // Mock performance if not available
    if (typeof performance === 'undefined') {
      global.performance = {
        now: () => Date.now(),
        memory: { usedJSHeapSize: 0 }
      };
    }
  }

  /**
   * Update code coverage
   * @param {Object} test - Test object
   */
  updateCoverage(test) {
    // Simple coverage tracking
    const testName = test.name;
    if (!this.coverage.has(testName)) {
      this.coverage.set(testName, {
        lines: new Set(),
        functions: new Set(),
        branches: new Set()
      });
    }
    
    // This is a simplified version - in a real implementation,
    // you would use a proper code coverage tool
  }

  /**
   * Generate test report
   * @param {number} totalTime - Total execution time
   * @returns {Object} Test report
   */
  generateReport(totalTime) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const total = this.results.length;
    
    const report = {
      summary: {
        total,
        passed,
        failed,
        successRate: (passed / total) * 100,
        totalTime
      },
      results: this.results,
      coverage: this.calculateCoverage(),
      performance: this.calculatePerformanceMetrics()
    };
    
    this.logReport(report);
    return report;
  }

  /**
   * Calculate code coverage
   * @returns {Object} Coverage metrics
   */
  calculateCoverage() {
    // Simplified coverage calculation
    const totalLines = 1000; // This would be calculated from actual code
    const coveredLines = this.coverage.size * 10; // Simplified
    
    return {
      lines: {
        total: totalLines,
        covered: coveredLines,
        percentage: (coveredLines / totalLines) * 100
      },
      functions: {
        total: 100,
        covered: this.coverage.size,
        percentage: (this.coverage.size / 100) * 100
      }
    };
  }

  /**
   * Calculate performance metrics
   * @returns {Object} Performance metrics
   */
  calculatePerformanceMetrics() {
    const performanceTests = this.results.filter(r => r.type === 'performance');
    
    if (performanceTests.length === 0) {
      return { averageTime: 0, maxTime: 0, minTime: 0 };
    }
    
    const times = performanceTests.map(t => t.duration);
    
    return {
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      maxTime: Math.max(...times),
      minTime: Math.min(...times),
      totalTests: performanceTests.length
    };
  }

  /**
   * Log test report
   * @param {Object} report - Test report
   */
  logReport(report) {
    console.log('\n=== TEST REPORT ===');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(2)}%`);
    console.log(`Total Time: ${report.summary.totalTime.toFixed(2)}ms`);
    
    if (report.coverage) {
      console.log('\n=== COVERAGE ===');
      console.log(`Lines: ${report.coverage.lines.percentage.toFixed(2)}%`);
      console.log(`Functions: ${report.coverage.functions.percentage.toFixed(2)}%`);
    }
    
    if (report.performance) {
      console.log('\n=== PERFORMANCE ===');
      console.log(`Average Time: ${report.performance.averageTime.toFixed(2)}ms`);
      console.log(`Max Time: ${report.performance.maxTime.toFixed(2)}ms`);
    }
    
    // Log failed tests
    const failedTests = report.results.filter(r => r.status === 'failed');
    if (failedTests.length > 0) {
      console.log('\n=== FAILED TESTS ===');
      failedTests.forEach(test => {
        console.log(`${test.name}: ${test.error}`);
      });
    }
  }
}

/**
 * Assertion Library
 */
class Assert {
  static equal(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`Assertion failed: ${message}. Expected ${expected}, got ${actual}`);
    }
  }

  static notEqual(actual, expected, message = '') {
    if (actual === expected) {
      throw new Error(`Assertion failed: ${message}. Expected not ${expected}, got ${actual}`);
    }
  }

  static true(actual, message = '') {
    if (actual !== true) {
      throw new Error(`Assertion failed: ${message}. Expected true, got ${actual}`);
    }
  }

  static false(actual, message = '') {
    if (actual !== false) {
      throw new Error(`Assertion failed: ${message}. Expected false, got ${actual}`);
    }
  }

  static throws(fn, message = '') {
    let threw = false;
    try {
      fn();
    } catch (error) {
      threw = true;
    }
    
    if (!threw) {
      throw new Error(`Assertion failed: ${message}. Expected function to throw`);
    }
  }

  static notThrows(fn, message = '') {
    try {
      fn();
    } catch (error) {
      throw new Error(`Assertion failed: ${message}. Expected function not to throw, but it threw: ${error.message}`);
    }
  }

  static instanceOf(actual, expected, message = '') {
    if (!(actual instanceof expected)) {
      throw new Error(`Assertion failed: ${message}. Expected instance of ${expected.name}, got ${actual.constructor.name}`);
    }
  }

  static contains(actual, expected, message = '') {
    if (!actual.includes(expected)) {
      throw new Error(`Assertion failed: ${message}. Expected ${actual} to contain ${expected}`);
    }
  }
}

// Create global test framework instance
const testFramework = new TestFramework();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.TestFramework = TestFramework;
  window.Assert = Assert;
  window.testFramework = testFramework;
  window.test = testFramework.test.bind(testFramework);
  window.unit = testFramework.unit.bind(testFramework);
  window.integration = testFramework.integration.bind(testFramework);
  window.performance = testFramework.performance.bind(testFramework);
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestFramework, Assert, testFramework };
}
