import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Document-layout height of info bar + header.
 * Avoid getBoundingClientRect(): it changes with scroll and caused intermittent
 * oversized sliders until a lucky reload.
 */
function getTopChromeHeight() {
  const header = document.querySelector('header[role="banner"]');
  if (!header) {
    return 0;
  }
  return header.offsetTop + header.offsetHeight;
}

function updateSliderHeights() {
  const topChrome = getTopChromeHeight();
  // If header layout is not ready yet, skip — a later pass will apply.
  if (topChrome <= 0) {
    return;
  }

  const viewportHeight =
    (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  const available = Math.max(Math.round(viewportHeight - topChrome), 240);

  document.querySelectorAll('.wp-block-system-cars-slider-block').forEach((el) => {
    el.style.setProperty('--header-height', `${topChrome}px`);
    el.style.height = `${available}px`;
    el.style.maxHeight = `${available}px`;
  });
}

/**
 * Remeasure after layout/fonts/images settle — fixes the intermittent wrong height.
 */
function scheduleHeightUpdates() {
  updateSliderHeights();

  requestAnimationFrame(() => {
    updateSliderHeights();
    requestAnimationFrame(updateSliderHeights);
  });

  window.addEventListener('load', updateSliderHeights, { once: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateSliderHeights).catch(() => {});
  }

  const header = document.querySelector('header[role="banner"]');
  if (header && typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => updateSliderHeights());
    ro.observe(header);
  }
}

function setArrowPositions(prevBtn, nextBtn) {
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
}

document.addEventListener('DOMContentLoaded', () => {
  scheduleHeightUpdates();
  window.addEventListener('resize', updateSliderHeights);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateSliderHeights);
  }

  document
    .querySelectorAll('.wp-block-system-cars-slider-block')
    .forEach((sliderEl) => {
      const totalSlides = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = sliderEl.querySelector('.swiper-button-prev');
      const nextBtn = sliderEl.querySelector('.swiper-button-next');
      const autoplayEnabled = sliderEl.dataset.autoplay !== 'false';
      const autoplayDelay = parseInt(sliderEl.dataset.autoplayDelay, 10) || 5000;

      let paginationEl = sliderEl.querySelector('.swiper-pagination');
      if (!paginationEl) {
        paginationEl = document.createElement('div');
        paginationEl.className = 'swiper-pagination';
        sliderEl.appendChild(paginationEl);
      }

      const swiper = new Swiper(sliderEl, {
        modules: [Navigation, Pagination, Autoplay, EffectFade],
        loop: totalSlides > 1,
        autoplay: totalSlides > 1 && autoplayEnabled
          ? { delay: autoplayDelay, disableOnInteraction: false }
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
            const num = String(index + 1).padStart(2, '0');
            return `<span class="${className}">${num}</span>`;
          },
        },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        slidesPerView: 1,
        speed: 800,
      });

      setArrowPositions(prevBtn, nextBtn);
      window.addEventListener('resize', () => setArrowPositions(prevBtn, nextBtn));

      // After Swiper mutates the DOM, re-fit to viewport
      updateSliderHeights();
      swiper.on('init', updateSliderHeights);
      swiper.on('resize', updateSliderHeights);
      swiper.on('imagesReady', updateSliderHeights);
    });
});
