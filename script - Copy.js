/* ==========================================================================
   PORTFOLIO INTERACTIVITY, NIGHT MODE & VERTICAL NAVBAR CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. NIGHT MODE / THEME TOGGLE CONTROLLER (CSS MEDIA QUERY DETECTION)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootHtml = document.documentElement;

  // CSS Media query detecting user's default browser / OS theme
  const darkSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  function getSystemTheme() {
    return darkSchemeMediaQuery.matches ? 'dark' : 'light';
  }

  // Determine active theme (saved choice takes precedence, else native browser theme)
  const activeTheme = savedTheme || getSystemTheme();
  applyTheme(activeTheme, !!savedTheme);

  function applyTheme(theme, isUserExplicitAction = true) {
    rootHtml.setAttribute('data-theme', theme);
    if (isUserExplicitAction) {
      localStorage.setItem('theme', theme);
    }
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Night Mode');
    }
  }

  // Listen to browser / system default theme changes in real time
  darkSchemeMediaQuery.addEventListener('change', (e) => {
    // Only update automatically if the user hasn't explicitly set a custom override
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // Toggle button click listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootHtml.getAttribute('data-theme') || getSystemTheme();
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(targetTheme, true);
    });
  }

  // ------------------------------------------------------------------------
  // 2. VERTICAL NAVIGATION BAR DRAWER (MOBILE / RESPONSIVE)
  // ------------------------------------------------------------------------
  const verticalSidebar = document.getElementById('vertical-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function openSidebar() {
    if (verticalSidebar) verticalSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = window.innerWidth <= 992 ? 'hidden' : '';
  }

  function closeSidebar() {
    if (verticalSidebar) verticalSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (verticalSidebar && verticalSidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar drawer when clicking links on smaller screens
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // Accessible Escape Key to close sidebar drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && verticalSidebar && verticalSidebar.classList.contains('open')) {
      closeSidebar();
      if (mobileMenuBtn) mobileMenuBtn.focus();
    }
  });

  // ------------------------------------------------------------------------
  // 3. SCROLLSPY: ACTIVE VERTICAL NAVBAR LINK ON SCROLL
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveSidebarLink() {
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      const secId = sec.getAttribute('id');

      if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
        sidebarLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${secId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveSidebarLink, { passive: true });
  updateActiveSidebarLink();

  // ------------------------------------------------------------------------
  // 4. INTERACTIVE SOUJANYA AI CHAT CONTROLLER (PERSONA SIMULATION & API HOOKS)
  // ------------------------------------------------------------------------
  // Allows visitors to interact with a conversational AI avatar of Soujanya M.N.
  // - Handles sending user queries & rendering user message bubbles
  // - Shows animated typing indicator while response is generating
  // - Provides intelligent contextual answers about Soujanya's background
  // - Includes explicit code comments & drop-in placeholders for OpenAI / Gemini API
  // ------------------------------------------------------------------------

  /* ========================================================================
     FUTURE API INTEGRATION GUIDE (e.g., OpenAI, Google Gemini, Anthropic)
     ------------------------------------------------------------------------
     To connect this interface to a live Large Language Model (LLM) API:

     1. ARCHITECTURE & SECURITY:
        - Never hardcode private API keys in client-side JavaScript.
        - Create a backend API route (e.g., /api/chat in Node.js, Express,
          Python FastAPI, or a Cloudflare Worker/AWS Lambda function).
        - Store your secret OPENAI_API_KEY or GEMINI_API_KEY in server environment variables.

     2. DROP-IN BACKEND CALL EXAMPLE:
        async function fetchLiveAiResponse(userMessage, conversationHistory) {
          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'gpt-4o-mini', // or 'gemini-1.5-flash'
                systemPrompt: `You are Soujanya M N, an AI & ML engineering student at
                               Adichunchanagiri Institute of Technology, Chikkamagaluru.
                               Speak warmly in first person. Highlight your Cold Storage Unit
                               and Smart Irrigation projects, your skills in C, Python, Java,
                               and DSA, and your openness to software engineering roles.`,
                messages: [
                  ...conversationHistory,
                  { role: 'user', content: userMessage }
                ]
              })
            });
            const data = await response.json();
            return data.reply;
          } catch (error) {
            console.error('LLM API Error:', error);
            return "I am having trouble connecting to my cloud AI service right now. Please feel free to email me directly at mnsoujanya9@gmail.com!";
          }
        }
     ======================================================================== */

  const aiChatForm = document.getElementById('ai-chat-form');
  const aiChatInput = document.getElementById('ai-chat-input');
  const chatMessagesDisplay = document.getElementById('chat-messages-display');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');
  const chatClearBtn = document.getElementById('chat-clear-btn');
  const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

  // In-memory conversation history log (can be passed to future API endpoint)
  let conversationHistory = [];

  // Helper to format current time as e.g. "2:45 PM"
  function getFormattedTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Appends a message bubble (user or AI) to the chat display area
  function appendMessage(sender, text, isAi = false) {
    if (!chatMessagesDisplay) return;

    const rowEl = document.createElement('div');
    rowEl.className = `chat-msg-row ${isAi ? 'ai-msg-row' : 'user-msg-row'}`;

    const avatarEl = document.createElement('div');
    avatarEl.className = `msg-avatar ${isAi ? 'ai-avatar-icon' : 'user-avatar-icon'}`;
    avatarEl.setAttribute('aria-hidden', 'true');
    avatarEl.textContent = isAi ? 'AI' : 'You';

    const bubbleEl = document.createElement('div');
    bubbleEl.className = `msg-bubble ${isAi ? 'ai-bubble' : 'user-bubble'}`;

    const senderNameEl = document.createElement('div');
    senderNameEl.className = 'msg-sender-name';
    senderNameEl.textContent = isAi ? 'Soujanya AI' : 'You';

    const textEl = document.createElement('div');
    textEl.className = 'msg-text';
    // If text contains HTML tags like <p> or <strong>, render safely; else wrap in paragraph
    if (text.includes('<p>') || text.includes('<strong>') || text.includes('<a>')) {
      textEl.innerHTML = text;
    } else {
      const p = document.createElement('p');
      p.textContent = text;
      textEl.appendChild(p);
    }

    const timestampEl = document.createElement('span');
    timestampEl.className = 'msg-timestamp';
    timestampEl.textContent = getFormattedTimestamp();

    bubbleEl.appendChild(senderNameEl);
    bubbleEl.appendChild(textEl);
    bubbleEl.appendChild(timestampEl);

    if (isAi) {
      rowEl.appendChild(avatarEl);
      rowEl.appendChild(bubbleEl);
    } else {
      rowEl.appendChild(bubbleEl);
      rowEl.appendChild(avatarEl);
    }

    chatMessagesDisplay.appendChild(rowEl);
    chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight;

    // Record in history
    conversationHistory.push({
      role: isAi ? 'assistant' : 'user',
      content: text,
      timestamp: new Date().toISOString()
    });
  }

  // Shows or hides the typing animation dots
  function setTypingState(isTyping) {
    if (!chatTypingIndicator) return;
    chatTypingIndicator.style.display = isTyping ? 'flex' : 'none';
    if (isTyping && chatMessagesDisplay) {
      chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight;
    }
  }

  // Intelligent Contextual AI Persona Response Generator
  function generateSoujanyaAiResponse(userQuery) {
    const q = userQuery.toLowerCase();

    // 1. Cold Storage Unit Project
    if (q.includes('cold storage') || q.includes('cooling') || q.includes('vegetable') || q.includes('spoilage')) {
      return `
        <p>❄️ <strong>Cold Storage Unit:</strong></p>
        <p>I engineered an <strong>Arduino-based automated cooling system</strong> that actively monitors ambient temperature and regulates a DC cooling fan to maintain optimal preservation conditions for vegetables, significantly reducing post-harvest spoilage.</p>
        <p>It uses digital temperature sensors and relay switching logic programmed in C/C++. You can check it out in my <a href="#projects">Projects section</a>!</p>
      `;
    }

    // 2. Smart Irrigation System Project
    if (q.includes('irrigation') || q.includes('soil') || q.includes('water') || q.includes('plant') || q.includes('agriculture')) {
      return `
        <p>🌱 <strong>Smart Irrigation System:</strong></p>
        <p>My <strong>IoT-based irrigation project</strong> measures real-time soil moisture levels using capacitive sensors and automates water delivery through a relay-driven pump, ensuring plants receive the exact hydration needed while conserving water.</p>
        <p>It runs autonomous offline firmware written in C/C++ on an Arduino microcontroller. Take a closer look in the <a href="#projects">Projects section</a>!</p>
      `;
    }

    // 3. Projects in general
    if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('portfolio')) {
      return `
        <p>🚀 I have built several practical embedded and IoT solutions:</p>
        <p>1. <strong>Cold Storage Unit:</strong> Arduino automated cooling system monitoring temperature and fan control to reduce vegetable spoilage.</p>
        <p>2. <strong>Smart Irrigation System:</strong> IoT automated soil moisture monitoring and pump control system for efficient plant watering.</p>
        <p>Click on either project card in the <a href="#projects">Projects section</a> to open its detailed specification view!</p>
      `;
    }

    // 4. Skills & Technologies
    if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('python') || q.includes('java') || q.includes(' c ') || q.includes('dsa') || q.includes('data structure')) {
      return `
        <p>💻 <strong>My Technical Proficiencies:</strong></p>
        <p>• <strong>Programming Languages:</strong> Python, C, Java</p>
        <p>• <strong>Core Fundamentals:</strong> Data Structures &amp; Algorithms (DSA), Object-Oriented Programming</p>
        <p>• <strong>Hardware &amp; IoT:</strong> Arduino UNO, Microcontrollers, Sensors (Temperature, Soil Moisture), Relay Automation</p>
        <p>• <strong>Domains of Interest:</strong> Artificial Intelligence &amp; Machine Learning</p>
        <p>Check out the interactive progress bars in the <a href="#skills">Skills section</a>!</p>
      `;
    }

    // 5. Education & College
    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('study') || q.includes('ait') || q.includes('cgpa') || q.includes('school')) {
      return `
        <p>🎓 <strong>Academic Background:</strong></p>
        <p>• <strong>B.E. in AI &amp; Machine Learning:</strong> Adichunchanagiri Institute of Technology (AIT), Chikkamagaluru (Currently in 3rd Sem | <strong>CGPA: 8.46</strong>)</p>
        <p>• <strong>12th Standard:</strong> Kanara E-Vision College, Chalageri — <strong>91.5%</strong></p>
        <p>• <strong>10th Standard (SSLC):</strong> KRCRS School, Sokke — <strong>97.6%</strong></p>
        <p>You can see my chronological journey in the <a href="#timeline">Timeline section</a>!</p>
      `;
    }

    // 6. Video Introduction
    if (q.includes('video') || q.includes('intro') || q.includes('watch') || q.includes('face') || q.includes('listen')) {
      return `
        <p>📹 I recorded a personal <strong>Video Introduction</strong> where I share my academic passion, engineering strengths, and goals in person! You can watch it directly in the <a href="#video-intro">Portfolio Spotlight section</a>.</p>
      `;
    }

    // 7. Contact, Hiring, Internships, Email, Phone
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('role') || q.includes('intern') || q.includes('job') || q.includes('reach')) {
      return `
        <p>📬 <strong>Let's Connect!</strong></p>
        <p>I am actively open to software engineering internships and junior roles:</p>
        <p>• <strong>Email:</strong> <a href="mailto:mnsoujanya9@gmail.com">mnsoujanya9@gmail.com</a></p>
        <p>• <strong>Phone:</strong> <a href="tel:+918792528689">+91 8792528689</a></p>
        <p>• <strong>Location:</strong> Karnataka, India</p>
        <p>You can also fill out the direct form in the <a href="#contact">Contact section</a> below!</p>
      `;
    }

    // 8. Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings') || q.includes('who are you')) {
      return `
        <p>👋 Hello! I'm Soujanya's AI assistant. I can tell you about her <strong>engineering studies in AI &amp; ML at AIT</strong>, her <strong>IoT projects (Cold Storage, Smart Irrigation)</strong>, or her <strong>programming proficiencies in C, Python, and Java</strong>. What would you like to explore?</p>
      `;
    }

    // 9. Default intelligent response
    return `
      <p>Thank you for asking! As Soujanya's AI persona, I'm happy to help. Soujanya is an AI &amp; ML undergraduate at Adichunchanagiri Institute of Technology with a strong foundation in <strong>Python, C, Data Structures, and Arduino IoT systems</strong>.</p>
      <p>Feel free to explore her <a href="#projects">Projects</a>, check her <a href="#skills">Skills</a>, or send a direct note through the <a href="#contact">Contact Form</a>!</p>
    `;
  }

  // Handle User Message Submission
  function handleUserMessageSubmit(userText) {
    const text = userText.trim();
    if (!text) return;

    // 1. Render user message
    appendMessage('You', text, false);

    // 2. Show typing indicator
    setTypingState(true);

    // 3. Simulate realistic thinking delay (700ms - 900ms)
    // NOTE: Replace this setTimeout block with your live fetch() call when integrating OpenAI or Gemini!
    setTimeout(() => {
      const aiReply = generateSoujanyaAiResponse(text);
      setTypingState(false);
      appendMessage('Soujanya AI', aiReply, true);
    }, 750);
  }

  // Form submit listener
  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!aiChatInput) return;
      const userText = aiChatInput.value;
      aiChatInput.value = '';
      handleUserMessageSubmit(userText);
    });
  }

  // Quick prompt buttons listener
  if (quickPromptBtns) {
    quickPromptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const promptText = btn.getAttribute('data-prompt') || btn.textContent.trim();
        handleUserMessageSubmit(promptText);
        if (aiChatInput) aiChatInput.focus();
      });
    });
  }

  // Reset / Clear conversation listener
  if (chatClearBtn) {
    chatClearBtn.addEventListener('click', () => {
      if (!chatMessagesDisplay) return;
      chatMessagesDisplay.innerHTML = `
        <div class="chat-msg-row ai-msg-row">
          <div class="msg-avatar ai-avatar-icon" aria-hidden="true">AI</div>
          <div class="msg-bubble ai-bubble">
            <div class="msg-sender-name">Soujanya AI</div>
            <div class="msg-text">
              <p>👋 Conversation restarted! I'm Soujanya's AI avatar. How can I assist you with her background, skills, or projects today?</p>
            </div>
            <span class="msg-timestamp">Just now</span>
          </div>
        </div>
      `;
      conversationHistory = [];
      setTypingState(false);
    });
  }

  // ------------------------------------------------------------------------
  // 5. DYNAMIC YEAR IN FOOTER
  // ------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 6. DIRECT CONTACT FORM HANDLER
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('user-name');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';

      setTimeout(() => {
        alert(`Thank you, ${nameInput.value || 'friend'}! Your message has been sent to Soujanya.`);
        contactForm.reset();
        submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      }, 800);
    });
  }

  // ------------------------------------------------------------------------
  // 6. SKILLS PROGRESS BAR ANIMATION (IntersectionObserver)
  // ------------------------------------------------------------------------
  // When the skills section scrolls into view, we add the .animate class to
  // each .skill-bar-fill element, which transitions its width from 0 to
  // the value stored in the CSS custom property --target-width.
  // This creates a satisfying on-scroll reveal effect.

  const skillBarFills = document.querySelectorAll('.skill-bar-fill');

  if (skillBarFills.length > 0 && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger animation: each bar fires slightly after the previous
            skillBarFills.forEach((bar, idx) => {
              setTimeout(() => {
                bar.classList.add('animate');
              }, idx * 80); // 80ms stagger between bars
            });
            // Stop observing once animation has been triggered
            skillsObserver.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the skills section is visible
      }
    );

    // Observe the parent skills section
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsObserver.observe(skillsSection);
    }
  } else {
    // Fallback: If IntersectionObserver not supported, animate immediately
    skillBarFills.forEach(bar => bar.classList.add('animate'));
  }

  // ------------------------------------------------------------------------
  // 7. TIMELINE SCORE BAR ANIMATION (IntersectionObserver)
  // ------------------------------------------------------------------------
  // Each timeline card's score fill bar (.tl-score-fill) transitions from
  // width 0 to --tl-score-width once the timeline section scrolls into view.
  // Each event card also gets a subtle entrance animation.

  const tlScoreFills = document.querySelectorAll('.tl-score-fill');

  if (tlScoreFills.length > 0 && 'IntersectionObserver' in window) {
    const tlScoreObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger bars with a small delay
            tlScoreFills.forEach((bar, idx) => {
              setTimeout(() => bar.classList.add('animate'), idx * 120);
            });
            tlScoreObserver.disconnect();
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.15 }
    );

    const timelineSection = document.getElementById('timeline');
    if (timelineSection) tlScoreObserver.observe(timelineSection);

  } else {
    tlScoreFills.forEach(bar => bar.classList.add('animate'));
  }

  // ── Timeline card entrance: fade-in + slide up on scroll ──────────────
  // Each .tl-card gets an 'is-visible' class when it scrolls into view.
  const tlCards = document.querySelectorAll('.tl-card');

  if (tlCards.length > 0 && 'IntersectionObserver' in window) {
    // Set initial hidden state via inline style (avoids FOUC)
    tlCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            // Small sequential delay per card
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 80);
            cardObserver.unobserve(card);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    tlCards.forEach(card => cardObserver.observe(card));
  }

  // ------------------------------------------------------------------------
  // 8. PROJECTS SECTION — THUMBNAIL TO PROJECT DETAIL MODAL CONTROLLER
  // ------------------------------------------------------------------------
  // HOW EACH THUMBNAIL IS CONNECTED TO ITS PROJECT DETAIL:
  //
  // 1. DATA ATTRIBUTE MAPPING (data-project):
  //    Each project card element (.proj-card) and its "Project Details" button
  //    (.proj-details-btn) have a `data-project="[id]"` attribute:
  //      - Thumbnail for Cold Storage Unit -> data-project="cold-storage"
  //      - Thumbnail for Smart Irrigation  -> data-project="irrigation"
  //
  // 2. CORRESPONDING MODAL DIALOG ID (project-modal-[id]):
  //    The matching detailed view dialog has an ID composed as:
  //      `project-modal-${projectId}`
  //      - "cold-storage" connects to <div id="project-modal-cold-storage">
  //      - "irrigation"   connects to <div id="project-modal-irrigation">
  //
  // 3. TRIGGER INTERACTIONS:
  //    - Mouse / Tap: Clicking on any project card thumbnail or its button
  //      extracts the project ID and displays the corresponding modal.
  //    - Keyboard: Pressing 'Enter' or 'Space' while a card thumbnail is focused
  //      (tabindex="0") automatically opens the project's detail view.
  //
  // 4. ACCESSIBILITY & STATE HANDLING:
  //    - Opening: Removes the HTML `hidden` attribute, traps background scroll
  //      via `body.style.overflow = 'hidden'`, and shifts focus to the modal close button.
  //    - Closing: Restores the `hidden` attribute, enables background scroll,
  //      and returns focus back to the triggering thumbnail card.
  //    - Dismissal: Supported via close button [data-close-modal], backdrop click,
  //      or pressing the Escape key.
  // ------------------------------------------------------------------------

  const projCards = document.querySelectorAll('.proj-card');
  const projDetailsBtns = document.querySelectorAll('.proj-details-btn');
  const projModals = document.querySelectorAll('.proj-modal');
  let lastFocusedThumbnail = null; // Stores thumbnail element to return focus after modal closes

  /**
   * Opens the detailed view modal associated with a specific project ID.
   * @param {string} projectId - The unique identifier (e.g. 'cold-storage', 'irrigation')
   * @param {HTMLElement} triggerEl - The thumbnail element that triggered the open action
   */
  function openProjectModal(projectId, triggerEl) {
    if (!projectId) return;

    // Find the modal matching this thumbnail's project ID: #project-modal-[id]
    const targetModal = document.getElementById(`project-modal-${projectId}`);
    if (!targetModal) return;

    // Remember which thumbnail opened this modal for accessible focus return
    lastFocusedThumbnail = triggerEl;

    // Unhide modal and lock background scrolling
    targetModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus the modal close button or panel for keyboard/screen reader accessibility
    const closeBtn = targetModal.querySelector('.proj-modal-close');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  }

  /**
   * Closes an active project detail modal dialog and restores document state.
   * @param {HTMLElement} modalEl - The modal dialog element to close
   */
  function closeProjectModal(modalEl) {
    if (!modalEl) return;

    // Hide modal and restore document body scroll
    modalEl.setAttribute('hidden', '');
    document.body.style.overflow = '';

    // Return focus to the thumbnail card that opened it
    if (lastFocusedThumbnail && typeof lastFocusedThumbnail.focus === 'function') {
      lastFocusedThumbnail.focus();
    }
  }

  // Connect click listeners to each project thumbnail card
  projCards.forEach(card => {
    // 1. Mouse click on card thumbnail
    card.addEventListener('click', (e) => {
      // If user clicked the external GitHub link inside the footer, let the link open normally
      if (e.target.closest('.proj-github-btn')) {
        return;
      }

      // Read the data-project attribute linking this thumbnail to its detail modal
      const projectId = card.getAttribute('data-project');
      openProjectModal(projectId, card);
    });

    // 2. Keyboard interaction (Enter or Space) on the card thumbnail
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // Prevent default spacebar scroll
        e.preventDefault();
        const projectId = card.getAttribute('data-project');
        openProjectModal(projectId, card);
      }
    });
  });

  // Also attach explicit click listeners to "Project Details" buttons
  projDetailsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent duplicate card click event
      const projectId = btn.getAttribute('data-project');
      const parentCard = btn.closest('.proj-card');
      openProjectModal(projectId, parentCard || btn);
    });
  });

  // Attach close event listeners to all modal close triggers (close button & backdrop)
  projModals.forEach(modal => {
    const closeTriggers = modal.querySelectorAll('[data-close-modal]');
    closeTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        closeProjectModal(modal);
      });
    });
  });

  // Global keyboard listener: Close any active modal when pressing Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Find any modal that is currently not hidden
      const openModal = document.querySelector('.proj-modal:not([hidden])');
      if (openModal) {
        closeProjectModal(openModal);
      }
    }
  });

  // ------------------------------------------------------------------------
  // 9. VIDEO INTRODUCTION CONTROLLER (SCROLL OBSERVER & AUTO-PAUSE)
  // ------------------------------------------------------------------------
  // Manages the embedded portfolio video:
  // - Auto-pauses the video when the user scrolls away from the section
  //   to prevent background audio disturbance.
  // - Applies smooth entrance animation when scrolled into view.
  // ------------------------------------------------------------------------
  const introVideo = document.getElementById('portfolio-intro-video');
  const videoSection = document.getElementById('video-intro');

  if (introVideo && videoSection && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // If user scrolled away and video is actively playing, pause it gracefully
          if (!entry.isIntersecting && !introVideo.paused) {
            introVideo.pause();
          }
        });
      },
      {
        root: null,
        threshold: 0.15 // Triggers when less than 15% is visible
      }
    );

    videoObserver.observe(videoSection);
  }

  // ------------------------------------------------------------------------
  // 10. FULL-SCREEN RESUME PDF VIEWER MODAL CONTROLLER
  // ------------------------------------------------------------------------
  // Manages opening & closing the clean full-screen resume PDF viewer:
  // - Clicking #view-resume-btn opens the full-screen resume modal.
  // - Handles closing via close button, backdrop click, or Escape key.
  // - Restores background body scroll and returns keyboard focus cleanly.
  // ------------------------------------------------------------------------
  const viewResumeBtn = document.getElementById('view-resume-btn');
  const resumeModal = document.getElementById('resume-modal');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = resumeModal.querySelector('.resume-close-btn');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 60);
    }
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.setAttribute('hidden', '');
    document.body.style.overflow = '';

    // Return focus to trigger button
    if (viewResumeBtn) {
      viewResumeBtn.focus();
    }
  }

  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (resumeModal) {
    // Close triggers (close button and backdrop)
    const resumeCloseTriggers = resumeModal.querySelectorAll('[data-close-resume]');
    resumeCloseTriggers.forEach(trigger => {
      trigger.addEventListener('click', closeResumeModal);
    });
  }

  // Escape key handler for resume modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && !resumeModal.hasAttribute('hidden')) {
      closeResumeModal();
    }
  });

}); /* End DOMContentLoaded */
