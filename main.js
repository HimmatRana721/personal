document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initial setups
    initCustomCursor();
    initMobileMenu();
    initProjectFilters();
    initFormInteractions();
    initDynamicCardInteractions();
    initPageTransitions();

    // Run preloader timeline
    runPreloader();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

/* ==========================================================================
   CUSTOM CURSOR & MAGNETIC EFFECT
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (!cursor || !follower) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Follower smooth tracking using GSAP ticker
    gsap.to({}, {
        duration: 0.016,
        repeat: -1,
        onRepeat: () => {
            posX += (mouseX - posX) * 0.15;
            posY += (mouseY - posY) * 0.15;

            gsap.set(follower, {
                css: {
                    left: posX,
                    top: posY
                }
            });

            gsap.set(cursor, {
                css: {
                    left: mouseX,
                    top: mouseY
                }
            });
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Hover states for links and buttons
    const hoverables = document.querySelectorAll('a, button, .magnetic, .project-card, .life-card, #menu-toggle');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            follower.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            follower.classList.remove('hovered');
            // Reset magnetic transform
            if (el.classList.contains('magnetic')) {
                gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
            }
        });

        // Magnetic pull effect
        if (el.classList.contains('magnetic')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move element slightly towards cursor
                gsap.to(el, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }
    });

    // Hide custom cursor when mouse leaves document window
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
        follower.style.display = 'none';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
        follower.style.display = 'block';
    });
}

/* ==========================================================================
   MOBILE MENU OVERLAY
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            // Animate mobile links staggered
            gsap.fromTo(mobileLinks, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
            );
        }
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

/* ==========================================================================
   PRELOADER & HERO ENTER TIME
   ========================================================================== */
function runPreloader() {
    const tl = gsap.timeline({
        onComplete: () => {
            // Destroy preloader element once animation completes
            document.querySelector('.preloader').style.display = 'none';
            // Trigger header scrolling background
            initHeaderScroll();
            // Start scroll animations
            initScrollAnimations();
            // Refresh scroll trigger to ensure correct scroll points after layout settles
            ScrollTrigger.refresh();
        }
    });

    // Animate letters sliding up
    tl.to('.preloader-text .word', {
        y: '0%',
        duration: 0.6,
        ease: 'power4.out',
        delay: 0.1
    })
    // Animate loader bar
    .to('.preloader-line', {
        width: '100%',
        duration: 0.8,
        ease: 'power2.inOut'
    }, '-=0.4')
    // Slide preloader up out of screen
    .to('.preloader', {
        y: '-100%',
        duration: 0.6,
        ease: 'power4.inOut'
    })
    // Entrance animations for Hero components
    .from('.social-sidebar', {
        x: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.4')
    .from('#hero-himmat-img', {
        scale: 1.1,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.4')
    .from('#hero-title-text', {
        y: '100%',
        duration: 0.7,
        ease: 'power4.out'
    }, '-=0.6')
    .to('#hero-line-sep', {
        width: '100%',
        duration: 0.5,
        ease: 'power2.inOut'
    }, '-=0.4')
    .from('#hero-subtitle-text', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3')
    .from('#scroll-btn', {
        y: -15,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
    }, '-=0.2');
}

/* ==========================================================================
   HEADER SCROLLING LOGIC
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Animate grid cards sorting
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    // Show matching cards
                    gsap.set(card, { display: 'flex' });
                    gsap.fromTo(card,
                        { scale: 0.85, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'transform' }
                    );
                } else {
                    // Hide non-matching cards
                    gsap.to(card, {
                        scale: 0.85,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            gsap.set(card, { display: 'none' });
                        }
                    });
                }
            });
        });
    });
}

/* ==========================================================================
   CONTACT FORM FLOATING LABEL AND SUBMIT ANIMATIONS
   ========================================================================== */
function initFormInteractions() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const captchaQuestionEl = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('form-captcha');
    let num1 = 0, num2 = 0, correctAnswer = 0;

    function generateCaptcha() {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        correctAnswer = num1 + num2;
        if (captchaQuestionEl) {
            captchaQuestionEl.textContent = `${num1} + ${num2} = ?`;
        }
        if (captchaInput) {
            captchaInput.value = '';
        }
    }

    // Generate initial captcha question on page load
    generateCaptcha();

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-message-btn');
        const submitSpan = submitBtn ? submitBtn.querySelector('span') : null;
        const originalText = 'Send Message';

        // Check CAPTCHA answer
        const userCaptchaAnswer = parseInt(captchaInput?.value || '', 10);
        if (isNaN(userCaptchaAnswer) || userCaptchaAnswer !== correctAnswer) {
            if (submitSpan) submitSpan.textContent = 'Wrong Security Answer!';
            if (submitBtn) gsap.to(submitBtn, { backgroundColor: '#ef4444', duration: 0.3 });
            if (captchaInput) {
                captchaInput.style.borderColor = '#ef4444';
                captchaInput.focus();
            }
            setTimeout(() => {
                if (submitSpan) submitSpan.textContent = originalText;
                if (submitBtn) gsap.to(submitBtn, { backgroundColor: '', duration: 0.3 });
                if (captchaInput) captchaInput.style.borderColor = '';
                generateCaptcha();
            }, 2000);
            return;
        }

        const nameVal = document.getElementById('form-name')?.value || '';
        const emailVal = document.getElementById('form-email')?.value || '';
        const messageVal = document.getElementById('form-message')?.value || '';

        if (submitSpan) submitSpan.textContent = 'Sending...';
        if (submitBtn) submitBtn.style.pointerEvents = 'none';

        fetch('https://formsubmit.co/ajax/himmatrana49@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: nameVal,
                email: emailVal,
                message: messageVal,
                _subject: `New Portfolio Message from ${nameVal}`
            })
        })
        .then(response => response.json())
        .then(data => {
            // Success state animation
            gsap.to(submitBtn, {
                backgroundColor: '#10b981', // Emerald green success color
                duration: 0.3,
                onComplete: () => {
                    if (submitSpan) submitSpan.textContent = 'Message Sent!';
                    contactForm.reset();
                    generateCaptcha();
                    
                    setTimeout(() => {
                        gsap.to(submitBtn, {
                            backgroundColor: '',
                            duration: 0.3,
                            onComplete: () => {
                                if (submitSpan) submitSpan.textContent = originalText;
                                if (submitBtn) submitBtn.style.pointerEvents = 'all';
                            }
                        });
                    }, 3500);
                }
            });
        })
        .catch(error => {
            console.error('Error sending message:', error);
            if (submitSpan) submitSpan.textContent = 'Error! Try Again';
            if (submitBtn) submitBtn.style.pointerEvents = 'all';
            setTimeout(() => {
                if (submitSpan) submitSpan.textContent = originalText;
                generateCaptcha();
            }, 3000);
        });
    });
}

/* ==========================================================================
   SCROLL TRIGGERED REVEALS (GSAP)
   ========================================================================== */
function initScrollAnimations() {
    // 1. Navigation Active Link Sync
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        ScrollTrigger.create({
            trigger: sec,
            start: 'top 30%',
            end: 'bottom 30%',
            onEnter: () => updateActiveNavLink(sec.id),
            onEnterBack: () => updateActiveNavLink(sec.id)
        });
    });

    function updateActiveNavLink(id) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // 2. Section Title Reveals (Reusable)
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
        const tag = header.querySelector('.section-tag');
        const title = header.querySelector('.section-title');
        const desc = header.querySelector('.section-desc');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        if (tag) tl.from(tag, { x: -20, opacity: 0, duration: 0.6, ease: 'power2.out' });
        if (title) tl.from(title, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');
        if (desc) tl.from(desc, { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');
    });

    // 3. Project Cards grid entrance
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 75%'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform'
    });

    // 4. Story Timeline Animation
    // Scroll progress line filling
    gsap.to('.timeline-progress-bar', {
        scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        },
        height: '100%',
        ease: 'none'
    });

    // Stagger timeline nodes sliding in
    const nodes = document.querySelectorAll('.timeline-node');
    nodes.forEach(node => {
        const content = node.querySelector('.timeline-node-content');
        
        ScrollTrigger.create({
            trigger: node,
            start: 'top 80%',
            onEnter: () => {
                node.classList.add('active');
                gsap.fromTo(content,
                    { x: 40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                );
            },
            once: true
        });
    });

    // 5. Life Masonry Cards Entrance
    const lifeCards = document.querySelectorAll('.life-card');
    lifeCards.forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'transform'
        });
    });

    // 6. Contact Section Staggered Entrance
    const contactTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%'
        }
    });

    contactTL.from('.contact-info', {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.contact-form-container', {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8');
}

/* ==========================================================================
   DYNAMIC CARD INTERACTION (PROJECTS & ARTICLES DYNAMIC SWITCHING)
   ========================================================================== */
function initDynamicCardInteractions() {
    function bindCardSwitching(sectionSelector, cardSelector) {
        const sections = document.querySelectorAll(sectionSelector);
        sections.forEach(section => {
            const cards = section.querySelectorAll(cardSelector);
            if (!cards || cards.length === 0) return;

            cards.forEach(card => {
                // Dynamically update hover state
                card.addEventListener('mouseenter', () => {
                    cards.forEach(c => c.classList.remove('is-hovered'));
                    card.classList.add('is-hovered');
                });

                card.addEventListener('mouseleave', () => {
                    card.classList.remove('is-hovered');
                });

                // Dynamically activate clicked card and deactivate all others in the section
                card.addEventListener('click', (e) => {
                    // Remove active and hover states from all sibling cards in section
                    cards.forEach(c => {
                        c.classList.remove('is-active');
                        c.classList.remove('is-hovered');
                    });

                    // Set clicked card to active
                    card.classList.add('is-active');

                    // Handle card surface click transition
                    const clickedLink = e.target.closest('a');
                    if (!clickedLink) {
                        const cardLink = card.querySelector('a[href]');
                        if (cardLink) {
                            const href = cardLink.getAttribute('href');
                            const target = cardLink.getAttribute('target');
                            if (href && !href.startsWith('#') && target !== '_blank' && !href.startsWith('http://') && !href.startsWith('https://')) {
                                if (window.smoothNavigate) {
                                    window.smoothNavigate(href, card);
                                } else {
                                    window.location.href = href;
                                }
                            } else if (href && target === '_blank') {
                                window.open(href, '_blank');
                            }
                        }
                    }
                });
            });
        });
    }

    // Bind dynamic hover/click switching for Projects section and Articles section
    bindCardSwitching('.projects-section', '.project-card');
    bindCardSwitching('.life-section', '.life-card');
    bindCardSwitching('#words', '.project-card');
}

/* ==========================================================================
   PAGE TRANSITION SYSTEM (SMOOTH ROUTER STYLE ANIMATIONS)
   ========================================================================== */
function initPageTransitions() {
    // 1. Ensure overlay element exists
    let overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-brand">HIMMAT<span>.</span></div>
            <div class="transition-bar"></div>
        `;
        document.body.appendChild(overlay);
    }

    // 2. Entrance Animation on Page Load
    gsap.set(overlay, { display: 'flex', scaleY: 1, transformOrigin: 'top center' });
    gsap.to(overlay, {
        scaleY: 0,
        duration: 0.55,
        ease: 'power4.inOut',
        delay: 0.05,
        onComplete: () => {
            gsap.set(overlay, { display: 'none' });
        }
    });

    // Handle back button / bfcache restore
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            gsap.set(overlay, { scaleY: 0, display: 'none' });
        }
    });

    // 3. Staggered Entrance Animation for Article Body (on article pages)
    const articleSection = document.querySelector('.article-section');
    if (articleSection) {
        const backBtn = articleSection.querySelector('.article-back-btn');
        const tag = articleSection.querySelector('.article-tag');
        const title = articleSection.querySelector('.article-main-title');
        const meta = articleSection.querySelector('.article-meta-info');
        const contentElems = articleSection.querySelectorAll('.article-body > p, .article-body > h2, .article-body > div, .article-body > hr');

        const articleTL = gsap.timeline({ delay: 0.2 });

        if (backBtn) articleTL.from(backBtn, { x: -30, opacity: 0, duration: 0.5, ease: 'power2.out' });
        if (tag) articleTL.from(tag, { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3');
        if (title) articleTL.from(title, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');
        if (meta) articleTL.from(meta, { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.4');
        if (contentElems.length > 0) {
            articleTL.from(contentElems, {
                y: 25,
                opacity: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power2.out'
            }, '-=0.3');
        }
    }

    // 4. Smooth Router Navigation Helper
    function smoothNavigate(href, cardElement = null) {
        if (!href || href === '#' || href.startsWith('javascript:')) return;

        // External links don't trigger full curtain
        if (href.startsWith('http://') || href.startsWith('https://')) {
            return;
        }

        if (cardElement) {
            cardElement.classList.add('page-exit-anim');
        }

        gsap.set(overlay, { display: 'flex', scaleY: 0, transformOrigin: 'bottom center' });
        gsap.to(overlay, {
            scaleY: 1,
            duration: 0.42,
            ease: 'power4.inOut',
            onComplete: () => {
                window.location.href = href;
            }
        });
    }

    // Intercept internal link clicks for curtain transition
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        if (!href || href.startsWith('#') || target === '_blank' || href.startsWith('http://') || href.startsWith('https://')) {
            return;
        }

        e.preventDefault();
        const parentCard = link.closest('.project-card, .life-card');
        smoothNavigate(href, parentCard);
    });

    window.smoothNavigate = smoothNavigate;
}
