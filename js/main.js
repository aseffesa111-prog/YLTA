/* ========================================
   YLTA — Main JavaScript v2.0
   Enhanced with stagger, scroll progress,
   back-to-top, IO-based counters
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Inject UI Elements ---------- */
  // Scroll progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  // Back to top button
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Retour en haut');
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Navbar
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll progress
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    // Back to top visibility
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // appel initial

  /* ---------- Hamburger Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('mobileOverlay');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Fermer le menu quand on clique sur l'overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }

  /* ---------- Stagger Reveal: Auto-assign stagger classes ---------- */
  const grids = document.querySelectorAll(
    '.activities-grid, .team-grid, .news-grid, .mission-grid, .join-steps'
  );

  grids.forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.classList.add('stagger-' + Math.min(i + 1, 7));
    });
  });

  /* ---------- Scroll Reveal Animations ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Active nav link highlight ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.navbar-links a:not(.btn-nav)');

  navLinksAll.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Counter Animation (IO-based) ---------- */
  const counters = document.querySelectorAll('.hero-stat h3');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const text = counter.textContent.trim();
      // Match numbers with optional prefix (+) and suffix
      const match = text.match(/^(\+?)(\d+)(.*)$/);
      if (match) {
        const prefix = match[1];
        const target = parseInt(match[2]);
        const suffix = match[3];
        let current = 0;
        const duration = 1800;
        const startTime = performance.now();

        const easeOutQuad = t => t * (2 - t);

        const step = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutQuad(progress);
          current = Math.floor(easedProgress * target);
          counter.textContent = prefix + current + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = prefix + target + suffix;
          }
        };

        requestAnimationFrame(step);
      }
    });
  };

  // Use IntersectionObserver to trigger counters only when visible
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ---------- Parallax-like subtle effect on hero shapes ---------- */
  const heroShapes = document.querySelectorAll('.hero-shape');
  if (heroShapes.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      heroShapes.forEach((shape, i) => {
        const speed = (i + 1) * 8;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    }, { passive: true });
  }

});
