/* ──────────────────────────────────────
   script.js – Animationen & Interaktionen
   Microsoft 365 Prozessautomatisierung
────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Mobile Navigation ──
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');
  const body = document.body;

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      body.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    });

    // Close on nav link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        body.classList.remove('nav-open');
      });
    });
  }

  // ── 2. Header scroll effect ──
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── 3. Active Nav Link on Scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const observeActive = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4, rootMargin: `-${72}px 0px 0px 0px` });

  sections.forEach(s => observeActive.observe(s));

  // ── 4. Scroll Reveal (IntersectionObserver) ──
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target); // only once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── 5. Flow Counter Animation ──
  const counterEl = document.getElementById('flow-counter');
  if (counterEl) {
    // Animate counter from 0 to random number between 48–127
    const target = Math.floor(Math.random() * 80) + 48;
    let current = 0;
    const duration = 1800; // ms
    const step = Math.ceil(target / (duration / 16));

    const tick = () => {
      current = Math.min(current + step, target);
      counterEl.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };

    // Start counter when hero is visible
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(tick, 800);
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });

    const heroSection = document.getElementById('hero');
    if (heroSection) counterObserver.observe(heroSection);
  }

  // ── 6. Flow Steps Sequential Animation ──
  const flowSteps = document.querySelectorAll('.flow-step');
  let activeIndex = 0;

  const activateStep = () => {
    flowSteps.forEach((step, i) => {
      step.style.transform = i === activeIndex ? 'scale(1.08)' : '';
    });
    activeIndex = (activeIndex + 1) % flowSteps.length;
  };

  if (flowSteps.length) {
    setInterval(activateStep, 1400);
  }

  // ── 7. Form Submission (Demo) ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.innerHTML = '<span>✓ Nachricht gesendet!</span>';
      btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  // ── 8. Tool chips stagger animation ──
  const toolChips = document.querySelectorAll('.tool-chip');
  toolChips.forEach((chip, i) => {
    chip.style.opacity = '0';
    chip.style.transform = 'scale(.92)';
    chip.style.transition = `opacity .4s ease ${i * 50}ms, transform .4s ease ${i * 50}ms`;
  });

  const toolsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      toolChips.forEach(chip => {
        chip.style.opacity = '1';
        chip.style.transform = 'scale(1)';
      });
      toolsObserver.disconnect();
    }
  }, { threshold: 0.2 });

  const toolsSection = document.getElementById('tools');
  if (toolsSection) toolsObserver.observe(toolsSection);

  // ── 9. Smooth scroll offset (for fixed header) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 10. Card tilt micro-interaction ──
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
