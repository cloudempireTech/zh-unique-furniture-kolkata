/**
 * ZH UNIQUE FURNITURE — MAIN JAVASCRIPT
 * Apple-style 3D animations, typewriter headlines, stat counters,
 * interactive configurator & direct WhatsApp dispatcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close mobile drawer when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
        }
      });
    });
  }

  // 2. Video Play / Pause Control
  const video = document.querySelector('.hero-video-wrapper video');
  const videoControlBtn = document.querySelector('.video-control-btn');

  if (video && videoControlBtn) {
    videoControlBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        videoControlBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
        videoControlBtn.setAttribute('aria-label', 'Pause Hero Video');
      } else {
        video.pause();
        videoControlBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
        videoControlBtn.setAttribute('aria-label', 'Play Hero Video');
      }
    });
  }

  // 3. Dynamic Typewriter Headline
  const typewriterElem = document.querySelector('.dynamic-typewriter');
  if (typewriterElem) {
    const phrases = [
      'Bespoke Velvet Sofas',
      'Modular L-Shape Lounges',
      'Solid Teak Dining Sets',
      'Hydraulic Storage Beds',
      'Architectural Seating'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 110;

    function typeLoop() {
      const currentPhrase = phrases[phraseIdx];
      if (isDeleting) {
        typewriterElem.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 50;
      } else {
        typewriterElem.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 110;
      }

      if (!isDeleting && charIdx === currentPhrase.length) {
        typingSpeed = 2200; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
  }

  // 4. Animated Number Counters (.stat-counter)
  const statElements = document.querySelectorAll('.stat-counter');
  if (statElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || el.innerText);
          const isDecimal = el.getAttribute('data-decimal') === 'true';
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          const intervalTime = duration / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            el.innerText = `${prefix}${isDecimal ? count.toFixed(1) : Math.floor(count)}${suffix}`;
          }, intervalTime);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    statElements.forEach(el => observer.observe(el));
  }

  // 5. Portfolio Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.offering-card');

  if (filterBtns.length > 0 && portfolioCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        const filter = btn.getAttribute('data-filter');
        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Interactive Furniture Configurator / Value Estimator
  const configType = document.getElementById('cfg-type');
  const configMaterial = document.getElementById('cfg-material');
  const configDimensions = document.getElementById('cfg-dimensions');
  const specLeadTime = document.getElementById('cfg-res-lead');
  const specWood = document.getElementById('cfg-res-wood');
  const specFoam = document.getElementById('cfg-res-foam');
  const configInquireBtn = document.getElementById('cfg-inquire-btn');

  function updateConfigurator() {
    if (!configType || !configMaterial) return;
    const type = configType.value;
    const material = configMaterial.value;
    const dimensions = configDimensions ? configDimensions.value : 'Standard 8ft x 6ft';

    let leadTime = '10 - 14 Days';
    let woodGrade = 'Kiln-Dried Sal & Teak Hardwood';
    let foamGrade = '40-Density High Resilience (Orthopedic)';

    if (type.includes('Chesterfield')) {
      leadTime = '12 - 16 Days (Hand-Tufted)';
      foamGrade = '45-Density Multi-Layer Ergonomic';
    } else if (type.includes('Dining')) {
      leadTime = '14 - 18 Days (Seasoned Teak Joinery)';
      foamGrade = 'High-Density Chair Seat Foam (32D)';
    } else if (type.includes('Bed')) {
      leadTime = '10 - 12 Days (Heavy-Duty German Hydraulic)';
      woodGrade = 'Seasoned Teak & Marine Plywood';
    }

    if (specLeadTime) specLeadTime.innerText = leadTime;
    if (specWood) specWood.innerText = woodGrade;
    if (specFoam) specFoam.innerText = foamGrade;

    if (configInquireBtn) {
      const msg = `Hello ZH Unique Furniture! I am interested in customizing:
- Item: ${type}
- Upholstery / Finish: ${material}
- Approximate Dimensions: ${dimensions}
- Framework: ${woodGrade}
- Cushioning: ${foamGrade}

Could you please share design options, catalogs, and workshop visiting details?`;
      configInquireBtn.href = `https://wa.me/918240912987?text=${encodeURIComponent(msg)}`;
    }
  }

  if (configType) configType.addEventListener('change', updateConfigurator);
  if (configMaterial) configMaterial.addEventListener('change', updateConfigurator);
  if (configDimensions) configDimensions.addEventListener('input', updateConfigurator);
  updateConfigurator();

  // 7. Contact Page WhatsApp Form Handler
  const contactForm = document.getElementById('zh-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value.trim() || 'Valued Patron';
      const phone = document.getElementById('form-phone')?.value.trim() || 'Not Provided';
      const category = document.getElementById('form-category')?.value || 'Custom Sofa / Sectional';
      const notes = document.getElementById('form-notes')?.value.trim() || 'Interested in bespoke furniture.';

      const text = `Namaste ZH Unique Furniture,

I would like to inquire about bespoke handcrafted furniture:
- Name: ${name}
- Phone: ${phone}
- Required Category: ${category}
- Specific Requirements / Room Dimensions:
${notes}

Please share your catalog and showroom / workshop details at Topsia, Kolkata.`;

      const waUrl = `https://wa.me/918240912987?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  // 8. Scroll Animation via IntersectionObserver
  const scrollElements = document.querySelectorAll('.bento-card, .offering-card, .review-card, .heritage-centerpiece');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  scrollElements.forEach(el => scrollObserver.observe(el));
});
