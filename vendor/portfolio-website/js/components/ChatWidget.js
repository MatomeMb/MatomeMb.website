/**
 * Chat Widget Component
 * Following Single Responsibility Principle - handles all chat functionality
 * 
 * @fileoverview Chat widget component with AI agent integration and security
 * @version 1.0.0
 * @author Matome Mbowene
 */

/**
 * Chat Widget class following SRP
 */
class ChatWidget {
    constructor() {
        this.chatToggle = null;
        this.chatWidget = null;
        this.closeChat = null;
        this.chatInput = null;
        this.sendMessage = null;
        this.chatBody = null;
        this.aiAgent = null;
        this.isInitialized = false;
        this.isOpen = false;
        this.rateLimitData = {
            lastRequest: 0,
            delay: (window.CONFIG?.CHAT_CONFIG?.RATE_LIMIT_DELAY) || 1000
        };
        
        // Bind methods to preserve context
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    /**
     * Initialize chat widget component
     * @returns {boolean} True if initialization successful
     */
    async initialize() {
        try {
            this.cacheElements();
            this.attachEventListeners();
            await this.initializeAIAgent();
            this.isInitialized = true;
            console.log('Chat Widget component initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Chat Widget component:', error);
            return false;
        }
    }

    /**
     * Cache DOM elements for performance
     * @private
     */
    cacheElements() {
        this.chatToggle = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.CHAT_TOGGLE) || 
                         document.querySelector('#chat-toggle');
        this.chatWidget = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.CHAT_WIDGET) || 
                         document.querySelector('#chat-widget');
        this.closeChat = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.CLOSE_CHAT) || 
                        document.querySelector('#close-chat');
        this.chatInput = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.CHAT_INPUT) || 
                        document.querySelector('#chat-input');
        this.sendMessage = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.SEND_MESSAGE) || 
                          document.querySelector('#send-message');
        this.chatBody = window.DOMUtils?.querySelector(window.CONFIG?.SELECTORS?.CHAT_BODY) || 
                       document.querySelector('#chat-body');
    }

    /**
     * Attach event listeners
     * @private
     */
    attachEventListeners() {
        if (this.chatToggle) {
            window.DOMUtils?.addEventListener(this.chatToggle, 'click', this.handleToggle) ||
            this.chatToggle.addEventListener('click', this.handleToggle);
        }

        if (this.closeChat) {
            window.DOMUtils?.addEventListener(this.closeChat, 'click', this.handleClose) ||
            this.closeChat.addEventListener('click', this.handleClose);
        }

        if (this.sendMessage) {
            window.DOMUtils?.addEventListener(this.sendMessage, 'click', this.handleSend) ||
            this.sendMessage.addEventListener('click', this.handleSend);
        }

        if (this.chatInput) {
            window.DOMUtils?.addEventListener(this.chatInput, 'keypress', this.handleKeyPress) ||
            this.chatInput.addEventListener('keypress', this.handleKeyPress);
        }
    }

    /**
     * Initialize AI Agent
     * @private
     */
    async initializeAIAgent() {
        try {
            if (typeof window.SecureAIAgent !== 'undefined') {
                this.aiAgent = new window.SecureAIAgent();
                console.log('AI Agent initialized for chat widget');
            } else {
                console.warn('AI Agent not available, using fallback responses');
            }
        } catch (error) {
            console.error('Error initializing AI Agent:', error);
        }
    }

    /**
     * Handle chat toggle click
     * @param {Event} event - Click event
     * @private
     */
    handleToggle(event) {
        try {
            event.preventDefault();
            this.toggleChat();
        } catch (error) {
            console.error('Error handling chat toggle:', error);
        }
    }

    /**
     * Handle close chat click
     * @param {Event} event - Click event
     * @private
     */
    handleClose(event) {
        try {
            event.preventDefault();
            this.closeChatWidget();
        } catch (error) {
            console.error('Error handling close chat:', error);
        }
    }

    /**
     * Handle send message click
     * @param {Event} event - Click event
     * @private
     */
    handleSend(event) {
        try {
            event.preventDefault();
            this.sendMessage();
        } catch (error) {
            console.error('Error handling send message:', error);
        }
    }

    /**
     * Handle key press in chat input
     * @param {Event} event - Key press event
     * @private
     */
    handleKeyPress(event) {
        try {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.sendMessage();
            }
        } catch (error) {
            console.error('Error handling key press:', error);
        }
    }

    /**
     * Toggle chat widget visibility
     * @private
     */
    toggleChat() {
        if (!this.chatWidget) return;

        if (this.isOpen) {
            this.closeChatWidget();
        } else {
            this.openChatWidget();
        }
    }

    /**
     * Open chat widget
     * @private
     */
    openChatWidget() {
        if (!this.chatWidget) return;

        window.DOMUtils?.addClass(this.chatWidget, 'open') ||
        this.chatWidget.classList.add('open');
        this.isOpen = true;

        // Focus on input
        if (this.chatInput) {
            setTimeout(() => {
                this.chatInput.focus();
            }, 100);
        }
    }

    /**
     * Close chat widget
     * @private
     */
    closeChatWidget() {
        if (!this.chatWidget) return;

        window.DOMUtils?.removeClass(this.chatWidget, 'open') ||
        this.chatWidget.classList.remove('open');
        this.isOpen = false;
    }

    /**
     * Send message to chat
     * @private
     */
    async sendMessage() {
        if (!this.chatInput) return;

        const message = this.chatInput.value.trim();
        
        // Validate input
        const validation = window.ValidationUtils?.validateChatMessage(message);
        if (!validation.success) {
            this.showError(validation.error);
            return;
        }

        // Clear input
        this.chatInput.value = '';

        // Add user message to chat
        this.addMessage(validation.sanitizedInput, true);

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Check rate limiting
            if (!this.checkRateLimit()) {
                this.hideTypingIndicator();
                this.addMessage(window.CONFIG?.ERROR_MESSAGES?.RATE_LIMIT_ERROR || 
                               'Too many requests. Please wait a moment before sending another message.');
                return;
            }

            // Get response from AI agent
            const response = await this.getChatResponse(validation.sanitizedInput);
            
            // Simulate realistic typing delay
            const delay = this.getTypingDelay();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(response);
            }, delay);

        } catch (error) {
            console.error('Error getting chat response:', error);
            this.hideTypingIndicator();
            this.addMessage(window.CONFIG?.ERROR_MESSAGES?.AI_AGENT_ERROR || 
                           'I apologize, but I\'m experiencing technical difficulties. Please try again later.');
        }
    }

    /**
     * Add message to chat body
     * @param {string} message - Message content
     * @param {boolean} isUser - Whether message is from user
     * @private
     */
    addMessage(message, isUser = false) {
        if (!this.chatBody || !message) return;

        const messageDiv = window.DOMUtils?.createElement('div', {
            className: `${window.CONFIG?.CSS_CLASSES?.CHAT_MESSAGE || 'chat-message'} ${isUser ? 
                       (window.CONFIG?.CSS_CLASSES?.CHAT_USER || 'user') : 
                       (window.CONFIG?.CSS_CLASSES?.CHAT_BOT || 'bot')}`
        }) || document.createElement('div');

        if (messageDiv) {
            messageDiv.className = `${window.CONFIG?.CSS_CLASSES?.CHAT_MESSAGE || 'chat-message'} ${isUser ? 
                                  (window.CONFIG?.CSS_CLASSES?.CHAT_USER || 'user') : 
                                  (window.CONFIG?.CSS_CLASSES?.CHAT_BOT || 'bot')}`;
            
            // Use textContent to prevent XSS
            window.DOMUtils?.setTextContent(messageDiv, message) ||
            (messageDiv.textContent = message);
            
            this.chatBody.appendChild(messageDiv);
            this.scrollToBottom();
        }
    }

    /**
     * Show typing indicator
     * @private
     */
    showTypingIndicator() {
        if (!this.chatBody) return;

        const typingDiv = window.DOMUtils?.createElement('div', {
            className: window.CONFIG?.CSS_CLASSES?.TYPING_INDICATOR || 'typing-indicator',
            id: 'typing-indicator'
        }) || document.createElement('div');

        if (typingDiv) {
            typingDiv.className = window.CONFIG?.CSS_CLASSES?.TYPING_INDICATOR || 'typing-indicator';
            typingDiv.id = 'typing-indicator';
            
            const dotsCount = window.CONFIG?.CHAT_CONFIG?.TYPING_INDICATOR_DOTS || 3;
            const dots = Array(dotsCount).fill().map(() => 
                window.DOMUtils?.createElement('div', {
                    className: window.CONFIG?.CSS_CLASSES?.TYPING_DOT || 'typing-dot'
                }) || document.createElement('div')
            );

            dots.forEach(dot => {
                if (dot) {
                    dot.className = window.CONFIG?.CSS_CLASSES?.TYPING_DOT || 'typing-dot';
                    typingDiv.appendChild(dot);
                }
            });

            this.chatBody.appendChild(typingDiv);
            this.scrollToBottom();
        }
    }

    /**
     * Hide typing indicator
     * @private
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Scroll chat to bottom
     * @private
     */
    scrollToBottom() {
        if (!this.chatBody) return;

        this.chatBody.scrollTo({
            top: this.chatBody.scrollHeight,
            behavior: 'smooth'
        });
    }

    /**
     * Get chat response from AI agent or fallback
     * @param {string} message - User message
     * @returns {Promise<string>} AI response
     * @private
     */
    async getChatResponse(message) {
        try {
            // Try AI Agent first
            if (this.aiAgent && this.aiAgent.isInitialized) {
                const response = await this.aiAgent.processMessage(message);
                return response;
            }
            
            // Fallback to static responses
            return this.getFallbackResponse(message);
        } catch (error) {
            console.error('Error getting chat response:', error);
            return this.getFallbackResponse(message);
        }
    }

    /**
     * Get fallback response for chat
     * @param {string} message - User message
     * @returns {string} Fallback response
     * @private
     */
    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase().trim();
        const responses = window.CONFIG?.FALLBACK_RESPONSES || {};
        const priorityKeywords = window.CONFIG?.PRIORITY_KEYWORDS || [];

        // Check for exact matches first
        if (responses[lowerMessage]) {
            return responses[lowerMessage];
        }

        // Check for partial matches with priority
        for (const keyword of priorityKeywords) {
            if (lowerMessage.includes(keyword)) {
                return responses[keyword] || responses.default;
            }
        }

        // Check other keywords
        for (const [key, response] of Object.entries(responses)) {
            if (key !== 'default' && lowerMessage.includes(key)) {
                return response;
            }
        }

        return responses.default || 'That\'s interesting! Feel free to ask about Matome\'s projects, skills, or background!';
    }

    /**
     * Check rate limiting
     * @returns {boolean} True if request is allowed
     * @private
     */
    checkRateLimit() {
        return window.ValidationUtils?.validateRateLimit(this.rateLimitData) || true;
    }

    /**
     * Get typing delay for realistic response
     * @returns {number} Delay in milliseconds
     * @private
     */
    getTypingDelay() {
        const config = window.CONFIG?.ANIMATION_CONFIG?.TYPING_DELAY || { MIN: 500, MAX: 1500 };
        return Math.random() * (config.MAX - config.MIN) + config.MIN;
    }

    /**
     * Show error message in chat
     * @param {string} error - Error message
     * @private
     */
    showError(error) {
        this.addMessage(`Error: ${error}`);
    }

    /**
     * Clean up event listeners and resources
     */
    destroy() {
        try {
            // Remove event listeners
            if (this.chatToggle) {
                this.chatToggle.removeEventListener('click', this.handleToggle);
            }

            if (this.closeChat) {
                this.closeChat.removeEventListener('click', this.handleClose);
            }

            if (this.sendMessage) {
                this.sendMessage.removeEventListener('click', this.handleSend);
            }

            if (this.chatInput) {
                this.chatInput.removeEventListener('keypress', this.handleKeyPress);
            }

            // Clear references
            this.chatToggle = null;
            this.chatWidget = null;
            this.closeChat = null;
            this.chatInput = null;
            this.sendMessage = null;
            this.chatBody = null;
            this.aiAgent = null;
            this.isInitialized = false;
            this.isOpen = false;

            console.log('Chat Widget component destroyed');
        } catch (error) {
            console.error('Error destroying Chat Widget component:', error);
        }
    }

    /**
     * Get component status
     * @returns {Object} Component status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isOpen: this.isOpen,
            hasAIAgent: !!this.aiAgent,
            aiAgentInitialized: this.aiAgent ? this.aiAgent.isInitialized : false
        };
    }
}

/**
 * Export ChatWidget class
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatWidget;
} else {
    // Browser environment
    window.ChatWidget = ChatWidget;
}
