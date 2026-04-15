document.addEventListener("DOMContentLoaded", function() {
  const styledButtons = document.querySelectorAll(".styled-button");
  styledButtons.forEach((button) => {
    if (button.classList.contains("capitalize")) {
      button.classList.remove("capitalize");
      button.classList.add("uppercase");
    }
  });
});
