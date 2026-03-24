/* ============================================================
   page-effects.js — Scroll Progress + Back to Top + Page Transitions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Inject global UI elements ──
  const progressBar = document.createElement('div');
  progressBar.id = 'scrollProgress';
  document.body.prepend(progressBar);

  const backToTop = document.createElement('button');
  backToTop.id = 'backToTop';
  backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.title = 'Back to top';
  document.body.appendChild(backToTop);

  const pageTransition = document.createElement('div');
  pageTransition.className = 'page-transition';
  document.body.appendChild(pageTransition);

  // ── Scroll progress bar ──
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    backToTop.classList.toggle('visible', scrollTop > 400);
  }, { passive: true });

  // ── Back to top ──
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Page transition on internal links ──
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.href;
    if (!href || href.startsWith('#') || href.includes('upwork.com')) return;
    if (!href.endsWith('.html') && !href.match(/localhost:\d+\/?$/)) return;
    // same origin only
    if (new URL(href, location.href).origin !== location.origin) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      pageTransition.classList.remove('exit');
      void pageTransition.offsetWidth; // reflow
      pageTransition.classList.add('enter');
      setTimeout(() => {
        window.location.href = href;
      }, 320);
    });
  });

  // Page exit (arriving on new page)
  setTimeout(() => {
    pageTransition.classList.remove('enter');
    pageTransition.classList.add('exit');
    setTimeout(() => pageTransition.classList.remove('exit'), 400);
  }, 50);

  // ── Typewriter effect for hero title ──
  const typeEl = document.querySelector('.hero__title');
  if (typeEl) {
    const spans = typeEl.querySelectorAll('.accent');
    if (spans.length > 0) {
      const target = spans[0];
      const original = target.textContent;
      target.textContent = '';
      target.classList.add('typewriter');
      let i = 0;
      const interval = setInterval(() => {
        target.textContent += original[i];
        i++;
        if (i >= original.length) {
          clearInterval(interval);
          target.classList.remove('typewriter');
        }
      }, 60);
    }
  }

  // ── Counter bounce animation hook ──
  document.querySelectorAll('[data-target]').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('counting');
          setTimeout(() => el.classList.remove('counting'), 600);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    observer.observe(el);
  });

  // ── Parallax-lite: hero content on scroll ──
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');
  if (hero && heroContent) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroContent.style.transform = `translateY(${y * 0.18}px)`;
      heroContent.style.opacity = Math.max(0, 1 - y / (hero.offsetHeight * 0.7));
    }, { passive: true });
  }

});
