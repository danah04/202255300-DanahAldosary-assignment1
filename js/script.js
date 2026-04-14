/* ==========================================================================
   PORTFOLIO — script.js
   1. Active nav link (scroll-based)
   2. Mobile nav toggle
   3. Scroll-reveal animations
   4. Contact form validation + feedback
   5. Footer year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     UTILITY: throttle — limits how often fn fires during fast scroll events
     Defined first (function declaration = hoisted) so everything below can use it.
     ========================================================================= */
  function throttle(fn, limit) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn.apply(this, args); }
    };
  }


  /* =========================================================================
     1. ACTIVE NAV LINK
     On scroll, find the section whose top edge is closest to (but above)
     the 33% mark of the viewport. Highlight the matching nav link.
     Works in both scroll directions — no IntersectionObserver quirks.
     ========================================================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const triggerY = window.scrollY + window.innerHeight * 0.33;
    let currentId = sections[0]?.id || '';

    sections.forEach(sec => {
      if (sec.offsetTop <= triggerY) currentId = sec.id;
    });

    navLinks.forEach(link => {
      // Don't remove active from the "Hire Me!" CTA link — it has no section
      if (link.classList.contains('nav-link--cta')) return;
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', throttle(updateActiveNav, 80));
  updateActiveNav(); // run on load


  /* =========================================================================
     2. MOBILE NAV TOGGLE
     Hamburger ↔ ✕, aria-expanded, close on link click.
     ========================================================================= */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '&#9776;';
      });
    });
  }


  /* =========================================================================
     3. SCROLL-REVEAL
     Add class="reveal" to any element in the HTML.
     Optional: add data-delay="150" (ms) for staggered entrance.
     ========================================================================= */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
 
  /* =========================================================================
     4. PROJECTS FILTER + SORT
     3 dropdowns: category, sort (newest/oldest), and level (beginner/advanced).
     ========================================================================= */
  const filterCategory = document.getElementById('filter-category');
  const sortProjects = document.getElementById('sort-projects');
  const filterLevel = document.getElementById('filter-level');
  const projectsMessage = document.getElementById('projects-message');
  const projectsGrid = document.querySelector('#projects .projects-grid');
  const projectCards = Array.from(document.querySelectorAll('#projects .project-card'));

  function updateProjects() {
    if (!projectsGrid || !projectCards.length) return;

    const selectedCategory = filterCategory.value;
    const selectedSort = sortProjects.value;
    const selectedLevel = filterLevel.value;

    let filteredProjects = projectCards.filter(card => {
      const matchCategory =
        selectedCategory === 'all' || card.dataset.category === selectedCategory;

      const matchLevel =
        selectedLevel === 'all' || card.dataset.level === selectedLevel;

      return matchCategory && matchLevel;
    });

    filteredProjects.sort((a, b) => {
      const yearA = Number(a.dataset.year);
      const yearB = Number(b.dataset.year);

      if (selectedSort === 'newest') {
        return yearB - yearA;
      } else {
        return yearA - yearB;
      }
    });

    projectCards.forEach(card => {
      card.style.display = 'none';
    });

    filteredProjects.forEach(card => {
      card.style.display = 'block';
      projectsGrid.appendChild(card);
    });

    if (selectedLevel === 'beginner') {
      projectsMessage.textContent = 'Showing beginner-friendly projects.';
    } else if (selectedLevel === 'advanced') {
      projectsMessage.textContent = 'Showing more advanced projects.';
    } else {
      projectsMessage.textContent = 'Showing all projects.';
    }
  }

  if (filterCategory) filterCategory.addEventListener('change', updateProjects);
  if (sortProjects) sortProjects.addEventListener('change', updateProjects);
  if (filterLevel) filterLevel.addEventListener('change', updateProjects);

  updateProjects();

  /* =========================================================================
     5. CONTACT FORM — validation + submission feedback
     ─────────────────────────────────────────────────────
     ========================================================================= */
  const contactForm  = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (!contactForm) return; // guard if form not in DOM

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const nameEl    = document.getElementById('name');
    const emailEl   = document.getElementById('email');
    const messageEl = document.getElementById('message');
    let valid = true;

    if (!nameEl.value.trim()) {
      setError('name-error', nameEl, 'Please enter your name.');
      valid = false;
    }
    if (!emailEl.value.trim()) {
      setError('email-error', emailEl, 'Please enter your email.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      setError('email-error', emailEl, 'Please enter a valid email address.');
      valid = false;
    }
    if (!messageEl.value.trim()) {
      setError('message-error', messageEl, 'Please write a message.');
      valid = false;
    }
    if (!valid) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled   = true;
    submitBtn.textContent = 'Sending…';

    fetch('https://formspree.io/f/xlgaelwg', {
           method: 'POST',
           headers: { 'Accept': 'application/json' },
           body: new FormData(contactForm)
         })
         .then(res => res.ok ? onSuccess() : onError())
         .catch(() => onError())
         .finally(() => resetBtn());
    // ──────────────────────────────────────────────────────────────────────
  });

  function setError(errorId, input, msg) {
    const el = document.getElementById(errorId);
    if (el) el.textContent = msg;
    input.classList.add('error');
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const el = document.getElementById(errorId);
      if (el) el.textContent = '';
    }, { once: true });
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    formFeedback.textContent = '';
    formFeedback.className   = 'form-feedback';
  }

  function onSuccess() {
    contactForm.reset();
    formFeedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formFeedback.className   = 'form-feedback success';
  }

  function onError() {
    formFeedback.textContent = '✕ Something went wrong. Please email me directly.';
    formFeedback.className   = 'form-feedback error';
  }

  function resetBtn(btn) {
    btn.disabled     = false;
    btn.textContent  = 'Send Message →';
  }


  /* =========================================================================
     6. FOOTER YEAR
     ========================================================================= */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================================
   7.DID YOU KNOW? — FACT API
   ========================================================================= */
  const factText = document.getElementById('fact-text');
  const factStatus = document.getElementById('fact-status');
  const newFactBtn = document.getElementById('new-fact-btn');

  async function loadFact() {
    if (!factText || !factStatus) return;

    try {
      factStatus.textContent = 'Loading...';

      const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      factText.textContent = data.text;
      factStatus.textContent = '';

    } catch (error) {
      factStatus.textContent = 'Could not load a fact. Please try again.';
      console.error(error);
    }
  }

  if (newFactBtn) {
    newFactBtn.addEventListener('click', loadFact);
  }

  // load first fact automatically
  loadFact();

});