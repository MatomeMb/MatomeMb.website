/**
 * Skills Accordion Component
 * Following Single Responsibility Principle - handles skills accordion functionality
 * 
 * @fileoverview Skills accordion component with smooth animations and state management
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * Skills Accordion class following SRP
 */
class SkillsAccordion {
    constructor() {
        this.accordions = null;
        this.isInitialized = false;
        
        // Bind methods to preserve context
        this.handleAccordionClick = this.handleAccordionClick.bind(this);
    }

    /**
     * Initialize skills accordion component
     * @returns {boolean} True if initialization successful
     */
    initialize() {
        try {
            this.cacheElements();
            this.attachEventListeners();
            this.openAllAccordions();
            this.isInitialized = true;
            console.log('Skills Accordion component initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Skills Accordion component:', error);
            return false;
        }
    }

    /**
     * Cache DOM elements for performance
     * @private
     */
    cacheElements() {
        this.accordions = window.DOMUtils?.querySelectorAll(window.CONFIG?.CSS_CLASSES?.SKILL_ACCORDION) || 
                         document.querySelectorAll('.skill-accordion');
    }

    /**
     * Attach event listeners
     * @private
     */
    attachEventListeners() {
        this.accordions.forEach(accordion => {
            const header = accordion.querySelector('.skill-accordion-header');
            if (header) {
                window.DOMUtils?.addEventListener(header, 'click', this.handleAccordionClick) ||
                header.addEventListener('click', this.handleAccordionClick);
            }
        });
    }

    /**
     * Handle accordion header click
     * @param {Event} event - Click event
     * @private
     */
    handleAccordionClick(event) {
        try {
            const header = event.currentTarget;
            const accordion = header.parentElement;
            this.toggleAccordion(accordion);
        } catch (error) {
            console.error('Error handling accordion click:', error);
        }
    }

    /**
     * Toggle accordion state
     * @param {Element} accordion - Accordion element
     * @private
     */
    toggleAccordion(accordion) {
        if (!accordion) return;

        const content = accordion.querySelector('.skill-accordion-content');
        const icon = accordion.querySelector('.skill-accordion-header i');
        
        if (!content) return;

        const isActive = accordion.classList.contains(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active');
        
        if (isActive) {
            this.closeAccordion(accordion, content, icon);
        } else {
            this.openAccordion(accordion, content, icon);
        }
    }

    /**
     * Open accordion
     * @param {Element} accordion - Accordion element
     * @param {Element} content - Content element
     * @param {Element} icon - Icon element
     * @private
     */
    openAccordion(accordion, content, icon) {
        // Add active class
        window.DOMUtils?.addClass(accordion, window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active') ||
        accordion.classList.add(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active');
        
        // Set content height
        window.DOMUtils?.setStyle(content, 'maxHeight', '600px') ||
        (content.style.maxHeight = '600px');
        
        // Rotate icon
        if (icon) {
            window.DOMUtils?.setStyle(icon, 'transform', 'rotate(180deg)') ||
            (icon.style.transform = 'rotate(180deg)');
        }
    }

    /**
     * Close accordion
     * @param {Element} accordion - Accordion element
     * @param {Element} content - Content element
     * @param {Element} icon - Icon element
     * @private
     */
    closeAccordion(accordion, content, icon) {
        // Remove active class
        window.DOMUtils?.removeClass(accordion, window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active') ||
        accordion.classList.remove(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active');
        
        // Set content height to 0
        window.DOMUtils?.setStyle(content, 'maxHeight', '0') ||
        (content.style.maxHeight = '0');
        
        // Rotate icon back
        if (icon) {
            window.DOMUtils?.setStyle(icon, 'transform', 'rotate(0deg)') ||
            (icon.style.transform = 'rotate(0deg)');
        }
    }

    /**
     * Open all accordions by default
     * @private
     */
    openAllAccordions() {
        this.accordions.forEach(accordion => {
            const content = accordion.querySelector('.skill-accordion-content');
            const icon = accordion.querySelector('.skill-accordion-header i');
            
            if (content) {
                this.openAccordion(accordion, content, icon);
            }
        });
    }

    /**
     * Open specific accordion by index
     * @param {number} index - Accordion index
     * @returns {boolean} True if accordion was opened
     */
    openAccordionByIndex(index) {
        try {
            if (index >= 0 && index < this.accordions.length) {
                const accordion = this.accordions[index];
                const content = accordion.querySelector('.skill-accordion-content');
                const icon = accordion.querySelector('.skill-accordion-header i');
                
                if (content) {
                    this.openAccordion(accordion, content, icon);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error opening accordion by index:', error);
            return false;
        }
    }

    /**
     * Close specific accordion by index
     * @param {number} index - Accordion index
     * @returns {boolean} True if accordion was closed
     */
    closeAccordionByIndex(index) {
        try {
            if (index >= 0 && index < this.accordions.length) {
                const accordion = this.accordions[index];
                const content = accordion.querySelector('.skill-accordion-content');
                const icon = accordion.querySelector('.skill-accordion-header i');
                
                if (content) {
                    this.closeAccordion(accordion, content, icon);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error closing accordion by index:', error);
            return false;
        }
    }

    /**
     * Toggle specific accordion by index
     * @param {number} index - Accordion index
     * @returns {boolean} True if accordion was toggled
     */
    toggleAccordionByIndex(index) {
        try {
            if (index >= 0 && index < this.accordions.length) {
                const accordion = this.accordions[index];
                this.toggleAccordion(accordion);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error toggling accordion by index:', error);
            return false;
        }
    }

    /**
     * Get accordion state by index
     * @param {number} index - Accordion index
     * @returns {boolean|null} True if open, false if closed, null if invalid index
     */
    getAccordionState(index) {
        try {
            if (index >= 0 && index < this.accordions.length) {
                const accordion = this.accordions[index];
                return accordion.classList.contains(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active');
            }
            return null;
        } catch (error) {
            console.error('Error getting accordion state:', error);
            return null;
        }
    }

    /**
     * Get all accordion states
     * @returns {Array<boolean>} Array of accordion states
     */
    getAllAccordionStates() {
        try {
            return Array.from(this.accordions).map(accordion => 
                accordion.classList.contains(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active')
            );
        } catch (error) {
            console.error('Error getting all accordion states:', error);
            return [];
        }
    }

    /**
     * Open all accordions
     * @returns {boolean} True if all accordions were opened
     */
    openAll() {
        try {
            this.accordions.forEach(accordion => {
                const content = accordion.querySelector('.skill-accordion-content');
                const icon = accordion.querySelector('.skill-accordion-header i');
                
                if (content) {
                    this.openAccordion(accordion, content, icon);
                }
            });
            return true;
        } catch (error) {
            console.error('Error opening all accordions:', error);
            return false;
        }
    }

    /**
     * Close all accordions
     * @returns {boolean} True if all accordions were closed
     */
    closeAll() {
        try {
            this.accordions.forEach(accordion => {
                const content = accordion.querySelector('.skill-accordion-content');
                const icon = accordion.querySelector('.skill-accordion-header i');
                
                if (content) {
                    this.closeAccordion(accordion, content, icon);
                }
            });
            return true;
        } catch (error) {
            console.error('Error closing all accordions:', error);
            return false;
        }
    }

    /**
     * Clean up event listeners and resources
     */
    destroy() {
        try {
            // Remove event listeners
            this.accordions.forEach(accordion => {
                const header = accordion.querySelector('.skill-accordion-header');
                if (header) {
                    header.removeEventListener('click', this.handleAccordionClick);
                }
            });

            // Clear references
            this.accordions = null;
            this.isInitialized = false;

            console.log('Skills Accordion component destroyed');
        } catch (error) {
            console.error('Error destroying Skills Accordion component:', error);
        }
    }

    /**
     * Get component status
     * @returns {Object} Component status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            accordionCount: this.accordions ? this.accordions.length : 0,
            openAccordions: this.accordions ? 
                Array.from(this.accordions).filter(accordion => 
                    accordion.classList.contains(window.CONFIG?.CSS_CLASSES?.ACTIVE || 'active')
                ).length : 0
        };
    }
}

/**
 * Export SkillsAccordion class
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsAccordion;
} else {
    // Browser environment
    window.SkillsAccordion = SkillsAccordion;
}
