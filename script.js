document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu (full-screen overlay) ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function closeMenu() {
    mobileMenu.hidden = true;
    if (mobileMenuOverlay) mobileMenuOverlay.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }
  function openMenu() {
    mobileMenu.hidden = false;
    if (mobileMenuOverlay) mobileMenuOverlay.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && !mobileMenu.hidden) closeMenu();
    });
  }

  /* ---------- Smooth scroll w/ header offset ---------- */
  const header = document.querySelector('.site-header');
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 80) + 24;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll-spy active nav link ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  const mobileNavLinks = document.querySelectorAll('[data-nav-mobile]');
  const sections = document.querySelectorAll('main section[id]');

  function setActive(id) {
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    mobileNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  }

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s));
  }

  /* ---------- "Ver más proyectos" ---------- */
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const extraProjects = document.querySelectorAll('.project-card.is-extra');

  if (viewMoreBtn && extraProjects.length) {
    viewMoreBtn.addEventListener('click', () => {
      const expanded = viewMoreBtn.getAttribute('aria-expanded') === 'true';

      extraProjects.forEach(card => { card.hidden = expanded; });
      viewMoreBtn.setAttribute('aria-expanded', String(!expanded));
      viewMoreBtn.textContent = expanded ? 'Ver todos los proyectos' : 'Ver menos proyectos';

      if (!expanded) {
        extraProjects[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ---------- Contact form (mailto, no backend available) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const DEST_EMAIL = 'josemontenegroqc@gmail.com';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim() || `Contacto desde el portafolio — ${name}`;
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = 'Por favor completa nombre, email y mensaje.';
        return;
      }

      const body = `${message}\n\n—\n${name}\n${email}`;
      const mailto = `mailto:${DEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      note.textContent = 'Abriendo tu cliente de correo…';
    });
  }

  console.log('Portafolio cargado correctamente ✅');
});