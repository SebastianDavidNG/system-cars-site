/**
 * Frontend script for styled-button-block
 * Fixes capitalize class to uppercase for old saved blocks
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find all styled buttons
  const styledButtons = document.querySelectorAll('.styled-button');

  styledButtons.forEach(button => {
    // Replace capitalize with uppercase
    if (button.classList.contains('capitalize')) {
      button.classList.remove('capitalize');
      button.classList.add('uppercase');
    }
  });
});
