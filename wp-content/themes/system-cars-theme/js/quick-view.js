/**
 * Quick View Modal functionality
 * Opens a modal with product details when clicking the Quick View button
 * Supports both simple and variable products
 */
(function() {
    'use strict';

    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    const overlay = modal.querySelector('.quick-view-modal__overlay');
    const closeBtn = modal.querySelector('.quick-view-modal__close');
    const loadingEl = modal.querySelector('.quick-view-modal__loading');
    const productEl = modal.querySelector('.quick-view-modal__product');

    // Store current variations data
    let currentVariations = [];
    let selectedAttributes = {};

    // Open modal
    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus trap
        closeBtn.focus();
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Clear content after animation
        setTimeout(() => {
            productEl.innerHTML = '';
            loadingEl.style.display = 'flex';
            currentVariations = [];
            selectedAttributes = {};
        }, 300);
    }

    // Load product data via AJAX
    function loadProduct(productId) {
        loadingEl.style.display = 'flex';
        productEl.innerHTML = '';

        // Use WordPress AJAX
        const formData = new FormData();
        formData.append('action', 'quick_view_product');
        formData.append('product_id', productId);
        formData.append('nonce', quickViewData.nonce);

        fetch(quickViewData.ajaxUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                productEl.innerHTML = data.data.html;
                loadingEl.style.display = 'none';

                // Initialize thumbnails gallery
                initThumbnails();

                // Initialize quantity buttons
                initQuantityButtons();

                // Initialize variations if variable product
                initVariations();

                // Initialize add to cart
                initAddToCart();
            } else {
                productEl.innerHTML = '<p class="error">Error al cargar el producto</p>';
                loadingEl.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Quick View Error:', error);
            productEl.innerHTML = '<p class="error">Error al cargar el producto</p>';
            loadingEl.style.display = 'none';
        });
    }

    // Initialize thumbnails gallery click
    function initThumbnails() {
        const thumbnails = productEl.querySelectorAll('.quick-view-product__thumbnails .thumbnail');
        const mainImageContainer = productEl.querySelector('.quick-view-product__image');
        const mainImage = mainImageContainer?.querySelector('img');

        if (!thumbnails.length || !mainImage || !mainImageContainer) return;

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Skip if this thumbnail is already active
                if (this.classList.contains('active')) return;

                // Get the large image URL from data attribute
                const newImageUrl = this.dataset.image;
                if (!newImageUrl) return;

                // Update active state immediately
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Add fade-out class
                mainImageContainer.classList.add('is-changing');

                // Wait for fade-out, then change image
                setTimeout(() => {
                    mainImage.src = newImageUrl;

                    // When new image loads, fade back in
                    mainImage.onload = function() {
                        mainImageContainer.classList.remove('is-changing');
                    };

                    // Fallback: remove class after timeout if onload doesn't fire (cached images)
                    setTimeout(() => {
                        mainImageContainer.classList.remove('is-changing');
                    }, 100);
                }, 200);
            });
        });
    }

    // Initialize quantity +/- buttons
    function initQuantityButtons() {
        const minusBtn = productEl.querySelector('.qty-minus');
        const plusBtn = productEl.querySelector('.qty-plus');
        const qtyInput = productEl.querySelector('.qty-input');

        if (minusBtn && plusBtn && qtyInput) {
            minusBtn.addEventListener('click', () => {
                const currentVal = parseInt(qtyInput.value) || 1;
                if (currentVal > 1) {
                    qtyInput.value = currentVal - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                const currentVal = parseInt(qtyInput.value) || 1;
                const max = parseInt(qtyInput.getAttribute('max')) || 999;
                if (currentVal < max) {
                    qtyInput.value = currentVal + 1;
                }
            });
        }
    }

    // Initialize variations for variable products
    function initVariations() {
        const variationsContainer = productEl.querySelector('.quick-view-product__variations');
        if (!variationsContainer) return;

        // Get variations data
        const variationsData = variationsContainer.dataset.variations;
        if (!variationsData) return;

        try {
            currentVariations = JSON.parse(variationsData);
        } catch (e) {
            console.error('Error parsing variations:', e);
            return;
        }

        const selects = variationsContainer.querySelectorAll('.quick-view-variation__select');
        const resetLink = variationsContainer.querySelector('.quick-view-variation__reset');
        const addToCartBtn = productEl.querySelector('.quick-view-add-to-cart');
        const priceEl = productEl.querySelector('.quick-view-product__price');

        // Handle select changes
        selects.forEach(select => {
            select.addEventListener('change', function() {
                const attributeName = this.dataset.attribute;
                const value = this.value;

                if (value) {
                    selectedAttributes[attributeName] = value;
                } else {
                    delete selectedAttributes[attributeName];
                }

                // Show/hide reset link
                if (Object.keys(selectedAttributes).length > 0) {
                    resetLink.style.display = 'inline-block';
                } else {
                    resetLink.style.display = 'none';
                }

                // Find matching variation
                const matchingVariation = findMatchingVariation();

                if (matchingVariation) {
                    // Enable button and update
                    addToCartBtn.disabled = false;
                    addToCartBtn.dataset.variationId = matchingVariation.variation_id;
                    addToCartBtn.textContent = 'Añadir al carrito';

                    // Update price
                    if (matchingVariation.price_html && priceEl) {
                        priceEl.innerHTML = matchingVariation.price_html;
                    }

                    // Update max quantity
                    const qtyInput = productEl.querySelector('.qty-input');
                    if (qtyInput && matchingVariation.max_qty) {
                        qtyInput.max = matchingVariation.max_qty;
                        if (parseInt(qtyInput.value) > matchingVariation.max_qty) {
                            qtyInput.value = matchingVariation.max_qty;
                        }
                    }

                    // Update image if variation has one
                    if (matchingVariation.image) {
                        const mainImage = productEl.querySelector('.quick-view-product__image img');
                        if (mainImage && mainImage.src !== matchingVariation.image) {
                            const container = productEl.querySelector('.quick-view-product__image');
                            container.classList.add('is-changing');
                            setTimeout(() => {
                                mainImage.src = matchingVariation.image;
                                setTimeout(() => {
                                    container.classList.remove('is-changing');
                                }, 100);
                            }, 200);
                        }
                    }

                    // Check stock
                    if (!matchingVariation.is_in_stock) {
                        addToCartBtn.disabled = true;
                        addToCartBtn.textContent = 'Agotado';
                    }
                } else {
                    // No matching variation or not all selected
                    addToCartBtn.disabled = true;
                    addToCartBtn.dataset.variationId = '';

                    // Check if all attributes are selected
                    if (Object.keys(selectedAttributes).length === selects.length) {
                        addToCartBtn.textContent = 'Combinación no disponible';
                    } else {
                        addToCartBtn.textContent = 'Seleccionar opciones';
                    }
                }
            });
        });

        // Handle reset
        if (resetLink) {
            resetLink.addEventListener('click', function(e) {
                e.preventDefault();

                selectedAttributes = {};
                selects.forEach(select => {
                    select.value = '';
                });

                resetLink.style.display = 'none';

                addToCartBtn.disabled = true;
                addToCartBtn.dataset.variationId = '';
                addToCartBtn.textContent = 'Seleccionar opciones';
            });
        }
    }

    // Find matching variation based on selected attributes
    function findMatchingVariation() {
        if (!currentVariations.length) return null;

        const selectedCount = Object.keys(selectedAttributes).length;
        const variationsContainer = productEl.querySelector('.quick-view-product__variations');
        const totalAttributes = variationsContainer ? variationsContainer.querySelectorAll('.quick-view-variation__select').length : 0;

        // Need all attributes selected
        if (selectedCount !== totalAttributes) return null;

        // Find exact match
        for (const variation of currentVariations) {
            let matches = true;

            for (const [attrName, attrValue] of Object.entries(selectedAttributes)) {
                const variationAttrValue = variation.attributes[attrName];

                // Empty string in variation means "any value"
                if (variationAttrValue !== '' && variationAttrValue !== attrValue) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                return variation;
            }
        }

        return null;
    }

    // Initialize add to cart button
    function initAddToCart() {
        const addToCartBtn = productEl.querySelector('.quick-view-add-to-cart');
        if (!addToCartBtn) return;

        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.dataset.productId;
            const variationId = this.dataset.variationId || '';
            const qtyInput = productEl.querySelector('.qty-input');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

            // Check if variable product needs variation selected
            const productType = productEl.querySelector('.quick-view-product')?.dataset.productType;
            if (productType === 'variable' && !variationId) {
                alert('Por favor selecciona las opciones del producto');
                return;
            }

            // Add loading state
            this.classList.add('loading');
            this.disabled = true;
            const originalText = this.textContent;
            this.textContent = 'Añadiendo...';

            const formData = new FormData();
            formData.append('action', 'quick_view_add_to_cart');
            formData.append('product_id', productId);
            formData.append('quantity', quantity);
            formData.append('nonce', quickViewData.nonce);

            // Add variation data if variable product
            if (variationId) {
                formData.append('variation_id', variationId);

                // Add selected attributes
                for (const [key, value] of Object.entries(selectedAttributes)) {
                    formData.append(`variation[${key}]`, value);
                }
            }

            fetch(quickViewData.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update cart count in header
                    const cartCounts = document.querySelectorAll('.cart-icon-count');
                    cartCounts.forEach(el => {
                        if (data.data.cart_count > 0) {
                            el.textContent = data.data.cart_count;
                            el.classList.remove('hidden');
                        }
                    });

                    // Show success message
                    this.textContent = '¡Añadido!';
                    this.classList.add('added');

                    // Close modal after delay
                    setTimeout(() => {
                        closeModal();
                    }, 1000);
                } else {
                    alert(data.data.message || 'Error al añadir al carrito');
                    this.textContent = originalText;
                    this.disabled = productType === 'variable' && !variationId;
                }
            })
            .catch(error => {
                console.error('Add to Cart Error:', error);
                alert('Error al añadir al carrito');
                this.textContent = originalText;
                this.disabled = productType === 'variable' && !variationId;
            })
            .finally(() => {
                this.classList.remove('loading');
            });
        });
    }

    // Event listeners
    document.addEventListener('click', function(e) {
        const quickViewBtn = e.target.closest('.quick-view-btn');
        if (quickViewBtn) {
            e.preventDefault();
            const productId = quickViewBtn.dataset.productId;
            if (productId) {
                openModal();
                loadProduct(productId);
            }
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', closeModal);

    // Close on button click
    closeBtn.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

})();
