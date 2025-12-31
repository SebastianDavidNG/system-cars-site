/**
 * themes/system-cars-theme/blocks/video-modal-block/frontend.js
 * Video modal functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const videoBlocks = document.querySelectorAll('.video-modal-block');

  videoBlocks.forEach((block) => {
    const thumbnail = block.querySelector('.video-thumbnail');
    const modal = block.querySelector('.video-modal-overlay');
    const modalContent = block.querySelector('.video-modal-content');
    const videoContainer = block.querySelector('.video-container');
    const closeButton = block.querySelector('.modal-close');
    const videoUrl = thumbnail?.getAttribute('data-video-url');

    if (!thumbnail || !modal || !videoUrl) return;

    // Extract video ID and type
    const getVideoEmbed = (url) => {
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be')
          ? url.split('/').pop().split('?')[0]
          : new URLSearchParams(new URL(url).search).get('v');
        return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      }

      // Vimeo
      if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        return `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      }

      // Direct video file
      return `<video controls autoplay style="width:100%;height:100%"><source src="${url}"></video>`;
    };

    // Open modal
    const openModal = () => {
      videoContainer.innerHTML = getVideoEmbed(videoUrl);
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    // Close modal
    const closeModal = () => {
      videoContainer.innerHTML = '';
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    // Event listeners
    thumbnail.addEventListener('click', openModal);
    thumbnail.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });

    closeButton?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  });
});
