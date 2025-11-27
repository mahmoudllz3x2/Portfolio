document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const fadeElements = document.querySelectorAll('.fade-in');
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveNavLink();
    });

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        const hamburger = navToggle.querySelector('.hamburger');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navMenu.classList.remove('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function isInViewport(element, threshold = 0.2) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * (1 - threshold);
    }

    function handleFadeIn() {
        fadeElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    function animateSkillBars() {
        skillProgressBars.forEach(bar => {
            if (isInViewport(bar.parentElement)) {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            }
        });
    }

    window.addEventListener('scroll', function() {
        handleFadeIn();
        animateSkillBars();
    });

    handleFadeIn();
    animateSkillBars();

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        if (!phone) return true;
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        input.classList.add('error');
        errorElement.textContent = message;
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        input.classList.remove('error');
        errorElement.textContent = '';
    }

    function validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;

        clearError(input);

        switch(fieldName) {
            case 'name':
                if (!value) {
                    showError(input, 'Please enter your name');
                    return false;
                }
                if (value.length < 2) {
                    showError(input, 'Name must be at least 2 characters');
                    return false;
                }
                break;

            case 'email':
                if (!value) {
                    showError(input, 'Please enter your email');
                    return false;
                }
                if (!validateEmail(value)) {
                    showError(input, 'Please enter a valid email address');
                    return false;
                }
                break;

            case 'phone':
                if (value && !validatePhone(value)) {
                    showError(input, 'Please enter a valid phone number');
                    return false;
                }
                break;

            case 'subject':
                if (!value) {
                    showError(input, 'Please enter a subject');
                    return false;
                }
                if (value.length < 3) {
                    showError(input, 'Subject must be at least 3 characters');
                    return false;
                }
                break;

            case 'message':
                if (!value) {
                    showError(input, 'Please enter your message');
                    return false;
                }
                if (value.length < 10) {
                    showError(input, 'Message must be at least 10 characters');
                    return false;
                }
                break;
        }

        return true;
    }

    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                phone: contactForm.phone.value.trim(),
                subject: contactForm.subject.value.trim(),
                message: contactForm.message.value.trim()
            };

            console.log('Form submitted:', formData);

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#10b981';
            submitBtn.disabled = true;

            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);

            showSuccessMessage();
        }
    });

    function showSuccessMessage() {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thank you for your message! I'll get back to you soon.</p>
        `;
        
        successMessage.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
            z-index: 9999;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 4000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    updateActiveNavLink();
});
