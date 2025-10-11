document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    const closeBtn = document.getElementById("menu-close");
    const openIcon = document.getElementById("icon-open");
    const closeIcon = document.getElementById("icon-close");

    // abrir desde el toggle del header
    toggle.addEventListener("click", () => {
        menu.classList.remove("-translate-y-full");
        menu.classList.add("translate-y-0");
        openIcon.classList.add("hidden");
        closeIcon.classList.remove("hidden");
    });

    // cerrar desde el botón dentro del menú
    closeBtn.addEventListener("click", () => {
        menu.classList.add("-translate-y-full");
        menu.classList.remove("translate-y-0");
        openIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
    });
});