/**
 * CertificationWidget - Certifications display widget
 * Displays professional certifications and credentials
 */
class CertificationWidget extends WidgetBase {
    getName() {
        return 'certification';
    }

    getTitle() {
        return 'Certification';
    }

    getIcon() {
        return 'fa fa-certificate';
    }

    getCategories() {
        return ['basic'];
    }

    getKeywords() {
        return ['certification', 'credential', 'license', 'qualification', 'accreditation'];
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Certification',
            tab: 'content'
        });

        this.addControl('cert_logo', {
            type: 'media',
            label: 'Certification Logo',
            default_value: '',
            description: 'Issuing organization logo'
        });

        this.addControl('cert_name', {
            type: 'text',
            label: 'Certification Name',
            default_value: 'AWS Certified Solutions Architect',
            placeholder: 'Enter certification name',
            label_block: true
        });

        this.addControl('issuing_org', {
            type: 'text',
            label: 'Issuing Organization',
            default_value: 'Amazon Web Services',
            placeholder: 'Enter organization name',
            label_block: true
        });

        this.addControl('credential_id', {
            type: 'text',
            label: 'Credential ID',
            default_value: 'ABC-123-XYZ',
            placeholder: 'e.g., ABC-123-XYZ'
        });

        this.addControl('issue_date', {
            type: 'text',
            label: 'Issue Date',
            default_value: 'January 2024',
            placeholder: 'e.g., January 2024'
        });

        this.addControl('expiry_date', {
            type: 'text',
            label: 'Expiry Date',
            default_value: 'January 2027',
            placeholder: 'e.g., January 2027 or No Expiration'
        });

        this.addControl('verification_url', {
            type: 'text',
            label: 'Verification URL',
            default_value: '',
            placeholder: 'https://verify.example.com',
            label_block: true,
            description: 'Optional verification link'
        });

        this.endControlsSection();

        // Style Section
        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('background_color', {
            type: 'color',
            label: 'Background Color',
            default_value: '#ffffff'
        });

        this.addControl('title_color', {
            type: 'color',
            label: 'Title Color',
            default_value: '#1a1a1a'
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#666666'
        });

        this.addControl('accent_color', {
            type: 'color',
            label: 'Accent Color',
            default_value: '#3b82f6'
        });

        this.endControlsSection();

        // Add Advanced tab
        this.registerAdvancedControls();
    }

    render() {
        const certLogo = this.getSetting('cert_logo', '');
        const certName = this.getSetting('cert_name', 'AWS Certified Solutions Architect');
        const issuingOrg = this.getSetting('issuing_org', 'Amazon Web Services');
        const credentialId = this.getSetting('credential_id', 'ABC-123-XYZ');
        const issueDate = this.getSetting('issue_date', 'January 2024');
        const expiryDate = this.getSetting('expiry_date', 'January 2027');
        const verificationUrl = this.getSetting('verification_url', '');
        const backgroundColor = this.getSetting('background_color', '#ffffff');
        const titleColor = this.getSetting('title_color', '#1a1a1a');
        const textColor = this.getSetting('text_color', '#666666');
        const accentColor = this.getSetting('accent_color', '#3b82f6');

        // Get advanced settings
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        // Validate animation values
        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration
            : { size: 0.5, unit: 's' };

        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay
            : { size: 0, unit: 's' };

        // Build certification logo or icon
        let logoHtml = '';
        const logoUrl = (certLogo && certLogo.url) ? certLogo.url : certLogo;

        if (logoUrl) {
            logoHtml = `<img src="${this.escapeHtml(logoUrl)}" alt="${this.escapeHtml(issuingOrg)}" style="width: 80px; height: 80px; object-fit: contain; margin-right: 20px;">`;
        } else {
            logoHtml = `<div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, ${accentColor} 0%, #1e40af 100%); display: flex; align-items: center; justify-content: center; margin-right: 20px; flex-shrink: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><i class="fas fa-certificate" style="color: white; font-size: 36px;"></i></div>`;
        }

        // Build verification button
        const verifyButton = verificationUrl ? `
            <a href="${this.escapeHtml(verificationUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; background: ${accentColor}; color: white; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 6px; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                <i class="fas fa-check-circle"></i>
                Verify Credential
            </a>
        ` : '';

        const content = `
            <div style="background: ${backgroundColor}; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    ${logoHtml}
                    <div style="flex: 1;">
                        <h3 style="color: ${titleColor}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${this.escapeHtml(certName)}</h3>
                        <div style="color: ${accentColor}; font-size: 15px; font-weight: 600; margin-bottom: 12px;">${this.escapeHtml(issuingOrg)}</div>
                        <div style="display: inline-block; background: ${accentColor}15; color: ${accentColor}; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Certified</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 20px; background: #f9fafb; border-radius: 8px; margin-bottom: 15px;">
                    <div>
                        <div style="color: ${textColor}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Credential ID</div>
                        <div style="color: ${titleColor}; font-size: 13px; font-weight: 600;">${this.escapeHtml(credentialId)}</div>
                    </div>
                    <div>
                        <div style="color: ${textColor}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Issue Date</div>
                        <div style="color: ${titleColor}; font-size: 13px; font-weight: 600;">${this.escapeHtml(issueDate)}</div>
                    </div>
                    <div>
                        <div style="color: ${textColor}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Expiry Date</div>
                        <div style="color: ${titleColor}; font-size: 13px; font-weight: 600;">${this.escapeHtml(expiryDate)}</div>
                    </div>
                </div>

                ${verifyButton}
            </div>
        `;

        // Build wrapper classes
        let wrapperClasses = ['certification-widget'];
        if (cssClasses) {
            wrapperClasses.push(cssClasses);
        }
        if (animation !== 'none') {
            wrapperClasses.push('animated', animation);
        }

        // Build wrapper attributes
        let wrapperAttributes = '';
        if (cssId) {
            wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;
        }

        // Build animation styles
        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }

        // Combine wrapper style
        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(CertificationWidget);
