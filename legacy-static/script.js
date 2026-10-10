/**
 * ==============================================================================
 * PAYAL FASHION DESIGN - CLIENT-SIDE JAVASCRIPT
 * ==============================================================================
 * Clean, vanilla JavaScript handling:
 * 1. Business Configuration (WhatsApp number, store info)
 * 2. WhatsApp Link Generation & Intelligent Setup Modal
 * 3. Interactive Product Category Filtering
 * 4. Collection Card quick-jump & filter
 * 5. Mobile Drawer Navigation & Backdrop
 * 6. Custom Design Enquiry Form Modal
 * 7. Graceful Image Error Fallbacks
 * 8. Sticky Header & Active Nav Scroll Spy
 * ==============================================================================
 */

// ============================================================================
// 1. BUSINESS CONFIGURATION (EDIT HERE)
// ============================================================================
/**
 * TO CONFIGURE YOUR ACTUAL BOUTIQUE WHATSAPP NUMBER:
 * 1. Replace '91XXXXXXXXXX' below with your actual phone number.
 * 2. Include country code (e.g. 91 for India) followed by your 10-digit number.
 * 3. Do NOT include '+' symbols, dashes, or spaces.
 * Example for Indian number 9876543210: '919876543210'
 */
const CONFIG = {
  // WhatsApp Phone Number (Placeholder: 91XXXXXXXXXX)
  whatsappNumber: '919723814909',

  // Store Brand Name
  brandName: 'Payal Fashion Design',

  // Instagram Handle (Placeholder)
  instagramHandle: 'payalfashiondesign',
};

// ============================================================================
// 2. WHATSAPP LINK HANDLER & VALIDATION
// ============================================================================

/**
 * Checks if the configured WhatsApp number is still a placeholder or unconfigured.
 * @returns {boolean} True if placeholder or unconfigured
 */
function isWhatsAppUnconfigured() {
  if (!CONFIG.whatsappNumber) return true;
  const str = CONFIG.whatsappNumber.toString().trim();
  const digitsOnly = str.replace(/[^0-9]/g, '');
  // Unconfigured if it contains placeholder characters like 'X' or has less than 10 digits
  return str.toUpperCase().includes('X') || digitsOnly.length < 10;
}

/**
 * Opens WhatsApp with a prefilled message, or shows setup help if not configured.
 * @param {string} messageText - The message to prefill in WhatsApp
 */
function handleWhatsAppAction(messageText) {
  if (isWhatsAppUnconfigured()) {
    // Show friendly setup dialog rather than opening a broken link
    showWhatsAppSetupModal(messageText);
    return;
  }

  // Number is configured: encode message and open WhatsApp
  const encodedMessage = encodeURIComponent(messageText);
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Displays the WhatsApp Setup modal dialog to guide the website owner.
 * @param {string} intendedMessage - The message the customer wanted to send
 */
function showWhatsAppSetupModal(intendedMessage) {
  const modal = document.getElementById('whatsapp-setup-modal');
  const preview = document.getElementById('modal-preview-message');

  if (preview) {
    preview.textContent = `"${intendedMessage}"`;
  }

  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

/**
 * Closes the WhatsApp Setup modal.
 */
function closeWhatsAppSetupModal() {
  const modal = document.getElementById('whatsapp-setup-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// ============================================================================
// 3. IMAGE ERROR GRACEFUL FALLBACK
// ============================================================================

/**
 * Replaces broken or offline external images with a bespoke boutique graphic card.
 * This ensures the website always looks polished even without internet connectivity.
 * @param {HTMLImageElement} img - The image element that failed to load
 */
function handleImageFallback(img) {
  if (!img || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = 'true';

  const categoryName = img.dataset.fallbackCategory || 'Ethnic Fashion';
  const parent = img.parentElement;

  if (parent) {
    // Create elegant fallback graphic
    const fallbackBox = document.createElement('div');
    fallbackBox.className = 'image-fallback-placeholder';
    fallbackBox.innerHTML = `
      <div class="fb-icon" aria-hidden="true">✦</div>
      <div class="fb-title">${categoryName}</div>
      <div class="fb-sub">Payal Fashion Design</div>
    `;
    img.style.display = 'none';
    parent.appendChild(fallbackBox);
  }
}

// Expose handleImageFallback to global window for inline onerror handlers
window.handleImageFallback = handleImageFallback;

// ============================================================================
// 4. DOM INITIALIZATION & EVENT LISTENERS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {

  // Auto-update current copyright year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Auto-update Phone number in Contact section from CONFIG
  const phoneDisplay = document.getElementById('contact-phone-display');
  if (phoneDisplay) {
    if (!isWhatsAppUnconfigured()) {
      // Format number nicely: +91 97238 14909
      const numStr = CONFIG.whatsappNumber.toString().trim();
      let formatted = numStr;
      if (numStr.startsWith('91') && numStr.length === 12) {
        formatted = `+91 ${numStr.slice(2, 7)} ${numStr.slice(7)}`;
      } else {
        formatted = `+${numStr}`;
      }
      phoneDisplay.textContent = formatted;
      phoneDisplay.classList.remove('placeholder-badge');
      phoneDisplay.classList.add('configured-badge');
      phoneDisplay.style.color = 'var(--burgundy)';
      phoneDisplay.style.fontWeight = '700';
    } else {
      phoneDisplay.textContent = '91XXXXXXXXXX';
    }
  }

  // Auto-update Instagram handle from CONFIG
  const instaDisplay = document.getElementById('contact-insta-display');
  const instaLink = document.getElementById('instagram-link');
  if (CONFIG.instagramHandle) {
    if (instaDisplay) instaDisplay.textContent = '@' + CONFIG.instagramHandle;
    if (instaLink) instaLink.href = 'https://instagram.com/' + CONFIG.instagramHandle;
  }

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-nav');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      drawerBackdrop.classList.add('active');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      drawerBackdrop.classList.remove('active');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --------------------------------------------------------------------------
  // WhatsApp Setup Modal Dismiss Buttons
  // --------------------------------------------------------------------------
  const modalSetupClose = document.getElementById('modal-setup-close');
  const modalSetupDismiss = document.getElementById('modal-setup-dismiss');
  const setupModalBackdrop = document.getElementById('whatsapp-setup-modal');

  if (modalSetupClose) modalSetupClose.addEventListener('click', closeWhatsAppSetupModal);
  if (modalSetupDismiss) modalSetupDismiss.addEventListener('click', closeWhatsAppSetupModal);
  if (setupModalBackdrop) {
    setupModalBackdrop.addEventListener('click', (e) => {
      if (e.target === setupModalBackdrop) closeWhatsAppSetupModal();
    });
  }

  // --------------------------------------------------------------------------
  // Custom Design Enquiry Helper Modal
  // --------------------------------------------------------------------------
  const customModal = document.getElementById('custom-enquiry-modal');
  const openCustomModalBtn = document.getElementById('open-custom-helper-btn');
  const customModalClose = document.getElementById('custom-modal-close');
  const customForm = document.getElementById('custom-enquiry-form');

  function openCustomModal() {
    if (customModal) {
      customModal.classList.add('open');
      customModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCustomModal() {
    if (customModal) {
      customModal.classList.remove('open');
      customModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openCustomModalBtn) openCustomModalBtn.addEventListener('click', openCustomModal);
  if (customModalClose) customModalClose.addEventListener('click', closeCustomModal);
  if (customModal) {
    customModal.addEventListener('click', (e) => {
      if (e.target === customModal) closeCustomModal();
    });
  }

  // Process Custom Enquiry Form Submit
  if (customForm) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const outfitType = document.getElementById('form-outfit-type')?.value || 'Custom Outfit';
      const notes = document.getElementById('form-design-notes')?.value.trim() || 'Not specified';
      const size = document.getElementById('form-size')?.value || 'Custom measurements';
      const budget = document.getElementById('form-budget')?.value || 'To be discussed';
      const neededBy = document.getElementById('form-date')?.value.trim() || 'Flexible';

      const customMessage = `Hello Payal Fashion Design! I would like to request a custom design consultation:\n\n` +
        `• Outfit Type: ${outfitType}\n` +
        `• Design / Fabric Notes: ${notes}\n` +
        `• Measurements / Size: ${size}\n` +
        `• Approx. Budget: ${budget}\n` +
        `• Needed By: ${neededBy}\n\n` +
        `Could you please let me know your availability for stitching and fabric selection?`;

      closeCustomModal();
      handleWhatsAppAction(customMessage);
    });
  }

  // --------------------------------------------------------------------------
  // WhatsApp Action Triggers (Header, Hero, Product Cards, Direct CTAs)
  // --------------------------------------------------------------------------

  // General buttons
  document.querySelectorAll('[data-whatsapp-action="general"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = `Hello ${CONFIG.brandName}, I am visiting your website and would like to enquire about your ethnic fashion collections and stitching services.`;
      handleWhatsAppAction(msg);
    });
  });

  // Custom stitching direct CTA
  document.querySelectorAll('[data-whatsapp-action="custom-direct"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = `Hello ${CONFIG.brandName}, I would like to discuss a custom outfit design and stitching order. Please let me know what details you need from me.`;
      handleWhatsAppAction(msg);
    });
  });

  // Product card "Enquire on WhatsApp" buttons
  document.querySelectorAll('[data-whatsapp-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.getAttribute('data-whatsapp-product');
      const msg = `Hello ${CONFIG.brandName}, I am interested in the "${productName}" from your Ready-to-Wear showcase. Could you please share more details regarding fabric availability, fitting, and pricing?`;
      handleWhatsAppAction(msg);
    });
  });

  // --------------------------------------------------------------------------
  // Interactive Product Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  /**
   * Applies the selected category filter to the products grid.
   * @param {string} category - Category name or 'all'
   */
  function applyProductFilter(category) {
    // Update active filter button state
    filterBtns.forEach(btn => {
      const btnFilter = btn.getAttribute('data-filter');
      const isActive = btnFilter.toLowerCase() === category.toLowerCase();
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Show/hide matching cards
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category.toLowerCase() === 'all' || cardCategory.toLowerCase() === category.toLowerCase()) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // Add click listeners to filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter');
      applyProductFilter(selectedFilter);
    });
  });

  // --------------------------------------------------------------------------
  // Collection Cards & Footer Links Jump-to-Category Filter
  // --------------------------------------------------------------------------
  document.querySelectorAll('[data-filter-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const targetCategory = trigger.getAttribute('data-filter-target');
      if (!targetCategory) return;

      // Scroll to Ready-to-Wear gallery section
      const gallerySection = document.getElementById('ready-to-wear');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }

      // Apply the filter
      applyProductFilter(targetCategory);
    });
  });

  // --------------------------------------------------------------------------
  // Sticky Header Elevation & Scroll-Spy Active Nav Highlighting
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.main-nav .nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header elevation shadow
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll Spy active navigation indicator
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      desktopNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // Keyboard Accessibility: Escape key closes active modals and drawer
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeWhatsAppSetupModal();
      closeCustomModal();
    }
  });

});
