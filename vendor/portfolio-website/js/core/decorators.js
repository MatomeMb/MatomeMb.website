/**
 * Decorator Pattern Implementation
 * Enhances component functionality without inheritance
 * Provides composable behavior modifications
 */

/**
 * Base Decorator Class
 */
class ComponentDecorator {
  constructor(component) {
    this.component = component;
  }

  render() {
    return this.component.render();
  }

  dispose() {
    return this.component.dispose();
  }

  // Delegate all other methods to the wrapped component
  get(target, prop) {
    if (prop in this) {
      return this[prop];
    }
    return this.component[prop];
  }
}

/**
 * Validation Decorator
 * Adds input validation to components
 */
class ValidationDecorator extends ComponentDecorator {
  constructor(component, validationRules = {}) {
    super(component);
    this.validationRules = validationRules;
    this.errors = [];
  }

  validate(data) {
    this.errors = [];
    
    for (const [field, rules] of Object.entries(this.validationRules)) {
      const value = data[field];
      
      for (const rule of rules) {
        const error = this.applyRule(field, value, rule);
        if (error) {
          this.errors.push(error);
        }
      }
    }
    
    return this.errors.length === 0;
  }

  applyRule(field, value, rule) {
    switch (rule.type) {
      case 'required':
        if (!value || value.trim() === '') {
          return `${field} is required`;
        }
        break;
      case 'minLength':
        if (value && value.length < rule.value) {
          return `${field} must be at least ${rule.value} characters`;
        }
        break;
      case 'maxLength':
        if (value && value.length > rule.value) {
          return `${field} must be no more than ${rule.value} characters`;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return `${field} must be a valid email address`;
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          return `${field} must be a valid URL`;
        }
        break;
      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          return rule.message || `${field} is invalid`;
        }
        break;
    }
    return null;
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

/**
 * Logging Decorator
 * Adds logging functionality to components
 */
class LoggingDecorator extends ComponentDecorator {
  constructor(component, options = {}) {
    super(component);
    this.options = {
      logLevel: 'info',
      logMethods: ['render', 'dispose'],
      ...options
    };
  }

  render() {
    this.log('render', 'Starting render');
    const result = this.component.render();
    this.log('render', 'Render completed');
    return result;
  }

  dispose() {
    this.log('dispose', 'Starting dispose');
    const result = this.component.dispose();
    this.log('dispose', 'Dispose completed');
    return result;
  }

  log(method, message) {
    if (this.options.logMethods.includes(method)) {
      console[this.options.logLevel](`[${this.constructor.name}] ${method}: ${message}`);
    }
  }
}

/**
 * Caching Decorator
 * Adds caching functionality to components
 */
class CachingDecorator extends ComponentDecorator {
  constructor(component, options = {}) {
    super(component);
    this.options = {
      ttl: 300000, // 5 minutes
      maxSize: 100,
      ...options
    };
    this.cache = new Map();
    this.timestamps = new Map();
  }

  render() {
    const cacheKey = this.generateCacheKey();
    
    if (this.isCacheValid(cacheKey)) {
      this.log('Cache hit');
      return this.cache.get(cacheKey);
    }
    
    this.log('Cache miss, rendering');
    const result = this.component.render();
    
    this.setCache(cacheKey, result);
    return result;
  }

  generateCacheKey() {
    // Simple cache key generation based on component state
    return JSON.stringify({
      component: this.component.constructor.name,
      timestamp: Date.now()
    });
  }

  isCacheValid(key) {
    if (!this.cache.has(key)) return false;
    
    const timestamp = this.timestamps.get(key);
    return Date.now() - timestamp < this.options.ttl;
  }

  setCache(key, value) {
    // Implement LRU cache eviction
    if (this.cache.size >= this.options.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.timestamps.delete(firstKey);
    }
    
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  clearCache() {
    this.cache.clear();
    this.timestamps.clear();
  }

  log(message) {
    if (this.options.logLevel === 'debug') {
      console.debug(`[CachingDecorator] ${message}`);
    }
  }
}

/**
 * Performance Decorator
 * Adds performance monitoring to components
 */
class PerformanceDecorator extends ComponentDecorator {
  constructor(component, options = {}) {
    super(component);
    this.options = {
      trackRenderTime: true,
      trackMemoryUsage: false,
      ...options
    };
    this.metrics = {
      renderCount: 0,
      totalRenderTime: 0,
      averageRenderTime: 0
    };
  }

  render() {
    const startTime = performance.now();
    const startMemory = this.options.trackMemoryUsage ? performance.memory?.usedJSHeapSize : 0;
    
    const result = this.component.render();
    
    const endTime = performance.now();
    const endMemory = this.options.trackMemoryUsage ? performance.memory?.usedJSHeapSize : 0;
    
    this.updateMetrics(endTime - startTime, endMemory - startMemory);
    
    return result;
  }

  updateMetrics(renderTime, memoryDelta) {
    this.metrics.renderCount++;
    this.metrics.totalRenderTime += renderTime;
    this.metrics.averageRenderTime = this.metrics.totalRenderTime / this.metrics.renderCount;
    
    if (this.options.trackMemoryUsage) {
      this.metrics.memoryDelta = memoryDelta;
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = {
      renderCount: 0,
      totalRenderTime: 0,
      averageRenderTime: 0
    };
  }
}

/**
 * Event Decorator
 * Adds event handling capabilities to components
 */
class EventDecorator extends ComponentDecorator {
  constructor(component, options = {}) {
    super(component);
    this.options = {
      autoAttach: true,
      ...options
    };
    this.eventListeners = new Map();
  }

  render() {
    const result = this.component.render();
    
    if (this.options.autoAttach) {
      this.attachEventListeners(result);
    }
    
    return result;
  }

  attachEventListeners(element) {
    // Attach common event listeners
    this.addEventListener(element, 'click', this.handleClick.bind(this));
    this.addEventListener(element, 'mouseenter', this.handleMouseEnter.bind(this));
    this.addEventListener(element, 'mouseleave', this.handleMouseLeave.bind(this));
  }

  addEventListener(element, event, handler) {
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, new Map());
    }
    
    this.eventListeners.get(element).set(event, handler);
    element.addEventListener(event, handler);
  }

  removeEventListener(element, event) {
    const listeners = this.eventListeners.get(element);
    if (listeners && listeners.has(event)) {
      element.removeEventListener(event, listeners.get(event));
      listeners.delete(event);
    }
  }

  handleClick(event) {
    this.emit('click', event);
  }

  handleMouseEnter(event) {
    this.emit('mouseenter', event);
  }

  handleMouseLeave(event) {
    this.emit('mouseleave', event);
  }

  emit(event, data) {
    // Emit custom event
    const customEvent = new CustomEvent(event, {
      detail: data,
      bubbles: true
    });
    
    if (this.component.element) {
      this.component.element.dispatchEvent(customEvent);
    }
  }

  dispose() {
    // Remove all event listeners
    for (const [element, listeners] of this.eventListeners) {
      for (const [event, handler] of listeners) {
        element.removeEventListener(event, handler);
      }
    }
    this.eventListeners.clear();
    
    return this.component.dispose();
  }
}

/**
 * Decorator Factory
 * Creates decorated components
 */
class DecoratorFactory {
  static createValidationDecorator(component, rules) {
    return new ValidationDecorator(component, rules);
  }

  static createLoggingDecorator(component, options) {
    return new LoggingDecorator(component, options);
  }

  static createCachingDecorator(component, options) {
    return new CachingDecorator(component, options);
  }

  static createPerformanceDecorator(component, options) {
    return new PerformanceDecorator(component, options);
  }

  static createEventDecorator(component, options) {
    return new EventDecorator(component, options);
  }

  static createMultipleDecorators(component, decorators) {
    let decoratedComponent = component;
    
    for (const decorator of decorators) {
      decoratedComponent = decorator(decoratedComponent);
    }
    
    return decoratedComponent;
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ComponentDecorator = ComponentDecorator;
  window.ValidationDecorator = ValidationDecorator;
  window.LoggingDecorator = LoggingDecorator;
  window.CachingDecorator = CachingDecorator;
  window.PerformanceDecorator = PerformanceDecorator;
  window.EventDecorator = EventDecorator;
  window.DecoratorFactory = DecoratorFactory;
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ComponentDecorator,
    ValidationDecorator,
    LoggingDecorator,
    CachingDecorator,
    PerformanceDecorator,
    EventDecorator,
    DecoratorFactory
  };
}
