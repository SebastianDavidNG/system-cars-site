/**
 * Parallax Effect for Parallax Columns Block
 * themes/system-cars-theme/blocks/parallax-columns-block/frontend.js
 */

(function() {
  'use strict';

  /**
   * Inicializa el efecto parallax en todos los bloques con data-parallax="true"
   */
  function initParallax() {
    const parallaxBlocks = document.querySelectorAll('.parallax-columns-block[data-parallax="true"]');

    if (parallaxBlocks.length === 0) {
      return;
    }

    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    parallaxBlocks.forEach(block => {
      const mobileOptimized = block.getAttribute('data-mobile-optimized') === 'true';

      // Si está optimizado para móvil y es un dispositivo móvil, no aplicar parallax
      if (mobileOptimized && isMobile) {
        // En móvil, usar background fijo normal
        block.style.backgroundAttachment = 'scroll';
        return;
      }

      // Evitar re-inicialización
      if (block.dataset.parallaxInitialized === 'true') {
        return;
      }

      // Crear el parallax scroll listener
      const handleScroll = () => {
        const rect = block.getBoundingClientRect();
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollPosition;
        const viewportHeight = window.innerHeight;

        // Solo aplicar parallax si el elemento está visible en el viewport
        if (rect.top < viewportHeight && rect.bottom > 0) {
          // Calcular el offset basado en la posición de scroll
          const scrolled = scrollPosition - elementTop + viewportHeight;
          const parallaxSpeed = 0.2; // Velocidad del efecto (0.2 = más sutil, 0.5 = más dramático)
          const offset = -(scrolled * parallaxSpeed);

          // Aplicar efecto parallax modificando background-position
          block.style.backgroundPosition = `center ${offset}px`;
        }
      };

      // Aplicar el efecto en scroll con throttling para performance
      let ticking = false;
      const scrollListener = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', scrollListener, { passive: true });

      // Aplicar efecto inicial
      handleScroll();

      // Marcar como inicializado
      block.dataset.parallaxInitialized = 'true';
    });
  }

  /**
   * Inicializar cuando el DOM esté listo
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }

  // Re-inicializar si hay cambios dinámicos en el DOM
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.querySelector) {
            const parallaxBlocks = node.querySelectorAll ? node.querySelectorAll('.parallax-columns-block[data-parallax="true"]') : [];
            if (parallaxBlocks.length > 0 || (node.classList && node.classList.contains('parallax-columns-block'))) {
              initParallax();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
