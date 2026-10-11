/**
 * ABI MOHAN MEDICAL — VITACARE INTERACTION & SCROLL MOTION CONTROLLER
 * Powered by GSAP & ScrollTrigger with native fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  initChipsSelector();
  initRefillDialog();
  initCopyPlusCode();
  initLiveStatus();
  initScrollProgressBar();
  initFloatingNavAndSpy();
  initBackToTop();
  initScrollMotions();
  initCardTiltPhysics();
  initChatbot();
});

/**
 * 1. Quick Medicine Chips Selection
 */
function initChipsSelector() {
  const chips = document.querySelectorAll('.chip-item');
  const input = document.getElementById('searchMedInput');
  const sendBtn = document.getElementById('btnSendWhatsapp');

  if (!input || !sendBtn) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const medName = chip.getAttribute('data-med') || chip.textContent;
      input.value = medName;
      input.focus();
    });
  });

  sendBtn.addEventListener('click', () => {
    const medQuery = input.value.trim() || 'General Medicine';
    const msg = `Hello ABI Mohan Medical, I would like to order: ${medQuery}. Please let me know price and counter readiness.`;
    const waUrl = `https://wa.me/918056668839?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
}

/**
 * 2. Refill Dialog Modal
 */
function initRefillDialog() {
  const dialog = document.getElementById('refillDialog');
  const openBtn = document.getElementById('navRefillBtn');
  const closeBtn = document.getElementById('closeRefillModal');
  const form = document.getElementById('refillForm');

  if (!dialog) return;

  function openModal() {
    dialog.showModal();
  }

  function closeModal() {
    dialog.close();
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close when tapping outside the modal card
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const patient = document.getElementById('modalPatientName').value.trim();
      const phone = document.getElementById('modalPatientPhone').value.trim();
      const notes = document.getElementById('modalMedDetails').value.trim();

      const text = `*New Prescription Order — ABI Mohan Medical*\n\n` +
        `*Patient:* ${patient}\n` +
        `*Phone:* ${phone}\n` +
        `*Needs:* ${notes}\n\n` +
        `Please confirm when ready for collection at Mathur center.`;

      const waUrl = `https://wa.me/918056668839?text=${encodeURIComponent(text)}`;
      closeModal();
      showToast('Opening WhatsApp to dispatch prescription order...');
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    });
  }
}

/**
 * 3. Copy Google Plus Code
 */
function initCopyPlusCode() {
  const copyBtn = document.getElementById('btnCopyCode');
  const code = 'J83M+QJ Mathur, Tamil Nadu';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code);
      copyBtn.textContent = 'Copied!';
      showToast('Plus Code copied to clipboard: J83M+QJ');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2500);
    } catch {
      showToast('Plus Code: J83M+QJ Mathur');
    }
  });
}

/**
 * 4. Real-time Live Status Badge (Dynamic Clock)
 */
function initLiveStatus() {
  const statusEl = document.getElementById('heroLiveStatusText');
  if (!statusEl) return;

  function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    statusEl.innerHTML = `Mathur &bull; Open Now &bull; ${timeStr}`;
  }

  updateTime();
  setInterval(updateTime, 10000); // refresh every 10s
}

/**
 * 5. Dynamic Scroll Progress Bar
 */
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  function updateBar() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      bar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/**
 * 6. Floating Scrolled Navbar & Scroll-Spy Active Indicator
 */
function initFloatingNavAndSpy() {
  const navBar = document.querySelector('.hero-nav-bar');
  const links = document.querySelectorAll('.pill-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navBar) return;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Toggle floating capsule navbar state
    if (scrollY > 120) {
      navBar.classList.add('scrolled');
    } else {
      navBar.classList.remove('scrolled');
    }

    // Scroll-Spy: Find section in middle of viewport
    let currentId = '';
    const triggerLine = scrollY + (window.innerHeight * 0.4);

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (triggerLine >= top && triggerLine < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Smooth click scroll with proper offset
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * 7. Back to Top Button
 */
function initBackToTop() {
  const btn = document.getElementById('btnBackToTop');
  if (!btn) return;

  function toggleBtn() {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBtn, { passive: true });
  toggleBtn();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 8. GSAP ScrollTrigger Motions & Dynamic Animated Counters
 */
function initScrollMotions() {
  // Check if reduced motion is requested
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (!hasGSAP) {
    // Native fallback for animated counters
    initNativeCounters();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // A. Hero Parallax Scale & Shift Scrub
  const heroImg = document.getElementById('heroBgImg');
  const heroContent = document.getElementById('heroContentBox');

  if (heroImg) {
    gsap.to(heroImg, {
      scale: 1.14,
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '#heroMaster',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });
  }

  if (heroContent) {
    gsap.to(heroContent, {
      yPercent: -12,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '#heroMaster',
        start: 'top top',
        end: '65% top',
        scrub: 0.6
      }
    });
  }

  // B. Dock Metrics Staggered Entrance + Dynamic Number Counter
  const dockCards = document.querySelectorAll('.dock-card');
  if (dockCards.length > 0) {
    gsap.from(dockCards, {
      y: 35,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#heroDockMetrics',
        start: 'top 92%',
        once: true,
        onEnter: () => animateCounters()
      }
    });
  }

  // C. Dispensary Section Photographic Scale & Card Reveal
  const dispPhoto = document.querySelector('.dispensary-photo-card img');
  if (dispPhoto) {
    gsap.fromTo(dispPhoto, 
      { scale: 0.94, opacity: 0.75 },
      {
        scale: 1.0,
        opacity: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.dispensary-split-showcase',
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.8
        }
      }
    );
  }

  // D. Services Capabilities Staggered Entrance
  const serviceCards = document.querySelectorAll('.service-visual-card');
  if (serviceCards.length > 0) {
    gsap.from(serviceCards, {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.grid-services-visual',
        start: 'top 85%',
        once: true
      }
    });
  }

  // E. Patient Reviews Staggered Float-In
  const reviewCards = document.querySelectorAll('.review-box-clean');
  if (reviewCards.length > 0) {
    gsap.from(reviewCards, {
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.grid-reviews-dual',
        start: 'top 88%',
        once: true
      }
    });
  }

  // F. Location Storefront Image Zoom-In Reveal
  const locationPhoto = document.querySelector('.location-store-img');
  if (locationPhoto) {
    gsap.fromTo(locationPhoto,
      { scale: 0.93, opacity: 0.8 },
      {
        scale: 1.0,
        opacity: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.location-banner-clean',
          start: 'top 82%',
          end: 'top 40%',
          scrub: 0.8
        }
      }
    );
  }
}

/**
 * Animated Numerical Counters (1k, 5.0/5, 100+)
 */
function animateCounters() {
  const numberEls = document.querySelectorAll('.dock-card-number[data-target]');
  
  numberEls.forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    const format = el.getAttribute('data-format');
    const duration = 1200; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * ease;

      if (format === 'k') {
        el.textContent = `${Math.round(currentVal / 1000)}k`;
      } else if (format === 'rating') {
        el.textContent = `${currentVal.toFixed(1)}/5`;
      } else if (format === 'plus') {
        el.textContent = `${Math.round(currentVal)}+`;
      } else {
        el.textContent = Math.round(currentVal);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Final exact values
        if (format === 'k') el.textContent = '1k';
        else if (format === 'rating') el.textContent = '5.0/5';
        else if (format === 'plus') el.textContent = '100+';
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

/**
 * Fallback observer for counters if GSAP is unavailable
 */
function initNativeCounters() {
  const dock = document.getElementById('heroDockMetrics');
  if (!dock) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(dock);
}

/**
 * 9. Tactile 3D Card Tilt Physics (Pointer Devices Only)
 */
function initCardTiltPhysics() {
  // Only apply on devices with precision pointer (mouse/trackpad), not touchscreens
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltCards = document.querySelectorAll('.dock-card, .service-visual-card, .dispensary-control-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Toast Helper
 */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toastFloat');
  const text = document.getElementById('toastMsgText');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/**
 * 10. 24/7 Tamil RAG Chatbot Controller
 */
function initChatbot() {
  const launcher = document.getElementById('btnChatLauncher');
  const windowEl = document.getElementById('chatWidgetWindow');
  const closeBtn = document.getElementById('btnCloseChat');
  const form = document.getElementById('chatInputForm');
  const input = document.getElementById('chatTextInput');
  const messagesBox = document.getElementById('chatMessages');
  const chips = document.querySelectorAll('.chat-chip-btn');

  if (!launcher || !windowEl || !form) return;

  const chatHistory = [];

  function openChat() {
    windowEl.classList.add('active');
    windowEl.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (input) input.focus();
    }, 200);
  }

  function closeChat() {
    windowEl.classList.remove('active');
    windowEl.setAttribute('aria-hidden', 'true');
  }

  launcher.addEventListener('click', () => {
    if (windowEl.classList.contains('active')) {
      closeChat();
    } else {
      openChat();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowEl.classList.contains('active')) {
      closeChat();
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q) {
        sendMessage(q);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendMessage(text);
  });

  async function sendMessage(text) {
    appendUserBubble(text);
    chatHistory.push({ sender: 'user', text });

    const typingBubble = appendTypingIndicator();
    scrollChatBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory })
      });

      if (!response.ok) throw new Error('Network error');

      // Prepare bot message bubble
      typingBubble.remove();
      const botBubble = appendBotBubble('');
      const contentEl = botBubble.querySelector('.bubble-content');
      let botText = '';

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      let isDone = false;
      while (!isDone) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') {
            isDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              botText += delta;
              contentEl.innerHTML = formatBotMessage(botText);
              scrollChatBottom();
            }
          } catch (err) {
            // ignore partial JSON parse errors
          }
        }
      }

      if (!botText.trim()) {
        botText = getLocalTamilAnswer(text);
        contentEl.innerHTML = formatBotMessage(botText);
      }

      chatHistory.push({ sender: 'bot', text: botText });
      scrollChatBottom();
    } catch (err) {
      if (typingBubble) typingBubble.remove();
      const fallback = getLocalTamilAnswer(text);
      appendBotBubble(fallback);
      scrollChatBottom();
    }
  }

  function getLocalTamilAnswer(query) {
    const q = (query || '').toLowerCase();
    if (q.includes('உரிமையாளர்') || q.includes('யார்') || q.includes('owner') || q.includes('manage') || q.includes('வனிதா') || q.includes('vanitha')) {
      return 'ABI Mohan Medical மருந்தகத்தின் உரிமையாளர் மற்றும் மேலாளர் **திருமதி. வனிதா பிரகாஷ்வேல் (Vanitha Prakashvel)** ஆவார். இவர் மருத்துவர் அல்ல; **D.Pharm** பட்டயப்படிப்பு முடித்து, மருந்தகங்களில் பணிபுரிந்து சிறந்த அனுபவம் பெற்ற மருந்தாளர் (Pharmacist). தற்போது மாத்தூரில் சொந்தமாக இந்த புதிய மருந்தகத்தை நிறுவி நடத்தி வருகிறார்.';
    } else if (q.includes('திறந்த') || q.includes('நேரம்') || q.includes('time') || q.includes('open') || q.includes('இரவு')) {
      return 'ஆம்! ABI Mohan Medical **24 மணி நேரமும்** தொடர்ந்து திறந்திருக்கும். நள்ளிரவிலும் அவசர மருந்துகள் உடனடியாகக் கிடைக்கும். தொலைபேசி: 080566 68839.';
    } else if (q.includes('முகவரி') || q.includes('எங்கு') || q.includes('address') || q.includes('location')) {
      return 'முகவரி: **20, மெயின் ரோடு தெரு, மாத்தூர், விருத்தாசலம், தமிழ்நாடு 606104** (Google Plus Code: `J83M+QJ Mathur`).';
    } else if (q.includes('ஆர்டர்') || q.includes('வாட்ஸ்அப்') || q.includes('order') || q.includes('whatsapp') || q.includes('சீட்டு')) {
      return 'உங்கள் மருந்துச் சீட்டை அல்லது தேவைப்படும் மாத்திரைகளை எங்கள் வாட்ஸ்அப் எண்ணிற்கு (**+91 80566 68839**) அனுப்பி எளிதாக ஆர்டர் செய்யலாம்.';
    } else if (q.includes('bp') || q.includes('sugar') || q.includes('சுகர்') || q.includes('பிபி') || q.includes('பரிசோதனை')) {
      return 'எங்கள் மருத்துவ மையத்தில் இரத்த அழுத்தம் (BP) மற்றும் இரத்த சர்க்கரை அளவு (RBS Sugar) பரிசோதனைகள் உடனுக்குடன் செய்து தரப்படும்.';
    } else {
      return 'வணக்கம்! ABI Mohan Medical (உரிமையாளர்: வனிதா பிரகாஷ்வேல்) மாத்தூரில் 24 மணி நேரமும் உங்கள் மருத்துவ சேவைக்கு தயாராக உள்ளது. உதவிக்கு எங்களை 080566 68839 என்ற எண்ணில் அழைக்கலாம்.';
    }
  }

  function appendUserBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble-user';
    bubble.innerHTML = `
      <div class="bubble-content">${escapeHtml(text)}</div>
      <span class="bubble-time">நீங்கள்</span>
    `;
    messagesBox.appendChild(bubble);
    return bubble;
  }

  function appendBotBubble(initialText) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble-bot';
    bubble.innerHTML = `
      <div class="bubble-content">${formatBotMessage(initialText)}</div>
      <span class="bubble-time">24/7 AI உதவியாளர்</span>
    `;
    messagesBox.appendChild(bubble);
    return bubble;
  }

  function appendTypingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble-bot typing-indicator-wrap';
    bubble.innerHTML = `
      <div class="bubble-content">
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    messagesBox.appendChild(bubble);
    return bubble;
  }

  function scrollChatBottom() {
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function formatBotMessage(text) {
    if (!text) return '';
    let formatted = escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/(080566\s*68839|\+91\s*80566\s*68839)/g, '<a href="tel:+918056668839" style="color: #10B981; font-weight: bold; text-decoration: underline;">$1</a>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }
}

