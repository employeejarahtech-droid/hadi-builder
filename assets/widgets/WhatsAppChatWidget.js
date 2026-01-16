class WhatsAppChatWidget extends WidgetBase {
    getName() {
        return 'WhatsAppChatWidget';
    }

    getTitle() {
        return 'WhatsApp Chat';
    }

    getIcon() {
        return 'fab fa-whatsapp';
    }

    getCategories() {
        return ['social', 'basic', 'contact'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('phone_number', {
            type: 'text',
            label: 'Phone Number',
            description: 'Include country code (e.g., 15551234567)',
            default_value: '',
            placeholder: '15551234567'
        });

        this.addControl('message', {
            type: 'textarea',
            label: 'Default Message',
            default_value: 'Hello! I would like to know more about your services.',
            placeholder: 'Type your message here...'
        });

        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Chat on WhatsApp',
            condition: {
                name: 'display_type',
                operator: '!=',
                value: 'floating'
            }
        });

        this.addControl('display_type', {
            type: 'select',
            label: 'Display Type',
            default_value: 'button',
            options: [
                { value: 'button', label: 'Inline Button' },
                { value: 'floating', label: 'Floating Bubble' }
            ]
        });

        // Updated Position Control with CSS values and Selector
        this.addControl('position', {
            type: 'select',
            label: 'Position (Floating)',
            default_value: 'bottom: 20px; right: 20px;',
            options: [
                { value: 'bottom: 20px; right: 20px;', label: 'Bottom Right' },
                { value: 'bottom: 20px; left: 20px;', label: 'Bottom Left' }
            ],
            selectors: {
                '.client-preview {{WRAPPER}} .whatsapp-widget-container.display-type-floating': 'position: fixed; z-index: 9999; {{VALUE}}'
            },
            condition: {
                name: 'display_type',
                operator: '==',
                value: 'floating'
            }
        });

        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#25D366',
            selectors: {
                '{{WRAPPER}} .whatsapp-btn': 'background-color: {{VALUE}};'
            }
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#ffffff',
            selectors: {
                '{{WRAPPER}} .whatsapp-btn': 'color: {{VALUE}};'
            }
        });

        this.addControl('icon_size', {
            type: 'slider',
            label: 'Icon Size',
            default_value: { size: 24, unit: 'px' },
            range: {
                min: 10,
                max: 100
            },
            tab: 'style',
            selectors: {
                '{{WRAPPER}} .whatsapp-btn i': 'font-size: {{SIZE}}{{UNIT}};'
            }
        });

        this.addControl('border_radius', {
            type: 'slider',
            label: 'Border Radius',
            default_value: { size: 8, unit: 'px' },
            range: {
                min: 0,
                max: 50
            },
            tab: 'style',
            selectors: {
                '{{WRAPPER}} .whatsapp-btn': 'border-radius: {{SIZE}}{{UNIT}};'
            }
        });

        this.endControlsSection();
    }

    render() {
        const phone = this.getSetting('phone_number');
        const message = encodeURIComponent(this.getSetting('message'));
        const text = this.getSetting('button_text');
        const displayType = this.getSetting('display_type');
        const position = this.getSetting('position'); // Contains "bottom: 20px; right: 20px;"

        const url = `https://wa.me/${phone}?text=${message}`;

        // Dynamic Classes
        let containerClasses = 'whatsapp-widget-container';
        containerClasses += ` display-type-${displayType}`;

        if (displayType === 'floating') {
            containerClasses += ' floating-widget';
        }

        return `
            <div class="${containerClasses}">
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn">
                    <i class="fab fa-whatsapp"></i>
                    ${displayType === 'button' ? `<span>${text}</span>` : ''}
                </a>
            </div>
            <style>
                /* Base Styles */
                .whatsapp-widget-container {
                     display: inline-block;
                }
                .whatsapp-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    text-decoration: none;
                    transition: transform 0.2s;
                }
                .whatsapp-btn:hover {
                    transform: scale(1.05);
                    filter: brightness(1.1);
                }

                /* Floating Mode Styles */
                /* Scoped to body.client-preview so it doesn't float in the builder canvas */
                body.client-preview .whatsapp-widget-container.display-type-floating {
                    position: fixed;
                    z-index: 9999;
                    ${position} /* Injects "bottom: 20px; right: 20px;" */
                }

                .whatsapp-widget-container.display-type-floating .whatsapp-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                body.client-preview .whatsapp-widget-container {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                }
            </style>
        `;
    }
}
