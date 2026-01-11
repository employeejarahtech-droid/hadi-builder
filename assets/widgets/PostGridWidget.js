class PostGridWidget extends WidgetBase {
    getName() { return 'post_grid'; }
    getTitle() { return 'Post Grid'; }
    getIcon() { return 'fas fa-th-large'; }
    getCategories() { return ['content']; }
    getKeywords() { return ['post', 'blog', 'news', 'grid']; }

    registerControls() {
        this.startControlsSection('content_section', { label: 'Content', tab: 'content' });

        this.addControl('posts_per_page', {
            type: 'slider',
            label: 'Posts Per Page',
            default_value: { size: 6, unit: '' },
            range: { min: 1, max: 50, step: 1 }
        });

        this.addControl('columns', {
            type: 'select',
            label: 'Columns',
            default_value: '3',
            options: [
                { value: '1', label: '1 Column' },
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' }
            ]
        });

        this.endControlsSection();

        this.startControlsSection('style_section', { label: 'Style', tab: 'style' });
        this.addControl('title_color', { type: 'color', label: 'Title Color', default_value: '#1e293b' });
        this.addControl('button_color', { type: 'color', label: 'Button Color', default_value: '#3b82f6' });
        this.endControlsSection();

        this.registerAdvancedControls();
    }

    render() {
        const postsPerPage = this.getSetting('posts_per_page', { size: 6 }).size;
        const columns = this.getSetting('columns', '3');
        const titleColor = this.getSetting('title_color', '#1e293b');
        const buttonColor = this.getSetting('button_color', '#3b82f6');

        const cssId = this.getSetting('css_id', '') || 'post-grid-' + Math.random().toString(36).substr(2, 9);
        const cssClasses = this.getSetting('css_classes', '');

        // Wrapper init
        const wrapperClasses = ['post-grid-widget', cssClasses];
        const wrapperAttr = cssId ? ` id="${cssId}"` : '';

        // Pass settings to global for loader
        window[`postGrid_${cssId}`] = { postsPerPage, columns, titleColor, buttonColor };

        // Use robust polling
        this.waitForContainer(cssId);

        return `<div class="${wrapperClasses.join(' ')}"${wrapperAttr} style="min-height: 200px;">
            <div class="post-grid-loading" style="text-align: center; padding: 40px; color: #64748b;">
                <i class="fas fa-spinner fa-spin fa-2x"></i><br>Loading posts...
                <div class="loading-status" style="font-size:12px; margin-top:10px; opacity:0.7;">Initializing...</div>
            </div>
        </div>`;
    }

    waitForContainer(containerId, attempts = 0) {
        const container = document.getElementById(containerId);
        if (container) {
            console.log(`[PostGrid] Container ${containerId} found after ${attempts} attempts`);
            this.loadPosts(containerId);
        } else if (attempts < 20) {
            setTimeout(() => this.waitForContainer(containerId, attempts + 1), 100);
        } else {
            console.error(`[PostGrid] timeout: Container ${containerId} not found`);
        }
    }

    async loadPosts(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const statusEl = container.querySelector('.loading-status');
        const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };

        const config = window[`postGrid_${containerId}`];
        if (!config) return;

        try {
            setStatus("Fetching posts...");
            const baseUrl = window.CMS_ROOT || '';
            const fetchUrl = `${baseUrl}/api/get-posts.php?limit=${config.postsPerPage}`;
            console.log('[PostGrid] Fetching:', fetchUrl);

            const res = await fetch(fetchUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            if (data.success && data.posts && data.posts.length > 0) {
                setStatus(`Loaded ${data.posts.length} posts`);
                this.renderGrid(container, data.posts, config);
            } else {
                container.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748b;">No posts found.</div>`;
            }

        } catch (e) {
            console.error('[PostGrid] Error loading posts:', e);
            container.innerHTML = `<div style="text-align: center; color: #ef4444;">Failed to load blog posts.<br><small>${e.message}</small></div>`;
        }
    }

    renderGrid(container, posts, config) {
        const baseUrl = window.CMS_ROOT || '';
        const gridStyle = `display: grid; grid-template-columns: repeat(${config.columns}, 1fr); gap: 30px;`;

        let html = `<div style="${gridStyle}" class="post-grid-layout">`;

        posts.forEach(post => {
            const date = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const image = post.image || 'https://via.placeholder.com/600x400?text=No+Image';

            html += `
            <article style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: transform 0.2s; border: 1px solid #e2e8f0;" 
                onmouseover="this.style.transform='translateY(-5px)'" 
                onmouseout="this.style.transform='translateY(0)'">
                
                <a href="${baseUrl}/blog/${post.slug}" style="text-decoration: none; color: inherit; display: block;">
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${image}" alt="${this.escapeHtml(post.title)}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    
                    <div style="padding: 24px;">
                        <div style="font-size: 14px; color: #94a3b8; margin-bottom: 8px;">
                            ${date}
                        </div>
                        
                        <h3 style="margin: 0 0 12px 0; font-size: 20px; line-height: 1.4; color: ${config.titleColor}; font-weight: 700;">
                            ${this.escapeHtml(post.title)}
                        </h3>
                        
                        <p style="margin: 0 0 20px 0; color: #64748b; line-height: 1.6; font-size: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            ${this.escapeHtml(post.meta_description || 'Click to read more...')}
                        </p>
                        
                        <span style="color: ${config.buttonColor}; font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 6px;">
                            Read Article <i class="fas fa-arrow-right" style="font-size: 12px;"></i>
                        </span>
                    </div>
                </a>
            </article>
            `;
        });

        html += `</div>`;

        // Responsive Mobile
        html += `
        <style>
            @media (max-width: 768px) {
                #${container.id} .post-grid-layout {
                    grid-template-columns: 1fr !important;
                }
            }
        </style>
        `;

        container.innerHTML = html;
    }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

window.elementorWidgetManager.registerWidget(PostGridWidget);
