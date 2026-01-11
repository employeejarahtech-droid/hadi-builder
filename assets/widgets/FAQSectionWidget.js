/**
 * FAQSectionWidget - A specialized widget for FAQ sections
 * Provides a repeater control for FAQ items with questions and answers
 */
class FAQSectionWidget extends WidgetBase {
    getName() {
        return 'faq-section';
    }

    getTitle() {
        return 'FAQ Section';
    }

    getIcon() {
        return 'fa fa-question-circle';
    }

    getCategories() {
        return ['section', 'content'];
    }

    getKeywords() {
        return ['faq', 'question', 'answer', 'accordion', 'help'];
    }

    isContainer() {
        return false;
    }

    getDefaultSettings() {
        return {
            faq_items: [
                {
                    question: 'What is your return policy?',
                    answer: 'We offer a 30-day money-back guarantee on all products. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund.'
                },
                {
                    question: 'How long does shipping take?',
                    answer: 'Standard shipping typically takes 5-7 business days. Express shipping options are available for 2-3 day delivery.'
                },
                {
                    question: 'Do you offer international shipping?',
                    answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
                },
                {
                    question: 'How can I track my order?',
                    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.'
                }
            ]
        };
    }

    registerControls() {
        // Content Section
        this.startControlsSection('content_section', {
            label: 'FAQ Items',
            tab: 'content'
        });

        // FAQ Items Repeater
        this.addControl('faq_items', {
            type: 'repeater',
            label: 'FAQ Items',
            default_value: [],
            fields: [
                {
                    name: 'question',
                    type: 'text',
                    label: 'Question',
                    default_value: 'Your question here?',
                    placeholder: 'Enter question'
                },
                {
                    name: 'answer',
                    type: 'textarea',
                    label: 'Answer',
                    default_value: 'Your answer here.',
                    placeholder: 'Enter answer'
                }
            ],
            title_field: 'question'
        });

        this.endControlsSection();
    }

    constructor() {
        super();
    }

    render() {
        // Get control values
        const faqItems = this.getSetting('faq_items', []);

        // Build FAQ Items HTML
        let faqItemsHTML = '';
        if (faqItems && faqItems.length > 0) {
            faqItemsHTML = faqItems.map((item, index) => {
                const question = item.question || 'Question?';
                const answer = item.answer || 'Answer.';

                return `
            <li class="accordion-li-${index}">
              <h3>
                <span>${this.escapeHtml(question)}</span>
                <span><i class="jarrow-arrow-seventy-four-down"></i></span>
              </h3>
              <div class="answer">
                <p>${this.escapeHtml(answer)}</p>
              </div>
            </li>`;
            }).join('');
        }

        // Return the complete FAQ HTML structure
        return `
<div class="faq-block-2">
  <div class="container">
    <div class="comingsoon-body-item block-item">
      <div class="title title_1bececf">
        <h2>
          <span></span>
          <span>FAQ</span>
          <span></span>
        </h2>
      </div>
    </div>
    <div class="comingsoon-body-item block-item">
      <div class="plain_text plain_text_1bececf">
        <p>
          Frequently asked questions about our services and products.
        </p>
      </div>
    </div>
    <div class="comingsoon-body-item block-item">
      <ul class="accordion-list">
        ${faqItemsHTML}
      </ul>
    </div>
  </div>
</div>
    `;
    }

    onContentRendered() {
        console.log('=== FAQ onContentRendered START ===');
        console.log('FAQ this.$el:', this.$el);
        console.log('FAQ this.$el type:', typeof this.$el);

        // Try multiple selection methods
        const $wrapper = $(this.$el);
        console.log('FAQ $wrapper:', $wrapper);
        console.log('FAQ $wrapper.length:', $wrapper.length);

        const $faqBlock = $wrapper.find('.faq-block-2');
        console.log('FAQ $faqBlock found:', $faqBlock.length);

        const $accordionList = $wrapper.find('.accordion-list');
        console.log('FAQ $accordionList found:', $accordionList.length);

        const $faqItems = $wrapper.find('.accordion-list > li');
        console.log('FAQ items found:', $faqItems.length);

        // Log the actual HTML to see structure
        console.log('FAQ HTML structure:', $wrapper.html()?.substring(0, 200));

        if ($faqItems.length === 0) {
            console.error('FAQ ERROR: No FAQ items found! Check HTML structure.');
            return;
        }

        // Use event delegation for better compatibility
        $wrapper.on('click', '.accordion-list > li', function (e) {
            console.log('=== FAQ CLICK EVENT FIRED ===');
            console.log('FAQ clicked element:', this);
            console.log('FAQ event:', e);

            const $this = $(this);

            if ($this.hasClass("active")) {
                // Close this item
                console.log('FAQ: Closing active item');
                $this.removeClass("active").find(".answer").slideUp(300);
            } else {
                // Close all other items
                console.log('FAQ: Closing other items and opening this one');
                $wrapper.find(".accordion-list > li.active .answer").slideUp(300);
                $wrapper.find(".accordion-list > li.active").removeClass("active");

                // Open this item
                $this.addClass("active").find(".answer").slideDown(300);
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        console.log('FAQ: Event delegation attached successfully');
        console.log('=== FAQ onContentRendered END ===');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.elementorWidgetManager.registerWidget(FAQSectionWidget);
