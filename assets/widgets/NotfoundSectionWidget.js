/**
 * NotfoundSectionWidget - A specialized widget for 404 Not Found pages
 * Provides controls for error code, title, description, and back button
 */
class NotfoundSectionWidget extends WidgetBase {
    getName() {
        return 'notfound-section';
    }

    getTitle() {
        return '404 Not Found Section';
    }

    getIcon() {
        return 'fa fa-exclamation-triangle';
    }

    getCategories() {
        return ['section', 'basic', 'content'];
    }

    getKeywords() {
        return ['404', 'not found', 'error', 'page', 'missing'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            error_code: '404',
            title: 'Page Not Found',
            description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
            button_text: 'Back to Home',
            button_link: '/',
            image: { url: '' },
            show_image: 'no'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('error_code', {
            type: 'text',
            label: 'Error Code',
            default_value: '404',
            placeholder: '404'
        });

        this.addControl('title', {
            type: 'text',
            label: 'Title',
            default_value: 'Page Not Found',
            placeholder: 'Enter title'
        });

        this.addControl('description', {
            type: 'textarea',
            label: 'Description',
            default_value: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
            placeholder: 'Enter description'
        });

        this.addControl('button_text', {
            type: 'text',
            label: 'Button Text',
            default_value: 'Back to Home',
            placeholder: 'Button text'
        });

        this.addControl('button_link', {
            type: 'url',
            label: 'Button Link',
            default_value: '/',
            placeholder: 'https://your-site.com'
        });

        this.addControl('show_image', {
            type: 'select',
            label: 'Show Image',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'no'
        });

        this.addControl('image', {
            type: 'media',
            label: 'Image',
            default_value: { url: '' },
            condition: {
                show_image: 'yes'
            }
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('text_align', {
            type: 'select',
            label: 'Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ],
            default_value: 'center',
            selectors: {
                '{{WRAPPER}} .notfound-content': 'text-align: {{VALUE}};'
            }
        });

        this.addControl('error_code_color', {
            type: 'color',
            label: 'Error Code Color',
            default_value: '#e0e0e0',
            selectors: {
                '{{WRAPPER}} .error-code': 'color: {{VALUE}};'
            }
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#1a1a1a',
            selectors: {
                '{{WRAPPER}} .notfound-title': 'color: {{VALUE}};'
            }
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const errorCode = this.getSetting('error_code', '404');
        const title = this.getSetting('title', 'Page Not Found');
        const description = this.getSetting('description', 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.');
        const buttonText = this.getSetting('button_text', 'Back to Home');
        const buttonLink = this.getSetting('button_link', '/');
        const showImage = this.getSetting('show_image', 'no');
        const image = this.getSetting('image', { url: '' });

        // Unique class for scoping
        const uid = 'notfound_' + Math.random().toString(36).substr(2, 9);

        let buttonUrl = '#';
        if (typeof buttonLink === 'string') {
            buttonUrl = buttonLink;
        } else if (typeof buttonLink === 'object' && buttonLink.url) {
            buttonUrl = buttonLink.url;
        }

        return `
            <style>
                .${uid} {
                    padding: 100px 0;
                    background-color: #fff;
                    font-family: 'Inter', sans-serif;
                    overflow: hidden;
                    position: relative;
                }

                .${uid} .container {
                    position: relative;
                    z-index: 2;
                }

                .${uid} .notfound-content {
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                }

                .${uid} .error-code {
                    font-size: 180px;
                    font-weight: 900;
                    line-height: 1;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    position: relative;
                    display: inline-block;
                    animation: float 6s ease-in-out infinite;
                }
                
                .${uid} .error-code::after {
                    content: attr(data-text);
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    opacity: 0.5;
                    filter: blur(2px);
                }

                .${uid} .notfound-title {
                    font-size: 42px;
                    font-weight: 800;
                    margin-bottom: 20px;
                    color: #1e293b;
                    letter-spacing: -1px;
                }

                .${uid} .notfound-description {
                    font-size: 18px;
                    color: #64748b;
                    margin-bottom: 40px;
                    line-height: 1.6;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .${uid} .btn-home {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px 36px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #ffffff;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border-radius: 50px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
                    position: relative;
                    overflow: hidden;
                }

                .${uid} .btn-home:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.5);
                }
                
                .${uid} .btn-home::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transform: translateX(-100%);
                    transition: transform 0.6s;
                }
                
                .${uid} .btn-home:hover::before {
                    transform: translateX(100%);
                }

                .${uid} .notfound-image {
                    max-width: 100%;
                    height: auto;
                    margin-top: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    animation: fadeInUp 0.8s ease-out 0.2s backwards;
                }

                /* Background decorative elements */
                .${uid}::before {
                    content: '';
                    position: absolute;
                    top: -100px;
                    left: -100px;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                }
                
                .${uid}::after {
                    content: '';
                    position: absolute;
                    bottom: -100px;
                    right: -100px;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%);
                    border-radius: 50%;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .${uid} .error-code {
                        font-size: 120px;
                    }
                    .${uid} .notfound-title {
                        font-size: 32px;
                    }
                }
            </style>

            <div class="${uid}">
                <div class="container">
                    <div class="notfound-content">
                        ${errorCode ? `<div class="error-code" data-text="${errorCode}">${errorCode}</div>` : ''}
                        
                        ${title ? `<h1 class="notfound-title">${this.escapeHtml(title)}</h1>` : ''}
                        
                        ${description ? `<p class="notfound-description">${this.escapeHtml(description)}</p>` : ''}
                        
                        ${buttonText ? `
                            <a href="${buttonUrl}" class="btn-home">
                                ${this.escapeHtml(buttonText)}
                            </a>
                        ` : ''}

                        ${showImage === 'yes' && image.url ? `
                            <div>
                                <img src="${image.url}" alt="404 Illustration" class="notfound-image">
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

window.elementorWidgetManager.registerWidget(NotfoundSectionWidget);
