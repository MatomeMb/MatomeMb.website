/**
 * Strategy Pattern Implementation
 * Provides interchangeable algorithms for different behaviors
 */

/**
 * Base Strategy Interface
 */
class IStrategy {
  execute(data) {
    throw new Error('execute() method must be implemented');
  }
}

/**
 * Sorting Strategies
 */
class SortStrategy extends IStrategy {
  constructor(sortBy = 'title', direction = 'asc') {
    super();
    this.sortBy = sortBy;
    this.direction = direction;
  }

  execute(data) {
    return data.sort((a, b) => {
      let aValue = this.getNestedValue(a, this.sortBy);
      let bValue = this.getNestedValue(b, this.sortBy);
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (this.direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

/**
 * Filter Strategies
 */
class FilterStrategy extends IStrategy {
  constructor(filterBy = 'all', filterValue = '') {
    super();
    this.filterBy = filterBy;
    this.filterValue = filterValue;
  }

  execute(data) {
    if (this.filterBy === 'all' || !this.filterValue) {
      return data;
    }

    return data.filter(item => {
      const value = this.getNestedValue(item, this.filterBy);
      
      if (Array.isArray(value)) {
        return value.some(v => 
          v.toLowerCase().includes(this.filterValue.toLowerCase())
        );
      }
      
      if (typeof value === 'string') {
        return value.toLowerCase().includes(this.filterValue.toLowerCase());
      }
      
      return false;
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

/**
 * Layout Strategies
 */
class LayoutStrategy extends IStrategy {
  constructor(layoutType = 'grid') {
    super();
    this.layoutType = layoutType;
  }

  execute(container, items) {
    switch (this.layoutType) {
      case 'grid':
        return this.applyGridLayout(container, items);
      case 'list':
        return this.applyListLayout(container, items);
      case 'masonry':
        return this.applyMasonryLayout(container, items);
      default:
        return this.applyGridLayout(container, items);
    }
  }

  applyGridLayout(container, items) {
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    return container;
  }

  applyListLayout(container, items) {
    container.className = 'flex flex-col space-y-4';
    return container;
  }

  applyMasonryLayout(container, items) {
    container.className = 'columns-1 md:columns-2 lg:columns-3 gap-6';
    return container;
  }
}

/**
 * Animation Strategies
 */
class AnimationStrategy extends IStrategy {
  constructor(animationType = 'fade') {
    super();
    this.animationType = animationType;
  }

  execute(element, options = {}) {
    const defaultOptions = {
      duration: 300,
      easing: 'ease-in-out',
      delay: 0,
      ...options
    };

    switch (this.animationType) {
      case 'fade':
        return this.fadeIn(element, defaultOptions);
      case 'slide':
        return this.slideIn(element, defaultOptions);
      case 'scale':
        return this.scaleIn(element, defaultOptions);
      case 'bounce':
        return this.bounceIn(element, defaultOptions);
      default:
        return this.fadeIn(element, defaultOptions);
    }
  }

  fadeIn(element, options) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${options.duration}ms ${options.easing}`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, options.delay);
  }

  slideIn(element, options) {
    element.style.transform = 'translateY(20px)';
    element.style.opacity = '0';
    element.style.transition = `transform ${options.duration}ms ${options.easing}, opacity ${options.duration}ms ${options.easing}`;
    
    setTimeout(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    }, options.delay);
  }

  scaleIn(element, options) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = `transform ${options.duration}ms ${options.easing}, opacity ${options.duration}ms ${options.easing}`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    }, options.delay);
  }

  bounceIn(element, options) {
    element.style.transform = 'scale(0.3)';
    element.style.opacity = '0';
    element.style.transition = `transform ${options.duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity ${options.duration}ms ${options.easing}`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    }, options.delay);
  }
}

/**
 * Strategy Context - Manages strategy execution
 */
class StrategyContext {
  constructor(strategy = null) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(data) {
    if (!this.strategy) {
      throw new Error('No strategy set');
    }
    return this.strategy.execute(data);
  }
}

/**
 * Strategy Factory - Creates strategies based on configuration
 */
class StrategyFactory {
  static createSortStrategy(sortBy, direction = 'asc') {
    return new SortStrategy(sortBy, direction);
  }

  static createFilterStrategy(filterBy, filterValue) {
    return new FilterStrategy(filterBy, filterValue);
  }

  static createLayoutStrategy(layoutType) {
    return new LayoutStrategy(layoutType);
  }

  static createAnimationStrategy(animationType) {
    return new AnimationStrategy(animationType);
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.IStrategy = IStrategy;
  window.SortStrategy = SortStrategy;
  window.FilterStrategy = FilterStrategy;
  window.LayoutStrategy = LayoutStrategy;
  window.AnimationStrategy = AnimationStrategy;
  window.StrategyContext = StrategyContext;
  window.StrategyFactory = StrategyFactory;
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IStrategy,
    SortStrategy,
    FilterStrategy,
    LayoutStrategy,
    AnimationStrategy,
    StrategyContext,
    StrategyFactory
  };
}
