/**
 * Project Filter Component
 * Following Single Responsibility Principle - handles project filtering functionality
 * 
 * @fileoverview Project filter component with smooth animations and category management
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * Project Filter class following SRP
 */
class ProjectFilter {
    constructor() {
        this.projectFilters = null;
        this.projectCards = null;
        this.isInitialized = false;
        this.activeFilter = 'all';
        
        // Bind methods to preserve context
        this.handleFilterClick = this.handleFilterClick.bind(this);
    }

    /**
     * Initialize project filter component
     * @returns {boolean} True if initialization successful
     */
    initialize() {
        try {
            this.cacheElements();
            this.attachEventListeners();
            this.setActiveFilter('all');
            this.isInitialized = true;
            console.log('Project Filter component initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Project Filter component:', error);
            return false;
        }
    }

    /**
     * Cache DOM elements for performance
     * @private
     */
    cacheElements() {
        this.projectFilters = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.PROJECT_FILTERS) || 
                             document.querySelectorAll('.project-filter');
        this.projectCards = window.DOMUtils?.querySelectorAll(window.CONFIG?.SELECTORS?.PROJECT_CARDS) || 
                           document.querySelectorAll('.project-card');
    }

    /**
     * Attach event listeners
     * @private
     */
    attachEventListeners() {
        this.projectFilters.forEach(filter => {
            window.DOMUtils?.addEventListener(filter, 'click', this.handleFilterClick) ||
            filter.addEventListener('click', this.handleFilterClick);
        });
    }

    /**
     * Handle filter click
     * @param {Event} event - Click event
     * @private
     */
    handleFilterClick(event) {
        try {
            const filter = event.currentTarget;
            const filterValue = filter.getAttribute('data-filter');
            
            if (filterValue) {
                this.setActiveFilter(filterValue);
                this.filterProjects(filterValue);
            }
        } catch (error) {
            console.error('Error handling filter click:', error);
        }
    }

    /**
     * Set active filter
     * @param {string} filterValue - Filter value
     * @private
     */
    setActiveFilter(filterValue) {
        this.activeFilter = filterValue;
        
        // Update filter buttons
        this.projectFilters.forEach(filter => {
            const isActive = filter.getAttribute('data-filter') === filterValue;
            
            if (isActive) {
                window.DOMUtils?.addClass(filter, window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active') ||
                filter.classList.add(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active');
            } else {
                window.DOMUtils?.removeClass(filter, window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active') ||
                filter.classList.remove(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active');
            }
        });
    }

    /**
     * Filter projects based on category
     * @param {string} filterValue - Filter value
     * @private
     */
    filterProjects(filterValue) {
        try {
            this.projectCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || cardCategory === filterValue;
                
                if (shouldShow) {
                    this.showProjectCard(card, index);
                } else {
                    this.hideProjectCard(card);
                }
            });
        } catch (error) {
            console.error('Error filtering projects:', error);
        }
    }

    /**
     * Show project card with animation
     * @param {Element} card - Project card element
     * @param {number} index - Card index for staggered animation
     * @private
     */
    showProjectCard(card, index) {
        // Set display to block first
        window.DOMUtils?.setStyle(card, 'display', 'block') ||
        (card.style.display = 'block');
        
        // Set initial state for animation
        window.DOMUtils?.setStyle(card, 'opacity', '0') ||
        (card.style.opacity = '0');
        window.DOMUtils?.setStyle(card, 'transform', 'translateY(20px)') ||
        (card.style.transform = 'translateY(20px)');
        
        // Animate in with staggered delay
        const delay = index * 50; // 50ms stagger
        setTimeout(() => {
            window.DOMUtils?.setStyle(card, 'transition', 'all 0.5s ease') ||
            (card.style.transition = 'all 0.5s ease');
            window.DOMUtils?.setStyle(card, 'opacity', '1') ||
            (card.style.opacity = '1');
            window.DOMUtils?.setStyle(card, 'transform', 'translateY(0)') ||
            (card.style.transform = 'translateY(0)');
        }, delay);
    }

    /**
     * Hide project card with animation
     * @param {Element} card - Project card element
     * @private
     */
    hideProjectCard(card) {
        // Animate out
        window.DOMUtils?.setStyle(card, 'transition', 'all 0.3s ease') ||
        (card.style.transition = 'all 0.3s ease');
        window.DOMUtils?.setStyle(card, 'opacity', '0') ||
        (card.style.opacity = '0');
        window.DOMUtils?.setStyle(card, 'transform', 'translateY(-20px)') ||
        (card.style.transform = 'translateY(-20px)');
        
        // Hide after animation
        setTimeout(() => {
            window.DOMUtils?.setStyle(card, 'display', 'none') ||
            (card.style.display = 'none');
        }, 300);
    }

    /**
     * Get available filter categories
     * @returns {Array<string>} Array of available categories
     */
    getAvailableCategories() {
        try {
            const categories = new Set();
            this.projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (category) {
                    categories.add(category);
                }
            });
            return Array.from(categories);
        } catch (error) {
            console.error('Error getting available categories:', error);
            return [];
        }
    }

    /**
     * Get projects by category
     * @param {string} category - Category to filter by
     * @returns {Array<Element>} Array of project cards in category
     */
    getProjectsByCategory(category) {
        try {
            return Array.from(this.projectCards).filter(card => 
                card.getAttribute('data-category') === category
            );
        } catch (error) {
            console.error('Error getting projects by category:', error);
            return [];
        }
    }

    /**
     * Get all visible projects
     * @returns {Array<Element>} Array of currently visible project cards
     */
    getVisibleProjects() {
        try {
            return Array.from(this.projectCards).filter(card => 
                card.style.display !== 'none' && 
                card.style.opacity !== '0'
            );
        } catch (error) {
            console.error('Error getting visible projects:', error);
            return [];
        }
    }

    /**
     * Get current active filter
     * @returns {string} Current active filter value
     */
    getActiveFilter() {
        return this.activeFilter;
    }

    /**
     * Set filter programmatically
     * @param {string} filterValue - Filter value to set
     * @returns {boolean} True if filter was set successfully
     */
    setFilter(filterValue) {
        try {
            if (!filterValue || typeof filterValue !== 'string') {
                console.warn('Invalid filter value provided');
                return false;
            }

            this.setActiveFilter(filterValue);
            this.filterProjects(filterValue);
            return true;
        } catch (error) {
            console.error('Error setting filter:', error);
            return false;
        }
    }

    /**
     * Reset filter to show all projects
     * @returns {boolean} True if filter was reset successfully
     */
    resetFilter() {
        return this.setFilter('all');
    }

    /**
     * Get filter statistics
     * @returns {Object} Filter statistics
     */
    getFilterStats() {
        try {
            const stats = {
                totalProjects: this.projectCards.length,
                visibleProjects: this.getVisibleProjects().length,
                activeFilter: this.activeFilter,
                availableCategories: this.getAvailableCategories()
            };

            // Count projects per category
            stats.projectsPerCategory = {};
            stats.availableCategories.forEach(category => {
                stats.projectsPerCategory[category] = this.getProjectsByCategory(category).length;
            });

            return stats;
        } catch (error) {
            console.error('Error getting filter stats:', error);
            return {
                totalProjects: 0,
                visibleProjects: 0,
                activeFilter: 'all',
                availableCategories: [],
                projectsPerCategory: {}
            };
        }
    }

    /**
     * Refresh filter component (useful for dynamic content)
     * @returns {boolean} True if refresh was successful
     */
    refresh() {
        try {
            this.cacheElements();
            this.attachEventListeners();
            this.setActiveFilter(this.activeFilter);
            this.filterProjects(this.activeFilter);
            return true;
        } catch (error) {
            console.error('Error refreshing filter component:', error);
            return false;
        }
    }

    /**
     * Clean up event listeners and resources
     */
    destroy() {
        try {
            // Remove event listeners
            this.projectFilters.forEach(filter => {
                filter.removeEventListener('click', this.handleFilterClick);
            });

            // Clear references
            this.projectFilters = null;
            this.projectCards = null;
            this.isInitialized = false;
            this.activeFilter = 'all';

            console.log('Project Filter component destroyed');
        } catch (error) {
            console.error('Error destroying Project Filter component:', error);
        }
    }

    /**
     * Get component status
     * @returns {Object} Component status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            activeFilter: this.activeFilter,
            filterCount: this.projectFilters ? this.projectFilters.length : 0,
            projectCount: this.projectCards ? this.projectCards.length : 0,
            visibleProjectCount: this.getVisibleProjects().length
        };
    }
}

/**
 * Export ProjectFilter class
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectFilter;
} else {
    // Browser environment
    window.ProjectFilter = ProjectFilter;
}
