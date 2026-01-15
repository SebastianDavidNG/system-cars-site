(function() {
  function getVideoEmbed(url) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId;
      if (url.includes("youtu.be")) {
        videoId = url.split("/").pop().split("?")[0];
      } else {
        try {
          videoId = new URLSearchParams(new URL(url).search).get("v");
        } catch (e) {
          console.error("Error parsing YouTube URL:", e);
          return "";
        }
      }
      return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop().split("?")[0];
      return `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }
    return `<video controls autoplay style="width:100%;height:100%"><source src="${url}" type="video/mp4"></video>`;
  }
  function initVideoModal() {
    console.log("🎬 Video Modal: Initializing...");
    let modal = document.getElementById("video-modal-overlay");
    if (!modal) {
      console.log("🎬 Video Modal: Creating modal overlay");
      modal = document.createElement("div");
      modal.id = "video-modal-overlay";
      modal.className = "video-modal-overlay";
      modal.innerHTML = `
        <button title="Close (Esc)" aria-label="Close" type="button" class="mfp-close"></button>
        <div class="video-modal-content">
          <div class="video-container"></div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      console.log("🎬 Video Modal: Modal overlay already exists");
    }
    const videoContainer = modal.querySelector(".video-container");
    const closeButton = modal.querySelector(".mfp-close");
    function closeModal() {
      videoContainer.innerHTML = "";
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
    function openModal(videoUrl) {
      console.log("🎬 Video Modal: openModal called with URL:", videoUrl);
      if (!videoUrl) {
        console.error("🎬 Video Modal: No video URL provided");
        return;
      }
      const embedCode = getVideoEmbed(videoUrl);
      console.log("🎬 Video Modal: Embed code generated:", embedCode ? "YES" : "NO");
      if (embedCode) {
        videoContainer.innerHTML = embedCode;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        console.log("🎬 Video Modal: Modal opened successfully");
      } else {
        console.error("🎬 Video Modal: Failed to generate embed code");
      }
    }
    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
    const videoTriggers = document.querySelectorAll(".video-modal-trigger");
    console.log(`🎬 Video Modal: Found ${videoTriggers.length} trigger(s)`);
    videoTriggers.forEach(function(trigger, index) {
      const videoUrl = trigger.getAttribute("data-video-url");
      console.log(`🎬 Video Modal: Trigger ${index + 1} - Video URL:`, videoUrl);
      if (videoUrl) {
        trigger.addEventListener("click", function(e) {
          console.log("🎬 Video Modal: Click detected on trigger", index + 1);
          e.preventDefault();
          openModal(videoUrl);
        });
        trigger.setAttribute("role", "button");
        trigger.setAttribute("tabindex", "0");
        trigger.addEventListener("keypress", function(e) {
          if (e.key === "Enter" || e.key === " ") {
            console.log("🎬 Video Modal: Keypress detected on trigger", index + 1);
            e.preventDefault();
            openModal(videoUrl);
          }
        });
        console.log(`🎬 Video Modal: Event listeners attached to trigger ${index + 1}`);
      } else {
        console.warn(`🎬 Video Modal: Trigger ${index + 1} has no video URL!`);
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVideoModal);
  } else {
    initVideoModal();
  }
})();
