/**
 * Main Application Script for Personal Brand Website
 * Features: Mobile menu, Navbar scroll, Swiper init, AOS init, GSAP UI animations, 
 * Project filtering, Modals, and Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }

  // 2. Initialize Swiper for Testimonials
  if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-slider')) {
    new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }

  // 3. Navbar Scroll Effect & Mobile Menu
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
      }
    });
  });

  // 4. GSAP Hero Animations (if present)
  if (typeof gsap !== 'undefined' && document.querySelector('.hero-content')) {
    gsap.from('.hero-content h1', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
    gsap.from('.hero-content p', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
    gsap.from('.hero-btns', { opacity: 0, scale: 0.9, duration: 1, delay: 0.6 });
    
    // Animate background shapes
    gsap.to('.shape-1', {
      x: 100, y: 50, rotation: 10,
      duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
    gsap.to('.shape-2', {
      x: -100, y: -50, rotation: -10,
      duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }

  // 5. Project Filtering (Projects Page)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            // Slight animation for filtered items
            if(typeof gsap !== 'undefined') {
              gsap.fromTo(card, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.4});
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Modal Popup System
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modals = document.querySelectorAll('.modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => modal.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });

  // 7. Form Validation (Contact Page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-control[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          // Simple email validation
          if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
            isValid = false;
            input.style.borderColor = 'red';
          } else {
            input.style.borderColor = 'var(--surface-border)';
          }
        }
      });

      if (isValid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          btn.classList.add('btn-success');
          contactForm.reset();
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
          }, 3000);
        }, 1500);
      }
    });
  }

  // 8. Blog Search functionality (Blog Page)
  const searchInput = document.getElementById('blogSearch');
  const blogCards = document.querySelectorAll('.blog-card');
  
  if (searchInput && blogCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      blogCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const excerpt = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 9. About Page Skills Animation via Intersection Observer
  const skillBars = document.querySelectorAll('.skill-progress');
  if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.getAttribute('data-width');
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // 10. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // 11. Installer Showcase Logic
  const winToggleBtns = document.querySelectorAll('.os-toggle-btn');
  const demoVideo = document.getElementById('demoVideo');
  const dynamicWindow = document.getElementById('dynamicWindow');
  const installerWindowTitle = document.getElementById('installerWindowTitle');

  if (winToggleBtns.length > 0 && demoVideo && dynamicWindow) {
    const videoSources = {
      macos: 'https://www.youtube-nocookie.com/embed/VDIFSdeenUQ?autoplay=1&mute=1&loop=1&playlist=VDIFSdeenUQ&modestbranding=1&rel=0&controls=0',
      windows: 'https://www.youtube-nocookie.com/embed/BRsHCMurhmc?autoplay=1&mute=1&loop=1&playlist=BRsHCMurhmc&modestbranding=1&rel=0&controls=0'
    };

    winToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const os = btn.getAttribute('data-os');

        // Toggle Active Tab
        winToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle Window Style
        if (os === 'macos') {
          dynamicWindow.classList.remove('is-windows');
          dynamicWindow.classList.add('is-macos');
          installerWindowTitle.textContent = 'DevFlow — macOS Installation';
        } else {
          dynamicWindow.classList.remove('is-macos');
          dynamicWindow.classList.add('is-windows');
          installerWindowTitle.textContent = 'DevFlow — Windows Installation';
        }

        // Change Video with Fade
        demoVideo.style.opacity = '0';
        demoVideo.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
          demoVideo.src = videoSources[os];
          demoVideo.style.opacity = '1';
        }, 300);
      });
    });
  }

  // 12. Feature Showcase Logic
  const featureNavBtns = document.querySelectorAll('.feature-nav-btn');
  const featureSlider = document.getElementById('featureSlider');
  const featureWindowTitle = document.getElementById('featureWindowTitle');
  const rightWindowTitle = document.getElementById('rightWindowTitle');
  const featureWindow = document.getElementById('featureWindow');
  const detailsTitle = document.getElementById('detailsTitle');
  const detailsText = document.getElementById('detailsText');

  const featureInfoData = [
    {
      title: "GitHub Management",
      text: "Experience intelligent GitHub repository management through a powerful unified dashboard built for modern developers. DevFlow AI seamlessly integrates with your GitHub account to provide real-time repository synchronization, advanced project insights, commit tracking, and smart workflow automation — all without leaving the platform. Instantly monitor repository activity, visualize commit history, manage uploads, track deployments, and receive live GitHub notifications from one centralized workspace. With deep GitHub API integration, developers can securely manage repositories, automate deployments, detect project issues, and maintain complete visibility over their development ecosystem with speed, clarity, and efficiency."
    },
    {
      title: "AI Assistant",
      text: "Harness the intelligence of DevFlow AI Assistant to supercharge your GitHub workflow and project management experience. The integrated AI continuously analyzes repositories, commit activity, project structure, deployment logs, and security patterns in real-time to identify issues before they become problems. From detecting exposed secrets and risky files during uploads to providing smart repository insights, deployment recommendations, and codebase intelligence, the assistant helps developers work faster and more securely. It doesn’t just automate tasks — it delivers actionable suggestions, explains optimization opportunities, improves project organization, and streamlines deployments, turning complex development workflows into a seamless AI-powered experience."
    },
    {
      title: "Deployment Control",
      text: "Streamline your deployment workflow with DevFlow AI’s integrated deployment management system. Connect platforms like Vercel and Netlify to deploy repositories directly from your dashboard with real-time build tracking and intelligent environment management. Monitor deployment status, view live build logs, inject encrypted environment variables from the Secret Vault, and instantly redeploy projects with a single click. Whether you are shipping a personal project, SaaS platform, or large-scale application, DevFlow AI provides the visibility, automation, and control needed to deploy faster, manage infrastructure efficiently, and maintain a reliable production pipeline."
    }
  ];

  function typeWriter(element, text) {
    element.textContent = '';
    let i = 0;
    
    // Clear any existing intervals
    if (element.typeInterval) clearInterval(element.typeInterval);
    
    element.typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(element.typeInterval);
      }
    }, 20); // Faster typing for longer text
  }

  if (featureNavBtns.length > 0 && featureSlider) {
    // Initialize first slide text
    setTimeout(() => {
      if (detailsText) typeWriter(detailsText, featureInfoData[0].text);
    }, 1000);

    // Handle Feature Tabs (Sliding)
    featureNavBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        
        const data = featureInfoData[index];

        // Update Active Tab
        featureNavBtns.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        // Slide the track
        const slideAmount = -(index * 100) / 3;
        featureSlider.style.transform = `translateX(${slideAmount}%)`;
        
        // Update titles
        if (featureWindowTitle) featureWindowTitle.textContent = `DevFlow — ${data.title}`;
        
        // Update Side Panel
        if (detailsTitle) detailsTitle.textContent = data.title;
        if (detailsText) typeWriter(detailsText, data.text);
      });
    });
  }

  // 13. Download Dropdowns Logic
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');

  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = trigger.nextElementSibling;
      
      // Close other menus
      dropdownMenus.forEach(m => {
        if (m !== menu) m.classList.remove('active');
      });

      menu.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.download-dropdown')) {
      dropdownMenus.forEach(menu => menu.classList.remove('active'));
    }
  });

  // 14. Download Counter Logic
  const countNumber = document.getElementById('countNumber');
  const downloadLinks = document.querySelectorAll('.btn-download-now');
  const mainDownloadBtns = document.querySelectorAll('.dropdown-trigger');
  
  if (countNumber) {
    // Initialize count from localStorage or start from 20
    let currentCount = parseInt(localStorage.getItem('devflow_downloads')) || 20;
    countNumber.textContent = currentCount.toLocaleString();

    const incrementCounter = () => {
      currentCount++;
      localStorage.setItem('devflow_downloads', currentCount);
      
      // Update UI with pulse animation
      countNumber.textContent = currentCount.toLocaleString();
      countNumber.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      countNumber.style.transform = 'scale(1.3)';
      countNumber.style.display = 'inline-block';
      
      setTimeout(() => {
        countNumber.style.transform = 'scale(1)';
      }, 200);
    };

    // Increment on clicking main buttons
    mainDownloadBtns.forEach(btn => btn.addEventListener('click', incrementCounter));
    
    // Increment on clicking actual download links
    downloadLinks.forEach(btn => btn.addEventListener('click', incrementCounter));
  }
});
