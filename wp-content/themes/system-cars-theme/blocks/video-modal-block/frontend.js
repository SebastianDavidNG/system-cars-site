/**
 * themes/system-cars-theme/blocks/video-modal-block/frontend.js
 * Video modal functionality
 */
(function() {
  'use strict';

  // Extract video embed code
  function getVideoEmbed(url) {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId;
      if (url.includes('youtu.be')) {
        videoId = url.split('/').pop().split('?')[0];
      } else {
        try {
          videoId = new URLSearchParams(new URL(url).search).get('v');
        } catch (e) {
          console.error('Error parsing YouTube URL:', e);
          return '';
        }
      }
      return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop().split('?')[0];
      return `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }

    // Direct video file (.mp4, .webm, etc.)
    return `<video controls autoplay style="width:100%;height:100%"><source src="${url}" type="video/mp4"></video>`;
  }

  // Initialize modal
  function initVideoModal() {
    // Create modal overlay if it doesn't exist
    let modal = document.getElementById('video-modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'video-modal-overlay';
      modal.className = 'video-modal-overlay';
      modal.innerHTML = `
        <button title="Close (Esc)" aria-label="Close" type="button" class="mfp-close"></button>
        <div class="video-modal-content">
          <div class="video-container"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const videoContainer = modal.querySelector('.video-container');
    const closeButton = modal.querySelector('.mfp-close');

    // Close modal function
    function closeModal() {
      videoContainer.innerHTML = '';
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Open modal function
    function openModal(videoUrl) {
      if (!videoUrl) return;

      const embedCode = getVideoEmbed(videoUrl);
      if (embedCode) {
        videoContainer.innerHTML = embedCode;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    // Close button event
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    // Click outside modal content to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Add click events to all video triggers
    const videoTriggers = document.querySelectorAll('.video-modal-trigger');

    videoTriggers.forEach(function(trigger) {
      const videoUrl = trigger.getAttribute('data-video-url');

      if (videoUrl) {
        trigger.addEventListener('click', function(e) {
          e.preventDefault();
          openModal(videoUrl);
        });
        // Also make it keyboard accessible
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');
        trigger.addEventListener('keypress', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(videoUrl);
          }
        });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoModal);
  } else {
    initVideoModal();
  }
})();
