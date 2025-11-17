// ===== CONSTANTS & CONFIGURATION =====
const CONFIG =
{
    SCROLL_THRESHOLD: 300,
    ANIMATION_THRESHOLD: 0.1,
    SCROLL_OFFSET: 80,
    THEME_STORAGE_KEY: 'theme',
    ANIMATION_DURATION: 300,
    INTERSECTION_OPTIONS:
    {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
};

// ===== DOM ELEMENTS =====
const elements =
{
    html: document.documentElement,
    themeToggle: document.getElementById('theme-toggle'),
    mobileMenuButton: document.getElementById('mobile-menu-button'),
    mobileMenu: document.getElementById('mobile-menu'),
    backToTopButton: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form')
};

// ===== THEME MANAGEMENT =====
class ThemeManager
{
    constructor()
    {
        this.init();
        this.bindEvents();
    }

    init()
    {
        const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);

        if (savedTheme === 'light')
        {
            elements.html.classList.remove('dark');
        } else
        {
            // Default to dark mode if no preference is saved or if preference is dark
            elements.html.classList.add('dark');
        }
    }

    toggle()
    {
        elements.html.classList.toggle('dark');
        const isDark = elements.html.classList.contains('dark');
        localStorage.setItem(CONFIG.THEME_STORAGE_KEY, isDark ? 'dark' : 'light');

        // Add animation to theme toggle
        this.animateToggle();
    }

    animateToggle()
    {
        if (elements.themeToggle)
        {
            elements.themeToggle.style.transform = 'rotate(180deg) scale(1.2)';
            setTimeout(() =>
            {
                elements.themeToggle.style.transform = 'rotate(0deg) scale(1)';
            }, 300);
        }
    }

    bindEvents()
    {
        if (elements.themeToggle)
        {
            elements.themeToggle.addEventListener('click', () => this.toggle());
        }
    }
}

// ===== MOBILE MENU MANAGEMENT =====
class MobileMenuManager
{
    constructor()
    {
        this.bindEvents();
    }

    toggle()
    {
        const isHidden = elements.mobileMenu.classList.contains('hidden');
        elements.mobileMenu.classList.toggle('hidden');

        // Add slide animation
        if (!isHidden)
        {
            this.animateMenuClose();
        } else
        {
            this.animateMenuOpen();
        }

        // Update ARIA attributes
        if (elements.mobileMenuButton)
        {
            elements.mobileMenuButton.setAttribute('aria-expanded', !isHidden);
        }
    }

    animateMenuOpen()
    {
        const menuItems = elements.mobileMenu.querySelectorAll('a');
        menuItems.forEach((item, index) =>
        {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';

            setTimeout(() =>
            {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    animateMenuClose()
    {
        const menuItems = elements.mobileMenu.querySelectorAll('a');
        menuItems.forEach((item, index) =>
        {
            setTimeout(() =>
            {
                item.style.transition = 'all 0.2s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
            }, index * 50);
        });
    }

    close()
    {
        elements.mobileMenu.classList.add('hidden');
        this.animateMenuClose();
    }

    bindEvents()
    {
        if (elements.mobileMenuButton)
        {
            elements.mobileMenuButton.addEventListener('click', () => this.toggle());
        }

        // Close mobile menu when clicking on navigation links
        document.querySelectorAll('#mobile-menu a').forEach(link =>
        {
            link.addEventListener('click', () => this.close());
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroller
{
    constructor()
    {
        this.bindEvents();
    }

    scrollToTarget(e)
    {
        e.preventDefault();

        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement)
        {
            const offsetTop = targetElement.offsetTop - CONFIG.SCROLL_OFFSET;

            // Add scroll animation
            this.animateScroll(offsetTop);
        }
    }

    animateScroll(targetPosition)
    {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) =>
        {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    bindEvents()
    {
        document.querySelectorAll('a[href^="#"]').forEach(anchor =>
        {
            anchor.addEventListener('click', (e) => this.scrollToTarget(e));
        });
    }
}

// ===== BACK TO TOP FUNCTIONALITY =====
class BackToTopManager
{
    constructor()
    {
        this.bindEvents();
    }

    handleScroll()
    {
        const isVisible = window.pageYOffset > CONFIG.SCROLL_THRESHOLD;

        if (isVisible)
        {
            this.showButton();
        } else
        {
            this.hideButton();
        }
    }

    showButton()
    {
        elements.backToTopButton.classList.remove('opacity-0', 'invisible');
        elements.backToTopButton.classList.add('opacity-100', 'visible');

        // Add bounce animation
        elements.backToTopButton.style.animation = 'bounceIn 0.6s ease-out';
    }

    hideButton()
    {
        elements.backToTopButton.classList.remove('opacity-100', 'visible');
        elements.backToTopButton.classList.add('opacity-0', 'invisible');
    }

    scrollToTop()
    {
        this.animateScrollToTop();
    }

    animateScrollToTop()
    {
        const startPosition = window.pageYOffset;
        const duration = 800;
        let start = null;

        const animation = (currentTime) =>
        {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutCubic(timeElapsed, startPosition, -startPosition, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    bindEvents()
    {
        window.addEventListener('scroll', () => this.handleScroll());
        if (elements.backToTopButton)
        {
            elements.backToTopButton.addEventListener('click', () => this.scrollToTop());
        }
    }
}

// ===== CONTACT FORM HANDLING =====
class ContactFormManager
{
    constructor()
    {
        this.bindEvents();
    }

    async handleSubmit(e)
    {
        e.preventDefault();

        try
        {
            // Get form values
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Validate form data
            if (!this.validateForm(data))
            {
                return;
            }

            // Show loading state
            this.showLoadingState(e.target);

            // Simulate API call
            await this.simulateApiCall();

            this.showSuccessMessage();
            e.target.reset();

        } catch (error)
        {
            console.error('Form submission error:', error);
            this.showErrorMessage();
        } finally
        {
            this.hideLoadingState(e.target);
        }
    }

    showLoadingState(form)
    {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton)
        {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    }

    hideLoadingState(form)
    {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton)
        {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    }

    async simulateApiCall()
    {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    validateForm(data)
    {
        const { name, email, subject, message } = data;

        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim())
        {
            this.showNotification('Please fill in all fields.', 'error');
            return false;
        }

        if (!this.isValidEmail(email))
        {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email)
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccessMessage()
    {
        this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    }

    showErrorMessage()
    {
        this.showNotification('An error occurred. Please try again later.', 'error');
    }

    showNotification(message, type = 'info')
    {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;

        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        notification.className += ` ${bgColor} text-white`;

        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() =>
        {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() =>
        {
            notification.classList.add('translate-x-full');
            setTimeout(() =>
            {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    bindEvents()
    {
        if (elements.contactForm)
        {
            elements.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimationManager
{
    constructor()
    {
        this.init();
    }

    init()
    {
        const observer = new IntersectionObserver((entries) =>
        {
            entries.forEach(entry =>
            {
                if (entry.isIntersecting)
                {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, CONFIG.INTERSECTION_OPTIONS);

        // Observe all elements with animation classes
        this.observeElements(observer);
    }

    observeElements(observer)
    {
        const selectors = [
            '.skill-card',
            '.project-card',
            '.certificate-card',
            '.timeline-item',
            '.animate-on-scroll'
        ];

        selectors.forEach(selector =>
        {
            document.querySelectorAll(selector).forEach(element =>
            {
                observer.observe(element);
            });
        });
    }

    animateElement(element)
    {
        // Add staggered animations for cards
        if (element.classList.contains('skill-card') ||
            element.classList.contains('project-card') ||
            element.classList.contains('certificate-card'))
        {

            const index = Array.from(element.parentNode.children).indexOf(element);
            const delay = index * 100;

            setTimeout(() =>
            {
                element.style.animation = 'fadeInUpSimple 0.8s ease-out forwards';
                element.style.opacity = '1';
                // Remove transform to prevent interference with button clicks
                element.style.transform = '';
            }, delay);
        } else
        {
            element.classList.add('animate-fade-in');
        }
    }
}

// ===== PARALLAX EFFECTS =====
class ParallaxManager
{
    constructor()
    {
        this.bindEvents();
    }

    handleScroll()
    {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element =>
        {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    bindEvents()
    {
        window.addEventListener('scroll', () => this.handleScroll());
    }
}

// ===== ERROR HANDLING =====
class ErrorHandler
{
    static handleError(error, context = '')
    {
        console.error(`Error in ${context}:`, error);

        // In production, you might want to send errors to a logging service
        if (process.env.NODE_ENV === 'production')
        {
            // Send to error tracking service
        }
    }

    static setupGlobalErrorHandling()
    {
        window.addEventListener('error', (e) =>
        {
            this.handleError(e.error, 'Global Error');
        });

        window.addEventListener('unhandledrejection', (e) =>
        {
            this.handleError(e.reason, 'Unhandled Promise Rejection');
        });
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer
{
    static debounce(func, wait)
    {
        let timeout;
        return function executedFunction(...args)
        {
            const later = () =>
            {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit)
    {
        let inThrottle;
        return function()
        {
            const args = arguments;
            const context = this;
            if (!inThrottle)
            {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== INITIALIZATION =====
class PortfolioApp
{
    constructor()
    {
        this.init();
    }

    init()
    {
        try
        {
            // Initialize all managers
            this.themeManager = new ThemeManager();
            this.mobileMenuManager = new MobileMenuManager();
            this.smoothScroller = new SmoothScroller();
            this.backToTopManager = new BackToTopManager();
            this.contactFormManager = new ContactFormManager();
            this.scrollAnimationManager = new ScrollAnimationManager();
            this.parallaxManager = new ParallaxManager();
            this.projectsCarouselManager = new ProjectsCarouselManager();
            this.certificatesCarouselManager = new CertificatesCarouselManager();
            this.socialLinksManager = new SocialLinksManager();
            this.customCursorManager = new CustomCursorManager();
            this.tiltEffectManager = new TiltEffectManager();
            this.particlesManager = new ParticlesManager();

            // Setup error handling
            ErrorHandler.setupGlobalErrorHandling();

            // Performance optimization for scroll events
            const optimizedScrollHandler = PerformanceOptimizer.throttle(
                () => this.backToTopManager.handleScroll(),
                16 // ~60fps
            );

            window.addEventListener('scroll', optimizedScrollHandler);

            // Add page load animations
            this.addPageLoadAnimations();

        } catch (error)
        {
            ErrorHandler.handleError(error, 'PortfolioApp Initialization');
        }
    }

    addPageLoadAnimations()
    {
        // Animate hero section elements
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelectorAll('.hero-section .flex a');
        const heroSocialLinks = document.querySelectorAll('.hero-section .social-icon');

        if (heroTitle)
        {
            heroTitle.style.animation = 'fadeInScale 1.2s ease-out';
        }

        if (heroSubtitle)
        {
            heroSubtitle.style.animation = 'slideInUp 1s ease-out 0.3s both';
        }

        heroButtons.forEach((button, index) =>
        {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';

            setTimeout(() =>
            {
                button.style.transition = 'all 0.6s ease';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 800 + (index * 200));
        });

        // Animate social links with same timing as contact section
        heroSocialLinks.forEach((link, index) =>
        {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';

            setTimeout(() =>
            {
                link.style.transition = 'all 0.6s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 1200 + (index * 150)); // Appear after buttons
        });
    }
}

// ===== TILT EFFECT MANAGEMENT =====
class TiltEffectManager
{
    constructor()
    {
        this.observer = null;
        this.init();
    }

    init()
    {
        // Only apply tilt effect on desktop devices
        if (window.matchMedia("(hover: hover)").matches)
        {
            this.applyTiltEffect();
            this.setupMutationObserver();
        }
    }

    // Function to apply tilt effect to elements
    applyTiltEffect()
    {
        // Select all project cards
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card =>
        {
            // Remove existing event listeners to prevent duplicates
            card.removeEventListener('mousemove', this.handleTilt);
            card.removeEventListener('mouseleave', this.resetTilt);

            // Add event listeners for mouse movement
            card.addEventListener('mousemove', this.handleTilt.bind(this));
            card.addEventListener('mouseleave', this.resetTilt.bind(this));
        });
    }

    // Handle the tilt effect based on mouse position
    handleTilt(e)
    {
        const card = e.currentTarget;
        const cardRect = card.getBoundingClientRect();

        // Calculate mouse position relative to the card
        const mouseX = e.clientX - cardRect.left;
        const mouseY = e.clientY - cardRect.top;

        // Calculate the percentage position
        const percentX = mouseX / cardRect.width;
        const percentY = mouseY / cardRect.height;

        // Calculate the tilt angle (max 15 degrees)
        const tiltX = (percentY - 0.5) * 15;
        const tiltY = (0.5 - percentX) * 15;

        // Apply the transform
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;

        // Add a subtle shadow effect
        const shadowX = (percentX - 0.5) * 20;
        const shadowY = (percentY - 0.5) * 20;
        const isDarkMode = document.documentElement.classList.contains('dark');
        const shadowColor = isDarkMode ? 'var(--tilt-shadow-dark)' : 'var(--tilt-shadow-light)';
        card.style.boxShadow = `${shadowX}px ${shadowY}px 20px ${shadowColor}`;

        // Add a subtle highlight effect
        const glareX = percentX * 100;
        const glareY = percentY * 100;
        const glareColor = isDarkMode ? 'var(--tilt-glare-dark)' : 'var(--tilt-glare-light)';
        card.style.background = `linear-gradient(${glareX}deg, ${glareColor} 0%, rgba(255, 255, 255, 0) 80%),
                                var(--glass-bg)`;
    }

    // Reset the card to its original state
    resetTilt(e)
    {
        const card = e.currentTarget;
        const isDarkMode = document.documentElement.classList.contains('dark');

        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.boxShadow = isDarkMode ? 'var(--shadow-md)' : 'var(--shadow-md)';
        card.style.background = '';
    }

    // Setup mutation observer for dynamic content
    setupMutationObserver()
    {
        this.observer = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                if (mutation.addedNodes.length)
                {
                    // Check if any of the added nodes are project cards
                    mutation.addedNodes.forEach(node =>
                    {
                        if (node.nodeType === Node.ELEMENT_NODE)
                        {
                            if (node.classList && node.classList.contains('project-card'))
                            {
                                this.addTiltToCard(node);
                            }

                            // Check for project cards within the added node
                            const projectCards = node.querySelectorAll && node.querySelectorAll('.project-card');
                            if (projectCards)
                            {
                                projectCards.forEach(card => this.addTiltToCard(card));
                            }
                        }
                    });
                }
            });
        });

        // Observe changes to the project sections
        const projectSections = document.querySelectorAll('#projects, .projects-section');
        projectSections.forEach(section =>
        {
            this.observer.observe(section, { childList: true, subtree: true });
        });
    }

    // Add tilt effect to a single card
    addTiltToCard(card)
    {
        if (card && card.classList.contains('project-card'))
        {
            card.removeEventListener('mousemove', this.handleTilt);
            card.removeEventListener('mouseleave', this.resetTilt);

            card.addEventListener('mousemove', this.handleTilt.bind(this));
            card.addEventListener('mouseleave', this.resetTilt.bind(this));
        }
    }

    // Method to manually add tilt effect to new elements
    addTiltToElements(selector)
    {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element =>
        {
            if (element.classList.contains('project-card'))
            {
                this.addTiltToCard(element);
            }
        });
    }

    // Cleanup method
    destroy()
    {
        if (this.observer)
        {
            this.observer.disconnect();
        }

        // Remove all event listeners
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card =>
        {
            card.removeEventListener('mousemove', this.handleTilt);
            card.removeEventListener('mouseleave', this.resetTilt);
        });
    }
}

// ===== PARTICLES BACKGROUND MANAGEMENT =====
class ParticlesManager
{
    constructor()
    {
        this.particlesConfig = null;
        this.isInitialized = false;
        this.init();
    }

    init()
    {
        // Wait for particles.js to load
        if (typeof particlesJS !== 'undefined')
        {
            this.initializeParticles();
        } else
        {
            // Retry if particles.js hasn't loaded yet
            setTimeout(() => this.init(), 100);
        }
    }

    initializeParticles()
    {
        if (this.isInitialized) return;

        this.particlesConfig = {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#0dcaf0"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#0dcaf0",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        };

        // Initialize particles
        particlesJS('particles-js', this.particlesConfig);
        this.isInitialized = true;

        // Set initial colors based on current theme
        this.updateParticleColors();

        // Bind theme change events
        this.bindThemeEvents();
    }

    updateParticleColors()
    {
        if (!this.isInitialized || !window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS)
        {
            return;
        }

        const isDarkMode = document.documentElement.classList.contains('dark');
        const particleColor = isDarkMode ? '#0dcaf0' : '#3b95f6';
        const lineColor = isDarkMode ? '#0dcaf0' : '#3b95f6';

        // Update particle colors
        window.pJSDom[0].pJS.particles.color.value = particleColor;
        window.pJSDom[0].pJS.particles.line_linked.color = lineColor;

        // Refresh particles
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }

    bindThemeEvents()
    {
        // Listen for theme changes
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle)
        {
            themeToggle.addEventListener('click', () =>
            {
                // Wait a bit for the theme to change before updating particles
                setTimeout(() => this.updateParticleColors(), 100);
            });
        }

        // Also listen for manual theme changes
        const observer = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class')
                {
                    setTimeout(() => this.updateParticleColors(), 100);
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
    }

    // Method to update particle configuration
    updateConfig(newConfig)
    {
        if (!this.isInitialized) return;

        this.particlesConfig = { ...this.particlesConfig, ...newConfig };

        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS)
        {
            // Update the configuration
            Object.assign(window.pJSDom[0].pJS, this.particlesConfig);
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    // Method to destroy particles
    destroy()
    {
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS)
        {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
        }
        this.isInitialized = false;
    }
}

// ===== START APPLICATION =====
document.addEventListener('DOMContentLoaded', () =>
{
    new PortfolioApp();
});

// ===== PROJECTS CAROUSEL MANAGEMENT =====
class ProjectsCarouselManager
{
    constructor()
    {
        this.currentIndex = 0;
        this.totalProjects = 4;
        this.track = document.getElementById('projects-track');
        this.prevButton = document.getElementById('prev-project');
        this.nextButton = document.getElementById('next-project');
        this.indicators = document.querySelectorAll('.project-indicator');

        if (this.track && this.prevButton && this.nextButton)
        {
            this.init();
        }
    }

    init()
    {
        this.bindEvents();
        this.updateCarousel();
        this.startAutoSlide();
    }

    bindEvents()
    {
        this.prevButton.addEventListener('click', () => this.previousProject());
        this.nextButton.addEventListener('click', () => this.nextProject());

        // Indicator clicks
        this.indicators.forEach((indicator, index) =>
        {
            indicator.addEventListener('click', () => this.goToProject(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) =>
        {
            if (document.querySelector('#projects').getBoundingClientRect().top < window.innerHeight)
            {
                if (e.key === 'ArrowLeft')
                {
                    this.previousProject();
                } else if (e.key === 'ArrowRight')
                {
                    this.nextProject();
                }
            }
        });

        // Touch/swipe support
        this.addTouchSupport();

        // Pause auto-slide on hover
        const projectsSection = document.getElementById('projects');
        if (projectsSection)
        {
            projectsSection.addEventListener('mouseenter', () => this.pauseAutoSlide());
            projectsSection.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }

    addTouchSupport()
    {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) =>
        {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoSlide();
        });

        this.track.addEventListener('touchmove', (e) =>
        {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () =>
        {
            if (!isDragging) return;
            isDragging = false;

            const deltaX = startX - currentX;
            const threshold = 50;

            if (deltaX > threshold)
            {
                this.nextProject();
            } else if (deltaX < -threshold)
            {
                this.previousProject();
            }

            this.startAutoSlide();
        });
    }

    nextProject()
    {
        this.currentIndex = (this.currentIndex + 1) % this.totalProjects;
        this.updateCarousel();
        this.addSlideAnimation('next');
    }

    previousProject()
    {
        this.currentIndex = (this.currentIndex - 1 + this.totalProjects) % this.totalProjects;
        this.updateCarousel();
        this.addSlideAnimation('prev');
    }

    goToProject(index)
    {
        if (index !== this.currentIndex)
        {
            this.currentIndex = index;
            this.updateCarousel();
            this.addSlideAnimation();
        }
    }

    updateCarousel()
    {
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        this.indicators.forEach((indicator, index) =>
        {
            if (index === this.currentIndex)
            {
                indicator.classList.remove('bg-gray-300', 'dark:bg-gray-600');
                indicator.classList.add('bg-primary');
            } else
            {
                indicator.classList.remove('bg-primary');
                indicator.classList.add('bg-gray-300', 'dark:bg-gray-600');
            }
        });

        // Update button states
        this.updateButtonStates();
    }

    updateButtonStates()
    {
        // For infinite loop, we don't need to disable buttons
        // But we can add visual feedback
        this.prevButton.style.opacity = '1';
        this.nextButton.style.opacity = '1';
    }

    addSlideAnimation(direction = '')
    {
        // Add bounce effect to buttons
        if (direction === 'next')
        {
            this.nextButton.style.transform = 'translateX(4px) translateY(-50%) scale(0.95)';
            setTimeout(() =>
            {
                this.nextButton.style.transform = 'translateX(4px) translateY(-50%) scale(1)';
            }, 150);
        } else if (direction === 'prev')
        {
            this.prevButton.style.transform = 'translateX(-4px) translateY(-50%) scale(0.95)';
            setTimeout(() =>
            {
                this.prevButton.style.transform = 'translateX(-4px) translateY(-50%) scale(1)';
            }, 150);
        }

        // Add slide animation to current project card
        const currentCard = this.track.children[this.currentIndex];
        if (currentCard)
        {
            currentCard.style.animation = 'slideInProject 0.6s ease-out';
            setTimeout(() =>
            {
                currentCard.style.animation = '';
            }, 600);
        }
    }

    startAutoSlide()
    {
        this.pauseAutoSlide(); // Clear any existing interval
        this.autoSlideInterval = setInterval(() =>
        {
            this.nextProject();
        }, 5000); // Change slide every 5 seconds
    }

    pauseAutoSlide()
    {
        if (this.autoSlideInterval)
        {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    // Public method to add new projects dynamically
    addProject(projectData)
    {
        // This method can be used to add new projects to the carousel
        // Implementation would depend on the specific requirements
        console.log('Adding new project:', projectData);
        // Update totalProjects and regenerate carousel if needed
    }
}

// ===== CERTIFICATES CAROUSEL MANAGEMENT =====
class CertificatesCarouselManager
{
    constructor()
    {
        this.currentIndex = 0;
        this.totalCertificates = 5;
        this.track = document.getElementById('certificates-track');
        this.prevButton = document.getElementById('prev-certificate');
        this.nextButton = document.getElementById('next-certificate');
        this.indicators = document.querySelectorAll('.certificate-indicator');

        if (this.track && this.prevButton && this.nextButton)
        {
            this.init();
        }
    }

    init()
    {
        this.bindEvents();
        this.updateCarousel();
        this.startAutoSlide();
    }

    bindEvents()
    {
        this.prevButton.addEventListener('click', () => this.previousCertificate());
        this.nextButton.addEventListener('click', () => this.nextCertificate());

        // Indicator clicks
        this.indicators.forEach((indicator, index) =>
        {
            indicator.addEventListener('click', () => this.goToCertificate(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) =>
        {
            if (document.querySelector('#certificates').getBoundingClientRect().top < window.innerHeight)
            {
                if (e.key === 'ArrowLeft')
                {
                    this.previousCertificate();
                } else if (e.key === 'ArrowRight')
                {
                    this.nextCertificate();
                }
            }
        });

        // Touch/swipe support
        this.addTouchSupport();

        // Pause auto-slide on hover
        const certificatesSection = document.getElementById('certificates');
        if (certificatesSection)
        {
            certificatesSection.addEventListener('mouseenter', () => this.pauseAutoSlide());
            certificatesSection.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }

    addTouchSupport()
    {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) =>
        {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoSlide();
        });

        this.track.addEventListener('touchmove', (e) =>
        {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () =>
        {
            if (!isDragging) return;
            isDragging = false;

            const deltaX = startX - currentX;
            const threshold = 50;

            if (deltaX > threshold)
            {
                this.nextCertificate();
            } else if (deltaX < -threshold)
            {
                this.previousCertificate();
            }

            this.startAutoSlide();
        });
    }

    nextCertificate()
    {
        this.currentIndex = (this.currentIndex + 1) % this.totalCertificates;
        this.updateCarousel();
        this.addSlideAnimation('next');
    }

    previousCertificate()
    {
        this.currentIndex = (this.currentIndex - 1 + this.totalCertificates) % this.totalCertificates;
        this.updateCarousel();
        this.addSlideAnimation('prev');
    }

    goToCertificate(index)
    {
        if (index !== this.currentIndex)
        {
            this.currentIndex = index;
            this.updateCarousel();
            this.addSlideAnimation();
        }
    }

    updateCarousel()
    {
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        this.indicators.forEach((indicator, index) =>
        {
            if (index === this.currentIndex)
            {
                indicator.classList.remove('bg-gray-300', 'dark:bg-gray-600');
                indicator.classList.add('bg-primary');
            } else
            {
                indicator.classList.remove('bg-primary');
                indicator.classList.add('bg-gray-300', 'dark:bg-gray-600');
            }
        });

        // Update button states
        this.updateButtonStates();
    }

    updateButtonStates()
    {
        // For infinite loop, we don't need to disable buttons
        // But we can add visual feedback
        this.prevButton.style.opacity = '1';
        this.nextButton.style.opacity = '1';
    }

    addSlideAnimation(direction = '')
    {
        // Add bounce effect to buttons
        if (direction === 'next')
        {
            this.nextButton.style.transform = 'translateX(4px) translateY(-50%) scale(0.95)';
            setTimeout(() =>
            {
                this.nextButton.style.transform = 'translateX(4px) translateY(-50%) scale(1)';
            }, 150);
        } else if (direction === 'prev')
        {
            this.prevButton.style.transform = 'translateX(-4px) translateY(-50%) scale(0.95)';
            setTimeout(() =>
            {
                this.prevButton.style.transform = 'translateX(-4px) translateY(-50%) scale(1)';
            }, 150);
        }

        // Add slide animation to current certificate card
        const currentCard = this.track.children[this.currentIndex];
        if (currentCard)
        {
            currentCard.style.animation = 'slideInProject 0.6s ease-out';
            setTimeout(() =>
            {
                currentCard.style.animation = '';
            }, 600);
        }
    }

    startAutoSlide()
    {
        this.pauseAutoSlide(); // Clear any existing interval
        this.autoSlideInterval = setInterval(() =>
        {
            this.nextCertificate();
        }, 6000); // Change slide every 6 seconds (slightly longer than projects)
    }

    pauseAutoSlide()
    {
        if (this.autoSlideInterval)
        {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    // Public method to add new certificates dynamically
    addCertificate(certificateData)
    {
        // This method can be used to add new certificates to the carousel
        // Implementation would depend on the specific requirements
        console.log('Adding new certificate:', certificateData);
        // Update totalCertificates and regenerate carousel if needed
    }
}

// ===== SOCIAL LINKS MANAGEMENT =====
class SocialLinksManager
{
    constructor()
    {
        this.init();
    }

    init()
    {
        this.setupHomeSocialLinks();
        this.setupContactSocialLinks();
    }

    setupHomeSocialLinks()
    {
        const homeSocialLinks = document.querySelectorAll('.hero-section .social-icon');

        homeSocialLinks.forEach(link =>
        {
            // Ensure home social links behave exactly like contact section
            this.addSocialLinkEvents(link);
        });
    }

    setupContactSocialLinks()
    {
        const contactSocialLinks = document.querySelectorAll('.contact-section .social-icon');

        contactSocialLinks.forEach(link =>
        {
            this.addSocialLinkEvents(link);
        });
    }

    addSocialLinkEvents(link)
    {
        // Add consistent hover behavior
        link.addEventListener('mouseenter', () =>
        {
            link.style.transform = 'translateY(-5px) scale(1.1)';
        });

        link.addEventListener('mouseleave', () =>
        {
            link.style.transform = 'translateY(0) scale(1)';
        });

        // Add click feedback
        link.addEventListener('mousedown', () =>
        {
            link.style.transform = 'translateY(-3px) scale(0.95)';
        });

        link.addEventListener('mouseup', () =>
        {
            link.style.transform = 'translateY(-5px) scale(1.1)';
        });

        // Add focus handling for accessibility
        link.addEventListener('focus', () =>
        {
            link.style.outline = '2px solid var(--primary-color)';
            link.style.outlineOffset = '2px';
        });

        link.addEventListener('blur', () =>
        {
            link.style.outline = 'none';
        });
    }
}

// ===== CUSTOM CURSOR MANAGEMENT =====
class CustomCursorManager
{
    constructor()
    {
        this.cursorDot = null;
        this.cursorDotOutline = null;
        this.cursorVisible = true;
        this.cursorEnlarged = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.outlineX = 0;
        this.outlineY = 0;
        this.dotSmoothing = 0.2;
        this.outlineSmoothing = 0.1;
        this.animationId = null;

        this.init();
    }

    init()
    {
        // Check if device supports hover (desktop only)
        if (window.matchMedia("(hover: hover)").matches)
        {
            this.createCursorElements();
            this.bindEvents();
            this.startAnimation();
        }
    }

    createCursorElements()
    {
        // Add fallback class for browsers that don't support :has()
        document.body.classList.add('custom-cursor-active');

        // Create cursor dot
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        document.body.appendChild(this.cursorDot);

        // Create cursor outline
        this.cursorDotOutline = document.createElement('div');
        this.cursorDotOutline.className = 'cursor-dot-outline';
        document.body.appendChild(this.cursorDotOutline);

        // Set initial opacity after a short delay for smooth appearance
        setTimeout(() =>
        {
            this.cursorDot.style.opacity = '1';
            this.cursorDotOutline.style.opacity = '1';
        }, 500);
    }

    bindEvents()
    {
        // Track mouse position
        document.addEventListener('mousemove', (e) =>
        {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Show cursor
            if (!this.cursorVisible)
            {
                this.cursorDot.style.opacity = '1';
                this.cursorDotOutline.style.opacity = '1';
                this.cursorVisible = true;
            }
        });

        // Hide cursor when mouse leaves window
        document.addEventListener('mouseout', () =>
        {
            this.cursorDot.style.opacity = '0';
            this.cursorDotOutline.style.opacity = '0';
            this.cursorVisible = false;
        });

        // Click effect
        document.addEventListener('mousedown', () =>
        {
            document.body.classList.add('cursor-click');
        });

        document.addEventListener('mouseup', () =>
        {
            document.body.classList.remove('cursor-click');
        });

        // Hover effect for interactive elements
        this.setupInteractiveElements();
    }

    setupInteractiveElements()
    {
        const interactiveElements = document.querySelectorAll(
            'a, button, .btn, input, textarea, .project-card, .social-link, .nav-links li, .carousel-control, .carousel-nav-button, .project-indicator, .certificate-indicator, .social-icon, .skill-card, .certificate-card, .timeline-item, .back-to-top'
        );

        interactiveElements.forEach(el =>
        {
            el.addEventListener('mouseover', () =>
            {
                document.body.classList.add('cursor-hover');
                this.cursorEnlarged = true;
            });

            el.addEventListener('mouseout', () =>
            {
                document.body.classList.remove('cursor-hover');
                this.cursorEnlarged = false;
            });
        });
    }

    startAnimation()
    {
        const animateCursor = () =>
        {
            // Calculate smooth movement for dot
            this.dotX += (this.mouseX - this.dotX) * this.dotSmoothing;
            this.dotY += (this.mouseY - this.dotY) * this.dotSmoothing;

            // Calculate smooth movement for outline
            this.outlineX += (this.mouseX - this.outlineX) * this.outlineSmoothing;
            this.outlineY += (this.mouseY - this.outlineY) * this.outlineSmoothing;

            // Apply positions
            this.cursorDot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
            this.cursorDotOutline.style.transform = `translate(${this.outlineX}px, ${this.outlineY}px)`;

            // Continue animation
            this.animationId = requestAnimationFrame(animateCursor);
        };

        // Start animation
        animateCursor();
    }

    // Method to add new interactive elements dynamically
    addInteractiveElement(element)
    {
        element.addEventListener('mouseover', () =>
        {
            document.body.classList.add('cursor-hover');
            this.cursorEnlarged = true;
        });

        element.addEventListener('mouseout', () =>
        {
            document.body.classList.remove('cursor-hover');
            this.cursorEnlarged = false;
        });
    }

    // Cleanup method
    destroy()
    {
        if (this.animationId)
        {
            cancelAnimationFrame(this.animationId);
        }

        // Remove fallback class
        document.body.classList.remove('custom-cursor-active');

        if (this.cursorDot)
        {
            this.cursorDot.remove();
        }

        if (this.cursorDotOutline)
        {
            this.cursorDotOutline.remove();
        }
    }
}
