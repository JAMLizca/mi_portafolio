document.addEventListener('DOMContentLoaded', function() {
    
    //  MENÚ DE NAVEGACIÓN MÓVIL

    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && mobileMenu) {
        function openMobileMenu() {
            mobileToggle.classList.add('active');
            mobileMenu.classList.add('active');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeMobileMenu();
            });
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
                mobileMenuLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                const href = this.getAttribute('href');
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === href) {
                        navLink.classList.add('active');
                    }
                });
            });
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (!this.classList.contains('cta-button')) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    const href = this.getAttribute('href');
                    mobileMenuLinks.forEach(mobileLink => {
                        mobileLink.classList.remove('active');
                        if (mobileLink.getAttribute('href') === href) {
                            mobileLink.classList.add('active');
                        }
                    });
                }
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    //  SMOOTH SCROLL PARA ENLACES INTERNOS

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar-container')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    //  ANIMACIONES DE PROYECTOS (IntersectionObserver)
   
    const projectCards = document.querySelectorAll('.project-card');

    if (projectCards.length > 0) {
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    projectObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        projectCards.forEach(card => {
            projectObserver.observe(card);
        });

        // Efecto de seguimiento del mouse en las tarjetas
        projectCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                this.style.setProperty('--mouse-x', x + '%');
                this.style.setProperty('--mouse-y', y + '%');
            });
        });
    }

    //  BOTÓN "VER MÁS" - FUNCIONAL

    const viewMoreBtn = document.querySelector('.view-more-btn');
    const projectsGridMore = document.querySelector('.projects-grid-more');

    if (viewMoreBtn && projectsGridMore) {
        viewMoreBtn.addEventListener('click', function() {
            const isVisible = projectsGridMore.classList.contains('is-visible');
            const icon = this.querySelector('i');

            if (!isVisible) {
                // Mostrar más proyectos
                this.classList.add('is-loading');
                this.innerHTML = '<i class="fas fa-spinner"></i> Cargando...';

                // Simular carga 
                setTimeout(() => {
                    projectsGridMore.classList.add('is-visible');
                    this.classList.remove('is-loading');
                    this.innerHTML = '<i class="fas fa-chevron-up"></i> Ver menos proyectos';

                    // Animar las nuevas tarjetas
                    const newCards = projectsGridMore.querySelectorAll('.project-card');
                    newCards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(40px)';
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 150);
                    });

                    // Scroll suave hacia los nuevos proyectos
                    setTimeout(() => {
                        projectsGridMore.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }, 600);
            } else {
                // Ocultar proyectos adicionales
                projectsGridMore.classList.remove('is-visible');
                this.innerHTML = 'Ver todos los proyectos <i class="fas fa-arrow-right"></i>';

                // Scroll suave de vuelta a la sección de proyectos
                document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    
    //  EFECTO DE CONTADOR EN HOVER

    const counterItems = document.querySelectorAll('.counter-item');
    counterItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const number = this.querySelector('.number');
            if (number) number.style.transform = 'scale(1.2)';
        });
        item.addEventListener('mouseleave', function() {
            const number = this.querySelector('.number');
            if (number) number.style.transform = 'scale(1)';
        });
    });

    //  CERTIFICACIONES CON MODAL
    
    const modal = document.getElementById('certModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const modalClose = document.getElementById('modalClose');
    const certCards = document.querySelectorAll('.certification-card');

    if (modal && modalBody && modalTitle) {
        function openModal(title, content) {
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                modalBody.innerHTML = '';
            }, 400);
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        certCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const url = this.dataset.url;
                const title = this.querySelector('h3').textContent;
                const issuer = this.querySelector('.issuer').textContent;
                const date = this.querySelector('.date').textContent;

                if (!url) {
                    alert('No se pudo cargar la certificación. URL no disponible.');
                    return;
                }

                const content = `
                    <div class="cert-info">
                        <p class="issuer">${issuer}</p>
                        <p class="date">${date}</p>
                    </div>
                    <div class="iframe-container">
                        <iframe
                            src="${url}"
                            loading="lazy"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            allow="fullscreen"
                        ></iframe>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="${url}" target="_blank" class="cert-link" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i> Abrir en nueva ventana
                        </a>
                    </div>
                `;

                openModal(title, content);
            });
        });

        // Animación de entrada para certificaciones
        const certObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    certObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        certCards.forEach(card => {
            certObserver.observe(card);
        });
    }

    //  EFECTO DE APARICIÓN PARA HABILIDADES

    const skillItems = document.querySelectorAll('.skill-item-large');
    if (skillItems.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        skillItems.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.05}s`;
            skillsObserver.observe(el);
        });
    }

    //  NAVBAR SCROLL EFFECT

    const navbar = document.querySelector('.navbar-container');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                navbar.style.transform = 'translateX(-50%) scale(0.97)';
                navbar.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
            } else {
                navbar.style.transform = 'translateX(-50%) scale(1)';
                navbar.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(0, 255, 65, 0.1)';
            }

            // Ocultar/mostrar navbar al hacer scroll hacia abajo/arriba
            if (scrollTop > lastScroll && scrollTop > 300) {
                navbar.style.transform = 'translateX(-50%) translateY(-120%) scale(0.97)';
            } else {
                navbar.style.transform = scrollTop > 50
                    ? 'translateX(-50%) scale(0.97)'
                    : 'translateX(-50%) scale(1)';
            }
            lastScroll = scrollTop;
        });
    }

    //  EFECTO DE APARICIÓN EN EL HERO

    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.8s ease ${index * 0.15}s`;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300);
    });

    //  SECCIONES ACTIVAS EN EL NAVBAR AL HACER SCROLL
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                    mobileMenuLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    console.log('✅ Portafolio cargado y funcional');
});