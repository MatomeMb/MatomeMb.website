/**
 * Jest Test Results Processor
 * Processes test results and generates reports
 * 
 * @fileoverview Test results processor for enhanced reporting
 * @version 1.0.0
 * @author Matome Mbowene
 */

const fs = require('fs');
const path = require('path');

/**
 * Process test results and generate enhanced reports
 * @param {Object} results - Jest test results
 * @returns {Object} Processed results
 */
function processTestResults(results) {
    const processedResults = {
        ...results,
        summary: generateSummary(results),
        coverage: processCoverage(results),
        performance: processPerformance(results),
        accessibility: processAccessibility(results),
        security: processSecurity(results)
    };

    // Generate detailed reports
    generateDetailedReport(processedResults);
    generateCoverageReport(processedResults);
    generatePerformanceReport(processedResults);

    return processedResults;
}

/**
 * Generate test summary
 * @param {Object} results - Jest test results
 * @returns {Object} Test summary
 */
function generateSummary(results) {
    const { numTotalTests, numPassedTests, numFailedTests, numPendingTests } = results;
    
    return {
        total: numTotalTests,
        passed: numPassedTests,
        failed: numFailedTests,
        pending: numPendingTests,
        successRate: ((numPassedTests / numTotalTests) * 100).toFixed(2),
        duration: results.startTime ? Date.now() - results.startTime : 0
    };
}

/**
 * Process coverage information
 * @param {Object} results - Jest test results
 * @returns {Object} Coverage summary
 */
function processCoverage(results) {
    const coverage = results.coverageMap || {};
    const coverageSummary = coverage.getCoverageSummary ? coverage.getCoverageSummary() : {};
    
    return {
        statements: coverageSummary.statements || { pct: 0 },
        branches: coverageSummary.branches || { pct: 0 },
        functions: coverageSummary.functions || { pct: 0 },
        lines: coverageSummary.lines || { pct: 0 },
        overall: calculateOverallCoverage(coverageSummary)
    };
}

/**
 * Process performance metrics
 * @param {Object} results - Jest test results
 * @returns {Object} Performance summary
 */
function processPerformance(results) {
    const testResults = results.testResults || [];
    const performanceTests = testResults.filter(test => 
        test.title.includes('Performance') || test.title.includes('performance')
    );
    
    return {
        totalPerformanceTests: performanceTests.length,
        passedPerformanceTests: performanceTests.filter(test => test.status === 'passed').length,
        averageExecutionTime: calculateAverageExecutionTime(testResults),
        slowestTest: findSlowestTest(testResults)
    };
}

/**
 * Process accessibility test results
 * @param {Object} results - Jest test results
 * @returns {Object} Accessibility summary
 */
function processAccessibility(results) {
    const testResults = results.testResults || [];
    const accessibilityTests = testResults.filter(test => 
        test.title.includes('Accessibility') || 
        test.title.includes('ARIA') || 
        test.title.includes('keyboard')
    );
    
    return {
        totalAccessibilityTests: accessibilityTests.length,
        passedAccessibilityTests: accessibilityTests.filter(test => test.status === 'passed').length,
        complianceScore: calculateComplianceScore(accessibilityTests)
    };
}

/**
 * Process security test results
 * @param {Object} results - Jest test results
 * @returns {Object} Security summary
 */
function processSecurity(results) {
    const testResults = results.testResults || [];
    const securityTests = testResults.filter(test => 
        test.title.includes('Security') || 
        test.title.includes('XSS') || 
        test.title.includes('validation')
    );
    
    return {
        totalSecurityTests: securityTests.length,
        passedSecurityTests: securityTests.filter(test => test.status === 'passed').length,
        securityScore: calculateSecurityScore(securityTests)
    };
}

/**
 * Calculate overall coverage percentage
 * @param {Object} coverageSummary - Coverage summary object
 * @returns {number} Overall coverage percentage
 */
function calculateOverallCoverage(coverageSummary) {
    const { statements, branches, functions, lines } = coverageSummary;
    if (!statements || !branches || !functions || !lines) return 0;
    
    return ((statements.pct + branches.pct + functions.pct + lines.pct) / 4).toFixed(2);
}

/**
 * Calculate average execution time
 * @param {Array} testResults - Array of test results
 * @returns {number} Average execution time in milliseconds
 */
function calculateAverageExecutionTime(testResults) {
    const times = testResults
        .filter(test => test.perfStats)
        .map(test => test.perfStats.end - test.perfStats.start);
    
    if (times.length === 0) return 0;
    
    return (times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(2);
}

/**
 * Find the slowest test
 * @param {Array} testResults - Array of test results
 * @returns {Object} Slowest test information
 */
function findSlowestTest(testResults) {
    let slowest = null;
    let maxTime = 0;
    
    testResults.forEach(test => {
        if (test.perfStats) {
            const duration = test.perfStats.end - test.perfStats.start;
            if (duration > maxTime) {
                maxTime = duration;
                slowest = {
                    title: test.title,
                    duration: duration,
                    file: test.testFilePath
                };
            }
        }
    });
    
    return slowest;
}

/**
 * Calculate accessibility compliance score
 * @param {Array} accessibilityTests - Array of accessibility test results
 * @returns {number} Compliance score percentage
 */
function calculateComplianceScore(accessibilityTests) {
    if (accessibilityTests.length === 0) return 0;
    
    const passed = accessibilityTests.filter(test => test.status === 'passed').length;
    return ((passed / accessibilityTests.length) * 100).toFixed(2);
}

/**
 * Calculate security score
 * @param {Array} securityTests - Array of security test results
 * @returns {number} Security score percentage
 */
function calculateSecurityScore(securityTests) {
    if (securityTests.length === 0) return 0;
    
    const passed = securityTests.filter(test => test.status === 'passed').length;
    return ((passed / securityTests.length) * 100).toFixed(2);
}

/**
 * Generate detailed test report
 * @param {Object} processedResults - Processed test results
 */
function generateDetailedReport(processedResults) {
    const reportPath = path.join(__dirname, '..', '..', 'test-report.json');
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: processedResults.summary,
        coverage: processedResults.coverage,
        performance: processedResults.performance,
        accessibility: processedResults.accessibility,
        security: processedResults.security,
        recommendations: generateRecommendations(processedResults)
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Detailed test report generated: ${reportPath}`);
}

/**
 * Generate coverage report
 * @param {Object} processedResults - Processed test results
 */
function generateCoverageReport(processedResults) {
    const coveragePath = path.join(__dirname, '..', '..', 'coverage-report.md');
    
    const coverage = processedResults.coverage;
    const report = `# Test Coverage Report

Generated: ${new Date().toISOString()}

## Coverage Summary

| Metric | Coverage | Status |
|--------|----------|--------|
| Statements | ${coverage.statements.pct}% | ${coverage.statements.pct >= 80 ? '✅' : '❌'} |
| Branches | ${coverage.branches.pct}% | ${coverage.branches.pct >= 80 ? '✅' : '❌'} |
| Functions | ${coverage.functions.pct}% | ${coverage.functions.pct >= 80 ? '✅' : '❌'} |
| Lines | ${coverage.lines.pct}% | ${coverage.lines.pct >= 80 ? '✅' : '❌'} |
| **Overall** | **${coverage.overall}%** | **${coverage.overall >= 80 ? '✅' : '❌'}** |

## Recommendations

${coverage.overall < 80 ? '⚠️ Coverage is below 80%. Consider adding more tests.' : '✅ Coverage meets requirements.'}
`;
    
    fs.writeFileSync(coveragePath, report);
    console.log(`📈 Coverage report generated: ${coveragePath}`);
}

/**
 * Generate performance report
 * @param {Object} processedResults - Processed test results
 */
function generatePerformanceReport(processedResults) {
    const performancePath = path.join(__dirname, '..', '..', 'performance-report.md');
    
    const performance = processedResults.performance;
    const report = `# Performance Test Report

Generated: ${new Date().toISOString()}

## Performance Summary

- **Total Performance Tests**: ${performance.totalPerformanceTests}
- **Passed Performance Tests**: ${performance.passedPerformanceTests}
- **Average Execution Time**: ${performance.averageExecutionTime}ms
- **Slowest Test**: ${performance.slowestTest ? performance.slowestTest.title : 'N/A'}

## Performance Metrics

${performance.slowestTest ? `### Slowest Test
- **Test**: ${performance.slowestTest.title}
- **Duration**: ${performance.slowestTest.duration}ms
- **File**: ${performance.slowestTest.file}
` : ''}

## Recommendations

${performance.averageExecutionTime > 1000 ? '⚠️ Average execution time is high. Consider optimizing tests.' : '✅ Performance is within acceptable limits.'}
`;
    
    fs.writeFileSync(performancePath, report);
    console.log(`⚡ Performance report generated: ${performancePath}`);
}

/**
 * Generate recommendations based on test results
 * @param {Object} processedResults - Processed test results
 * @returns {Array} Array of recommendations
 */
function generateRecommendations(processedResults) {
    const recommendations = [];
    
    // Coverage recommendations
    if (processedResults.coverage.overall < 80) {
        recommendations.push({
            type: 'coverage',
            priority: 'high',
            message: 'Test coverage is below 80%. Add more tests to improve coverage.',
            action: 'Write additional unit tests for uncovered code paths.'
        });
    }
    
    // Performance recommendations
    if (processedResults.performance.averageExecutionTime > 1000) {
        recommendations.push({
            type: 'performance',
            priority: 'medium',
            message: 'Test execution time is high. Consider optimizing slow tests.',
            action: 'Review and optimize test performance, especially slow tests.'
        });
    }
    
    // Accessibility recommendations
    if (processedResults.accessibility.complianceScore < 90) {
        recommendations.push({
            type: 'accessibility',
            priority: 'high',
            message: 'Accessibility compliance is below 90%. Improve ARIA attributes and keyboard navigation.',
            action: 'Add more accessibility tests and improve ARIA implementation.'
        });
    }
    
    // Security recommendations
    if (processedResults.security.securityScore < 95) {
        recommendations.push({
            type: 'security',
            priority: 'high',
            message: 'Security test score is below 95%. Review security implementations.',
            action: 'Strengthen input validation and security measures.'
        });
    }
    
    return recommendations;
}

module.exports = processTestResults;
