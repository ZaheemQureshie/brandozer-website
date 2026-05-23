/* ═══════════════════════════════════════════
   MAIN.JS — cursor, scroll, loader, navbar
═══════════════════════════════════════════ */

// ─── Loading Screen ───
(function() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);
  }, 2000);
})();

// ─── Custom Cursor ───
(function() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;

  let outlineX = 0, outlineY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover states
  document.querySelectorAll('a, button, .filter-tab, .job-header, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Cursor Contrast for Gold elements
  document.querySelectorAll('.btn-majestic-primary, .nav-cta, .btn-majestic-secondary').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-contrast'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-contrast'));
  });
})();

// ─── Scroll Progress Bar ───
(function() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

// ─── Navbar Scroll Behavior ───
(function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
})();

// ─── Hamburger Menu ───
(function() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ─── Active Nav Link ───
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, #mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ─── Gold Particles ───
function createParticles(container, count = 25) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${4 + Math.random() * 5}s;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

// Initialize particles
document.addEventListener('DOMContentLoaded', () => {
  const heroParticles = document.getElementById('hero-particles');
  if (heroParticles) createParticles(heroParticles, 25);
});

// ─── Parallax Hero ───
(function() {
  const heroImg = document.getElementById('hero-parallax');
  if (!heroImg) return;
  
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroImg.style.transform = `translateY(${offset * 0.3}px)`;
  }, { passive: true });
})();

// ─── Smooth Scroll for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Page reveal on load ───
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition');
});

// ─── Cursor dynamic re-scan ───
function refreshCursorTargets() {
  document.querySelectorAll('a, button, .filter-tab, .job-header, .faq-question, .testimonial-arrow').forEach(el => {
    if (!el._cursorBound) {
      el._cursorBound = true;
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    }
  });
}

document.addEventListener('DOMContentLoaded', refreshCursorTargets);


