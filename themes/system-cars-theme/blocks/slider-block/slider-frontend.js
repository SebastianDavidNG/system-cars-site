import Swiper from 'swiper';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Registrar módulos globalmente
Swiper.use([Navigation, Autoplay, EffectFade]);

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.wp-block-system-cars-slider-block')
    .forEach((sliderEl, idx) => {
      const totalSlides = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = sliderEl.querySelector('.swiper-button-prev');
      const nextBtn = sliderEl.querySelector('.swiper-button-next');
      const counter = sliderEl.querySelector('.slide-counter');
      const currentEl = counter && counter.querySelector('.current');
      const totalEl = counter && counter.querySelector('.total');

      // Set total
      if (totalEl) totalEl.textContent = totalSlides;

      const swiper = new Swiper(sliderEl, {
        loop: totalSlides > 1,
        autoplay: totalSlides > 1
          ? { delay: 5000, disableOnInteraction: false }
          : false,
        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
          disabledClass: 'swiper-button-disabled',
        },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        slidesPerView: 1,
        speed: 800,
        on: {
          init() {
            if (currentEl) currentEl.textContent = this.realIndex + 1;
          },
          slideChange() {
            if (currentEl) currentEl.textContent = this.realIndex + 1;
          },
        },
      });

      console.log(`Slider ${idx + 1} inicializado con ${totalSlides} slides`);
    });
});
