/* ==========================================================================
   PORTFOLIO — script.js
   Features:
   1. Navbar: transparent → opaque on scroll
   2. Active nav link via Intersection Observer
   3. Mobile nav toggle
   4. Scroll-reveal animations
   5. Contact form validation + feedback
   6. Footer year auto-update
   ========================================================================== */


/* ==========================================================================
   UTILITY: Wait for DOM to be fully loaded before running any code
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. NAVBAR — SCROLL BEHAVIOUR
     Adds .scrolled class to #navbar once the user scrolls past the hero.
     The CSS transitions the navbar from transparent to navy background.
     ========================================================================= */
  const navbar = document.getElementById('navbar');

  // Distance (px) after which navbar becomes opaque
  const SCROLL_THRESHOLD = 80;

  function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Throttle scroll handler for performance
  window.addEventListener('scroll', throttle(handleNavbarScroll, 100));

  // Run once on load in case page is refreshed mid-scroll
  handleNavbarScroll();


  /* =========================================================================
     2. ACTIVE NAV LINK — INTERSECTION OBSERVER
     Watches each <section> element. When a section crosses the threshold
     of the viewport, the matching nav link gets .active class and any
     previously active link loses it.

     How it works:
     - querySelectorAll grabs all sections that have an id
     - IntersectionObserver fires whenever a section enters/exits viewport
     - We match the section's id to the nav <a> whose href="#id"
     ========================================================================= */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root:       null,        // viewport
    rootMargin: `-${navbar.offsetHeight}px 0px -40% 0px`,
    // section must pass navbar height from top AND be above 40% from bottom
    threshold:  0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Remove active from all links
      navLinks.forEach(link => link.classList.remove('active'));

      // Add active to the matching link
      const targetId   = entry.target.id;
      const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
      if (activeLink) activeLink.classList.add('active');
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));


  /* =========================================================================
     3. MOBILE NAV TOGGLE
     The .nav-toggle button shows/hides .nav-links on small screens.
     Clicking a nav link also closes the menu.
     ========================================================================= */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      // Update aria-expanded for accessibility
      navToggle.setAttribute('aria-expanded', isOpen);
      // Swap hamburger icon to X when open
      navToggle.textContent = isOpen ? '\u00D7' : '\u2630';  /* × : ☰ */
    });

    // Close menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '\u2630';
      });
    });
  }


  /* =========================================================================
     4. SCROLL-REVEAL ANIMATION
     Any element with class .reveal will fade + slide up into view when
     it enters the viewport. Add class="reveal" to cards, timeline items,
     section content, etc. in your HTML.

     For staggered delays on child elements add a data-delay attribute:
       <div class="project-card reveal" data-delay="100"> (ms)
     ========================================================================= */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const delay = entry.target.dataset.delay || 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Number(delay));

      // Unobserve after reveal so it doesn't toggle back
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold:  0.12,   // trigger when 12% of element is visible
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* =========================================================================
     5. CONTACT FORM — VALIDATION + SUBMISSION FEEDBACK
     Validates required fields client-side. On success, shows a confirmation
     message. Hook up the actual submission logic (Formspree / EmailJS /
     your own API) inside the handleFormSubmit function.
     ========================================================================= */
  const contactForm    = document.getElementById('contact-form');
  const formFeedback   = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    // --- 5a. Gather field references ---
    const nameField    = document.getElementById('name');
    const emailField   = document.getElementById('email');
    const messageField = document.getElementById('message');

    // --- 5b. Clear previous errors ---
    clearFormErrors();

    // --- 5c. Validate fields ---
    let isValid = true;

    if (!nameField.value.trim()) {
      showFieldError('name-error', nameField, 'Please enter your name.');
      isValid = false;
    }

    if (!emailField.value.trim()) {
      showFieldError('email-error', emailField, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(emailField.value.trim())) {
      showFieldError('email-error', emailField, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!messageField.value.trim()) {
      showFieldError('message-error', messageField, 'Please enter a message.');
      isValid = false;
    }

    if (!isValid) return;

    // --- 5d. Disable button and show loading state ---
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    // --- 5e. TODO: Replace this block with your real API call ---
    // Example using Formspree:
    //
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method:  'POST',
    //   headers: { 'Accept': 'application/json' },
    //   body:    new FormData(contactForm)
    // })
    // .then(res => res.ok ? onFormSuccess() : onFormError())
    // .catch(() => onFormError())
    // .finally(() => {
    //   submitBtn.disabled    = false;
    //   submitBtn.textContent = 'Send Message';
    // });
    //
    // Remove the mock timeout below once you wire up a real endpoint.

    // Mock delay — simulates async network request
    setTimeout(() => {
      onFormSuccess();
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    }, 1500);
  }

  /* --- Helpers --- */

  function showFieldError(errorId, inputEl, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
    inputEl.classList.add('error');

    // Remove error state as soon as user starts retyping
    inputEl.addEventListener('input', () => {
      inputEl.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }, { once: true });
  }

  function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    formFeedback.textContent = '';
    formFeedback.className   = 'form-feedback';
  }

  function isValidEmail(email) {
    // Simple regex — adequate for client-side UX, server must re-validate
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function onFormSuccess() {
    contactForm.reset();
    formFeedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formFeedback.classList.add('success');
  }

  function onFormError() {
    formFeedback.textContent = '✕ Something went wrong. Please try again or email me directly.';
    formFeedback.classList.add('error');
  }


  /* =========================================================================
     6. FOOTER — DYNAMIC YEAR
     Keeps copyright year always current without manual edits.
     ========================================================================= */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* =========================================================================
     UTILITY: Throttle
     Limits how often a function fires during rapid events (scroll, resize).
     ========================================================================= */
  function throttle(fn, limit) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }


  /* =========================================================================
     TODO HOOKS — Add these features as you build out the site:

     A) Project filter buttons
        - Add click listeners to .filter-btn elements
        - Toggle .hidden on .project-card items based on data-category attr
        - Animate the filtering with CSS transitions

     B) Timeline entry animations
        - Add class="reveal" + data-delay attributes to .timeline-item elements
        - The revealObserver above will handle them automatically

     C) Typed / animated hero subtitle
        - Use a simple setInterval to cycle through role strings in .hero-title

     D) Lightbox for project images
        - On card click, open full-size image in a modal overlay

     E) Theme toggle (light/dark)
        - Add a toggle button that swaps a data-theme attr on <html>
        - Define :root[data-theme="dark"] overrides in CSS
     ========================================================================= */

});