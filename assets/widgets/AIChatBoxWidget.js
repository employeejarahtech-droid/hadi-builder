
class AIChatBoxWidget extends WidgetBase {
    getName() {
        return 'AIChatBoxWidget';
    }

    getTitle() {
        return 'AI Chat Box';
    }

    getIcon() {
        return 'fas fa-robot';
    }

    getCategories() {
        return ['interactive', 'social', 'basic'];
    }

    registerControls() {
        this.startControlsSection('content_section', {
            label: 'Content',
            tab: 'content'
        });

        this.addControl('chat_title', {
            type: 'text',
            label: 'Chat Title',
            default_value: 'AI Assistant'
        });

        this.addControl('welcome_message', {
            type: 'textarea',
            label: 'Welcome Message',
            default_value: 'Hello! How can I assist you today?'
        });

        this.addControl('position', {
            type: 'select',
            label: 'Position',
            default_value: 'bottom: 20px; right: 20px;',
            options: [
                { value: 'bottom: 20px; right: 20px;', label: 'Bottom Right' },
                { value: 'bottom: 20px; left: 20px;', label: 'Bottom Left' }
            ],
            selectors: {
                '.client-preview {{WRAPPER}} .ai-chat-widget-wrapper': 'position: fixed; z-index: 9999; {{VALUE}}'
            }
        });

        this.addControl('steps', {
            type: 'repeater',
            label: 'Conversation Steps',
            item_label: 'Step',
            fields: [
                {
                    name: 'step_type',
                    label: 'Type',
                    type: 'select',
                    options: [
                        { value: 'radio', label: 'Radio (Single Choice)' },
                        { value: 'checkbox', label: 'Checkbox (Multi Choice)' },
                        { value: 'form', label: 'Lead Form' }
                    ],
                    default: 'radio'
                },
                {
                    name: 'question',
                    label: 'Question / Form Title',
                    type: 'text',
                    default: 'What reflect your interest?'
                },
                {
                    name: 'options',
                    label: 'Options (for Radio/Checkbox)',
                    type: 'textarea',
                    default: 'Support, Sales, Product Info'
                }
            ],
            default_value: [
                {
                    step_type: 'checkbox',
                    question: 'Select your interests:',
                    options: 'Web Design, App Development, SEO'
                },
                {
                    step_type: 'radio',
                    question: 'What is your budget range?',
                    options: 'Under $1k, $1k-$5k, $5k+'
                },
                {
                    step_type: 'form',
                    question: 'Please leave your contact info:',
                    options: ''
                }
            ]
        });

        this.endControlsSection();

        this.startControlsSection('style_section', {
            label: 'Style',
            tab: 'style'
        });

        this.addControl('theme_color', {
            type: 'color',
            label: 'Theme Color',
            default_value: '#4F46E5',
            selectors: {
                '{{WRAPPER}} .ai-chat-toggle-btn': 'background-color: {{VALUE}};',
                '{{WRAPPER}} .ai-chat-header': 'background-color: {{VALUE}};'
            }
        });

        this.addControl('text_color', {
            type: 'color',
            label: 'Text Color',
            default_value: '#ffffff',
            selectors: {
                '{{WRAPPER}} .ai-chat-toggle-btn': 'color: {{VALUE}};',
                '{{WRAPPER}} .ai-chat-header': 'color: {{VALUE}};'
            }
        });

        this.endControlsSection();
    }

    render() {
        // Fallbacks for direct call vs instance
        const title = this.getSetting('chat_title') || 'AI Assistant';
        const welcomeMessage = this.getSetting('welcome_message') || 'Hello! How can I assist you today?';
        const position = this.getSetting('position') || 'bottom: 20px; right: 20px;';
        const steps = this.getSetting('steps') || [];
        const themeColor = this.getSetting('theme_color') || '#4F46E5';

        // Unique ID for toggle functionality
        const widgetId = Math.random().toString(36).substr(2, 9);
        const toggleId = `ai-chat-toggle-${widgetId}`;
        const boxId = `ai-chat-box-${widgetId}`;

        // Encode steps for JS - CAREFUL MAPPING
        const stepsJson = JSON.stringify(steps).replace(/"/g, '&quot;');

        return `
            <div class="ai-chat-widget-wrapper" 
                 data-widget-id="${widgetId}" 
                 data-steps="${stepsJson}"
                 data-theme-color="${themeColor}"
                 data-welcome-message="${encodeURIComponent(welcomeMessage)}">
                 
                <!-- Chat Window -->
                <div id="${boxId}" class="ai-chat-box">
                    <div class="ai-chat-header">
                        <div class="ai-chat-title">
                            <i class="fas fa-robot"></i> ${title}
                        </div>
                        <div class="ai-chat-actions">
                            <button class="ai-chat-reset" title="Reset Chat">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button class="ai-chat-close" onclick="document.getElementById('${boxId}').style.display = 'none'; document.getElementById('${toggleId}').style.display = 'flex';">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="ai-chat-body">
                        <div class="ai-message bot-message">
                            ${welcomeMessage}
                        </div>
                    </div>
                    <div class="ai-chat-input-area">
                        <input type="text" placeholder="Type a message...">
                        <button><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>

                <!-- Toggle Button -->
                <button id="${toggleId}" class="ai-chat-toggle-btn" onclick="document.getElementById('${boxId}').style.display = 'flex'; this.style.display = 'none';">
                    <i class="fas fa-comment-dots"></i>
                </button>
            </div>

            <style>
                .ai-chat-widget-wrapper {
                    position: relative; /* Default for builder */
                    pointer-events: auto;
                    z-index: 9999;
                }
                
                /* Scoped fix for frontend */
                body.client-preview .ai-chat-widget-wrapper {
                    position: fixed; 
                    z-index: 9999;
                    ${position}
                }

                .ai-chat-toggle-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .ai-chat-toggle-btn:hover {
                    transform: scale(1.1);
                }

                .ai-chat-box {
                    display: none; /* Hidden by default */
                    flex-direction: column;
                    width: 350px;
                    height: 500px;
                    max-height: 80vh;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    overflow: hidden;
                    position: absolute;
                    bottom: 80px;
                    right: 0; /* Aligns with button wrapper */
                    animation: aiSlideUp 0.3s ease-out;
                }
                
                @keyframes aiSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .ai-chat-header {
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                }
                
                .ai-chat-actions {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .ai-chat-close, .ai-chat-reset {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    opacity: 0.8;
                    font-size: 16px;
                }
                
                .ai-chat-reset:hover {
                    color: #ef4444; /* Red for reset */
                    opacity: 1;
                }

                .ai-chat-body {
                    flex: 1;
                    padding: 20px;
                    background: #f9fafb;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .ai-message {
                    padding: 10px 15px;
                    border-radius: 12px;
                    max-width: 80%;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .bot-message {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }
                
                .user-message {
                    background: var(--theme-color, #4F46E5);
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }

                /* Option Buttons */
                .ai-options-container {
                     display: flex;
                     flex-direction: column;
                     gap: 8px;
                     margin-top: 5px;
                     align-self: flex-start;
                     width: 100%;
                }

                .ai-option-btn {
                    background: #fff;
                    border: 1px solid var(--theme-color, #4F46E5);
                    color: var(--theme-color, #4F46E5);
                    padding: 8px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    text-align: left;
                    transition: all 0.2s;
                }

                .ai-option-btn:hover {
                    background: var(--theme-color, #4F46E5);
                    color: #fff;
                }

                .ai-chat-input-area {
                    padding: 15px;
                    border-top: 1px solid #f3f4f6;
                    display: flex;
                    gap: 10px;
                    background: #fff;
                }

                .ai-chat-input-area input {
                    flex: 1;
                    border: 1px solid #e5e7eb;
                    padding: 8px 15px;
                    border-radius: 20px;
                    outline: none;
                    font-size: 14px;
                }
                
                .ai-chat-input-area button {
                    background: none;
                    border: none;
                    color: #4F46E5;
                    cursor: pointer;
                    font-size: 18px;
                }
                
                .ai-chat-input-area.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
            </style>
        `;
    }

    onContentRendered() {
        // PublicRenderer calls this with no args, sets this.$el
        const element = this.$el;
        if (!element) return;

        if (element.dataset && element.dataset.aiChatInitialized === 'true') return;

        const wrapper = element.classList && element.classList.contains('ai-chat-widget-wrapper')
            ? element
            : element.querySelector('.ai-chat-widget-wrapper');

        if (!wrapper) return;

        element.dataset.aiChatInitialized = 'true';

        const input = wrapper.querySelector('input');
        const btn = wrapper.querySelector('.ai-chat-input-area button');
        const inputArea = wrapper.querySelector('.ai-chat-input-area');
        const msgs = wrapper.querySelector('.ai-chat-body');
        const resetBtn = wrapper.querySelector('.ai-chat-reset');

        if (!msgs) return;

        // DEBUG: Console only (no visible messages)
        const debugMsg = (msg) => {
            console.log('AIChatBox:', msg);
            // Uncomment below to show debug in chat:
            // const d = document.createElement('div');
            // d.style.fontSize = '10px'; d.style.color = 'red'; d.textContent = 'DBG: ' + msg;
            // msgs.appendChild(d);
        };

        // Read Settings
        const getAttr = (name) => wrapper.getAttribute(name);

        // DECODING LOGIC
        let rawSteps = getAttr('data-steps') || '[]';
        // Safety: replace &quot; with " if present
        rawSteps = rawSteps.replace(/&quot;/g, '"');

        let steps = [];
        try {
            steps = JSON.parse(rawSteps);
        } catch (e) {
            debugMsg('Parse Error: ' + e.message);
        }

        // Handle case where steps is null or not array
        if (!Array.isArray(steps)) steps = [];

        const themeColor = getAttr('data-theme-color') || '#4F46E5';
        const welcomeMessage = decodeURIComponent(getAttr('data-welcome-message') || '') || 'Hello! How can I assist you today?';

        // FALLBACK DEFAULTS
        if (steps.length === 0) {
            debugMsg('Falling back to Demo Steps');
            steps = [
                {
                    step_type: 'checkbox',
                    question: 'Select your interests:',
                    options: 'Web Design, App Development, SEO'
                },
                {
                    step_type: 'radio',
                    question: 'What is your budget range?',
                    options: 'Under $1k, $1k-$5k, $5k+'
                }
            ];
        } else {
            debugMsg('Steps Loaded: ' + steps.length);
        }

        let currentStepIndex = 0;
        const storageKey = 'ai_chat_history_v2';

        const scrollToBottom = () => {
            setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
        };

        const saveHistory = (text, type) => {
            try {
                const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
                history.push({ text, type, timestamp: new Date().getTime() });
                localStorage.setItem(storageKey, JSON.stringify(history));
            } catch (e) { }
        };

        const loadHistory = () => {
            try {
                const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if (history.length > 0) {
                    history.forEach(msg => {
                        const div = document.createElement('div');
                        div.className = `ai-message ${msg.type}-message`;
                        if (msg.type === 'user') div.style.backgroundColor = themeColor;
                        div.textContent = msg.text;
                        msgs.appendChild(div);
                    });
                    scrollToBottom();
                    return true;
                }
            } catch (e) { }
            return false;
        };

        const clearHistory = () => {
            localStorage.removeItem(storageKey);
            msgs.innerHTML = '';

            const bMsg = document.createElement('div');
            bMsg.className = 'ai-message bot-message';
            bMsg.textContent = welcomeMessage;
            msgs.appendChild(bMsg);

            currentStepIndex = 0;
            debugMsg('History Cleared. Restarting...');
            startFlow();
        };

        const addUserMessage = (text, save = true) => {
            const uMsg = document.createElement('div');
            uMsg.className = 'ai-message user-message';
            uMsg.style.backgroundColor = themeColor;
            uMsg.textContent = text;
            msgs.appendChild(uMsg);
            scrollToBottom();
            if (save) saveHistory(text, 'user');
        };

        const addBotMessage = (text, save = true) => {
            const bMsg = document.createElement('div');
            bMsg.className = 'ai-message bot-message';
            bMsg.textContent = text;
            msgs.appendChild(bMsg);
            scrollToBottom();
            if (save) saveHistory(text, 'bot');
        };

        const sendMessage = () => {
            const txt = input.value.trim();
            if (!txt) return;
            addUserMessage(txt);
            input.value = '';
            setTimeout(() => {
                addBotMessage("I'm a simulated AI response.");
            }, 1000);
        };

        // DOM Listeners
        if (btn) { btn.onclick = null; btn.addEventListener('click', sendMessage); }
        if (input) {
            input.onkeypress = null;
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
            });
        }
        if (resetBtn) { resetBtn.onclick = null; resetBtn.addEventListener('click', clearHistory); }

        const handleGuidedFlow = () => {
            debugMsg('Step: ' + currentStepIndex);
            if (currentStepIndex >= steps.length) {
                setTimeout(() => {
                    addBotMessage("An agent will be with you shortly.");
                    if (inputArea) inputArea.classList.remove('disabled');
                    if (input) { input.disabled = false; input.focus(); }
                    if (btn) btn.disabled = false;
                }, 500);
                return;
            }

            const step = steps[currentStepIndex];
            const stepType = step.step_type || 'radio';

            if (!step.question) { currentStepIndex++; handleGuidedFlow(); return; }

            setTimeout(() => {
                addBotMessage(step.question);

                if (stepType === 'form') {
                    // Form
                    const formContainer = document.createElement('div');
                    formContainer.className = 'ai-options-container';
                    formContainer.style.background = '#f3f4f6';
                    formContainer.style.padding = '10px';
                    formContainer.style.borderRadius = '8px';

                    const createInput = (ph) => {
                        const i = document.createElement('input');
                        i.placeholder = ph;
                        i.className = 'ai-form-input';
                        i.style.width = '100%'; i.style.marginBottom = '5px';
                        i.style.padding = '8px'; i.style.borderRadius = '4px';
                        i.style.border = '1px solid #e5e7eb';
                        return i;
                    }
                    const n = createInput('Name');
                    const m = createInput('Mobile');
                    const e = createInput('Email');
                    const a = createInput('Address');
                    const s = document.createElement('button');
                    s.textContent = 'Submit';
                    s.style.width = '100%'; s.style.background = themeColor; s.style.color = 'white'; s.style.padding = '10px';
                    s.style.border = 'none'; s.style.cursor = 'pointer'; s.style.borderRadius = '4px';
                    s.style.marginTop = '5px';

                    s.onclick = () => {
                        if (!n.value || !m.value || !e.value || !a.value) {
                            addBotMessage('⚠️ Please fill in all fields (Name, Mobile, Email, Address).', false);
                            return;
                        }

                        // Disable submit button and show loading
                        s.disabled = true;
                        s.textContent = 'Submitting...';

                        // Prepare form data
                        const formData = {
                            name: n.value,
                            mobile: m.value,
                            email: e.value,
                            address: a.value
                        };

                        // Submit to API
                        fetch('/api/submit-widget-form.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                widget_name: 'AIChatBoxWidget',
                                form_data: formData
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    addUserMessage(`${n.value}, ${m.value}, ${e.value}, ${a.value}`);
                                    addBotMessage(`✅ Thank you! Your information has been received. (Ref: #${data.id})`);
                                } else {
                                    addBotMessage('❌ Error: ' + (data.error || 'Unknown error'));
                                    s.disabled = false;
                                    s.textContent = 'Submit';
                                    return;
                                }
                                formContainer.remove();
                                currentStepIndex++;
                                handleGuidedFlow();
                            })
                            .catch(err => {
                                console.error('Form submission error:', err);
                                addBotMessage('❌ Network error. Please try again.');
                                s.disabled = false;
                                s.textContent = 'Submit';
                            });
                    };
                    formContainer.append(n, m, e, a, s);
                    msgs.appendChild(formContainer);
                    scrollToBottom();
                } else {
                    // Radio/Checkbox
                    const opts = step.options ? step.options.split(',') : [];
                    if (opts.length > 0) {
                        const c = document.createElement('div');
                        c.className = 'ai-options-container';
                        let sel = [];

                        opts.forEach(o => {
                            const b = document.createElement('button');
                            b.className = 'ai-option-btn';
                            b.textContent = o.trim();
                            b.style.display = 'block'; b.style.width = '100%';
                            b.style.marginBottom = '5px'; b.style.padding = '8px';
                            b.style.background = 'white';
                            b.style.color = themeColor;
                            b.style.border = `1px solid ${themeColor}`;
                            b.style.borderRadius = '15px';
                            b.style.cursor = 'pointer';

                            if (stepType === 'checkbox') {
                                b.onclick = () => {
                                    if (sel.includes(o.trim())) {
                                        sel = sel.filter(x => x !== o.trim());
                                        b.style.background = 'white'; b.style.color = themeColor;
                                    } else {
                                        sel.push(o.trim());
                                        b.style.background = themeColor; b.style.color = 'white';
                                    }
                                };
                            } else {
                                b.onclick = () => {
                                    addUserMessage(o.trim());
                                    c.remove();
                                    currentStepIndex++;
                                    handleGuidedFlow();
                                };
                            }
                            c.appendChild(b);
                        });

                        if (stepType === 'checkbox') {
                            const n = document.createElement('button');
                            n.textContent = 'Next >';
                            n.style.width = '100%'; n.style.marginTop = '5px'; n.style.background = themeColor; n.style.color = 'white';
                            n.style.border = 'none'; n.style.padding = '8px'; n.style.cursor = 'pointer';
                            n.onclick = () => {
                                if (sel.length === 0) {
                                    addBotMessage('⚠️ Please select at least one option.', false);
                                    return;
                                }
                                addUserMessage(sel.join(', '));
                                c.remove();
                                currentStepIndex++;
                                handleGuidedFlow();
                            };
                            c.appendChild(n);
                        }
                        msgs.appendChild(c);
                        scrollToBottom();
                    } else {
                        currentStepIndex++; handleGuidedFlow();
                    }
                }
            }, 600);
        };

        const startFlow = () => {
            debugMsg('Starting Flow...');
            if (inputArea) inputArea.classList.add('disabled');
            if (input) { input.disabled = true; input.placeholder = "Select option..."; }
            if (btn) btn.disabled = true;
            setTimeout(handleGuidedFlow, 1000);
        }

        const hasHistory = loadHistory();
        if (!hasHistory) {
            startFlow();
        } else {
            if (inputArea) inputArea.classList.remove('disabled');
            if (input) input.disabled = false;
            if (btn) btn.disabled = false;
        }
    }
}


