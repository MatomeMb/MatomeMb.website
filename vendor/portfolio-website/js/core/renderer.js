/**
 * Performance-Optimized Renderer - Data-Oriented Design
 * Implements efficient rendering pipeline with virtual DOM concepts
 * Optimized for CPU cache efficiency and minimal DOM manipulation
 */

class ProjectRenderer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      batchSize: 50,
      useVirtualScrolling: true,
      enableCaching: true,
      ...options
    };
    
    this.projects = [];
    this.renderCache = new Map();
    this.visibleRange = { start: 0, end: 0 };
    this.itemHeight = 200; // Estimated item height for virtual scrolling
    this.containerHeight = 0;
    this.scrollTop = 0;
    
    this.init();
  }

  /**
   * Initialize renderer
   */
  init() {
    if (!this.container) {
      throw new Error(`Container with id "${this.containerId}" not found`);
    }
    
    this.containerHeight = this.container.clientHeight;
    this.setupVirtualScrolling();
    this.setupEventListeners();
  }

  /**
   * Set up virtual scrolling for performance
   */
  setupVirtualScrolling() {
    if (!this.options.useVirtualScrolling) return;
    
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.style.height = '100%';
    this.scrollContainer.style.overflow = 'auto';
    this.scrollContainer.style.position = 'relative';
    
    this.viewport = document.createElement('div');
    this.viewport.style.position = 'relative';
    this.viewport.style.height = '100%';
    
    this.scrollContainer.appendChild(this.viewport);
    this.container.appendChild(this.scrollContainer);
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    if (this.options.useVirtualScrolling) {
      this.scrollContainer.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    // Resize observer for responsive updates
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
      this.resizeObserver.observe(this.container);
    }
  }

  /**
   * Render projects with data-oriented approach
   * @param {Array} projects - Array of project data
   */
  renderProjects(projects) {
    this.projects = projects;
    
    // Use requestAnimationFrame for batched DOM updates
    requestAnimationFrame(() => {
      this.batchRenderProjects();
    });
  }

  /**
   * Batch render projects for optimal performance
   */
  batchRenderProjects() {
    if (this.options.useVirtualScrolling) {
      this.renderVirtualProjects();
    } else {
      this.renderAllProjects();
    }
  }

  /**
   * Render all projects (non-virtual scrolling)
   */
  renderAllProjects() {
    const fragment = document.createDocumentFragment();
    
    // Process projects in batches for better performance
    const batchSize = this.options.batchSize;
    let currentBatch = 0;
    
    const processBatch = () => {
      const start = currentBatch * batchSize;
      const end = Math.min(start + batchSize, this.projects.length);
      
      for (let i = start; i < end; i++) {
        const element = this.createProjectElement(this.projects[i], i);
        fragment.appendChild(element);
      }
      
      currentBatch++;
      
      if (end < this.projects.length) {
        // Process next batch
        requestAnimationFrame(processBatch);
      } else {
        // All batches processed, update DOM
        this.updateDOM(fragment);
      }
    };
    
    processBatch();
  }

  /**
   * Render projects with virtual scrolling
   */
  renderVirtualProjects() {
    this.updateVisibleRange();
    
    const fragment = document.createDocumentFragment();
    const totalHeight = this.projects.length * this.itemHeight;
    
    // Set total height for scrollbar
    this.viewport.style.height = `${totalHeight}px`;
    
    // Render only visible items
    for (let i = this.visibleRange.start; i < this.visibleRange.end; i++) {
      const element = this.createProjectElement(this.projects[i], i);
      element.style.position = 'absolute';
      element.style.top = `${i * this.itemHeight}px`;
      element.style.width = '100%';
      fragment.appendChild(element);
    }
    
    this.updateDOM(fragment);
  }

  /**
   * Update visible range for virtual scrolling
   */
  updateVisibleRange() {
    const containerHeight = this.scrollContainer.clientHeight;
    const scrollTop = this.scrollContainer.scrollTop;
    
    const start = Math.floor(scrollTop / this.itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / this.itemHeight) + 1,
      this.projects.length
    );
    
    this.visibleRange = { start, end };
  }

  /**
   * Create project element with caching
   * @param {Object} project - Project data
   * @param {number} index - Project index
   * @returns {HTMLElement} Project element
   */
  createProjectElement(project, index) {
    const cacheKey = `${project.id || index}_${JSON.stringify(project)}`;
    
    if (this.options.enableCaching && this.renderCache.has(cacheKey)) {
      return this.renderCache.get(cacheKey).cloneNode(true);
    }
    
    const element = this.buildProjectElement(project);
    
    if (this.options.enableCaching) {
      this.renderCache.set(cacheKey, element.cloneNode(true));
    }
    
    return element;
  }

  /**
   * Build project element structure
   * @param {Object} project - Project data
   * @returns {HTMLElement} Project element
   */
  buildProjectElement(project) {
    const element = document.createElement('div');
    element.className = 'project-card glass rounded-lg p-8 mb-8';
    element.setAttribute('data-project-id', project.id || '');
    
    // Use data-oriented approach for efficient rendering
    element.innerHTML = this.generateProjectHTML(project);
    
    // Add event listeners
    this.attachProjectEventListeners(element, project);
    
    return element;
  }

  /**
   * Generate project HTML efficiently
   * @param {Object} project - Project data
   * @returns {string} HTML string
   */
  generateProjectHTML(project) {
    return `
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-2xl font-bold text-white">${this.escapeHtml(project.title)}</h3>
        <div class="flex space-x-2">
          ${project.technologies.map(tech => 
            `<span class="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">${this.escapeHtml(tech)}</span>`
          ).join('')}
        </div>
      </div>
      
      <p class="text-gray-300 mb-4">${this.escapeHtml(project.description)}</p>
      
      <div class="text-sm text-gray-400">
        <strong>Repository:</strong> 
        <a href="${this.escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" 
           class="text-primary hover:text-blue-300 hover:underline transition-colors">
          ${this.escapeHtml(project.repository)}
        </a><br>
        <strong>Status:</strong> ${this.escapeHtml(project.status)}
      </div>
    `;
  }

  /**
   * Attach event listeners to project element
   * @param {HTMLElement} element - Project element
   * @param {Object} project - Project data
   */
  attachProjectEventListeners(element, project) {
    // Add click handler for project details
    element.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        this.handleProjectClick(project);
      }
    });
    
    // Add hover effects
    element.addEventListener('mouseenter', () => {
      element.classList.add('hover:scale-105');
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove('hover:scale-105');
    });
  }

  /**
   * Handle project click
   * @param {Object} project - Project data
   */
  handleProjectClick(project) {
    // Emit custom event for project selection
    const event = new CustomEvent('projectSelected', {
      detail: { project },
      bubbles: true
    });
    this.container.dispatchEvent(event);
  }

  /**
   * Update DOM efficiently
   * @param {DocumentFragment} fragment - Document fragment
   */
  updateDOM(fragment) {
    if (this.options.useVirtualScrolling) {
      // Clear existing content
      this.viewport.innerHTML = '';
      this.viewport.appendChild(fragment);
    } else {
      // Replace all content
      this.container.innerHTML = '';
      this.container.appendChild(fragment);
    }
  }

  /**
   * Handle scroll event for virtual scrolling
   */
  handleScroll() {
    if (!this.options.useVirtualScrolling) return;
    
    // Throttle scroll handling
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = setTimeout(() => {
      this.renderVirtualProjects();
    }, 16); // ~60fps
  }

  /**
   * Handle resize event
   */
  handleResize() {
    this.containerHeight = this.container.clientHeight;
    this.renderVirtualProjects();
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Clear render cache
   */
  clearCache() {
    this.renderCache.clear();
  }

  /**
   * Dispose of renderer resources
   */
  dispose() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.clearCache();
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ProjectRenderer = ProjectRenderer;
}

// Node.js environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProjectRenderer };
}
