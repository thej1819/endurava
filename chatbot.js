/**
 * Eva — Endurava's Virtual Assistant
 * Conversational widget for hiring, career and training questions
 */

// Broad FAQ knowledge base. Checked whenever the active flow's own
// keywords don't match, so a question never dead-ends just because
// it came up mid-flow.
const KNOWLEDGE_BASE = [
  {
    keywords: ['contact', 'email', 'phone', 'address', 'reach you'],
    response: "**Contact Information:**\n\nEmail: admin@enduravatech.com\nPhone: +91 77805 80473\nLocation: Hyderabad, Telangana, India\n\nOr visit our contact page for a form!",
  },
  {
    keywords: ['pricing', 'cost', 'fee', 'fees', 'price', 'charges'],
    response: "Great question! Pricing depends on what you need:\n\n**Recruitment**: Performance-based or retained search\n**Training**: Flexible course pricing with payment plans\n\nShare a bit more about what you're looking for and I'll point you the right way, or contact our team for a custom quote!",
  },
  {
    keywords: ['success', 'testimonial', 'review', 'rating'],
    response: "We're proud of our impact!\n\nCheck out our Testimonials page to see real stories from:\n• Technology professionals who advanced their careers\n• Companies who built exceptional teams\n\nVisit: /testimonials",
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye', 'see you'],
    response: "You're welcome! Feel free to come back anytime you have a question. Have a great day!",
  },
  {
    keywords: ['location', 'office', 'where are you', 'based', 'city'],
    response: "We're based in Hyderabad, Telangana, India, and work with clients and talent across India (many roles and courses are remote-friendly).",
  },
  {
    keywords: ['duration', 'how long', 'weeks', 'months long'],
    response: "Our courses range from **4 weeks** (AI & Generative AI Fundamentals) up to **12 weeks** (Full-Stack + AI), depending on the track. Want details on a specific course?",
  },
  {
    keywords: ['certificate', 'certification', 'certified'],
    response: "Yes! Every course includes a certificate of completion, plus a portfolio of practical projects you can show employers.",
  },
  {
    keywords: ['guarantee', 'placement assistance', 'job after course', 'get a job'],
    response: "We provide dedicated placement **assistance** and real employer connections — while no ethical provider can promise a guaranteed job, most of our learners get placed within 3-6 months of completing training.",
  },
  {
    keywords: ['beginner', 'no experience', 'eligibility', 'who can join', 'prerequisite'],
    response: "Our programs welcome both complete beginners and working professionals upskilling into new areas. Most fundamentals courses need no prior experience — course pages list any specific prerequisites.",
  },
  {
    keywords: ['remote', 'work from home', 'onsite', 'hybrid'],
    response: "Many of the roles and courses we support are remote-friendly, though it varies by employer/role. Tell me which role or course you're asking about and I can be more specific.",
  },
  {
    keywords: ['internship', 'intern'],
    response: "We do support internship-style pathways for select training tracks. Let me know your area of interest and I'll point you toward the right course.",
  },
  {
    keywords: ['difference between recruitment and staffing', 'staffing vs', 'recruitment vs staffing'],
    response: "Good question — **Recruitment** is direct hiring for permanent roles, while **Staffing** provides flexible talent for project-based or contract needs. We offer both, tailored to what your team needs.",
  },
  {
    keywords: ['what is agentic ai', 'what is genai', 'what is generative ai', 'agentic ai', 'genai'],
    response: "**Generative AI (GenAI)** creates new content — text, code, images — from prompts. **Agentic AI** goes further, autonomously planning and carrying out multi-step tasks. Both are core focus areas across our talent placements and training programs.",
  },
  {
    keywords: ['apply', 'admission', 'enroll', 'enrolment', 'enrollment', 'sign up', 'register'],
    response: "Reach out through our Contact page and our team will walk you through enrollment and payment options for the training track that fits you.",
  },
  {
    keywords: ['company', 'about', 'mission', 'vision', 'culture', 'who are you', 'what do you do'],
    response: "We're Endurava Technologies!\n\nWe connect ambitious technology professionals with visionary organizations. Our mission:\n• **Hire smarter** with AI-driven recruitment\n• **Build stronger** with specialized talent\n• **Grow with AI** as a key differentiator\n\nWhat would you like to know more about — hiring, careers, or training?",
  },
  {
    keywords: ['working hours', 'office hours', 'available', 'business hours'],
    response: "Our team is available Monday–Saturday, 9 AM–7 PM IST. You can email us anytime and we'll get back to you promptly!",
  },
  {
    keywords: ['linkedin', 'instagram', 'facebook', 'social media'],
    response: "You can find us on LinkedIn, Instagram and Facebook — links are in the footer of every page!",
  },
  {
    keywords: ['why endurava', 'why choose you', 'what makes you different', 'why should i'],
    response: "A few reasons teams and talent choose us:\n• Technology-first, specialized focus (not generalist staffing)\n• AI-assisted matching and recruitment\n• We train **and** place — not just one or the other\n• Long-term relationships, not one-off placements",
  },
  {
    keywords: ['industries', 'sectors', 'domains'],
    response: "We focus primarily on the technology sector — software engineering, AI/ML, cloud, data, and emerging tech — for clients ranging from startups to enterprises.",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'hii', 'yo'],
    response: "Hey there! Great to meet you. How can I help — hiring, careers, or training?",
  },
];

// Tech-stack terms get a lightweight, context-aware nudge rather than a
// generic "I don't understand" — mirrors the hire-vs-job-seeker branch
// used by other recruitment chat assistants.
const TECH_STACK_KEYWORDS = [
  'python', 'java', '.net', 'react', 'angular', 'node', 'node.js', 'cloud',
  'aws', 'azure', 'gcp', 'devops', 'data engineering', 'cybersecurity',
  'salesforce', 'servicenow', 'sap', 'oracle', 'machine learning', 'ml',
];

const CHAT_ICON_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H8l-4 4V4Z"/></svg>';
const CLOSE_ICON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

class EvaChat {
  constructor() {
    this.isOpen = false;
    this.currentFlow = null;
    this.messages = [];
    this.init();
  }

  init() {
    this.createChatUI();
    this.attachEventListeners();
  }

  createChatUI() {
    const chatHTML = `
      <div id="eva-chat-container" class="chat-container">
        <!-- Floating Button -->
        <button id="chat-toggle-btn" class="chat-toggle-btn" title="Chat with Eva">
          <span class="chat-icon">${CHAT_ICON_SVG}</span>
          <span class="chat-badge" style="display:none">●</span>
        </button>

        <!-- Chat Window -->
        <div id="chat-window" class="chat-window" style="display:none">
          <div class="chat-header">
            <div>
              <h3>Eva</h3>
              <p>Endurava's virtual assistant</p>
            </div>
            <button id="chat-close-btn" class="chat-close-btn">${CLOSE_ICON_SVG}</button>
          </div>

          <div class="chat-messages" id="chat-messages">
            <!-- Messages will be inserted here -->
          </div>

          <div class="chat-input-area">
            <input
              type="text"
              id="chat-input"
              class="chat-input"
              placeholder="Type your question..."
            />
            <div id="chat-quick-replies" class="chat-quick-replies">
              <!-- Quick reply buttons will be inserted here -->
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const inputField = document.getElementById('chat-input');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && inputField.value.trim()) {
        this.handleUserInput(inputField.value.trim());
        inputField.value = '';
      }
    });
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle-btn');

    chatWindow.style.display = 'flex';
    toggleBtn.classList.add('active');
    this.isOpen = true;

    // Show welcome message if first time
    if (this.messages.length === 0) {
      this.showWelcome();
    }
  }

  closeChat() {
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle-btn');

    chatWindow.style.display = 'none';
    toggleBtn.classList.remove('active');
    this.isOpen = false;
  }

  showWelcome() {
    this.addMessage('bot', "Hi, I'm Eva — Endurava's virtual assistant. I can help with hiring, career opportunities, or training. What brings you here today?", true);
    this.showQuickReplies([
      { label: "I'm Hiring", action: 'hiring' },
      { label: 'Career Opportunities', action: 'career' },
      { label: 'Training & Courses', action: 'training' },
      { label: 'General Question', action: 'general' }
    ]);
  }

  showQuickReplies(replies) {
    const repliesContainer = document.getElementById('chat-quick-replies');
    repliesContainer.innerHTML = '';

    replies.forEach(reply => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = reply.label;
      btn.onclick = () => this.handleQuickReply(reply.action);
      repliesContainer.appendChild(btn);
    });
  }

  handleQuickReply(action) {
    if (action === 'restart') {
      this.currentFlow = null;
      this.showWelcome();
      return;
    }
    if (action === 'contact_form') {
      this.addMessage('user', 'I\'d like to talk to your team.');
      this.showContactHandoff();
      return;
    }

    const replies = {
      hiring: {
        message: 'I need to find specialized technology talent for my team.',
        flow: 'hiring_flow'
      },
      career: {
        message: 'I\'m interested in exploring career opportunities and growth.',
        flow: 'career_flow'
      },
      training: {
        message: 'Tell me about your training programs and courses.',
        flow: 'training_flow'
      },
      general: {
        message: 'I have a general question about Endurava.',
        flow: 'general_flow'
      }
    };

    const selected = replies[action];
    if (!selected) return;
    this.addMessage('user', selected.message);
    this.currentFlow = selected.flow;
    this.handleConversation(selected.flow);
  }

  handleUserInput(input) {
    this.addMessage('user', input);

    // If we're in a flow, continue with that flow
    if (this.currentFlow) {
      this.continueFlow(this.currentFlow, input);
    } else {
      // Otherwise, try to intelligently route the question
      this.handleGeneralQuestion(input);
    }
  }

  handleConversation(flow) {
    const responses = {
      hiring_flow: this.hiringFlow,
      career_flow: this.careerFlow,
      training_flow: this.trainingFlow,
      general_flow: this.generalFlow
    };

    if (responses[flow]) {
      responses[flow].call(this);
    }
  }

  continueFlow(flow, input) {
    const flows = {
      hiring_flow: [
        {
          keywords: ['role', 'position', 'engineer', 'developer', 'architect'],
          response: "Great! Tell me more about the specific roles you're looking to fill. Are you hiring for AI/ML engineers, full-stack developers, DevOps specialists, or something else?",
          nextAction: 'hiring_roles'
        },
        {
          keywords: ['ai', 'ml', 'machine', 'learning', 'genai', 'generative'],
          response: "Excellent! AI talent is our specialty. We have access to engineers skilled in:\n• Generative AI & LLM systems\n• Agentic AI\n• Machine Learning & Data Engineering\n• AI-first full-stack development\n\nWhat's your timeline and team size?",
          nextAction: 'hiring_timeline'
        },
        {
          keywords: ['timeline', 'urgent', 'asap', 'week', 'month'],
          response: "Perfect! We specialize in rapid placements without compromising quality. For immediate needs, we can typically provide qualified candidates within 1-2 weeks.\n\nWould you like to discuss your specific requirements with our team?",
          nextAction: 'hiring_contact'
        }
      ],
      career_flow: [
        {
          keywords: ['skill', 'learn', 'training', 'course', 'develop'],
          response: "Awesome! We offer comprehensive training in:\n• AI & Generative AI Fundamentals\n• Full Stack Development\n• Cloud Engineering (AWS & Azure)\n• Data Engineering\n• DevOps & CI/CD\n\nWhat technology interests you most?",
          nextAction: 'career_interests'
        },
        {
          keywords: ['job', 'role', 'position', 'opportunity', 'placement'],
          response: "We'd love to help you find the right opportunity! Once you complete our training or validate your skills, we connect qualified candidates with our partner organizations. Many of our learners get placed within 3-6 months.\n\nWhat's your current skill level?",
          nextAction: 'career_level'
        }
      ],
      training_flow: [
        {
          keywords: ['ai', 'machine', 'learning', 'genai'],
          response: "Our AI-focused courses are perfect for building future-ready skills!\n\n**AI & Generative AI Fundamentals** (4 weeks)\n**AI & ML Fundamentals** (8 weeks)\n**Data Engineering for AI** (10 weeks)\n**Full-Stack + AI** (12 weeks)\n\nWhat's your experience level?",
          nextAction: 'training_level'
        },
        {
          keywords: ['full', 'stack', 'web', 'development'],
          response: "Great choice! Our Full Stack Development course covers:\n• HTML/CSS/JavaScript\n• React & Modern Frameworks\n• Node.js Backend\n• Database Design\n• Deployment & DevOps basics\n\nDuration: 12 weeks | Intermediate level | Includes job placement support",
          nextAction: 'training_enroll'
        }
      ],
      general_flow: [
        {
          keywords: ['company', 'about', 'mission', 'vision', 'culture'],
          response: "We're Endurava Technologies!\n\nWe connect ambitious technology professionals with visionary organizations. Our mission:\n• **Hire smarter** with AI-driven recruitment\n• **Build stronger** with specialized talent\n• **Grow with AI** as a key differentiator\n\nWe specialize in technology recruitment and AI-first training.\n\nWhat would you like to know more about?",
          nextAction: 'general_followup'
        }
      ]
    };

    const flowSteps = flows[flow] || [];

    for (let step of flowSteps) {
      if (step.keywords.some(kw => input.toLowerCase().includes(kw))) {
        this.addMessage('bot', step.response, true);

        if (step.nextAction === 'hiring_contact' || step.nextAction === 'training_enroll') {
          this.showQuickReplies([
            { label: 'Contact Our Team', action: 'contact_form' },
            { label: '← Back to Main Menu', action: 'restart' }
          ]);
        } else {
          this.showQuickReplies([
            { label: '← Back to Main Menu', action: 'restart' },
            { label: 'Contact Us', action: 'contact_form' }
          ]);
        }
        return;
      }
    }

    // The flow's own keywords didn't match — try the general knowledge
    // base before giving up, so a question never dead-ends mid-flow.
    const knowledgeMatch = this.findKnowledgeMatch(input);
    if (knowledgeMatch) {
      this.addMessage('bot', knowledgeMatch, true);
      this.showQuickReplies([
        { label: '← Back to Main Menu', action: 'restart' },
        { label: 'Contact Us', action: 'contact_form' }
      ]);
      return;
    }

    this.registerMiss();
  }

  hiringFlow() {
    this.addMessage('bot', "Let's find your perfect team!\n\nI have a few quick questions:\n\n1. What types of roles are you looking to fill?", true);
    this.showQuickReplies([
      { label: 'AI/ML Engineers', action: 'hiring' },
      { label: 'Full-Stack Developers', action: 'hiring' },
      { label: 'DevOps/Cloud Engineers', action: 'hiring' },
      { label: 'Multiple Roles', action: 'hiring' }
    ]);
  }

  careerFlow() {
    this.addMessage('bot', "Exciting! Let's build your tech career path. Are you interested in:", true);
    this.showQuickReplies([
      { label: 'Learning New Skills', action: 'career' },
      { label: 'Finding Job Opportunities', action: 'career' },
      { label: 'Career Guidance', action: 'career' },
      { label: 'Both Training & Jobs', action: 'career' }
    ]);
  }

  trainingFlow() {
    this.addMessage('bot', "Perfect! Our training programs are designed for modern tech careers. What interests you most?", true);
    this.showQuickReplies([
      { label: 'AI & Machine Learning', action: 'training' },
      { label: 'Full-Stack Development', action: 'training' },
      { label: 'Cloud Engineering', action: 'training' },
      { label: 'Data & DevOps', action: 'training' }
    ]);
  }

  generalFlow() {
    this.addMessage('bot', "Great! Happy to help. We specialize in:\n• Technology Recruitment & Staffing\n• Modern Tech Training Programs\n• Career Development Support\n• AI-First Solutions\n\nWhat would you like to know more about?", true);
    this.showQuickReplies([
      { label: 'Our Services', action: 'general' },
      { label: 'Training Programs', action: 'general' },
      { label: 'Testimonials', action: 'general' },
      { label: 'Contact Info', action: 'contact_form' }
    ]);
  }

  // Looks up the knowledge base and the tech-stack catch-all. Returns a
  // response string, or null if nothing matched.
  findKnowledgeMatch(input) {
    const lower = input.toLowerCase();

    for (const entry of KNOWLEDGE_BASE) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        return entry.response;
      }
    }

    const matchedTech = TECH_STACK_KEYWORDS.find(kw => lower.includes(kw));
    if (matchedTech) {
      return `We work with talent and training across ${matchedTech}! Are you looking to **hire** someone with those skills, or **learn** them yourself?`;
    }

    return null;
  }

  handleGeneralQuestion(input) {
    const match = this.findKnowledgeMatch(input);

    if (match) {
      this.addMessage('bot', match, true);
      this.showQuickReplies([
        { label: 'Main Menu', action: 'restart' },
        { label: 'Contact Team', action: 'contact_form' }
      ]);
      return;
    }

    this.registerMiss();
  }

  // Anything outside the knowledge base goes straight to a human handoff
  // rather than guessing — Eva only answers what she actually knows.
  registerMiss() {
    this.showContactHandoff();
  }

  showContactHandoff() {
    this.addMessage('bot', "That's outside what I can help with directly — please reach out to our team:\n\nEmail: admin@enduravatech.com\nPhone: +91 77805 80473\n\nOr use the form on our Contact page!", true);
    this.showQuickReplies([
      { label: '← Back to Main Menu', action: 'restart' }
    ]);
  }

  addMessage(sender, text, isAnimated = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;

    if (sender === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">E</div>
        <div class="message-content">${this.escapeHtml(text).replace(/\n/g, '<br>')}</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">${this.escapeHtml(text)}</div>
      `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    this.messages.push({ sender, text });
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize Eva when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EvaChat();
  });
} else {
  new EvaChat();
}
