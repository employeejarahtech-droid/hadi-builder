/**
 * EventEmitter - Simple event system for controls
 * Inspired by Elementor's event system
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Register an event listener
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     * @param {object} context - Context for callback (optional)
     */
    on(event, callback, context = null) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({ callback, context });
        return this;
    }

    /**
     * Register a one-time event listener
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     * @param {object} context - Context for callback (optional)
     */
    once(event, callback, context = null) {
        const onceWrapper = (...args) => {
            callback.apply(context, args);
            this.off(event, onceWrapper);
        };
        return this.on(event, onceWrapper, context);
    }

    /**
     * Remove an event listener
     * @param {string} event - Event name
     * @param {function} callback - Callback function to remove (optional)
     */
    off(event, callback = null) {
        if (!this.events[event]) return this;

        if (callback) {
            this.events[event] = this.events[event].filter(
                listener => listener.callback !== callback
            );
        } else {
            delete this.events[event];
        }
        return this;
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass to callbacks
     */
    emit(event, ...args) {
        if (!this.events[event]) return this;

        this.events[event].forEach(listener => {
            try {
                listener.callback.apply(listener.context, args);
            } catch (error) {
                console.error(`Error in event listener for "${event}":`, error);
            }
        });
        return this;
    }

    /**
     * Remove all event listeners
     */
    removeAllListeners() {
        this.events = {};
        return this;
    }

    /**
     * Get all listeners for an event
     * @param {string} event - Event name
     * @returns {array} Array of listeners
     */
    listeners(event) {
        return this.events[event] || [];
    }

    /**
     * Check if event has listeners
     * @param {string} event - Event name
     * @returns {boolean}
     */
    hasListeners(event) {
        return !!(this.events[event] && this.events[event].length);
    }
}
