/**
 * Component Factory - Factory Pattern Implementation
 * Creates components based on configuration
 * Implements Dependency Injection for loose coupling
 */

class ComponentFactory {
  constructor() {
    this.componentRegistry = new Map();
    this.dependencyContainer = new Map();
    this.componentInstances = new WeakMap();
  }

  /**
   * Register a component type
   * @param {string} type - Component type identifier
   * @param {Function} ComponentClass - Component constructor
   * @param {Object} dependencies - Required dependencies
   */
  register(type, ComponentClass, dependencies = {}) {
    this.componentRegistry.set(type, {
      constructor: ComponentClass,
      dependencies: dependencies
    });
  }

  /**
   * Register a dependency for injection
   * @param {string} name - Dependency name
   * @param {any} instance - Dependency instance
   */
  registerDependency(name, instance) {
    this.dependencyContainer.set(name, instance);
  }

  /**
   * Create a component instance
   * @param {string} type - Component type
   * @param {Object} config - Component configuration
   * @param {Object} options - Creation options
   * @returns {IComponent} Component instance
   */
  create(type, config = {}, options = {}) {
    const componentInfo = this.componentRegistry.get(type);
    
    if (!componentInfo) {
      throw new Error(`Component type "${type}" not registered`);
    }

    // Resolve dependencies
    const resolvedDependencies = this.resolveDependencies(componentInfo.dependencies);
    
    // Merge config with resolved dependencies
    const finalConfig = { ...config, ...resolvedDependencies };
    
    // Create component instance
    const instance = new componentInfo.constructor(finalConfig);
    
    // Store instance for potential reuse
    if (options.singleton) {
      this.componentInstances.set(instance, instance);
    }
    
    return instance;
  }

  /**
   * Resolve component dependencies
   * @param {Object} dependencies - Dependency map
   * @returns {Object} Resolved dependencies
   */
  resolveDependencies(dependencies) {
    const resolved = {};
    
    for (const [key, dependencyName] of Object.entries(dependencies)) {
      if (this.dependencyContainer.has(dependencyName)) {
        resolved[key] = this.dependencyContainer.get(dependencyName);
      } else {
        console.warn(`Dependency "${dependencyName}" not found for key "${key}"`);
      }
    }
    
    return resolved;
  }

  /**
   * Create multiple components of the same type
   * @param {string} type - Component type
   * @param {Array} configs - Array of configurations
   * @param {Object} options - Creation options
   * @returns {Array} Array of component instances
   */
  createMultiple(type, configs, options = {}) {
    return configs.map(config => this.create(type, config, options));
  }

  /**
   * Create component with builder pattern
   * @param {string} type - Component type
   * @returns {ComponentBuilder} Builder instance
   */
  builder(type) {
    return new ComponentBuilder(this, type);
  }

  /**
   * Get registered component types
   * @returns {Array} Array of registered types
   */
  getRegisteredTypes() {
    return Array.from(this.componentRegistry.keys());
  }

  /**
   * Check if component type is registered
   * @param {string} type - Component type
   * @returns {boolean} True if registered
   */
  isRegistered(type) {
    return this.componentRegistry.has(type);
  }

  /**
   * Unregister a component type
   * @param {string} type - Component type
   */
  unregister(type) {
    this.componentRegistry.delete(type);
  }

  /**
   * Clear all registrations
   */
  clear() {
    this.componentRegistry.clear();
    this.dependencyContainer.clear();
  }
}

/**
 * Component Builder - Builder Pattern for complex component creation
 */
class ComponentBuilder {
  constructor(factory, type) {
    this.factory = factory;
    this.type = type;
    this.config = {};
    this.options = {};
  }

  /**
   * Set component configuration
   * @param {Object} config - Configuration object
   * @returns {ComponentBuilder} Builder instance
   */
  withConfig(config) {
    this.config = { ...this.config, ...config };
    return this;
  }

  /**
   * Set creation options
   * @param {Object} options - Options object
   * @returns {ComponentBuilder} Builder instance
   */
  withOptions(options) {
    this.options = { ...this.options, ...options };
    return this;
  }

  /**
   * Set a specific config property
   * @param {string} key - Property key
   * @param {any} value - Property value
   * @returns {ComponentBuilder} Builder instance
   */
  set(key, value) {
    this.config[key] = value;
    return this;
  }

  /**
   * Build the component
   * @returns {IComponent} Component instance
   */
  build() {
    return this.factory.create(this.type, this.config, this.options);
  }
}

// Create global factory instance
const componentFactory = new ComponentFactory();

// Register core dependencies
componentFactory.registerDependency('stateManager', globalState);
componentFactory.registerDependency('eventBus', new EventTarget());

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ComponentFactory = ComponentFactory;
  window.ComponentBuilder = ComponentBuilder;
  window.componentFactory = componentFactory;
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ComponentFactory, ComponentBuilder, componentFactory };
}
