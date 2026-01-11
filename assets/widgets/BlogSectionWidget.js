/**
 * BlogSectionWidget - A specialized widget for blog posts sections
 * Displays latest blog posts with title, excerpt, and read more link
 */
class BlogSectionWidget extends WidgetBase {
    getName() {
        return 'blog-section';
    }

    getTitle() {
        return 'Blog Section';
    }

    getIcon() {
        return 'fa fa-blog';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['blog', 'posts', 'articles', 'news'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Latest from Our Blog',
            section_subtitle: 'News & Updates',
            posts_count: '3',
            show_excerpt: 'yes'
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Blog Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Latest from Our Blog',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'News & Updates',
            placeholder: 'Enter subtitle'
        });

        this.addControl('posts_count', {
            type: 'select',
            label: 'Number of Posts',
            options: [
                { value: '3', label: '3 Posts' },
                { value: '6', label: '6 Posts' },
                { value: '9', label: '9 Posts' }
            ],
            default_value: '3'
        });

        this.addControl('show_excerpt', {
            type: 'select',
            label: 'Show Excerpt',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ],
            default_value: 'yes'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const sectionTitle = this.getSetting('section_title', 'Latest from Our Blog');
        const sectionSubtitle = this.getSetting('section_subtitle', 'News & Updates');
        const postsCount = this.getSetting('posts_count', '3');
        const showExcerpt = this.getSetting('show_excerpt', 'yes');

        // Placeholder blog posts (in production, this would fetch from API)
        const placeholderPosts = [
            {
                title: 'Getting Started with Web Development',
                excerpt: 'Learn the fundamentals of modern web development and build your first website.',
                image: 'https://placehold.co/400x300',
                link: '#',
                date: 'Jan 5, 2026'
            },
            {
                title: 'The Future of Digital Marketing',
                excerpt: 'Explore emerging trends and strategies in digital marketing for 2026.',
                image: 'https://placehold.co/400x300',
                link: '#',
                date: 'Jan 3, 2026'
            },
            {
                title: 'UI/UX Design Best Practices',
                excerpt: 'Discover the principles of creating intuitive and beautiful user interfaces.',
                image: 'https://placehold.co/400x300',
                link: '#',
                date: 'Dec 28, 2025'
            }
        ];

        const posts = placeholderPosts.slice(0, parseInt(postsCount));

        const postsHTML = posts.map(post => {
            const excerptHTML = showExcerpt === 'yes' ? `<p class="blog-excerpt">${this.escapeHtml(post.excerpt)}</p>` : '';

            return `
        <div class="blog-item">
          <div class="blog-image">
            <img src="${post.image}" alt="${this.escapeHtml(post.title)}">
          </div>
          <div class="blog-content">
            <span class="blog-date">${post.date}</span>
            <h3 class="blog-title">${this.escapeHtml(post.title)}</h3>
            ${excerptHTML}
            <a href="${post.link}" class="blog-link">Read More →</a>
          </div>
        </div>
      `;
        }).join('');

        return `
<div class="blog-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="blog-grid">
      ${postsHTML}
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

window.elementorWidgetManager.registerWidget(BlogSectionWidget);
