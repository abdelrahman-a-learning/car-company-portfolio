document.addEventListener("DOMContentLoaded", () => {
  console.log("AutoDrive website loaded");

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
});

