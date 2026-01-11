/**
 * TeamSectionWidget - A specialized widget for team members sections
 * Provides a repeater control for team members with photos, names, roles, bios, and social links
 */
class TeamSectionWidget extends WidgetBase {
    getName() {
        return 'team-section';
    }

    getTitle() {
        return 'Team Section';
    }

    getIcon() {
        return 'fa fa-users';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['team', 'members', 'staff', 'people', 'employees'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            section_title: 'Meet Our Team',
            section_subtitle: 'The People Behind Our Success',
            team_members: [
                {
                    photo: { url: 'https://i.pravatar.cc/300?img=12' },
                    name: 'John Doe',
                    role: 'CEO & Founder',
                    bio: 'Passionate leader with 10+ years of experience in the industry.',
                    social_links: 'https://twitter.com/johndoe\nhttps://linkedin.com/in/johndoe'
                },
                {
                    photo: { url: 'https://i.pravatar.cc/300?img=5' },
                    name: 'Jane Smith',
                    role: 'Creative Director',
                    bio: 'Award-winning designer with a keen eye for detail and innovation.',
                    social_links: 'https://twitter.com/janesmith\nhttps://linkedin.com/in/janesmith'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'Team Content',
            tab: 'content'
        });

        this.addControl('section_title', {
            type: 'text',
            label: 'Section Title',
            default_value: 'Meet Our Team',
            placeholder: 'Enter section title'
        });

        this.addControl('section_subtitle', {
            type: 'text',
            label: 'Section Subtitle',
            default_value: 'The People Behind Our Success',
            placeholder: 'Enter subtitle'
        });

        this.addControl('team_members', {
            type: 'repeater',
            label: 'Team Members',
            default_value: [],
            fields: [
                {
                    name: 'photo',
                    type: 'media',
                    label: 'Photo',
                    default_value: { url: 'https://i.pravatar.cc/300' }
                },
                {
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    default_value: 'Team Member',
                    placeholder: 'Enter name'
                },
                {
                    name: 'role',
                    type: 'text',
                    label: 'Role/Position',
                    default_value: 'Position',
                    placeholder: 'Enter role'
                },
                {
                    name: 'bio',
                    type: 'textarea',
                    label: 'Bio',
                    default_value: 'Short bio about the team member.',
                    placeholder: 'Enter bio'
                },
                {
                    name: 'social_links',
                    type: 'textarea',
                    label: 'Social Links (one per line)',
                    default_value: '',
                    placeholder: 'https://twitter.com/username\nhttps://linkedin.com/in/username'
                }
            ],
            title_field: 'name'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        const sectionTitle = this.getSetting('section_title', 'Meet Our Team');
        const sectionSubtitle = this.getSetting('section_subtitle', 'The People Behind Our Success');
        const teamMembers = this.getSetting('team_members', []);

        let teamHTML = '';
        if (teamMembers && teamMembers.length > 0) {
            teamHTML = teamMembers.map(member => {
                const socialLinks = (member.social_links || '').split('\n').filter(link => link.trim());
                const socialHTML = socialLinks.map(link => {
                    const url = link.trim();
                    let icon = 'fa-link';
                    if (url.includes('twitter.com')) icon = 'fa-twitter';
                    else if (url.includes('facebook.com')) icon = 'fa-facebook-f';
                    else if (url.includes('linkedin.com')) icon = 'fa-linkedin-in';
                    else if (url.includes('instagram.com')) icon = 'fa-instagram';

                    return `<a href="${url}" target="_blank" rel="noopener noreferrer"><i class="fab ${icon}"></i></a>`;
                }).join('');

                return `
          <div class="team-member">
            <div class="team-photo">
              <img src="${member.photo?.url || 'https://i.pravatar.cc/300'}" alt="${this.escapeHtml(member.name || '')}">
            </div>
            <div class="team-info">
              <h3 class="team-name">${this.escapeHtml(member.name || 'Team Member')}</h3>
              <p class="team-role">${this.escapeHtml(member.role || '')}</p>
              <p class="team-bio">${this.escapeHtml(member.bio || '')}</p>
              ${socialHTML ? `<div class="team-social">${socialHTML}</div>` : ''}
            </div>
          </div>
        `;
            }).join('');
        }

        return `
<div class="team-section">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="section-title">${this.escapeHtml(sectionTitle)}</h2>
      <p class="section-subtitle">${this.escapeHtml(sectionSubtitle)}</p>
    </div>
    <div class="team-grid">
      ${teamHTML}
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

window.elementorWidgetManager.registerWidget(TeamSectionWidget);
