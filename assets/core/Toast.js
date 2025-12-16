/**
 * Toast Notification System
 * Replaces native alert() with non-blocking UI notifications
 */
class Toast {
    static container = null;

    static init() {
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    static show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;

        // Icon mapping
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';

        toast.innerHTML = `
            <i class="fa ${iconClass} toast-icon"></i>
            <div class="toast-content">${message}</div>
        `;

        this.container.appendChild(toast);

        // Animate in
        // Small delay to allow DOM append before adding class for transition
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            // Wait for transition to finish before removing from DOM
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    static success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    static error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }

    static info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Expose globally
window.Toast = Toast;
