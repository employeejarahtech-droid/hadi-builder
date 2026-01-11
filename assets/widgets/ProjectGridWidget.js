class ProjectGridWidget extends WidgetBase {
    getName() { return 'project_grid'; }
    getTitle() { return 'Project Grid'; }
    getIcon() { return 'fas fa-th-large'; }
    getCategories() { return ['real_estate']; }
    getKeywords() { return ['project', 'grid', 'portfolio', 'real estate']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });
        this.addControl('title', { type: 'text', label: 'Title', default_value: 'Our Projects', placeholder: 'Enter title', label_block: true });
        this.addControl('columns', { type: 'select', label: 'Columns', default_value: '3', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] });

        this.addControl('source', {
            type: 'select',
            label: 'Source',
            default_value: 'dynamic',
            options: [
                { value: 'dynamic', label: 'Dynamic (From Database)' },
                { value: 'manual', label: 'Manual (Custom Projects)' }
            ]
        });

        this.addControl('posts_per_page', {
            type: 'number',
            label: 'Projects Per Page',
            default_value: 6,
            min: 1,
            max: 50,
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'dynamic' }]
            }
        });

        this.addControl('pagination_type', {
            type: 'select',
            label: 'Pagination',
            default_value: 'numbers',
            options: [
                { value: 'none', label: 'None' },
                { value: 'numbers', label: 'Numbers' }
            ],
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'dynamic' }]
            }
        });

        this.endControlsSection();
        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
        this.registerAdvancedControls();
    }

    render() {
        const title = this.getSetting('title', 'Our Projects');
        const columns = this.getSetting('columns', '3');
        const source = this.getSetting('source', 'dynamic');
        const postsPerPage = this.getSetting('posts_per_page', 6);
        const paginationType = this.getSetting('pagination_type', 'numbers');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'project-grid-' + Math.random().toString(36).substr(2, 9);

        window[`projectGrid_${cssId}`] = {
            source, postsPerPage, paginationType, accentColor, title, columns
        };

        this.waitForContainer(cssId);

        let wrapperClasses = ['project-grid-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);

        return `<div class="${wrapperClasses.join(' ')}" id="${cssId}">
            <div style="padding: 40px; text-align: center; color: #666;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <div style="margin-top: 10px;">Loading projects...</div>
            </div>
        </div>`;
    }

    waitForContainer(containerId, attempts = 0) {
        const container = document.getElementById(containerId);
        if (container) {
            this.loadProjects(containerId, 1);
        } else if (attempts < 20) {
            setTimeout(() => this.waitForContainer(containerId, attempts + 1), 100);
        }
    }

    async loadProjects(containerId, page = 1) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = window[`projectGrid_${containerId}`];
        if (!config) return;

        const { source, postsPerPage, paginationType, accentColor, title, columns } = config;

        let projectsData = [];
        let totalPages = 1;

        if (source === 'dynamic') {
            try {
                const baseUrl = window.CMS_ROOT || '';
                const fetchUrl = `${baseUrl}/api/get-projects.php?page=${page}&limit=${postsPerPage}`;
                const response = await fetch(fetchUrl);
                const data = await response.json();

                if (data.success && data.projects) {
                    projectsData = data.projects;
                    totalPages = data.total_pages || 1;
                }
            } catch (e) {
                console.error(e);
                container.innerHTML = `<div class="alert alert-danger">Error loading projects.</div>`;
                return;
            }
        }

        const projectCards = projectsData.map(project => {
            const imgUrl = project.featured_image || 'https://via.placeholder.com/600x400?text=No+Image';
            const linkUrl = (window.CMS_ROOT || '') + '/project/' + (project.slug || project.id);

            return `
                <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: white; transition: transform 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);"
                    onmouseover="this.style.transform='translateY(-5px)'"
                    onmouseout="this.style.transform='translateY(0)'">
                    <a href="${linkUrl}" style="text-decoration: none; color: inherit;">
                        <div style="aspect-ratio: 16/9; background-image: url('${imgUrl}'); background-size: cover; background-position: center;"></div>
                        <div style="padding: 20px;">
                            <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #1e293b;">${project.title}</h3>
                            <div style="font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                ${project.description || 'No description'}
                            </div>
                            <span style="color: ${accentColor}; font-weight: 600; font-size: 14px;">View Project <i class="fas fa-arrow-right" style="font-size: 12px;"></i></span>
                        </div>
                    </a>
                </div>
            `;
        }).join('');

        const gridHtml = projectCards.length > 0
            ? `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 30px;">${projectCards}</div>`
            : `<div style="text-align: center; padding: 40px; color: #64748b;">No projects found.</div>`;

        // Pagination
        let paginationHtml = '';
        if (source === 'dynamic' && paginationType === 'numbers' && totalPages > 1) {
            paginationHtml = `<div style="margin-top: 40px; display: flex; justify-content: center; gap: 5px;">`;
            for (let i = 1; i <= totalPages; i++) {
                const isActive = i === page;
                paginationHtml += `<button onclick="new (window.elementorWidgetManager.getWidgetClass('project_grid'))().changePage('${containerId}', ${i})" 
                    style="width: 36px; height: 36px; border: 1px solid ${isActive ? accentColor : '#e2e8f0'}; background: ${isActive ? accentColor : '#fff'}; color: ${isActive ? '#fff' : '#64748b'}; border-radius: 6px; cursor: pointer; font-weight: 600;">${i}</button>`;
            }
            paginationHtml += `</div>`;
        }

        container.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                ${title ? `<h2 style="text-align: center; font-size: 32px; font-weight: 800; margin-bottom: 40px; color: #1e293b;">${title}</h2>` : ''}
                ${gridHtml}
                ${paginationHtml}
            </div>
            <style>
                @media(max-width: 960px) { #${containerId} .grid { grid-template-columns: repeat(2, 1fr) !important; } }
                @media(max-width: 600px) { #${containerId} .grid { grid-template-columns: 1fr !important; } }
            </style>
        `.replace('.grid', 'div[style*="display: grid"]'); // Simple hack for media query selector
    }

    changePage(containerId, page) {
        this.loadProjects(containerId, page);
        const container = document.getElementById(containerId);
        if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

window.elementorWidgetManager.registerWidget(ProjectGridWidget);
