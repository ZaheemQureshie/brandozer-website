/* ═══════════════════════════════════════════
   ANIMATIONS.JS — scroll reveal, counters, parallax, progress bars
═══════════════════════════════════════════ */

// ─── Intersection Observer — Scroll Reveal ───
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function observeRevealElements() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', observeRevealElements);
})();

// ─── Animated Counter ───
function animateCounter(el, target, suffix = '', duration = 1500) {
  const start = performance.now();
  const startVal = 0;
  el.classList.add('counting');

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = Math.round(startVal + (target - startVal) * easedProgress);
    el.textContent = current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.classList.remove('counting');
      el.classList.add('complete');
    }
  }

  requestAnimationFrame(update);
}

// ─── Counter Observer ───
(function() {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        animateCounter(el, target, suffix, 2000);
        el.dataset.prefix && (el.dataset.prefixed = 'true');
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-counter]').forEach(el => {
      counterObserver.observe(el);
    });
  });
})();

// ─── Skill / Progress Bar Animation ───
(function() {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        if (fill) {
          const width = fill.dataset.width;
          setTimeout(() => {
            fill.style.width = width + '%';
          }, 100);
        }
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-bar-wrap').forEach(el => {
      barObserver.observe(el);
    });
  });
})();

// ─── Parallax CTA Background ───
(function() {
  const ctaParallax = document.querySelectorAll('[data-parallax]');
  if (!ctaParallax.length) return;

  window.addEventListener('scroll', () => {
    ctaParallax.forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    });
  }, { passive: true });
})();

// ─── Timeline Active Steps ───
(function() {
  const steps = document.querySelectorAll('.process-step');
  if (!steps.length) return;

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const stepNum = entry.target.querySelector('.step-number');
      const stepCard = entry.target.querySelector('.step-card');
      if (entry.isIntersecting) {
        stepNum?.classList.add('active');
        stepCard?.classList.add('active');
      }
    });
  }, { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' });

  steps.forEach(step => stepObserver.observe(step));
})();

// ─── Staggered card observer ───
(function() {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger cards within the parent
        const parent = entry.target;
        const children = parent.querySelectorAll('.reveal');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('revealed'), i * 120);
        });
        cardObserver.unobserve(parent);
      }
    });
  }, { threshold: 0.1 });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-stagger]').forEach(el => {
      cardObserver.observe(el);
    });
  });
})();
