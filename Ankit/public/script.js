/* =============================================
   KUMAR HOMECARE SERVICES — script.js (v3 Animated)
   ============================================= */
'use strict';

/* ──────────────────────────────────
   PAGE LOADER — hide once everything loads
────────────────────────────────── */
const pageLoader = document.getElementById('pageLoader');
// Lock scroll while loading
document.body.style.overflow = 'hidden';

window.addEventListener('load', () => {
  setTimeout(() => {
    pageLoader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 600); // slight delay so loader feels intentional
});

/* ──────────────────────────────────
   NAVBAR scroll effect + active links
────────────────────────────────── */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightActiveNav();
  handleParallax();
}, { passive: true });

function highlightActiveNav() {
  const pos = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}

/* ──────────────────────────────────
   HAMBURGER / MOBILE MENU
────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link, .mobile-cta').forEach(l =>
  l.addEventListener('click', closeMobileMenu)
);

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ──────────────────────────────────
   SMOOTH SCROLL
────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════════════════════
   SCROLL ANIMATIONS — IntersectionObserver
══════════════════════════════════════════════ */

/* 1. Universal reveal observer */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* 2. Direction-specific observers */
const dirObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('anim-in');
      dirObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-anim]').forEach(el => dirObs.observe(el));

/* 3. Stagger children observer */
const staggerObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const children = e.target.querySelectorAll('[data-stagger]');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('anim-in'), i * 110);
      });
      staggerObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('[data-stagger-wrap]').forEach(el => staggerObs.observe(el));

/* ──────────────────────────────────
   PARALLAX on Hero Image
────────────────────────────────── */
const heroImg = document.querySelector('.hero-img');
function handleParallax() {
  if (!heroImg) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroImg.style.transform = `translateY(${scrolled * 0.28}px) scale(1.05)`;
  }
}

/* ──────────────────────────────────
   COUNTER ANIMATION for trust stats
────────────────────────────────── */
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const isK = suffix.includes('K');
  const endVal = isK ? target * 1000 : target;

  requestAnimationFrame(function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(ease * endVal);

    if (isK) {
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'K'
        : current;
    } else {
      el.textContent = current;
    }

    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isK ? target + 'K' : target;
  });
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const nums = e.target.querySelectorAll('.trust-num[data-count]');
    nums.forEach(num => {
      const raw     = num.dataset.count;
      const suffix  = num.dataset.suffix || '';
      const target  = parseInt(raw);
      animateCounter(num, target, suffix, 1800);
    });
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

const heroBar = document.querySelector('.hero-trust-row');
if (heroBar) counterObs.observe(heroBar);

/* ──────────────────────────────────
   PROGRESS LINE — Steps section
────────────────────────────────── */
const stepsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const line = document.querySelector('.steps-progress-line');
      if (line) line.style.width = '100%';
      stepsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const stepsRow = document.querySelector('.steps-row');
if (stepsRow) stepsObs.observe(stepsRow);

/* ──────────────────────────────────
   SECTION LINE REVEAL
────────────────────────────────── */
const lineObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('line-visible');
      lineObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.section-underline').forEach(el => lineObs.observe(el));

/* ──────────────────────────────────
   FAQ ACCORDION
────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item     = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item.active').forEach(open => {
      open.classList.remove('active');
      open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
  });
});

// Open first FAQ by default
const firstFaq = document.querySelector('.faq-item');
if (firstFaq) {
  firstFaq.classList.add('active');
  firstFaq.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
}

/* ──────────────────────────────────
   BOOKING FORM
────────────────────────────────── */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name      = document.getElementById('fullName').value.trim();
    const phone     = document.getElementById('phone').value.trim();
    const appliance = document.getElementById('appliance').value;
    const problem   = document.getElementById('problem').value.trim();

    if (!name)                   { markError('fullName',  'Please enter your full name.');       return; }
    if (!phone || phone.length < 8) { markError('phone',  'Please enter a valid phone number.'); return; }
    if (!appliance)              { markError('appliance', 'Please select an appliance type.');   return; }
    if (!problem)                { markError('problem',   'Please describe the problem briefly.'); return; }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    setTimeout(() => {
      showToast('✅ Booking received! We\'ll call you within 15 minutes.', 'success');
      bookingForm.reset();
      btn.disabled = false;
      btn.innerHTML = 'Submit Request <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
    }, 1200);
  });
}

function markError(id, msg) {
  const el = document.getElementById(id);
  el.style.borderColor = '#ef4444';
  el.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.12)';
  showToast('⚠️ ' + msg);
  el.focus();
  el.addEventListener('input', function clear() {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
    el.removeEventListener('input', clear);
  }, { once: true });
}

/* ──────────────────────────────────
   TOAST
────────────────────────────────── */
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast' + (type ? ' ' + type : '');
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
}

/* ──────────────────────────────────
   FLOATING CALL BTN PULSE
────────────────────────────────── */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes floatPulse {
    0%,100% { box-shadow: 0 6px 24px rgba(0,0,0,.22), 0 0 0 0 rgba(15,15,15,.4); }
    50%      { box-shadow: 0 6px 24px rgba(0,0,0,.22), 0 0 0 14px rgba(15,15,15,0); }
  }
  .pulse-anim { animation: floatPulse 2s ease-in-out 3; }
`;
document.head.appendChild(styleEl);

let idleTimer;
const floatCall = document.querySelector('.float-call');
function resetIdle() {
  clearTimeout(idleTimer);
  floatCall?.classList.remove('pulse-anim');
  idleTimer = setTimeout(() => floatCall?.classList.add('pulse-anim'), 9000);
}
['scroll','mousemove','click','touchstart'].forEach(ev =>
  window.addEventListener(ev, resetIdle, { passive: true })
);
resetIdle();

/* ──────────────────────────────────
   MAGNETIC HOVER on buttons
────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-hero-primary').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = '';
  });
});

/* ──────────────────────────────────
   CARD TILT on service cards
────────────────────────────────── */
document.querySelectorAll('.service-card, .why-card, .review-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  =  dy * 4;
    const tiltY  = -dx * 4;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
    setTimeout(() => { card.style.transition = ''; }, 400);
  });
});

/* ──────────────────────────────────
   SCROLL PROGRESS BAR at top
────────────────────────────── */
const progressBar = document.getElementById('scrollProgress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total   = document.body.scrollHeight - window.innerHeight;
    const percent = (window.scrollY / total) * 100;
    progressBar.style.width = percent + '%';
  }, { passive: true });
}

/* ──────────────────────────────────
   HERO immediately visible
────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Instantly show hero — no scroll needed
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));

  // Hero entrance animations (staggered)
  const heroEls = [
    document.querySelector('.hero-eyebrow'),
    document.querySelector('.hero-headline'),
    document.querySelector('.hero-sub'),
    document.querySelector('.hero-actions'),
  ];
  heroEls.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.75s ease, transform 0.75s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 300 + i * 160);
  });

  // Hero bottom bar slides up
  const bar = document.querySelector('.hero-bottom-bar');
  if (bar) {
    bar.style.opacity = '0';
    bar.style.transform = 'translateY(20px)';
    setTimeout(() => {
      bar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      bar.style.opacity = '1';
      bar.style.transform = 'translateY(0)';
    }, 900);
  }

  // ── Auto-update copyright year ──
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize hero slider
  initSlider();
});

/* ──────────────────────────────────
   SIMPLE HERO IMAGE SLIDER (AUTO)
────────────────────────────────── */
function initSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.slide'));
  if (slides.length === 0) return;

  let current = 0;
  let interval = null;
  const delay = 4500;

  function show(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    current = i;
  }

  function next() { show((current + 1) % slides.length); }

  function start() { stop(); interval = setInterval(next, delay); }
  function stop()  { if (interval) clearInterval(interval); interval = null; }

  // start state
  show(0);
  start();

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
}
