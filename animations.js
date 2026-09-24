/**
 * Endurava Animations Utility
 * Handles scroll-based reveal animations, micro-interactions, and scroll tracking
 */

// Configuration
const ANIMATION_CONFIG = {
  revealDuration: 600,
  revealDelay: 50,
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // spring-like easing
};

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

/**
 * Initialize scroll reveal animations
 * Applies animations to elements with [data-reveal] attribute
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if (!revealElements.length) return;

  const revealElement = (el, index) => {
    const animationType = el.dataset.reveal || 'fade-up';
    const delay = el.dataset.revealDelay 
      ? parseInt(el.dataset.revealDelay) 
      : index * ANIMATION_CONFIG.revealDelay;

    // Apply animation with delay
    setTimeout(() => {
      el.classList.add(`reveal-${animationType}`);
      el.classList.add('revealed');
    }, delay);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        revealElement(entry.target, index);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Start observing all elements and check if they're already in viewport
  revealElements.forEach((el, index) => {
    observer.observe(el);
    
    // Immediately trigger animation if element is already in viewport
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInViewport) {
      setTimeout(() => {
        revealElement(el, index);
        observer.unobserve(el);
      }, 50); // Small delay to ensure paint happens
    }
  });
}

/**
 * Animated counter for statistics
 * Counts from 0 to target number when element enters viewport
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  if (!counters.length) return;

  const animateCounter = (el) => {
    if (el.classList.contains('counted')) return;
    
    const target = parseInt(el.dataset.count);
    const duration = parseInt(el.dataset.countDuration) || 2000;
    const startTime = performance.now();

    const counter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(counter);
      } else {
        el.textContent = target.toLocaleString();
        el.classList.add('counted');
      }
    };

    requestAnimationFrame(counter);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((el) => {
    observer.observe(el);
    
    // Check if counter is already in viewport
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInViewport) {
      setTimeout(() => {
        animateCounter(el);
        observer.unobserve(el);
      }, 50);
    }
  });
}

/**
 * Initialize scroll progress indicator
 * Shows scroll position as vertical bar on desktop
 */
function initScrollProgress() {
  const progressBar = document.querySelector('[data-scroll-progress]');
  
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * Animated marquee - infinite horizontal scroll
 * Apply to container with .marquee class and child items with .marquee-item
 */
function initMarquee() {
  const marquees = document.querySelectorAll('[data-marquee]');
  
  if (!marquees.length) return;

  marquees.forEach((marquee) => {
    const items = marquee.querySelectorAll('.marquee-item');
    
    if (items.length === 0) return;

    // Pause animation on hover
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });

    // Duplicate items for seamless loop
    const clone = marquee.cloneNode(true);
    clone.querySelectorAll('.marquee-item').forEach((item) => {
      marquee.appendChild(item.cloneNode(true));
    });
  });
}

/**
 * Staggered reveal for card grids
 * Applies sequential animations to child elements
 */
function initStaggeredReveal() {
  const grids = document.querySelectorAll('[data-stagger]');
  
  if (!grids.length) return;

  const animateItems = (container) => {
    const items = container.querySelectorAll('[data-stagger-item]');
    const staggerDelay = parseInt(container.dataset.stagger) || 80;

    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('reveal-fade-up');
        item.classList.add('revealed');
      }, index * staggerDelay);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateItems(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  grids.forEach((grid) => {
    observer.observe(grid);
    
    // Check if grid is already in viewport
    const rect = grid.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInViewport) {
      setTimeout(() => {
        animateItems(grid);
        observer.unobserve(grid);
      }, 50);
    }
  });
}

/**
 * Smooth scroll to element
 * Used for anchor links and CTAs
 */
function smoothScrollTo(target) {
  if (typeof target === 'string') {
    target = document.querySelector(target);
  }
  
  if (!target) return;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

/**
 * Add parallax effect to elements
 * Use data-parallax="speed" where speed is 0-1
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (!parallaxElements.length) return;

  const updateParallax = () => {
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const rect = el.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementOffset = rect.top + scrolled;
      const yPos = (scrolled - elementOffset) * speed;

      el.style.transform = `translateY(${yPos}px)`;
    });
  };

  window.addEventListener('scroll', updateParallax, { passive: true });
}

/**
 * Detect and respect prefers-reduced-motion
 * Disables animations for users who prefer reduced motion
 */
function respectReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }
}

/**
 * Initialize all animations
 * Call once on page load
 */
function initAllAnimations() {
  respectReducedMotion();
  initScrollReveal();
  initAnimatedCounters();
  initScrollProgress();
  initMarquee();
  initStaggeredReveal();
  initParallax();
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
  initAllAnimations();
}

// Re-init on dynamic content
window.addEventListener('load', () => {
  setTimeout(initAllAnimations, 100);
});

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initScrollReveal,
    initAnimatedCounters,
    initScrollProgress,
    initMarquee,
    initStaggeredReveal,
    smoothScrollTo,
    initParallax,
    initAllAnimations,
  };
}
