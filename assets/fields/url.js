/**
 * URL Control - Standardized to extend BaseControl
 */
class URLControl extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);
    }

    /**
     * Get the current value, ensuring it's an object with defaults
     */
    getValue() {
        let val = this.value;

        // Handle legacy string values
        if (typeof val === 'string') {
            val = { url: val };
        }

        val = val || {};

        // Ensure url is a string (handle nested object case)
        let urlValue = val.url || '';
        if (typeof urlValue === 'object') {
            urlValue = urlValue.url || '';
        }

        return {
            url: urlValue,
            is_external: val.is_external || false,
            nofollow: val.nofollow || false
        };
    }

    render() {
        const value = this.getValue();
        const urlId = `${this.id}_url`;
        const externalId = `${this.id}_external`;
        const nofollowId = `${this.id}_nofollow`;

        return `
            <div class="elementor-control-field">
                <div class="elementor-control-input-wrapper">
                    <input type="url" 
                        id="${urlId}" 
                        class="elementor-control-tag-area" 
                        data-setting="url"
                        placeholder="${this.placeholder || 'https://example.com'}"
                        value="${this.escapeHtml(value.url)}" />
                </div>
            </div>
            <div class="elementor-control-field elementor-control-url-more" style="margin-top: 5px;">
                <div class="elementor-control-input-wrapper" style="display: flex; gap: 10px; font-size: 12px;">
                    <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                        <input type="checkbox" 
                            id="${externalId}" 
                            data-setting="is_external" 
                            ${value.is_external ? 'checked' : ''} />
                        Open in new window
                    </label>
                    <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                        <input type="checkbox" 
                            id="${nofollowId}" 
                            data-setting="nofollow" 
                            ${value.nofollow ? 'checked' : ''} />
                        Add nofollow
                    </label>
                </div>
            </div>
        `;
    }

    setupListeners() {
        super.setupListeners();

        // Use document delegation to ensure we catch events even if DOM isn't ready locally
        $(document).on('input change blur', `[data-control-id="${this.id}"] input`, (e) => {
            // e.stopPropagation(); // Let it bubble, we want logging to work if needed

            const $target = $(e.target);
            const setting = $target.data('setting');

            if (!setting) return;

            const currentVal = this.getValue();
            let newVal;

            if ($target.attr('type') === 'checkbox') {
                newVal = $target.is(':checked');
            } else {
                newVal = $target.val();
            }

            // Update specific property
            const updatedValue = {
                ...currentVal,
                [setting]: newVal
            };

            console.log(`URLControl Input Change [${this.id}]: ${setting} = ${newVal}`);

            this.setValue(updatedValue);
        });
    }
}

// Export global
window.URLControl = URLControl;
window.URLinput = URLControl; // Alias for backward compatibility
