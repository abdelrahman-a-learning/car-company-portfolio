document.addEventListener("DOMContentLoaded", () => {
  console.log("AutoDrive website loaded");

  // ===== MOBILE MENU =====
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    // Improve mobile UX by collapsing the menu after link selection.
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header')) {
        nav.classList.remove('active');
      }
    });
  }

  // ===== PROMO CODE COPY =====
  const promoCopyBtn = document.querySelector('.promo-copy-btn');

  if (promoCopyBtn) {
    const defaultText = promoCopyBtn.textContent;
    const promoCode = promoCopyBtn.dataset.promoCode;

    promoCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(promoCode);
        promoCopyBtn.textContent = 'Copied!';
      } catch (error) {
        promoCopyBtn.textContent = 'Copy failed';
      }

      setTimeout(() => {
        promoCopyBtn.textContent = defaultText;
      }, 2000);
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== ANIMATED COUNTERS =====
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString() + (target >= 1000 ? '+' : '');
      }
    };

    updateCounter();
  };

  const observeCounters = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(counter => {
    observeCounters.observe(counter);
  });

  // ===== TESTIMONIALS SLIDER =====
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentIndex = 0;
  let autoSlideInterval;

  function createDots() {
    if (dotsContainer && testimonials.length > 0) {
      testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = index;
          showTestimonial(currentIndex);
          resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
      });
    }
  }

  function updateDots() {
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
  }

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });
    updateDots();
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextTestimonial, 5000);
  }

  if (testimonials.length > 0) {
    createDots();
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetAutoSlide();
      });
    }

    // Auto-slide
    autoSlideInterval = setInterval(nextTestimonial, 5000);

    // Pause on hover
    const sliderContainer = document.querySelector('.testimonial-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });
      
      sliderContainer.addEventListener('mouseleave', () => {
        resetAutoSlide();
      });
    }
  }

  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    function validatePhone(phone) {
      if (!phone) return true;
      const re = /^[\d\s\-\+\(\)]+$/;
      return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    function showError(input, message) {
      const formGroup = input.parentElement;
      const errorElement = formGroup.querySelector('.error-message');
      errorElement.textContent = message;
      input.classList.add('invalid');
    }
    
    function clearError(input) {
      const formGroup = input.parentElement;
      const errorElement = formGroup.querySelector('.error-message');
      errorElement.textContent = '';
      input.classList.remove('invalid');
    }
    
    function validateField(input) {
      clearError(input);
      
      if (input.hasAttribute('required') && !input.value.trim()) {
        showError(input, 'This field is required');
        return false;
      }
      
      if (input.type === 'email' && input.value && !validateEmail(input.value)) {
        showError(input, 'Please enter a valid email address');
        return false;
      }
      
      if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
        showError(input, 'Please enter a valid phone number (at least 10 digits)');
        return false;
      }
      
      if (input.name === 'name' && input.value.length < 2) {
        showError(input, 'Name must be at least 2 characters');
        return false;
      }
      
      if (input.name === 'message' && input.value.length < 10) {
        showError(input, 'Message must be at least 10 characters');
        return false;
      }
      
      return true;
    }
    
    // Real-time validation
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('invalid')) {
            validateField(input);
          }
        });
      }
    });

    if (subjectInput) {
      subjectInput.addEventListener('change', () => validateField(subjectInput));
    }
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isPhoneValid = phoneInput ? validateField(phoneInput) : true;
      const isSubjectValid = subjectInput ? validateField(subjectInput) : true;
      const isMessageValid = validateField(messageInput);
      
      if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        if (btnText && btnLoader) {
          btnText.style.display = 'none';
          btnLoader.style.display = 'inline';
          submitBtn.disabled = true;
        }
        
        // Simulate form submission
        setTimeout(() => {
          // Show success message
          const successMsg = contactForm.querySelector('.success-message');
          successMsg.style.display = 'block';
          
          // Reset form
          contactForm.reset();
          
          // Reset button state
          if (btnText && btnLoader) {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
          }
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 5000);

          // Scroll to success message
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
      } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }

  // ===== BACK TO TOP BUTTON =====
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  const observeElements = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all cards and sections
  document.querySelectorAll('.card, .vehicle-card, .info-card').forEach(el => {
    observeElements.observe(el);
  });

  console.log("All interactive features initialized ✓");
});
