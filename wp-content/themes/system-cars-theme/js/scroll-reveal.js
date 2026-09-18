/**
 * Scroll fade-in for System Cars blocks.
 * Desktop: whole block reveals once in view.
 * Mobile: staggered children when data-sc-reveal="stagger".
 */
(function () {
  'use strict';

  var DESKTOP_MQ = '(min-width: 768px)';
  var REDUCE_MQ = '(prefers-reduced-motion: reduce)';

  function prefersReducedMotion() {
    return window.matchMedia(REDUCE_MQ).matches;
  }

  function isDesktop() {
    return window.matchMedia(DESKTOP_MQ).matches;
  }

  function forceReflow(el) {
    // Ensure the hidden styles paint before we add .is-revealed (needed for transition).
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
  }

  function reveal(el, delayMs) {
    if (!el || el.classList.contains('is-revealed')) {
      return;
    }
    window.setTimeout(function () {
      forceReflow(el);
      el.classList.add('is-revealed');
    }, delayMs || 0);
  }

  function revealAll(root) {
    root.querySelectorAll('.sc-reveal, .sc-reveal-item').forEach(function (el) {
      reveal(el, 0);
    });
  }

  function decodeAttr(value) {
    if (!value) {
      return value;
    }
    var textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  function getStaggerItems(block) {
    var custom = decodeAttr(block.getAttribute('data-sc-reveal-items'));
    if (custom) {
      try {
        return block.querySelectorAll(custom);
      } catch (e) {
        // Fallback if :scope unsupported in attribute selector contexts
        return block.querySelectorAll(custom.replace(/:scope\s*>\s*/g, ''));
      }
    }
    return block.querySelectorAll(':scope > .sc-reveal-item, :scope > a, :scope > div');
  }

  function observeOnce(elements) {
    if (!elements.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el, i) {
        reveal(el, i * 80);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Require a meaningful portion in view so it doesn't fire while barely peeking.
          if (!entry.isIntersecting || entry.intersectionRatio < 0.18) {
            return;
          }
          var el = entry.target;
          var delay = Number(el.getAttribute('data-sc-reveal-delay') || 0);
          reveal(el, delay);
          observer.unobserve(el);
        });
      },
      {
        root: null,
        // Trigger when the element is further into the viewport (more noticeable).
        rootMargin: '0px 0px -12% 0px',
        threshold: [0.18, 0.28, 0.4],
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initBlock(block) {
    var mode = block.getAttribute('data-sc-reveal') || 'block';

    if (mode === 'stagger' && !isDesktop()) {
      var items = Array.prototype.slice.call(getStaggerItems(block));
      if (items.length) {
        block.classList.add('sc-reveal--children');
        items.forEach(function (item, index) {
          item.classList.add('sc-reveal-item');
          item.setAttribute('data-sc-reveal-delay', String(Math.min(index * 90, 360)));
        });
        forceReflow(block);
        observeOnce(items);
        return;
      }
    }

    block.classList.remove('sc-reveal--children');
    forceReflow(block);
    observeOnce([block]);
  }

  function init() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll('.sc-reveal'));
    if (!blocks.length) {
      return;
    }

    if (prefersReducedMotion()) {
      blocks.forEach(function (block) {
        block.classList.add('is-revealed');
        block.querySelectorAll('.sc-reveal-item').forEach(function (item) {
          item.classList.add('is-revealed');
        });
      });
      return;
    }

    // Wait one frame so initial opacity:0 styles are applied before observing.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        blocks.forEach(initBlock);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  var lastDesktop = isDesktop();
  window.matchMedia(DESKTOP_MQ).addEventListener('change', function () {
    var nowDesktop = isDesktop();
    if (nowDesktop === lastDesktop) {
      return;
    }
    lastDesktop = nowDesktop;
    document.querySelectorAll('.sc-reveal:not(.is-revealed)').forEach(initBlock);
  });
})();
