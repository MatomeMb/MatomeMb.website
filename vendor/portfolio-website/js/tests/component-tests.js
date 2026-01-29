/**
 * Component Tests - Following Agile testing hierarchy
 * Unit tests for individual components
 * Integration tests for component interactions
 * Performance tests for rendering optimization
 */

// Import test framework
const { TestFramework, Assert } = require('./test-framework.js');

class ComponentTests {
  constructor() {
    this.testFramework = new TestFramework();
    this.setupTests();
  }

  setupTests() {
    this.setupUnitTests();
    this.setupIntegrationTests();
    this.setupPerformanceTests();
  }

  setupUnitTests() {
    // Test ProjectRenderer component
    this.testFramework.unit('ProjectRenderer should render projects following SRP', () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'test-container';
      document.body.appendChild(mockContainer);
      
      const renderer = new ProjectRenderer('test-container');
      const projects = [
        { id: 1, title: 'Test Project', description: 'Test Description' }
      ];
      
      renderer.renderProjects(projects);
      
      Assert.true(mockContainer.children.length > 0, 'Should render project elements');
      Assert.contains(mockContainer.innerHTML, 'Test Project', 'Should contain project title');
      
      document.body.removeChild(mockContainer);
    });

    // Test State Manager
    this.testFramework.unit('ApplicationState should manage state following Observer pattern', () => {
      const state = new ApplicationState();
      let callbackCalled = false;
      let callbackData = null;
      
      const unsubscribe = state.subscribe('test', (newValue, oldValue) => {
        callbackCalled = true;
        callbackData = { newValue, oldValue };
      });
      
      state.setState('test', 'new value');
      
      Assert.true(callbackCalled, 'Should call observer callback');
      Assert.equal(callbackData.newValue, 'new value', 'Should pass new value to callback');
      Assert.equal(callbackData.oldValue, undefined, 'Should pass old value to callback');
      
      unsubscribe();
    });

    // Test Component Factory
    this.testFramework.unit('ComponentFactory should create components following Factory pattern', () => {
      const factory = new ComponentFactory();
      
      // Register a test component
      class TestComponent {
        constructor(config) {
          this.config = config;
        }
        render() { return document.createElement('div'); }
        dispose() {}
      }
      
      factory.register('test', TestComponent, {});
      
      Assert.true(factory.isRegistered('test'), 'Should register component type');
      
      const component = factory.create('test', { test: 'value' });
      Assert.instanceOf(component, TestComponent, 'Should create component instance');
      Assert.equal(component.config.test, 'value', 'Should pass configuration to component');
    });

    // Test Strategy Pattern
    this.testFramework.unit('SortStrategy should sort data following Strategy pattern', () => {
      const sortStrategy = new SortStrategy('title', 'asc');
      const data = [
        { title: 'Zebra' },
        { title: 'Apple' },
        { title: 'Banana' }
      ];
      
      const sorted = sortStrategy.execute(data);
      
      Assert.equal(sorted[0].title, 'Apple', 'Should sort alphabetically');
      Assert.equal(sorted[1].title, 'Banana', 'Should maintain sort order');
      Assert.equal(sorted[2].title, 'Zebra', 'Should complete sort');
    });

    // Test Decorator Pattern
    this.testFramework.unit('ValidationDecorator should validate data following Decorator pattern', () => {
      class TestComponent {
        render() { return document.createElement('div'); }
        dispose() {}
      }
      
      const component = new TestComponent();
      const decorator = new ValidationDecorator(component, {
        title: [{ type: 'required' }],
        email: [{ type: 'email' }]
      });
      
      const validData = { title: 'Test', email: 'test@example.com' };
      const invalidData = { title: '', email: 'invalid-email' };
      
      Assert.true(decorator.validate(validData), 'Should validate correct data');
      Assert.false(decorator.validate(invalidData), 'Should reject invalid data');
      Assert.true(decorator.getErrors().length > 0, 'Should have validation errors');
    });
  }

  setupIntegrationTests() {
    // Test component interactions
    this.testFramework.integration('Components should interact through state management', () => {
      const state = ApplicationState.getInstance();
      const factory = new ComponentFactory();
      
      // Register dependencies
      factory.registerDependency('stateManager', state);
      
      // Create components that share state
      let component1Updated = false;
      let component2Updated = false;
      
      state.subscribe('sharedData', (newValue) => {
        component1Updated = true;
      });
      
      state.subscribe('sharedData', (newValue) => {
        component2Updated = true;
      });
      
      // Update shared state
      state.setState('sharedData', 'test value');
      
      Assert.true(component1Updated, 'Component 1 should be notified');
      Assert.true(component2Updated, 'Component 2 should be notified');
    });

    // Test rendering pipeline integration
    this.testFramework.integration('Rendering pipeline should work with strategies', () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'test-container';
      document.body.appendChild(mockContainer);
      
      const renderer = new ProjectRenderer('test-container');
      const sortStrategy = new SortStrategy('title', 'asc');
      const filterStrategy = new FilterStrategy('title', 'Test');
      
      const projects = [
        { id: 1, title: 'Test Project 1', description: 'Description 1' },
        { id: 2, title: 'Another Project', description: 'Description 2' },
        { id: 3, title: 'Test Project 2', description: 'Description 3' }
      ];
      
      // Apply strategies
      let filteredProjects = filterStrategy.execute(projects);
      let sortedProjects = sortStrategy.execute(filteredProjects);
      
      // Render
      renderer.renderProjects(sortedProjects);
      
      Assert.true(mockContainer.children.length > 0, 'Should render projects');
      Assert.contains(mockContainer.innerHTML, 'Test Project', 'Should contain filtered projects');
      
      document.body.removeChild(mockContainer);
    });
  }

  setupPerformanceTests() {
    // Test rendering performance
    this.testFramework.performance('ProjectRenderer should render 1000 projects efficiently', () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'test-container';
      document.body.appendChild(mockContainer);
      
      const renderer = new ProjectRenderer('test-container');
      
      // Generate large dataset
      const projects = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        title: `Project ${i}`,
        description: `Description for project ${i}`,
        technologies: ['React', 'Node.js', 'MongoDB']
      }));
      
      // Measure rendering time
      const startTime = performance.now();
      renderer.renderProjects(projects);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      
      Assert.true(renderTime < 100, `Rendering should complete in under 100ms, took ${renderTime}ms`);
      Assert.true(mockContainer.children.length > 0, 'Should render projects');
      
      document.body.removeChild(mockContainer);
    });

    // Test memory usage
    this.testFramework.performance('Components should not leak memory', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Create and dispose many components
      for (let i = 0; i < 100; i++) {
        const state = new ApplicationState();
        const factory = new ComponentFactory();
        
        // Create components
        const components = [];
        for (let j = 0; j < 10; j++) {
          const component = factory.create('test', { id: j });
          components.push(component);
        }
        
        // Dispose components
        components.forEach(component => {
          if (component.dispose) {
            component.dispose();
          }
        });
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Allow some memory increase but not excessive
      Assert.true(memoryIncrease < 1024 * 1024, `Memory increase should be less than 1MB, increased by ${memoryIncrease} bytes`);
    });

    // Test state management performance
    this.testFramework.performance('State management should handle many observers efficiently', () => {
      const state = new ApplicationState();
      
      // Create many observers
      const observers = [];
      for (let i = 0; i < 1000; i++) {
        const observer = (newValue, oldValue) => {
          // Simple observer
        };
        observers.push(state.subscribe('test', observer));
      }
      
      // Measure state update time
      const startTime = performance.now();
      state.setState('test', 'new value');
      const endTime = performance.now();
      
      const updateTime = endTime - startTime;
      
      Assert.true(updateTime < 50, `State update should complete in under 50ms, took ${updateTime}ms`);
      
      // Clean up observers
      observers.forEach(unsubscribe => unsubscribe());
    });
  }

  async runAllTests() {
    return await this.testFramework.runAll();
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ComponentTests = ComponentTests;
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ComponentTests };
}
