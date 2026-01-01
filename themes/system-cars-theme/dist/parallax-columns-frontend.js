(function() {
  function initParallax() {
    const parallaxBlocks = document.querySelectorAll('.parallax-columns-block[data-parallax="true"]');
    if (parallaxBlocks.length === 0) {
      return;
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    parallaxBlocks.forEach((block) => {
      const mobileOptimized = block.getAttribute("data-mobile-optimized") === "true";
      if (mobileOptimized && isMobile) {
        block.style.backgroundAttachment = "scroll";
        return;
      }
      if (block.dataset.parallaxInitialized === "true") {
        return;
      }
      const handleScroll = () => {
        const rect = block.getBoundingClientRect();
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollPosition;
        const viewportHeight = window.innerHeight;
        if (rect.top < viewportHeight && rect.bottom > 0) {
          const scrolled = scrollPosition - elementTop + viewportHeight;
          const parallaxSpeed = 0.2;
          const offset = -(scrolled * parallaxSpeed);
          block.style.backgroundPosition = `center ${offset}px`;
        }
      };
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
      window.addEventListener("scroll", scrollListener, { passive: true });
      handleScroll();
      block.dataset.parallaxInitialized = "true";
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParallax);
  } else {
    initParallax();
  }
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.querySelector) {
            const parallaxBlocks = node.querySelectorAll ? node.querySelectorAll('.parallax-columns-block[data-parallax="true"]') : [];
            if (parallaxBlocks.length > 0 || node.classList && node.classList.contains("parallax-columns-block")) {
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
