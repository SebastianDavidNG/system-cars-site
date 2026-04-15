document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    const closeBtn = document.getElementById("menu-close");
    const openIcon = document.getElementById("icon-open");
    const closeIcon = document.getElementById("icon-close");
    const body = document.body;

    // Check if all elements exist
    if (!toggle || !menu || !closeBtn) {
        return;
    }

    // Function to open menu with animations
    function openMenu() {
        menu.classList.add("is-open");
        body.classList.add("mobile-menu-open");
        if (openIcon) openIcon.classList.add("hidden");
        if (closeIcon) closeIcon.classList.remove("hidden");
    }

    // Function to close menu with animations
    function closeMenu() {
        menu.classList.remove("is-open");
        body.classList.remove("mobile-menu-open");
        if (openIcon) openIcon.classList.remove("hidden");
        if (closeIcon) closeIcon.classList.add("hidden");
    }

    // Open from header toggle button
    toggle.addEventListener("click", (e) => {
        e.preventDefault();
        if (menu.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close from button inside menu
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeMenu();
    });

    // Close menu when clicking on a menu link
    const menuLinks = menu.querySelectorAll("a");
    menuLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("is-open")) {
            closeMenu();
        }
    });
});