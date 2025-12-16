/**
 * EventEmitter - Simple event emitter class
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} listener - Callback function
     */
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {function} listenerToRemove - Callback to remove
     */
    off(event, listenerToRemove) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass to listeners
     */
    emit(event, ...args) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach(listener => {
            listener.apply(this, args);
        });
    }

    /**
     * Remove all listeners
     */
    removeAllListeners() {
        this.events = {};
    }
}
