/**
 * Mini Cart Dropdown functionality
 * Opens a dropdown showing cart contents when clicking the cart icon
 */
(function() {
    'use strict';

    const wrapper = document.querySelector('.sc-mini-cart-wrapper');
    if (!wrapper) return;

    const trigger = wrapper.querySelector('.sc-mini-cart-trigger');
    const miniCart = wrapper.querySelector('.sc-mini-cart');
    const closeBtn = miniCart?.querySelector('.sc-mini-cart__close');

    if (!trigger || !miniCart) return;

    let isOpen = false;
    let needsRefresh = false; // Flag to track if content needs to be refreshed

    // Open mini cart
    function openMiniCart() {
        if (isOpen) return;

        isOpen = true;
        miniCart.classList.add('is-open');
        miniCart.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');

        // Focus close button for accessibility
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }

        // Only refresh if content was marked as needing refresh
        // (after add to cart, remove, etc.)
        if (needsRefresh) {
            refreshMiniCart();
            needsRefresh = false;
        }
    }

    // Close mini cart
    function closeMiniCart() {
        if (!isOpen) return;

        isOpen = false;
        miniCart.classList.remove('is-open');
        miniCart.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
    }

    // Toggle mini cart
    function toggleMiniCart(e) {
        e.preventDefault();
        e.stopPropagation();

        if (isOpen) {
            closeMiniCart();
        } else {
            openMiniCart();
        }
    }

    // Refresh mini cart content via AJAX
    function refreshMiniCart(showLoading = true) {
        const content = miniCart.querySelector('.sc-mini-cart__content');
        if (!content) return;

        // Add loading state if requested
        if (showLoading) {
            content.classList.add('is-loading');
            content.classList.remove('is-loaded');
        }

        const formData = new FormData();
        formData.append('action', 'sc_get_mini_cart');

        fetch(miniCartData.ajaxUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Insert content
                content.innerHTML = data.data.html;
                updateCartCount(data.data.cart_count);

                // Wait for browser to render, then show
                if (showLoading) {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            content.classList.remove('is-loading');
                            content.classList.add('is-loaded');
                        });
                    });
                }
            }
        })
        .catch(error => {
            console.error('Mini Cart Error:', error);
            content.classList.remove('is-loading');
        });
    }

    // Update content directly without loading state (for fragments)
    function updateContent(html) {
        const content = miniCart.querySelector('.sc-mini-cart__content');
        if (!content) return;

        content.innerHTML = html;
    }

    // Update cart count badge
    function updateCartCount(count) {
        const countBadges = document.querySelectorAll('.cart-icon-count');
        countBadges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        });
    }

    // Use event delegation on the stable miniCart element so remove buttons
    // work even after WooCommerce replaces .sc-mini-cart__content via fragments.
    miniCart.addEventListener('click', function(e) {
        const btn = e.target.closest('.sc-mini-cart__item-remove');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const cartItemKey = btn.dataset.cartItemKey;
        if (!cartItemKey) return;

        const item = btn.closest('.sc-mini-cart__item');
        if (item) {
            item.classList.add('is-removing');
        }

        removeCartItem(cartItemKey);
    });

    // Remove item from cart via AJAX
    function removeCartItem(cartItemKey) {
        const formData = new FormData();
        formData.append('action', 'sc_remove_cart_item');
        formData.append('cart_item_key', cartItemKey);

        fetch(miniCartData.ajaxUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const content = miniCart.querySelector('.sc-mini-cart__content');
                if (content) {
                    content.innerHTML = data.data.html;
                }
                updateCartCount(data.data.cart_count);

                // Trigger WooCommerce event for other listeners
                if (typeof jQuery !== 'undefined') {
                    jQuery(document.body).trigger('removed_from_cart');
                }
            }
        })
        .catch(error => {
            console.error('Remove Cart Item Error:', error);
        });
    }

    // Event listeners
    trigger.addEventListener('click', toggleMiniCart);

    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMiniCart();
        });
    }

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && !wrapper.contains(e.target)) {
            closeMiniCart();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeMiniCart();
        }
    });

    // Listen for WooCommerce add to cart events
    if (typeof jQuery !== 'undefined') {
        jQuery(document.body).on('added_to_cart', function(event, fragments, cart_hash, $button) {
            // Update mini cart content from fragments if available
            if (fragments && fragments['.sc-mini-cart__content']) {
                const temp = document.createElement('div');
                temp.innerHTML = fragments['.sc-mini-cart__content'];
                if (temp.firstElementChild) {
                    updateContent(temp.firstElementChild.innerHTML);
                }
            } else {
                // Mark for refresh on next open
                needsRefresh = true;
            }

            // Update cart count from fragments
            if (fragments && fragments['.cart-icon-count']) {
                const countBadges = document.querySelectorAll('.cart-icon-count');
                const temp = document.createElement('div');
                temp.innerHTML = fragments['.cart-icon-count'];
                const newBadge = temp.firstElementChild;

                if (newBadge) {
                    countBadges.forEach(badge => {
                        badge.className = newBadge.className;
                        badge.textContent = newBadge.textContent;
                    });
                }
            }
        });

        // Listen for cart updated (e.g., from cart page)
        jQuery(document.body).on('updated_cart_totals', function() {
            needsRefresh = true;
            if (isOpen) {
                refreshMiniCart();
            }
        });
    }

})();
