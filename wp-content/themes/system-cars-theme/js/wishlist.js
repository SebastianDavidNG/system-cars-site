/**
 * Wishlist functionality with localStorage
 * System Cars Theme
 */
(function() {
    'use strict';

    const STORAGE_KEY = 'sc_wishlist';
    let notificationTimeout = null;

    // Get wishlist from localStorage
    function getWishlist() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // Save wishlist to localStorage
    function saveWishlist(wishlist) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
        } catch (e) {
            console.error('Error saving wishlist:', e);
        }
    }

    // Check if product is in wishlist
    function isInWishlist(productId) {
        const wishlist = getWishlist();
        return wishlist.includes(productId);
    }

    // Add product to wishlist
    function addToWishlist(productId) {
        const wishlist = getWishlist();
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            saveWishlist(wishlist);
        }
    }

    // Remove product from wishlist
    function removeFromWishlist(productId) {
        let wishlist = getWishlist();
        wishlist = wishlist.filter(id => id !== productId);
        saveWishlist(wishlist);
    }

    // Create notification element if it doesn't exist
    function getOrCreateNotification() {
        let notification = document.getElementById('wishlist-notification');

        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'wishlist-notification';
            notification.className = 'wishlist-notification';
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

            // Close button event
            const closeBtn = notification.querySelector('.wishlist-notification__close');
            if (closeBtn) {
                closeBtn.addEventListener('click', hideNotification);
            }
        }

        return notification;
    }

    // Show notification
    function showNotification(productName, isAdded) {
        const notification = getOrCreateNotification();
        const icon = notification.querySelector('.wishlist-notification__icon');
        const title = notification.querySelector('.wishlist-notification__title');
        const message = notification.querySelector('.wishlist-notification__message');

        // Update content
        if (isAdded) {
            icon.className = 'wishlist-notification__icon wishlist-notification__icon--added';
            icon.innerHTML = '<i class="fa-solid fa-heart"></i>';
            title.textContent = 'Agregado a la lista';
            message.textContent = `"${productName}" se agregó a tu lista de deseos.`;
        } else {
            icon.className = 'wishlist-notification__icon wishlist-notification__icon--removed';
            icon.innerHTML = '<i class="fa-regular fa-heart"></i>';
            title.textContent = 'Eliminado de la lista';
            message.textContent = `"${productName}" se eliminó de tu lista de deseos.`;
        }

        // Clear previous timeout
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('is-visible');
        });

        // Auto-hide after 3 seconds
        notificationTimeout = setTimeout(hideNotification, 3000);
    }

    // Hide notification
    function hideNotification() {
        const notification = document.getElementById('wishlist-notification');
        if (notification) {
            notification.classList.remove('is-visible');
        }
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
            notificationTimeout = null;
        }
    }

    // Toggle wishlist button state
    function toggleWishlistButton(button, productId) {
        const isActive = isInWishlist(productId);

        if (isActive) {
            button.classList.add('is-active');
            button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Añadir', 'Quitar'));
        } else {
            button.classList.remove('is-active');
            button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Quitar', 'Añadir'));
        }
    }

    // Initialize wishlist buttons
    function initWishlistButtons() {
        const buttons = document.querySelectorAll('.product-card__wishlist');

        buttons.forEach(button => {
            const productId = parseInt(button.getAttribute('data-product-id'), 10);
            const productName = button.getAttribute('data-product-name') || 'Producto';

            // Set initial state
            toggleWishlistButton(button, productId);

            // Click handler
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isCurrentlyActive = isInWishlist(productId);

                // Toggle wishlist
                if (isCurrentlyActive) {
                    removeFromWishlist(productId);
                } else {
                    addToWishlist(productId);
                }

                // Update button state
                toggleWishlistButton(button, productId);

                // Add animation class
                button.classList.add('is-animating');
                setTimeout(() => {
                    button.classList.remove('is-animating');
                }, 400);

                // Show notification
                showNotification(productName, !isCurrentlyActive);
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWishlistButtons);
    } else {
        initWishlistButtons();
    }
})();
