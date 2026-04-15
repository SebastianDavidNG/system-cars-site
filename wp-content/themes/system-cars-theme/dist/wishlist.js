(function() {
  const STORAGE_KEY = "sc_wishlist";
  let notificationTimeout = null;
  function getWishlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
  function saveWishlist(wishlist) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Error saving wishlist:", e);
    }
  }
  function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
  }
  function addToWishlist(productId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      saveWishlist(wishlist);
    }
  }
  function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter((id) => id !== productId);
    saveWishlist(wishlist);
  }
  function getOrCreateNotification() {
    let notification = document.getElementById("wishlist-notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "wishlist-notification";
      notification.className = "wishlist-notification";
      notification.innerHTML = `
                <button type="button" class="wishlist-notification__close" aria-label="Cerrar">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="wishlist-notification__icon">
                    <i class="fa-solid fa-heart"></i>
                </div>
                <div class="wishlist-notification__content">
                    <h4 class="wishlist-notification__title"></h4>
                    <p class="wishlist-notification__message"></p>
                </div>
            `;
      document.body.appendChild(notification);
      const closeBtn = notification.querySelector(".wishlist-notification__close");
      if (closeBtn) {
        closeBtn.addEventListener("click", hideNotification);
      }
    }
    return notification;
  }
  function showNotification(productName, isAdded) {
    const notification = getOrCreateNotification();
    const icon = notification.querySelector(".wishlist-notification__icon");
    const title = notification.querySelector(".wishlist-notification__title");
    const message = notification.querySelector(".wishlist-notification__message");
    if (isAdded) {
      icon.className = "wishlist-notification__icon wishlist-notification__icon--added";
      icon.innerHTML = '<i class="fa-solid fa-heart"></i>';
      title.textContent = "Agregado a la lista";
      message.textContent = `"${productName}" se agregó a tu lista de deseos.`;
    } else {
      icon.className = "wishlist-notification__icon wishlist-notification__icon--removed";
      icon.innerHTML = '<i class="fa-regular fa-heart"></i>';
      title.textContent = "Eliminado de la lista";
      message.textContent = `"${productName}" se eliminó de tu lista de deseos.`;
    }
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    requestAnimationFrame(() => {
      notification.classList.add("is-visible");
    });
    notificationTimeout = setTimeout(hideNotification, 3e3);
  }
  function hideNotification() {
    const notification = document.getElementById("wishlist-notification");
    if (notification) {
      notification.classList.remove("is-visible");
    }
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
      notificationTimeout = null;
    }
  }
  function toggleWishlistButton(button, productId) {
    const isActive = isInWishlist(productId);
    if (isActive) {
      button.classList.add("is-active");
      button.setAttribute("aria-label", button.getAttribute("aria-label").replace("Añadir", "Quitar"));
    } else {
      button.classList.remove("is-active");
      button.setAttribute("aria-label", button.getAttribute("aria-label").replace("Quitar", "Añadir"));
    }
  }
  function initWishlistButtons() {
    const buttons = document.querySelectorAll(".product-card__wishlist");
    buttons.forEach((button) => {
      const productId = parseInt(button.getAttribute("data-product-id"), 10);
      const productName = button.getAttribute("data-product-name") || "Producto";
      toggleWishlistButton(button, productId);
      button.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isCurrentlyActive = isInWishlist(productId);
        if (isCurrentlyActive) {
          removeFromWishlist(productId);
        } else {
          addToWishlist(productId);
        }
        toggleWishlistButton(button, productId);
        button.classList.add("is-animating");
        setTimeout(() => {
          button.classList.remove("is-animating");
        }, 400);
        showNotification(productName, !isCurrentlyActive);
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWishlistButtons);
  } else {
    initWishlistButtons();
  }
})();
