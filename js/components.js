/* ═══════════════════════════════════════════
   COMPONENTS.JS — slider, accordion, filter, navbar
═══════════════════════════════════════════ */

// ─── Testimonial Slider ───
(function() {
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
(function() {
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
(function() {
  document.querySelectorAll('.job-item').forEach(item => {
    const header = item.querySelector('.job-header');
    if (!header) return;
    header.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
})();

// ─── Services Accordion / Tab ───
(function() {
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
(function() {
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
(function() {
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
(function() {
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

// ─── Contact Form Validation & FormSubmit.co Integration ───
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const companyInput = document.getElementById('company');
  const serviceInput = document.getElementById('service');
  const sourceInput = document.getElementById('source');
  const messageInput = document.getElementById('message');
  const callTimeInput = document.getElementById('call-time');
  const submitBtn = form.querySelector('button[type="submit"]');
  const successBox = document.getElementById('form-success');

  // Input listener to remove error class on change
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

  // Watch hidden service input for selection changes
  const serviceSelect = document.getElementById('service-select');
  if (serviceSelect && serviceInput) {
    const observer = new MutationObserver(() => {
      if (serviceInput.value) {
        serviceSelect.classList.remove('error');
      }
    });
    observer.observe(serviceInput, { attributes: true, attributeFilter: ['value'] });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Reset error styling
    form.querySelectorAll('.form-input, .form-textarea, .custom-select').forEach(field => {
      field.classList.remove('error');
    });

    // Validate Full Name
    if (!fullNameInput.value.trim()) {
      fullNameInput.classList.add('error');
      valid = false;
    }

    // Validate Email
    if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      valid = false;
    }

    // Validate Service Required
    if (!serviceInput.value.trim()) {
      serviceSelect?.classList.add('error');
      valid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageInput.classList.add('error');
      valid = false;
    }

    if (!valid) {
      // Find the first error element and scroll to it
      const firstError = form.querySelector('.error, .custom-select.error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Capture and format values
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim() || "Not provided";
    const company = companyInput.value.trim() || "Not provided";
    const serviceValue = serviceInput.value.trim();
    const sourceValue = sourceInput.value.trim() || "Not provided";
    const message = messageInput.value.trim();
    const callTime = callTimeInput.value.trim() || "Not provided";

    // Map service technical values to friendly titles
    const serviceTitles = {
      "brand-strategy": "Brand Strategy & Positioning",
      "brand-naming": "Brand Naming & Tagline Development",
      "logo-design": "Logo Design & Visual Identity",
      "brand-guidelines": "Brand Guidelines Document",
      "brand-collateral": "Brand Collateral Design",
      "brand-comm": "Brand Communication Assets",
      "social-optimization": "Profile Optimization & Branding",
      "social-strategy": "Social Media Strategy",
      "social-calendar": "Content Calendar & Scheduling",
      "community-management": "Community Management",
      "organic-growth": "Organic Growth Optimization",
      "social-reporting": "Social Media Reporting",
      "web-strategy": "Website Strategy & Wireframing",
      "ui-ux-design": "Custom UI/UX Website Design",
      "frontend-dev": "Front-End Development",
      "fullstack-dev": "Full-Stack Web Development",
      "cms-ecommerce": "CMS & E-Commerce Development",
      "web-automation": "Web Automation & System Integration",
      "landing-pages": "Landing Pages & Funnels",
      "seo": "Search Engine Optimization (SEO)",
      "google-ads": "Google Ads",
      "meta-ads": "Meta Ads (Facebook & Instagram)",
      "tiktok-ads": "TikTok Ads",
      "linkedin-ads": "LinkedIn Ads",
      "youtube-ads": "YouTube Ads",
      "whatsapp-ads": "WhatsApp Ads",
      "snapchat-ads": "Snapchat Ads",
      "pinterest-ads": "Pinterest Ads",
      "retargeting-ads": "Retargeting / Remarketing Ads",
      "programmatic-ads": "Programmatic Ads",
      "copywriting": "Copywriting & Ad Copy",
      "ad-creatives": "Ad Creatives Design",
      "graphic-design": "Graphic Design",
      "video-production": "Video Production & Editing",
      "content-writing": "Content Writing",
      "social-content": "Social Media Content Creation",
      "motion-graphics": "Motion Graphics & Animation",
      "creative-campaign": "Creative Campaign Development",
      "other": "Other / Custom Requirement"
    };

    const friendlyService = serviceTitles[serviceValue] || serviceValue;

    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Booking Your Call...`;

    // Construct AJAX FormSubmit payload
    const payload = {
      "Full Name": fullName,
      "Email Address": email,
      "WhatsApp / Phone": phone,
      "Company / Brand Name": company,
      "Service Required": friendlyService,
      "Referral Source": sourceValue,
      "Preferred Date for Call": callTime,
      "Message / Brief": message,
      "_subject": `🚀 New Brand Strategy Consultation: ${fullName}`,
      "_template": "table",
      "_honey": "" // Honeypot field for spam prevention
    };

    fetch("https://formsubmit.co/ajax/brandozer.official@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Clear the inputs
      form.reset();
      
      // Reset custom selects
      document.querySelectorAll('.custom-select-trigger').forEach(trigger => {
        if (trigger.parentElement.id === 'service-select') {
          trigger.textContent = 'Select a service…';
        } else if (trigger.parentElement.id === 'source-select') {
          trigger.textContent = 'Select an option…';
        }
      });
      document.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));

      // Construct highly formatted WhatsApp Message
      const waMessage = `Hi Brandozer! 🚀\nI just submitted a contact form on your website. Here are my project details:\n\n👤 *Name:* ${fullName}\n📧 *Email:* ${email}\n📞 *WhatsApp:* ${phone}\n🏢 *Company:* ${company}\n💼 *Service:* ${friendlyService}\n💡 *Source:* ${sourceValue}\n📅 *Preferred Call Date:* ${callTime}\n\n📝 *Message:*\n${message}`;
      const waUrl = `https://wa.me/923288672756?text=${encodeURIComponent(waMessage)}`;

      // Update the success box to look premium and dynamic
      if (successBox) {
        successBox.innerHTML = `
          <div style="text-align: left;">
            <h3 style="color: #27AE60; font-family: var(--font-heading); font-size: 20px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-check-circle"></i> Strategy Call Booked Successfully!
            </h3>
            <p style="color: var(--color-white); margin-bottom: 20px; font-size: 15px; line-height: 1.6;">
              Thank you! We've received your request and logged it to our email inbox (<strong>brandozer.official@gmail.com</strong>). We will get back to you within 24 hours.
            </p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn-majestic-primary btn-shimmer" style="background: #25D366; border-color: #25D366; color: white !important; font-size: 15px; padding: 14px 28px; border-radius: 4px; display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 600;">
                <i class="fab fa-whatsapp" style="font-size: 18px;"></i> Connect Instantly on WhatsApp
              </a>
            </div>
          </div>
        `;
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Automatically attempt to open WhatsApp in a new tab for seamless flow
      window.open(waUrl, "_blank");
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      
      // Fallback: If fetch fails, we still let them connect directly on WhatsApp!
      const waMessage = `Hi Brandozer! 🚀\nI wanted to request a Strategy Call. Here are my project details:\n\n👤 *Name:* ${fullName}\n📧 *Email:* ${email}\n📞 *WhatsApp:* ${phone}\n🏢 *Company:* ${company}\n💼 *Service:* ${friendlyService}\n📅 *Preferred Call Date:* ${callTime}\n\n📝 *Message:*\n${message}`;
      const waUrl = `https://wa.me/923288672756?text=${encodeURIComponent(waMessage)}`;

      if (successBox) {
        successBox.innerHTML = `
          <div style="text-align: left;">
            <h3 style="color: #e67e22; font-family: var(--font-heading); font-size: 20px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-exclamation-circle"></i> Network Connection Notice
            </h3>
            <p style="color: var(--color-white); margin-bottom: 20px; font-size: 15px; line-height: 1.6;">
              It looks like we couldn't connect to our email server. No worries! You can click the button below to send your details directly via WhatsApp instead.
            </p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn-majestic-primary btn-shimmer" style="background: #25D366; border-color: #25D366; color: white !important; font-size: 15px; padding: 14px 28px; border-radius: 4px; display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 600;">
                <i class="fab fa-whatsapp" style="font-size: 18px;"></i> Connect on WhatsApp Now
              </a>
            </div>
          </div>
        `;
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      window.open(waUrl, "_blank");
    });
  });
})();

// ─── Newsletter Form ───
(function() {
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
(function() {
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
