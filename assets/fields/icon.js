/**
 * ICON Control - Icon picker control extending BaseControl
 */
class ICON extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);
        this.type = 'icon';
        this.randid = Math.random().toString(36).substr(2, 9);
        this.elementId = args.element_id || null;
    }

    /**
     * Render the icon picker control
     * @returns {string} HTML string
     */
    render() {
        // ... existing render code ...
        const value = this.value || this.defaultValue || '';

        return `
            <div class="icon-box">
                <input type="hidden" class="icon-${this.randid}" id="${this.id}" name="${this.id}" value="${value}" />
                <span class="icon-trashs"><i class="fa fa-trash"></i></span>
                <div class="icon-selected">
                    <i class="${value}"></i>
                </div>
                <div class="icon-hover" rand-id="${this.randid}">
                    <div>Choose Icon</div>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupListeners() {
        super.setupListeners();

        // Use setTimeout to ensure DOM is ready, especially in repeaters
        setTimeout(() => {
            console.log(`Setting up icon control listeners for ${this.id} (randid: ${this.randid})`);

            // Icon selection click handler - use document delegation for repeater compatibility
            $(document).on("click", `.icon-hover[rand-id="${this.randid}"]`, (event) => {
                event.preventDefault();
                event.stopPropagation();

                const currentitemval = $(`.icon-${this.randid}`).val();

                const values = {
                    selectedFiles: currentitemval,
                    popType: 'single_select',
                    popFileType: 'icon',
                    dataSelector: `.icon-${this.randid}`,
                    dataFor: 'icon',
                    elementId: this.elementId,
                    controlId: this.id
                };

                console.log('Icon clicked, opening modal with values:', values);

                if (typeof window.myModalIcon !== 'undefined' && window.myModalIcon) {
                    window.myModalIcon.open(values);
                } else {
                    console.error('Icon modal (window.myModalIcon) not initialized');
                }
            });

            // Icon removal handler - check if it's for this control
            $(document).on("click", `.icon-trashs`, (event) => {
                const $iconBox = $(event.currentTarget).closest('.icon-box');
                if ($iconBox.find(`.icon-${this.randid}`).length) {
                    event.preventDefault();
                    event.stopPropagation();

                    $iconBox.find(`.icon-${this.randid}`).val('');
                    $iconBox.find('.icon-selected i').attr('class', '');
                    this.setValue('', false);
                }
            });

            // Listen for value changes from the modal
            $(document).on('change', `.icon-${this.randid}`, (event) => {
                const newValue = $(event.target).val();
                console.log('Icon input changed to:', newValue);

                // Update the displayed icon
                $(`.icon-hover[rand-id="${this.randid}"]`).siblings('.icon-selected').find('i').attr('class', newValue);

                // Update the control's internal value and emit change
                this.setValue(newValue, false);
            });
        }, 100); // Small delay to ensure DOM is ready
    }

    /**
     * Get the current value
     * @returns {string} Icon class string
     */
    getValue() {
        const $input = $(`.icon-${this.randid}`);
        if ($input.length) {
            return $input.val() || this.value;
        }
        return this.value;
    }

    /**
     * Set a new value
     * @param {string} newValue - New icon class
     * @param {boolean} silent - Don't emit change event
     */
    setValue(newValue, silent = false) {
        const oldValue = this.value;
        this.value = newValue;

        // Update the hidden input
        const $input = $(`.icon-${this.randid}`);
        if ($input.length) {
            $input.val(newValue);
        }

        // Update the displayed icon
        $(`.icon-hover[rand-id="${this.randid}"]`).siblings('.icon-selected').find('i').attr('class', newValue);

        if (!silent && oldValue !== newValue) {
            this.handleChange(newValue, oldValue);
        }
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        const $wrapper = $(`[data-control-id="${this.id}"]`);
        if ($wrapper.length) {
            $wrapper.off("click", `.icon-hover[rand-id="${this.randid}"]`);
            $wrapper.off("click", `.icon-trashs`);
            $wrapper.off("change", `.icon-${this.randid}`);
        }
        super.destroy();
    }
}

// Export global
window.ICON = ICON;
