import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Dynamically measure header height and update CSS variable on each slider
function updateSliderHeights() {
  const header = document.querySelector('header[role="banner"]');
  if (!header) return;
  // getBoundingClientRect().bottom = distance from viewport top to header bottom
  // This naturally includes the info bar above the header
  const headerBottom = header.getBoundingClientRect().bottom;
  document.querySelectorAll('.wp-block-system-cars-slider-block').forEach((el) => {
    el.style.setProperty('--header-height', headerBottom + 'px');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateSliderHeights();
  window.addEventListener('resize', updateSliderHeights);

  document
    .querySelectorAll('.wp-block-system-cars-slider-block')
    .forEach((sliderEl) => {
      const totalSlides = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = sliderEl.querySelector('.swiper-button-prev');
      const nextBtn = sliderEl.querySelector('.swiper-button-next');

      // Create pagination container if it doesn't exist
      let paginationEl = sliderEl.querySelector('.swiper-pagination');
      if (!paginationEl) {
        paginationEl = document.createElement('div');
        paginationEl.className = 'swiper-pagination';
        sliderEl.appendChild(paginationEl);
      }

      // The block element itself is the swiper container (has class .swiper)
      const swiper = new Swiper(sliderEl, {
        modules: [Navigation, Pagination, Autoplay, EffectFade],
        loop: totalSlides > 1,
        autoplay: totalSlides > 1
          ? { delay: 5000, disableOnInteraction: false }
          : false,
        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
          disabledClass: 'swiper-button-disabled',
        },
        pagination: {
          el: paginationEl,
          clickable: true,
          renderBullet: function (index, className) {
            // Format number with leading zero (01, 02, 03...)
            const num = String(index + 1).padStart(2, '0');
            return `<span class="${className}">${num}</span>`;
          },
        },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        slidesPerView: 1,
        speed: 800,
      });

      // Force arrow positions after Swiper initialization (overrides Swiper defaults)
      const isDesktop = window.innerWidth >= 1024;
      const isTablet = window.innerWidth >= 768;
      const arrowOffset = isDesktop ? '70px' : (isTablet ? '40px' : '20px');

      if (prevBtn) {
        prevBtn.style.left = arrowOffset;
        prevBtn.style.right = 'auto';
      }
      if (nextBtn) {
        nextBtn.style.right = arrowOffset;
        nextBtn.style.left = 'auto';
      }

      // Update positions on window resize
      window.addEventListener('resize', () => {
        const isDesktopNow = window.innerWidth >= 1024;
        const isTabletNow = window.innerWidth >= 768;
        const newOffset = isDesktopNow ? '70px' : (isTabletNow ? '40px' : '20px');

        if (prevBtn) prevBtn.style.left = newOffset;
        if (nextBtn) nextBtn.style.right = newOffset;
      });
    });
});