/**
 * Application State Manager - Observer Pattern Implementation
 * Follows Singleton pattern for global state management
 * Implements Observer pattern for reactive updates
 */

class ApplicationState {
  constructor() {
    if (ApplicationState.instance) {
      return ApplicationState.instance;
    }

    this.observers = new Map();
    this.state = new Map();
    this.history = [];
    this.maxHistorySize = 50;
    
    ApplicationState.instance = this;
  }

  /**
   * Get singleton instance
   * @returns {ApplicationState} Singleton instance
   */
  static getInstance() {
    if (!ApplicationState.instance) {
      ApplicationState.instance = new ApplicationState();
    }
    return ApplicationState.instance;
  }

  /**
   * Subscribe to state changes (Observer pattern)
   * @param {string} key - State key to observe
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    
    this.observers.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const observers = this.observers.get(key);
      if (observers) {
        observers.delete(callback);
        if (observers.size === 0) {
          this.observers.delete(key);
        }
      }
    };
  }

  /**
   * Unsubscribe from state changes
   * @param {string} key - State key
   * @param {Function} callback - Callback function
   */
  unsubscribe(key, callback) {
    const observers = this.observers.get(key);
    if (observers) {
      observers.delete(callback);
      if (observers.size === 0) {
        this.observers.delete(key);
      }
    }
  }

  /**
   * Set state value and notify observers
   * @param {string} key - State key
   * @param {any} value - New value
   * @param {boolean} silent - Skip notification if true
   */
  setState(key, value, silent = false) {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    
    // Add to history for time-travel debugging
    this.addToHistory(key, oldValue, value);
    
    if (!silent) {
      this.notify(key, value, oldValue);
    }
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} State value
   */
  getState(key, defaultValue = null) {
    return this.state.has(key) ? this.state.get(key) : defaultValue;
  }

  /**
   * Get all state as object
   * @returns {Object} Complete state object
   */
  getAllState() {
    const stateObj = {};
    for (const [key, value] of this.state) {
      stateObj[key] = value;
    }
    return stateObj;
  }

  /**
   * Notify observers of state change
   * @param {string} key - State key
   * @param {any} newValue - New value
   * @param {any} oldValue - Old value
   */
  notify(key, newValue, oldValue) {
    const observers = this.observers.get(key);
    if (observers) {
      observers.forEach(callback => {
        try {
          callback(newValue, oldValue, key);
        } catch (error) {
          console.error(`Error in state observer for key "${key}":`, error);
        }
      });
    }
  }

  /**
   * Add state change to history
   * @param {string} key - State key
   * @param {any} oldValue - Old value
   * @param {any} newValue - New value
   */
  addToHistory(key, oldValue, newValue) {
    this.history.push({
      key,
      oldValue,
      newValue,
      timestamp: Date.now()
    });

    // Maintain history size limit
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Get state change history
   * @param {string} key - Optional key to filter history
   * @returns {Array} History array
   */
  getHistory(key = null) {
    if (key) {
      return this.history.filter(entry => entry.key === key);
    }
    return [...this.history];
  }

  /**
   * Clear all state and observers
   */
  clear() {
    this.state.clear();
    this.observers.clear();
    this.history = [];
  }

  /**
   * Reset to previous state (time-travel debugging)
   * @param {number} steps - Number of steps to go back
   */
  timeTravel(steps = 1) {
    const historyLength = this.history.length;
    if (steps > historyLength) {
      console.warn('Cannot time travel beyond available history');
      return;
    }

    // Get the state at the specified step back
    const targetIndex = historyLength - steps;
    const targetEntry = this.history[targetIndex];
    
    if (targetEntry) {
      this.setState(targetEntry.key, targetEntry.oldValue, true);
    }
  }
}

// Create global state instance
const globalState = ApplicationState.getInstance();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ApplicationState = ApplicationState;
  window.globalState = globalState;
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApplicationState, globalState };
}
