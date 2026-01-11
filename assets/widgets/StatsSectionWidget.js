/**
 * StatsSectionWidget - A specialized widget for statistics/counter sections
 * Provides a repeater control for stat items with numbers, labels, icons, and suffixes
 */
class StatsSectionWidget extends WidgetBase {
    getName() {
        return 'stats-section';
    }

    getTitle() {
        return 'Stats Section';
    }

    getIcon() {
        return 'fa fa-chart-bar';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['stats', 'statistics', 'counter', 'numbers', 'metrics', 'achievements'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Our Achievements',
            section_subtitle: 'By The Numbers',
            stats: [
                {
                    icon: 'fa fa-users',
                    number: '500',
                    suffix: '+',
                    label: 'Happy Clients'
                },
                {
                    icon: 'fa fa-project-diagram',
                    number: '1000',
                    suffix: '+',
                    label: 'Projects Completed'
                },
                {
                    icon: 'fa fa-award',
                    number: '50',
                    suffix: '+',
                    label: 'Awards Won'
                },
                {
                    icon: 'fa fa-clock',
                    number: '10',
                    suffix: '+',
                    label: 'Years Experience'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Stats Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Our Achievements',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'By The Numbers',
            placeholder: 'Enter subtitle'
        });

        this.addControl('stats', {
            type: 'repeater',
            label: 'Statistics',
            default_value: [],
            fields: [
                {
                    name: 'icon',
                    type: 'icon',
                    label: 'Icon',
                    default_value: 'fa fa-star'
                },
                {
                    name: 'number',
                    type: 'text',
                    label: 'Number',
                    default_value: '100',
                    placeholder: 'Enter number'
                },
                {
                    name: 'suffix',
                    type: 'text',
                    label: 'Suffix',
                    default_value: '+',
                    placeholder: '+ or % or K'
                },
                {
                    name: 'label',
                    type: 'text',
                    label: 'Label',
                    default_value: 'Stat Label',
                    placeholder: 'Enter label'
                }
            ],
            title_field: 'label'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const sectionTitle = this.getSetting('section_title', 'Our Achievements');
        const sectionSubtitle = this.getSetting('section_subtitle', 'By The Numbers');
        const stats = this.getSetting('stats', []);

        let statsHTML = '';
        if (stats && stats.length > 0) {
            statsHTML = stats.map(stat => {
                const iconHTML = stat.icon ? `<i class="${stat.icon}"></i>` : '<i class="fa fa-star"></i>';
                return `
          <div class="stat-item">
            <div class="stat-icon">${iconHTML}</div>
            <div class="stat-number">${this.escapeHtml(stat.number || '0')}${this.escapeHtml(stat.suffix || '')}</div>
            <div class="stat-label">${this.escapeHtml(stat.label || 'Stat')}</div>
          </div>
        `;
            }).join('');
        }

        return `
<div class="stats-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="stats-grid">
      ${statsHTML}
    </div>
  </div>
</div>
    `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(StatsSectionWidget);
