/**
 * The Chocolate Room Cafe and Bistro - Main Interactive Script
 * Visakhapatnam, MVP Colony
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- 1. Mobile Menu Drawer Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. Menu Category Tabs & Filtering ---
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');

      // Update active state of buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-[#2B1700]', 'text-[#FAF7F2]');
        btn.classList.add('bg-white', 'text-[#6B5E55]', 'hover:text-[#2B1700]');
      });

      button.classList.remove('bg-white', 'text-[#6B5E55]', 'hover:text-[#2B1700]');
      button.classList.add('active', 'bg-[#2B1700]', 'text-[#FAF7F2]');

      // Filter cards
      menuItems.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          card.classList.remove('hidden');
          // Smooth fade in
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- 3. WhatsApp Quick Order Functionality ---
  const orderButtons = document.querySelectorAll('.order-wa-btn');
  const waPhoneNumber = '918374869966';

  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.getAttribute('data-item-name');
      const itemPrice = btn.getAttribute('data-item-price');
      let message = "Hi, I'd like to place an order from The Chocolate Room!";
      
      if (itemName) {
        message = `Hi! I'd like to order *${itemName}* (₹${itemPrice}) from The Chocolate Room, MVP Colony!`;
      }
      
      const waUrl = `https://wa.me/${waPhoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  });

  // --- 4. Interactive Gallery Lightbox Modal ---
  const galleryItems = document.querySelectorAll('.gallery-trigger');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');

  let currentGalleryIndex = 0;
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-full-img'),
    caption: item.getAttribute('data-caption') || ''
  }));

  function openModal(index) {
    if (!galleryData[index]) return;
    currentGalleryIndex = index;
    modalImg.src = galleryData[index].src;
    modalCaption.textContent = galleryData[index].caption;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    openModal(currentGalleryIndex);
  }

  function showPrev() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    openModal(currentGalleryIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalNext) modalNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (modalPrev) modalPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  // Close when clicking modal backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });
  }

  // Keyboard navigation for modal
  document.addEventListener('keydown', (e) => {
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // --- 5. Active Nav Highlighting On Scroll ---
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-[#D97706]', 'font-semibold');
            link.classList.remove('text-[#2B1700]/80');
          } else {
            link.classList.remove('text-[#D97706]', 'font-semibold');
            link.classList.add('text-[#2B1700]/80');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
});
