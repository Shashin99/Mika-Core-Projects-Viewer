/* ============================================================
   Main JS — Upwork Portfolio
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Navbar ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ── Hamburger Menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  // ── Active Nav Link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll Animations ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  document.querySelectorAll('.stagger-item').forEach((el, i) => {
    el.dataset.delay = i * 80;
    observer.observe(el);
  });

  // ── Animated Stat Counters ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ── Project Filter ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = show ? 'block' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          }
        }, 200);
      });
    });
  });
  // set transitions on project cards
  projectCards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (lightbox && lightboxImg && src) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Video Modal ──
  const videoModal = document.getElementById('videoModal');
  const videoClose = document.getElementById('videoClose');
  const videoFrame = document.getElementById('videoFrame');

  document.querySelectorAll('[data-video]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.video;
      if (videoModal && videoFrame) {
        videoFrame.src = src;
        videoModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  videoClose?.addEventListener('click', closeVideo);
  videoModal?.addEventListener('click', (e) => { if (e.target === videoModal) closeVideo(); });
  function closeVideo() {
    videoModal?.classList.remove('open');
    if (videoFrame) videoFrame.src = '';
    document.body.style.overflow = '';
  }

  // ── Contact Form ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const successMsg = document.getElementById('formSuccess');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e55353';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;
      // Simulate send
      contactForm.style.opacity = '0.5';
      contactForm.style.pointerEvents = 'none';
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.opacity = '1';
        contactForm.style.pointerEvents = '';
        if (successMsg) successMsg.style.display = 'flex';
        setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; }, 4000);
      }, 1200);
    });
  }

  // ── Fallback: ensure elements are visible after 1.5s (safety net) ──
  setTimeout(() => {
    document.querySelectorAll('.fade-up:not(.visible), .stagger-item:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 1500);

  // Also trigger visible for all elements in viewport immediately on load
  setTimeout(() => {
    document.querySelectorAll('.fade-up, .stagger-item').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('visible');
      }
    });
  }, 100);

  // ── Keyboard ESC closes modals ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeLightbox(); closeVideo(); }
  });

  // ── Tooltip for tech badges ──
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.setAttribute('title', el.dataset.tooltip);
  });

});
