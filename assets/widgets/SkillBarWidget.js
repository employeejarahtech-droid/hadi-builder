/**
 * SkillBarWidget - Skill level bars widget
 */
class SkillBarWidget extends WidgetBase {
    getName() { return 'skill_bar'; }
    getTitle() { return 'Skill Bar'; }
    getIcon() { return 'fa fa-sliders-h'; }
    getCategories() { return ['stats']; }
    getKeywords() { return ['skill', 'bar', 'level', 'expertise']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Skills', tab: 'content' });
        this.addControl('skills', {
            type: 'repeater',
            label: 'Skills',
            default_value: [
                { skill: 'JavaScript', level: { size: 90, unit: '%' } },
                { skill: 'PHP', level: { size: 85, unit: '%' } },
                { skill: 'CSS', level: { size: 95, unit: '%' } }
            ],
            fields: [
                { id: 'skill', type: 'text', label: 'Skill Name', default_value: 'Skill', placeholder: 'Enter skill name' },
                { id: 'level', type: 'slider', label: 'Level', default_value: { size: 80, unit: '%' }, range: { min: 0, max: 100, step: 1 } }
            ]
        });
        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('bar_color', { type: 'color', label: 'Bar Color', default_value: '#3b82f6' });
        this.addControl('background_color', { type: 'color', label: 'Background', default_value: '#e5e7eb' });
        this.addControl('text_color', { type: 'color', label: 'Text Color', default_value: '#1a1a1a' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const skills = this.getSetting('skills', [
            { skill: 'JavaScript', level: { size: 90, unit: '%' } },
            { skill: 'PHP', level: { size: 85, unit: '%' } },
            { skill: 'CSS', level: { size: 95, unit: '%' } }
        ]);
        const barColor = this.getSetting('bar_color', '#3b82f6');
        const backgroundColor = this.getSetting('background_color', '#e5e7eb');
        const textColor = this.getSetting('text_color', '#1a1a1a');

        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '');
        const animation = this.getSetting('animation', 'none');
        const animationDuration = this.getSetting('animation_duration', { size: 0.5, unit: 's' });
        const animationDelay = this.getSetting('animation_delay', { size: 0, unit: 's' });

        const safeAnimationDuration = (animationDuration && typeof animationDuration === 'object' && animationDuration.size !== undefined && animationDuration.unit !== undefined)
            ? animationDuration : { size: 0.5, unit: 's' };
        const safeAnimationDelay = (animationDelay && typeof animationDelay === 'object' && animationDelay.size !== undefined && animationDelay.unit !== undefined)
            ? animationDelay : { size: 0, unit: 's' };

        const skillsArray = Array.isArray(skills) ? skills : [];
        const skillBars = skillsArray.map((item, index) => {
            const skillName = item.skill || 'Skill';
            const level = (item.level && typeof item.level === 'object' && item.level.size !== undefined) ? item.level.size : 80;

            return `
                <div style="margin-bottom: ${index < skillsArray.length - 1 ? '20px' : '0'};">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: ${textColor}; font-size: 14px; font-weight: 600;">${this.escapeHtml(skillName)}</span>
                        <span style="color: ${textColor}; font-size: 14px; font-weight: 600;">${level}%</span>
                    </div>
                    <div style="width: 100%; height: 10px; background: ${backgroundColor}; border-radius: 5px; overflow: hidden;">
                        <div style="width: ${level}%; height: 100%; background: ${barColor}; border-radius: 5px; transition: width 1s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');

        const content = `<div>${skillBars}</div>`;

        let wrapperClasses = ['skill-bar-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);
        if (animation !== 'none') wrapperClasses.push('animated', animation);

        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${this.escapeHtml(cssId)}"`;

        let animationStyles = '';
        if (animation !== 'none') {
            const duration = `${safeAnimationDuration.size}${safeAnimationDuration.unit}`;
            const delay = `${safeAnimationDelay.size}${safeAnimationDelay.unit}`;
            animationStyles = `animation-name: ${animation}; animation-duration: ${duration}; animation-delay: ${delay}; animation-fill-mode: both;`;
        }

        const wrapperStyle = animationStyles ? ` style="${animationStyles.trim()}"` : '';

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}${wrapperStyle}>${content}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(SkillBarWidget);
