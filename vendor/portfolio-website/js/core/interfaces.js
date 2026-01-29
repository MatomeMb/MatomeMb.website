/**
 * Core Interfaces - Following Interface Segregation Principle (ISP)
 * Each interface defines a specific responsibility
 */

// Base component interface following ISP
class IComponent {
  /**
   * Render the component to DOM
   * @returns {HTMLElement} The rendered element
   */
  render() {
    throw new Error('render() method must be implemented');
  }

  /**
   * Clean up resources and event listeners
   */
  dispose() {
    throw new Error('dispose() method must be implemented');
  }
}

// Stateful component interface - SRP focused
class IStatefulComponent extends IComponent {
  /**
   * Set component state
   * @param {any} state - New state object
   */
  setState(state) {
    throw new Error('setState() method must be implemented');
  }

  /**
   * Get current component state
   * @returns {any} Current state
   */
  getState() {
    throw new Error('getState() method must be implemented');
  }
}

// Event emitter interface - SRP focused
class IEventEmitter extends IComponent {
  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  on(event, handler) {
    throw new Error('on() method must be implemented');
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  off(event, handler) {
    throw new Error('off() method must be implemented');
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    throw new Error('emit() method must be implemented');
  }
}

// Renderable interface for components that can be rendered
class IRenderable {
  /**
   * Render to string or DOM
   * @returns {string|HTMLElement} Rendered content
   */
  render() {
    throw new Error('render() method must be implemented');
  }
}

// Configurable interface for components that accept configuration
class IConfigurable {
  /**
   * Configure the component
   * @param {Object} config - Configuration object
   */
  configure(config) {
    throw new Error('configure() method must be implemented');
  }
}

// Disposable interface for resource cleanup
class IDisposable {
  /**
   * Dispose of resources
   */
  dispose() {
    throw new Error('dispose() method must be implemented');
  }
}

// Export interfaces for use in other modules
if (typeof window !== 'undefined') {
  window.IComponent = IComponent;
  window.IStatefulComponent = IStatefulComponent;
  window.IEventEmitter = IEventEmitter;
  window.IRenderable = IRenderable;
  window.IConfigurable = IConfigurable;
  window.IDisposable = IDisposable;
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IComponent,
    IStatefulComponent,
    IEventEmitter,
    IRenderable,
    IConfigurable,
    IDisposable
  };
}
