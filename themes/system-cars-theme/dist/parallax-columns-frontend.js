document.addEventListener("DOMContentLoaded", () => {
  const parallaxColumns = document.querySelectorAll(".parallax-column");
  if (parallaxColumns.length === 0) return;
  const handleScroll = () => {
    parallaxColumns.forEach((column) => {
      const bgElement = column.querySelector(".parallax-bg");
      if (!bgElement) return;
      const rect = column.getBoundingClientRect();
      const scrollPercent = (window.scrollY - rect.top) / (rect.height + window.innerHeight);
      const yPos = scrollPercent * 100;
      bgElement.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  };
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
  handleScroll();
});
