document.addEventListener("DOMContentLoaded", () => {
  console.log("AutoDrive website loaded");

  // Smooth Scroll for Navigation Links
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

  // Testimonials Slider
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let currentIndex = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }, 5000);
  }

  // Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    function validatePhone(phone) {
      if (!phone) return true; // Optional field
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
        showError(input, 'Please enter a valid phone number');
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
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isPhoneValid = validateField(phoneInput);
      const isMessageValid = validateField(messageInput);
      
      if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
        // Show success message
        const successMsg = contactForm.querySelector('.success-message');
        successMsg.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    });
  }
});

