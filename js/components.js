/* ═══════════════════════════════════════════
   COMPONENTS.JS — slider, accordion, filter, navbar
═══════════════════════════════════════════ */

// ─── Testimonial Slider ───
(function () {
  const sliders = document.querySelectorAll('.testimonial-slider');
  sliders.forEach(slider => {
    const track = slider.querySelector('.testimonial-track');
    const cards = slider.querySelectorAll('.testimonial-card');
    const dots = slider.querySelectorAll('.testimonial-dot');
    const prev = slider.querySelector('.testimonial-arrow.prev');
    const next = slider.querySelector('.testimonial-arrow.next');
    if (!track || !cards.length) return;

    let current = 0;
    let autoplay;

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAutoplay() {
      autoplay = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplay);
    }

    prev?.addEventListener('click', () => { goTo(current - 1); stopAutoplay(); startAutoplay(); });
    next?.addEventListener('click', () => { goTo(current + 1); stopAutoplay(); startAutoplay(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); stopAutoplay(); startAutoplay(); }));

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Touch support
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
      }
    }, { passive: true });

    goTo(0);
    startAutoplay();
  });
})();

// ─── FAQ Accordion ───
(function () {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

// ─── Job Accordion ───
(function () {
  document.querySelectorAll('.job-item').forEach(item => {
    const header = item.querySelector('.job-header');
    if (!header) return;
    header.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
})();

// ─── Services Accordion / Tab ───
(function () {
  document.querySelectorAll('.services-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      document.querySelectorAll('.services-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
})();

// ─── Portfolio Filter ───
(function () {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  if (!filterTabs.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      portfolioCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
})();

// ─── Blog Category Filter ───
(function () {
  const blogTabs = document.querySelectorAll('.blog-filter-tab');
  const blogCards = document.querySelectorAll('.blog-card');
  if (!blogTabs.length) return;

  blogTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      blogTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      blogCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.display = match ? '' : 'none';
      });
    });
  });
})();

// ─── Pricing Toggle ───
(function () {
  const toggle = document.getElementById('pricing-toggle');
  const monthly = document.querySelectorAll('.price-monthly');
  const oneTime = document.querySelectorAll('.price-onetime');
  const labelMonthly = document.getElementById('label-monthly');
  const labelOneTime = document.getElementById('label-onetime');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isMonthly = !toggle.checked;
    monthly.forEach(el => el.style.display = isMonthly ? '' : 'none');
    oneTime.forEach(el => el.style.display = isMonthly ? 'none' : '');
    labelMonthly?.classList.toggle('active', isMonthly);
    labelOneTime?.classList.toggle('active', !isMonthly);
  });
})();

// ─── Country Code Picker ───
(function () {
  const COUNTRIES = [
    { flag: '🇵🇰', name: 'Pakistan', dial: '+92' },
    { flag: '🇺🇸', name: 'United States', dial: '+1' },
    { flag: '🇬🇧', name: 'United Kingdom', dial: '+44' },
    { flag: '🇦🇪', name: 'UAE', dial: '+971' },
    { flag: '🇸🇦', name: 'Saudi Arabia', dial: '+966' },
    { flag: '🇶🇦', name: 'Qatar', dial: '+974' },
    { flag: '🇰🇼', name: 'Kuwait', dial: '+965' },
    { flag: '🇧🇭', name: 'Bahrain', dial: '+973' },
    { flag: '🇴🇲', name: 'Oman', dial: '+968' },
    { flag: '🇮🇳', name: 'India', dial: '+91' },
    { flag: '🇧🇩', name: 'Bangladesh', dial: '+880' },
    { flag: '🇳🇬', name: 'Nigeria', dial: '+234' },
    { flag: '🇬🇭', name: 'Ghana', dial: '+233' },
    { flag: '🇰🇪', name: 'Kenya', dial: '+254' },
    { flag: '🇿🇦', name: 'South Africa', dial: '+27' },
    { flag: '🇪🇬', name: 'Egypt', dial: '+20' },
    { flag: '🇲🇦', name: 'Morocco', dial: '+212' },
    { flag: '🇩🇿', name: 'Algeria', dial: '+213' },
    { flag: '🇹🇳', name: 'Tunisia', dial: '+216' },
    { flag: '🇩🇪', name: 'Germany', dial: '+49' },
    { flag: '🇫🇷', name: 'France', dial: '+33' },
    { flag: '🇮🇹', name: 'Italy', dial: '+39' },
    { flag: '🇪🇸', name: 'Spain', dial: '+34' },
    { flag: '🇳🇱', name: 'Netherlands', dial: '+31' },
    { flag: '🇨🇭', name: 'Switzerland', dial: '+41' },
    { flag: '🇦🇺', name: 'Australia', dial: '+61' },
    { flag: '🇨🇦', name: 'Canada', dial: '+1' },
    { flag: '🇸🇬', name: 'Singapore', dial: '+65' },
    { flag: '🇲🇾', name: 'Malaysia', dial: '+60' },
    { flag: '🇮🇩', name: 'Indonesia', dial: '+62' },
    { flag: '🇹🇷', name: 'Turkey', dial: '+90' },
    { flag: '🇷🇺', name: 'Russia', dial: '+7' },
    { flag: '🇧🇷', name: 'Brazil', dial: '+55' },
    { flag: '🇲🇽', name: 'Mexico', dial: '+52' },
    { flag: '🇦🇷', name: 'Argentina', dial: '+54' },
    { flag: '🇨🇳', name: 'China', dial: '+86' },
    { flag: '🇯🇵', name: 'Japan', dial: '+81' },
    { flag: '🇰🇷', name: 'South Korea', dial: '+82' },
    { flag: '🇵🇭', name: 'Philippines', dial: '+63' },
    { flag: '🇹🇭', name: 'Thailand', dial: '+66' },
    { flag: '🇻🇳', name: 'Vietnam', dial: '+84' },
    { flag: '🇳🇿', name: 'New Zealand', dial: '+64' },
    { flag: '🇮🇷', name: 'Iran', dial: '+98' },
    { flag: '🇮🇶', name: 'Iraq', dial: '+964' },
    { flag: '🇱🇧', name: 'Lebanon', dial: '+961' },
    { flag: '🇯🇴', name: 'Jordan', dial: '+962' },
    { flag: '🇾🇪', name: 'Yemen', dial: '+967' },
    { flag: '🇱🇾', name: 'Libya', dial: '+218' },
    { flag: '🇸🇩', name: 'Sudan', dial: '+249' },
    { flag: '🇪🇹', name: 'Ethiopia', dial: '+251' },
    { flag: '🇹🇿', name: 'Tanzania', dial: '+255' },
    { flag: '🇺🇬', name: 'Uganda', dial: '+256' },
    { flag: '🇸🇳', name: 'Senegal', dial: '+221' },
    { flag: '🇵🇱', name: 'Poland', dial: '+48' },
    { flag: '🇸🇪', name: 'Sweden', dial: '+46' },
    { flag: '🇳🇴', name: 'Norway', dial: '+47' },
    { flag: '🇩🇰', name: 'Denmark', dial: '+45' },
    { flag: '🇫🇮', name: 'Finland', dial: '+358' },
    { flag: '🇵🇹', name: 'Portugal', dial: '+351' },
    { flag: '🇬🇷', name: 'Greece', dial: '+30' },
    { flag: '🇭🇺', name: 'Hungary', dial: '+36' },
    { flag: '🇷🇴', name: 'Romania', dial: '+40' },
    { flag: '🇨🇿', name: 'Czech Republic', dial: '+420' },
    { flag: '🇦🇹', name: 'Austria', dial: '+43' },
    { flag: '🇧🇪', name: 'Belgium', dial: '+32' },
    { flag: '🇮🇪', name: 'Ireland', dial: '+353' },
    { flag: '🇦🇫', name: 'Afghanistan', dial: '+93' },
    { flag: '🇱🇰', name: 'Sri Lanka', dial: '+94' },
    { flag: '🇳🇵', name: 'Nepal', dial: '+977' },
    { flag: '🇲🇻', name: 'Maldives', dial: '+960' },
  ];

  const ccWrap = document.getElementById('cc-wrap');
  const ccBtn = document.getElementById('cc-btn');
  const ccFlag = document.getElementById('cc-flag');
  const ccCode = document.getElementById('cc-code');
  const ccList = document.getElementById('cc-list');
  const ccSearchInput = document.getElementById('cc-search-input');
  const phoneHidden = document.getElementById('phone');
  const phoneNumber = document.getElementById('phone-number');

  if (!ccWrap || !ccBtn) return;

  let selectedDial = '+92';

  function renderList(filter) {
    if (!ccList) return;
    const q = (filter || '').toLowerCase();
    const filtered = q ? COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) || c.dial.includes(q)
    ) : COUNTRIES;

    ccList.innerHTML = filtered.map(c => `
      <div class="cc-item" data-dial="${c.dial}" data-flag="${c.flag}" role="option">
        <span class="cc-item-flag">${c.flag}</span>
        <span class="cc-item-name">${c.name}</span>
        <span class="cc-item-dial">${c.dial}</span>
      </div>
    `).join('');

    ccList.querySelectorAll('.cc-item').forEach(item => {
      item.addEventListener('click', () => {
        selectedDial = item.dataset.dial;
        ccFlag.textContent = item.dataset.flag;
        ccCode.textContent = selectedDial;
        ccWrap.classList.remove('open');
        ccBtn.setAttribute('aria-expanded', 'false');
        syncPhone();
        phoneNumber.focus();
      });
    });
  }

  function syncPhone() {
    if (!phoneHidden || !phoneNumber) return;
    const num = phoneNumber.value.trim();
    phoneHidden.value = num ? `${selectedDial} ${num}` : '';
  }

  phoneNumber && phoneNumber.addEventListener('input', syncPhone);

  ccBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = ccWrap.classList.toggle('open');
    ccBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      if (ccSearchInput) { ccSearchInput.value = ''; ccSearchInput.focus(); }
      renderList('');
    }
  });

  ccSearchInput && ccSearchInput.addEventListener('input', () => renderList(ccSearchInput.value));

  document.addEventListener('click', (e) => {
    if (!ccWrap.contains(e.target)) {
      ccWrap.classList.remove('open');
      ccBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Initial render
  renderList('');
})();

// ─── Contact Form Validation & Submission ───
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const companyInput = document.getElementById('company');
  const serviceInput = document.getElementById('service');
  const messageInput = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');
  const successBox = document.getElementById('form-success');

  // Remove error state on input
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });

  // Watch hidden service input for selection changes
  const serviceSelect = document.getElementById('service-select');
  if (serviceSelect && serviceInput) {
    const observer = new MutationObserver(() => {
      if (serviceInput.value) serviceSelect.classList.remove('error');
    });
    observer.observe(serviceInput, { attributes: true, attributeFilter: ['value'] });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('.form-input, .form-textarea, .custom-select').forEach(f => f.classList.remove('error'));

    if (!fullNameInput.value.trim()) { fullNameInput.classList.add('error'); valid = false; }
    if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      emailInput.classList.add('error'); valid = false;
    }
    if (!serviceInput.value.trim()) { serviceSelect?.classList.add('error'); valid = false; }
    if (!messageInput.value.trim()) { messageInput.classList.add('error'); valid = false; }

    if (!valid) {
      form.querySelector('.error, .custom-select.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim() || 'Not provided';
    const company = companyInput.value.trim() || 'Not provided';
    const serviceValue = serviceInput.value.trim();
    const message = messageInput.value.trim();

    const serviceTitles = {
      "brand-strategy": "Brand Strategy", "logo-design": "Logo Design", "color-palette": "Color Palette",
      "typography-fonts": "Typography / Fonts", "brand-messaging-copywriting": "Brand Messaging & Copywriting",
      "brand-technology-dev-automation": "Brand Technology, Development & Automation",
      "social-media-branding": "Social Media Branding", "advertising-creative": "Advertising Creative",
      "packaging-design": "Packaging Design & Product Presentation",
      "social-media-graphics-design": "Social Media Graphics Design",
      "print-stationery-design": "Print & Stationery Design",
      "profile-optimization-branding": "Profile Optimization & Branding",
      "social-media-strategy": "Social Media Strategy",
      "content-calendar-scheduling": "Content Calendar & Scheduling",
      "community-management": "Community Management",
      "organic-growth-optimization": "Organic Growth Optimization",
      "social-media-reporting": "Social Media Reporting",
      "website-design-strategy": "Website Design & Strategy",
      "web-development-solutions": "Web Development Solutions",
      "mobile-app-development": "Mobile App Development",
      "full-stack-development": "Full Stack Development",
      "content-optimization": "Content & Optimization",
      "automation-solutions": "Automation Solutions",
      "google-ads": "Google Ads", "meta-ads": "Meta Ads (Facebook & Instagram)",
      "tiktok-ads": "TikTok Ads", "linkedin-ads": "LinkedIn Ads",
      "youtube-ads": "YouTube Ads", "whatsapp-ads": "WhatsApp Ads",
      "snapchat-ads": "Snapchat Ads", "pinterest-ads": "Pinterest Ads",
      "retargeting-remarketing-ads": "Retargeting / Remarketing Ads",
      "programmatic-ads": "Programmatic Ads", "x-twitter-ads": "X/Twitter Ads",
      "telegram-ads": "Telegram Ads", "copywriting-ad-copy": "Copywriting & Ad Copy",
      "ad-creatives-design": "Ad Creatives Design", "graphic-design": "Graphic Design",
      "video-production-editing": "Video Production & Editing",
      "content-writing": "Content Writing",
      "social-media-content-creation": "Social Media Content Creation",
      "motion-graphics-animation": "Motion Graphics & Animation",
      "creative-campaign-development": "Creative Campaign Development",
      "web-app-pentest": "Web Application Penetration Testing",
      "android-app-pentest": "Android Application Penetration Testing",
      "ios-app-pentest": "iOS Application Penetration Testing",
      "network-pentest": "Network Penetration Testing",
      "digital-brand-protection": "Digital Brand Protection",
      "other": "Other / Custom Requirement"
    };
    const friendlyService = serviceTitles[serviceValue] || serviceValue;

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i> Booking Your Call…`;

    const now = new Date();
    const submittedAt = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      + ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Construct AJAX FormSubmit payload
    const payload = {
      "_subject": "New Brandozer Lead — Free Brand Growth Audit",
      "_template": "box",
      "Lead Type": "Free 20-Minute Brand Growth Audit",
      "Lead Status": "New consultation request",
      "Lead Summary": "A potential client submitted the Brandozer consultation form and is ready for the next step. Review the details below, then confirm whether the Calendly meeting was booked.",
      "Recommended Action": "Check Calendly booking. If not booked, follow up by WhatsApp or email within 15 minutes.",
      "Client Name": fullName,
      "Client Email": email,
      "WhatsApp / Phone": phone,
      "Company / Brand / Website": company,
      "Service Interest": friendlyService,
      "Project Goal / Message": message,
      "Landing Page": "Brandozer Contact Page",
      "_honey": "" // Honeypot field for spam prevention
    };

    fetch("https://formsubmit.co/ajax/brandozer.official@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(() => onSuccess(fullName, email, phone, company, friendlyService, message, submittedAt, originalBtnText))
      .catch(() => onSuccess(fullName, email, phone, company, friendlyService, message, submittedAt, originalBtnText));

    function onSuccess(fullName, email, phone, company, friendlyService, message, submittedAt, originalBtnText) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Reset form
      form.reset();
      document.querySelectorAll('.custom-select-trigger').forEach(t => {
        if (t.closest('#service-select')) t.textContent = 'Select a service…';
      });
      document.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));

      // Reset country code button to Pakistan
      const ccFlagEl = document.getElementById('cc-flag');
      const ccCodeEl = document.getElementById('cc-code');
      if (ccFlagEl) ccFlagEl.textContent = '🇵🇰';
      if (ccCodeEl) ccCodeEl.textContent = '+92';

      // ── Beautifully formatted WhatsApp message ──
      const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━';
      const waMsg =
        `🚀 *NEW BRANDOZER LEAD — FREE BRAND GROWTH AUDIT*
${divider}

📌 *LEAD INFORMATION*
• *Lead Type:* Free 20-Minute Brand Growth Audit
• *Status:* New consultation request
• *Recommended Action:* Check Calendly booking. If not booked, follow up by WhatsApp or email within 15 minutes.

${divider}

👤 *CLIENT DETAILS*
• *Client Name:* ${fullName}
• *Client Email:* ${email}
• *WhatsApp / Phone:* ${phone}
• *Company / Brand / Website:* ${company}

${divider}

💼 *PROJECT DETAILS*
• *Service Interest:* ${friendlyService}

📝 *Project Goal / Message:*
${message}

${divider}
🌐 *Landing Page:* Brandozer Contact Page
🕐 *Submitted:* ${submittedAt}`;

      const waUrl = `https://wa.me/923288672756?text=${encodeURIComponent(waMsg)}`;

      // Show beautiful success card with manual action boxes
      if (successBox) {
        successBox.innerHTML = `
          <div class="success-wa-card">
            <div class="card-top">
              <div class="check-icon"><i class="fas fa-check"></i></div>
              <div class="card-text">
                <h4>Form Submitted Successfully!</h4>
                <p>We've recieved your request. Please choose your preferred next step below.</p>
              </div>
            </div>
            <div class="success-actions-grid">
              <!-- Calendly Box -->
              <div class="action-box calendly-box">
                <i class="far fa-calendar-alt action-box-icon"></i>
                <h5>Schedule Strategy Call</h5>
                <p>Pick a date & time on our calendar to lock in your free 30-min strategy session.</p>
                <button id="manual-cal-trigger" class="cal-trigger-btn">
                  Book Meeting
                </button>
              </div>
              
              <!-- WhatsApp Box -->
              <div class="action-box wa-box">
                <i class="fab fa-whatsapp action-box-icon"></i>
                <h5>Connect Instantly</h5>
                <p>Send your project details directly to our team via WhatsApp for a quicker response.</p>
                <a href="${waUrl}" target="_blank" rel="noopener" class="wa-send-btn">
                  Send to WhatsApp
                </a>
              </div>
            </div>
          </div>
        `;
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add event listener to the manual Calendly button
        const calBtn = document.getElementById('manual-cal-trigger');
        if (calBtn) {
          calBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCalendlyModal(fullName, email, phone);
          });
        }
      }
    }
  });

  // ── Calendly Modal Logic ──
  function openCalendlyModal(name, email, phone) {
    const overlay = document.getElementById('calendly-overlay');
    const clientNameEl = document.getElementById('cal-client-name');
    const embedContainer = document.getElementById('calendly-embed-container');
    const loadingEl = document.getElementById('cal-loading');
    if (!overlay) return;

    if (clientNameEl) clientNameEl.textContent = name;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // ⚠️ Replace the URL below with your actual Calendly event link
    const calendlyBase = 'https://calendly.com/brandozer-official/30min';
    const params = new URLSearchParams({
      name: name,
      email: email,
      a1: phone,
      hide_gdpr_banner: '1',
      background_color: 'ffffff',
      text_color: '000000',
      primary_color: 'C9A84C'
    });

    if (embedContainer) embedContainer.innerHTML = '';
    if (loadingEl) loadingEl.style.display = 'flex';

    // URLSearchParams uses '+' for spaces, but Calendly expects '%20'
    // So we replace '+' with '%20' in the final query string
    const queryString = params.toString().replace(/\+/g, '%20');
    const fullUrl = `${calendlyBase}?${queryString}`;

    function initWidget() {
      if (window.Calendly && embedContainer) {
        Calendly.initInlineWidget({ url: fullUrl, parentElement: embedContainer });
        // Show timezone hider after widget renders
        setTimeout(() => {
          if (loadingEl) loadingEl.style.display = 'none';
          const tzHider = document.getElementById('cal-tz-hider');
          if (tzHider) tzHider.style.display = 'block';
        }, 2500);
      }
    }

    if (!window.Calendly) {
      if (!document.getElementById('calendly-css')) {
        const link = document.createElement('link');
        link.id = 'calendly-css';
        link.rel = 'stylesheet';
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(link);
      }
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }
  }

  // Close modal controls
  const overlay = document.getElementById('calendly-overlay');
  const closeBtn = document.getElementById('calendly-close-btn');

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    const ec = document.getElementById('calendly-embed-container');
    if (ec) {
      // Remove iframe but keep the tz hider div
      const tzHider = document.getElementById('cal-tz-hider');
      ec.innerHTML = '';
      if (tzHider) { tzHider.style.display = 'none'; ec.appendChild(tzHider); }
    }
  }

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay?.classList.contains('active')) closeModal();
  });
})();

// ─── Newsletter Form ───
(function () {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.footer-subscribe-input');
    const success = form.parentElement.querySelector('.footer-subscribe-success');
    if (!input || !input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = '#e74c3c';
      setTimeout(() => input.style.borderColor = '', 2000);
      return;
    }
    if (success) {
      success.style.display = 'block';
      form.style.display = 'none';
      input.value = '';
    }
  });
})();

// ─── Smooth Page Load ───
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// ─── General Accordion ───
(function () {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();
