class SingleProjectWidget extends WidgetBase {
    getName() { return 'single_project'; }
    getTitle() { return 'Single Project Details'; }
    getIcon() { return 'fas fa-building'; }
    getCategories() { return ['real_estate']; }
    getKeywords() { return ['project', 'details', 'real estate', 'property']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Project Source', tab: 'content' });

        this.addControl('source', {
            type: 'select',
            label: 'Source',
            default_value: 'current_query',
            options: [
                { value: 'current_query', label: 'Current Query (URL Parameter)' },
                { value: 'manual', label: 'Manual Selection' }
            ]
        });

        this.addControl('project_id', {
            type: 'text',
            label: 'Project ID/Slug',
            default_value: '',
            placeholder: 'e.g. 1 or luxury-villa',
            condition: {
                terms: [{ name: 'source', operator: '==', value: 'manual' }]
            }
        });

        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('accent_color', { type: 'color', label: 'Accent Color', default_value: '#3b82f6' });
        this.endControlsSection();
    }

    render() {
        const source = this.getSetting('source', 'current_query');
        const projectId = this.getSetting('project_id', '');
        const accentColor = this.getSetting('accent_color', '#3b82f6');
        const cssClasses = this.getSetting('css_classes', '');
        const cssId = this.getSetting('css_id', '') || 'single-project-' + Math.random().toString(36).substr(2, 9);

        let wrapperClasses = ['single-project-widget'];
        if (cssClasses) wrapperClasses.push(cssClasses);

        let wrapperAttributes = '';
        if (cssId) wrapperAttributes += ` id="${cssId}"`;
        wrapperAttributes += ` data-container-id="${cssId}"`;

        // Pass config via window
        window[`singleProject_${cssId}`] = { source, projectId, accentColor };

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttributes}>
            <div style="padding: 40px; text-align: center; color: #666;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <div style="margin-top: 10px;">Loading project details...</div>
            </div>
        </div>`;
    }

    onContentRendered() {
        const containerId = this.$el.getAttribute('data-container-id');
        if (containerId) {
            setTimeout(() => this.loadProject(containerId), 100);
        }
    }

    async loadProject(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = window[`singleProject_${containerId}`];
        if (!config) return;

        const { source, projectId, accentColor } = config;
        let targetId = projectId;
        let queryType = 'id';

        if (source === 'current_query') {
            const path = window.location.pathname;
            const segments = path.split('/');
            // project/slug
            const idx = segments.indexOf('project');
            if (idx !== -1 && segments[idx + 1]) {
                targetId = segments[idx + 1];
                queryType = 'slug';
            } else {
                const params = new URLSearchParams(window.location.search);
                if (params.get('id')) {
                    targetId = params.get('id');
                } else if (params.get('slug')) {
                    targetId = params.get('slug');
                    queryType = 'slug';
                }
            }
        }

        if (!targetId) {
            container.innerHTML = `<div class="alert alert-warning">Project identifier not found.</div>`;
            return;
        }

        // Determine if ID is numeric or slug
        if (source === 'manual' && isNaN(targetId)) {
            queryType = 'slug';
        }

        try {
            const baseUrl = window.CMS_ROOT || '';
            const queryParam = queryType === 'slug' ? `slug=${targetId}` : `id=${targetId}`;
            const response = await fetch(`${baseUrl}/api/get-projects.php?${queryParam}`);
            const data = await response.json();

            if (data.success && data.project) {
                this.renderProjectUI(container, data.project, accentColor);
            } else {
                container.innerHTML = `<div class="alert alert-danger">Project not found: ${targetId}</div>`;
            }
        } catch (e) {
            console.error(e);
            container.innerHTML = `<div class="alert alert-danger">Error loading project.</div>`;
        }
    }

    renderProjectUI(container, project, accentColor) {
        // Parse attributes
        let attributesHtml = '';
        try {
            const rawAttrs = JSON.parse(project.attributes || '[]');
            let groupedAttrs = [];

            // Normalize
            if (Array.isArray(rawAttrs) && rawAttrs.length > 0 && rawAttrs[0].group_name) {
                groupedAttrs = rawAttrs;
            } else if (Array.isArray(rawAttrs) && rawAttrs.length > 0) {
                groupedAttrs = [{ group_name: 'General', attributes: rawAttrs.map(a => ({ name: a.key || a.name, value: a.value, type: a.type || 'text' })) }];
            }

            if (groupedAttrs.length > 0) {
                attributesHtml = `<div class="project-attributes" style="margin-top: 30px;">`;
                groupedAttrs.forEach(group => {
                    attributesHtml += `
                        <div class="attr-group" style="margin-bottom: 20px;">
                            <h3 style="font-size: 18px; border-bottom: 2px solid ${accentColor}; padding-bottom: 5px; margin-bottom: 10px; display: inline-block;">${group.group_name || 'Details'}</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                                ${group.attributes.map(attr => {
                        const isColor = attr.type === 'color';
                        const isImage = attr.type === 'image';

                        let content = attr.value;
                        if (isColor) content = `<span style="width: 16px; height: 16px; border-radius: 50%; background: ${attr.value}; border: 1px solid #ccc;"></span> ${attr.value}`;
                        if (isImage) content = `<img src="${attr.value}" style="width: 100%; height: auto; max-height: 200px; border-radius: 4px; cursor: pointer; display: block; margin-top: 5px;" onclick="window.open(this.src, '_blank')">`;

                        return `
                                    <div style="background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                        <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">${attr.name}</div>
                                        <div style="font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
                                            ${content}
                                        </div>
                                    </div>
                                    `;
                    }).join('')}
                            </div>
                        </div>
                    `;
                });
                attributesHtml += `</div>`;
            }
        } catch (e) { console.error('Error parsing attributes', e); }

        // Gallery
        let galleryHtml = '';
        try {
            let images = [];
            if (project.featured_image) images.push(project.featured_image);
            const extra = JSON.parse(project.gallery_images || '[]');
            if (Array.isArray(extra)) images = [...images, ...extra];

            if (images.length > 0) {
                const mainImg = images[0];
                const thumbs = images.length > 1 ? images.map(img => `
                    <div onclick="this.closest('.project-gallery').querySelector('.main-img').src = '${img}'" 
                         style="background-image: url('${img}'); height: 80px; background-size: cover; cursor: pointer; border-radius: 6px; margin-top: 10px;">
                    </div>
                `).join('') : '';

                galleryHtml = `
                    <div class="project-gallery" style="margin-bottom: 30px;">
                        <img class="main-img" src="${mainImg}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px;">
                        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                            ${thumbs}
                        </div>
                    </div>
                `;
            }
        } catch (e) { }

        // Plans
        let plansHtml = '';
        if (project.master_plan) {
            plansHtml += `
                <div class="master-plan" style="margin-top: 40px; margin-bottom: 40px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1e293b;">Master/Layout Plan</h3>
                    <img src="${project.master_plan}" style="width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer;" onclick="window.open(this.src, '_blank')">
                </div>
            `;
        }

        // Floor Plans Logic Removed (Moved to Attributes)

        // Map
        let mapHtml = '';
        if (project.map_embed_code) {
            // Force width/height to 100% via inline styles injection or class
            // We'll wrap it and use CSS
            mapHtml = `
                 <div class="project-map" style="margin-top: 40px;">
                     <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1e293b;">Location</h3>
                     <div class="map-container" style="overflow: hidden; border-radius: 12px; height: 400px; background: #f1f5f9;">
                         ${project.map_embed_code}
                     </div>
                 </div>
             `;
        }

        container.innerHTML = `
            <div class="project-detail-container" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <h1 style="font-size: 36px; margin-bottom: 10px;">${project.title}</h1>
                <div style="margin-bottom: 20px;">
                    <span style="background: ${accentColor}20; color: ${accentColor}; padding: 5px 12px; border-radius: 20px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">${project.project_type || 'Building'}</span>
                    ${project.category_name ? `<span style="background: #f1f5f9; color: #475569; padding: 5px 12px; border-radius: 20px; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; margin-left: 10px;">${project.category_name}</span>` : ''}
                </div>
                ${galleryHtml}
                <div class="project-content" style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
                    <div class="main-info">
                        <div class="description" style="font-size: 18px; line-height: 1.6; color: #475569; margin-bottom: 30px;">
                            ${project.description || 'No description provided.'}
                        </div>
                        ${attributesHtml}
                        ${plansHtml}
                        ${mapHtml}
                    </div>
                    <div class="sidebar-info">
                        <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; position: sticky; top: 100px;">
                            <h3 style="margin-top: 0;">Interested in this project?</h3>
                            <button style="width: 100%; background: ${accentColor}; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>
            @media(max-width: 768px) {
                .project-content { grid-template-columns: 1fr !important; }
            }
            .project-map iframe { width: 100% !important; height: 100% !important; border: 0; }
            </style>
        `;
    }
}

window.elementorWidgetManager.registerWidget(SingleProjectWidget);
