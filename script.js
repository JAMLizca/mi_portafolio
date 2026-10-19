document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu (diálogo a pantalla completa) ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const DESKTOP_MQ = window.matchMedia('(min-width: 901px)');

  const isMenuOpen = () => !mobileMenu.hidden;

  function focusables() {
    return mobileMenu.querySelectorAll('a[href], button:not([disabled])');
  }

  function openMenu() {
    mobileMenu.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    focusables()[0]?.focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!isMenuOpen()) return;
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuToggle.focus();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', openMenu);
    mobileMenuClose?.addEventListener('click', () => closeMenu());

    // Al navegar no devolvemos el foco al botón: el navegador lo lleva al ancla
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
    });

    document.addEventListener('keydown', (e) => {
      if (!isMenuOpen()) return;

      if (e.key === 'Escape') {
        closeMenu();
        return;
      }

      // Mantener el foco dentro del menú
      if (e.key === 'Tab') {
        const items = focusables();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    DESKTOP_MQ.addEventListener('change', (e) => {
      if (e.matches) closeMenu({ restoreFocus: false });
    });
  }

  /* ---------- Scroll-spy: enlace activo del menú ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id]');

  function setActive(id) {
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Carrusel de habilidades (scroll infinito) ---------- */
  const carousel = document.getElementById('skillsCarousel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (carousel && !reduceMotion) {
    // Se duplica la lista completa para que translateX(-50%) cierre el bucle sin saltos.
    // Las copias son decorativas: se ocultan a lectores de pantalla.
    Array.from(carousel.children).forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      carousel.appendChild(clone);
    });
    carousel.classList.add('is-animated');
  }

  /* ---------- Formulario de contacto (mailto, sitio estático sin backend) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form && note) {
    const destEmail = form.dataset.email;
    const field = (name) => form.elements.namedItem(name);

    function showNote(text, isError = false) {
      note.textContent = text;
      note.classList.toggle('is-error', isError);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const required = ['name', 'email', 'message'].map(field);
      let firstInvalid = null;

      required.forEach(input => {
        const valid = input.checkValidity() && input.value.trim() !== '';
        input.setAttribute('aria-invalid', String(!valid));
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        showNote('Revisa los campos: nombre, un email válido y mensaje son obligatorios.', true);
        firstInvalid.focus();
        return;
      }

      const name = field('name').value.trim();
      const email = field('email').value.trim();
      const message = field('message').value.trim();
      const subject = field('subject').value.trim() || `Contacto desde el portafolio — ${name}`;

      const body = `${message}\n\n—\n${name}\n${email}`;
      window.location.href =
        `mailto:${destEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      showNote(`Abriendo tu cliente de correo… Si no se abre, escríbeme a ${destEmail}.`);
    });

    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) {
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }
});
