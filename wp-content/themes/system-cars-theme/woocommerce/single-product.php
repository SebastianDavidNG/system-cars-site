<?php
/**
 * Single Product Template
 *
 * @package System_Cars_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();

// Start the loop to set up post data
while ( have_posts() ) :
    the_post();

    global $product;

    // Ensure we have a valid product object
    if ( ! is_a( $product, 'WC_Product' ) ) {
        $product = wc_get_product( get_the_ID() );
    }

    if ( ! $product ) {
        return;
    }

    // Get product categories for breadcrumb
    $terms = get_the_terms( get_the_ID(), 'product_cat' );
    $category_name = '';
    $category_link = '';
    if ( $terms && ! is_wp_error( $terms ) ) {
        $term = reset( $terms );
        $category_name = $term->name;
        $category_link = get_term_link( $term );
    }

    // Get all images for gallery
    $main_image_id = $product->get_image_id();
    $gallery_ids = $product->get_gallery_image_ids();
    $all_images = array();

    if ( $main_image_id ) {
        $all_images[] = $main_image_id;
    }
    if ( ! empty( $gallery_ids ) ) {
        $all_images = array_merge( $all_images, $gallery_ids );
    }
?>

<!-- Page Header -->
<section class="sc-page-header">
    <h1 class="sc-page-header__title"><?php the_title(); ?></h1>
    <nav class="sc-page-header__breadcrumbs">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Inicio', 'system-cars-theme' ); ?></a>
        <span class="breadcrumb-separator"></span>
        <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>"><?php esc_html_e( 'Tienda', 'system-cars-theme' ); ?></a>
        <?php if ( $category_name ) : ?>
            <span class="breadcrumb-separator"></span>
            <a href="<?php echo esc_url( $category_link ); ?>"><?php echo esc_html( $category_name ); ?></a>
        <?php endif; ?>
        <span class="breadcrumb-separator"></span>
        <span class="breadcrumb-current"><?php the_title(); ?></span>
    </nav>
</section>

<main id="main-content" role="main" class="sc-single-product">
    <div class="container mx-auto px-4 py-8 lg:py-12">
            <div class="sc-single-product__main">
                <!-- Product Gallery (Simple - No Swiper) -->
                <div class="sc-single-product__gallery">
                    <div class="sc-product-gallery" id="product-gallery" data-total="<?php echo count( $all_images ); ?>">
                        <?php if ( ! empty( $all_images ) ) : ?>
                            <!-- Main Image Container -->
                            <div class="sc-product-gallery__main">
                                <div class="sc-product-gallery__viewer" id="gallery-viewer">
                                    <?php
                                    $first_image_id = $all_images[0];
                                    $first_large_url = wp_get_attachment_image_url( $first_image_id, 'large' );
                                    $first_full_url = wp_get_attachment_image_url( $first_image_id, 'full' );
                                    ?>
                                    <img src="<?php echo esc_url( $first_large_url ); ?>"
                                         alt="<?php echo esc_attr( get_the_title() ); ?>"
                                         class="sc-product-gallery__image"
                                         id="main-gallery-image"
                                         data-full-url="<?php echo esc_url( $first_full_url ); ?>">
                                </div>

                                <?php if ( count( $all_images ) > 1 ) : ?>
                                    <!-- Navigation Arrows -->
                                    <button type="button" class="sc-gallery-nav sc-gallery-nav--prev" id="gallery-prev" aria-label="<?php esc_attr_e( 'Anterior', 'system-cars-theme' ); ?>">
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <button type="button" class="sc-gallery-nav sc-gallery-nav--next" id="gallery-next" aria-label="<?php esc_attr_e( 'Siguiente', 'system-cars-theme' ); ?>">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </button>
                                <?php endif; ?>

                                <!-- Zoom Button -->
                                <button type="button" class="sc-product-gallery__zoom-btn" id="gallery-zoom" aria-label="<?php esc_attr_e( 'Ampliar imagen', 'system-cars-theme' ); ?>">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </button>
                            </div>

                            <!-- Thumbnails -->
                            <?php if ( count( $all_images ) > 1 ) : ?>
                                <div class="sc-product-gallery__thumbs" id="gallery-thumbs">
                                    <?php foreach ( $all_images as $index => $image_id ) : ?>
                                        <button type="button"
                                                class="sc-product-gallery__thumb <?php echo $index === 0 ? 'is-active' : ''; ?>"
                                                data-index="<?php echo esc_attr( $index ); ?>"
                                                data-large-url="<?php echo esc_url( wp_get_attachment_image_url( $image_id, 'large' ) ); ?>"
                                                data-full-url="<?php echo esc_url( wp_get_attachment_image_url( $image_id, 'full' ) ); ?>">
                                            <?php echo wp_get_attachment_image( $image_id, 'thumbnail' ); ?>
                                        </button>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        <?php else : ?>
                            <div class="sc-product-gallery__main">
                                <?php echo wc_placeholder_img( 'large' ); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="sc-single-product__info">
                    <!-- Category -->
                    <?php if ( $category_name ) : ?>
                        <a href="<?php echo esc_url( $category_link ); ?>" class="sc-single-product__category">
                            <?php echo esc_html( $category_name ); ?>
                        </a>
                    <?php endif; ?>

                    <!-- Title -->
                    <h1 class="sc-single-product__title"><?php the_title(); ?></h1>

                    <!-- Price -->
                    <div class="sc-single-product__price">
                        <?php echo $product->get_price_html(); ?>
                    </div>

                    <!-- Short Description -->
                    <?php if ( $product->get_short_description() ) : ?>
                        <div class="sc-single-product__short-description">
                            <?php echo wp_kses_post( $product->get_short_description() ); ?>
                        </div>
                    <?php endif; ?>

                    <!-- Add to Cart Form -->
                    <div class="sc-single-product__add-to-cart">
                        <?php if ( $product->is_type( 'variable' ) ) : ?>
                            <!-- Variable Product: Use WooCommerce's variation handling -->
                            <?php woocommerce_template_single_add_to_cart(); ?>
                        <?php elseif ( $product->is_purchasable() && $product->is_in_stock() ) : ?>
                            <!-- Simple Product: Custom form with +/- buttons -->
                            <form class="cart sc-cart-form" action="<?php echo esc_url( apply_filters( 'woocommerce_add_to_cart_form_action', $product->get_permalink() ) ); ?>" method="post" enctype="multipart/form-data">
                                <?php do_action( 'woocommerce_before_add_to_cart_button' ); ?>

                                <!-- Custom Quantity with +/- buttons -->
                                <div class="sc-quantity">
                                    <button type="button" class="sc-quantity__btn sc-quantity__btn--minus" aria-label="<?php esc_attr_e( 'Reducir cantidad', 'system-cars-theme' ); ?>">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <input type="number"
                                           id="quantity_<?php echo esc_attr( $product->get_id() ); ?>"
                                           class="sc-quantity__input"
                                           name="quantity"
                                           value="1"
                                           min="1"
                                           max="<?php echo esc_attr( $product->get_max_purchase_quantity() > 0 ? $product->get_max_purchase_quantity() : '' ); ?>"
                                           step="1"
                                           inputmode="numeric"
                                           autocomplete="off">
                                    <button type="button" class="sc-quantity__btn sc-quantity__btn--plus" aria-label="<?php esc_attr_e( 'Aumentar cantidad', 'system-cars-theme' ); ?>">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <button type="submit" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>" class="sc-add-to-cart-btn">
                                    <span><?php echo esc_html( $product->single_add_to_cart_text() ); ?></span>
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>

                                <?php do_action( 'woocommerce_after_add_to_cart_button' ); ?>
                            </form>
                        <?php else : ?>
                            <?php woocommerce_template_single_add_to_cart(); ?>
                        <?php endif; ?>
                    </div>

                    <!-- SKU & Categories -->
                    <div class="sc-single-product__meta">
                        <?php if ( $product->get_sku() ) : ?>
                            <div class="sc-single-product__meta-item">
                                <span class="sc-single-product__meta-label"><?php esc_html_e( 'SKU:', 'system-cars-theme' ); ?></span>
                                <span class="sc-single-product__meta-value"><?php echo esc_html( $product->get_sku() ); ?></span>
                            </div>
                        <?php endif; ?>

                        <?php
                        $categories = wc_get_product_category_list( $product->get_id(), ', ' );
                        if ( $categories ) :
                        ?>
                            <div class="sc-single-product__meta-item">
                                <span class="sc-single-product__meta-label"><?php esc_html_e( 'Categoría:', 'system-cars-theme' ); ?></span>
                                <span class="sc-single-product__meta-value"><?php echo wp_kses_post( $categories ); ?></span>
                            </div>
                        <?php endif; ?>

                        <?php
                        $tags = wc_get_product_tag_list( $product->get_id(), ', ' );
                        if ( $tags ) :
                        ?>
                            <div class="sc-single-product__meta-item">
                                <span class="sc-single-product__meta-label"><?php esc_html_e( 'Etiquetas:', 'system-cars-theme' ); ?></span>
                                <span class="sc-single-product__meta-value"><?php echo wp_kses_post( $tags ); ?></span>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Wishlist Button -->
                    <button
                        type="button"
                        class="sc-single-product__wishlist"
                        data-product-id="<?php echo esc_attr( $product->get_id() ); ?>"
                        data-product-name="<?php echo esc_attr( get_the_title() ); ?>"
                        aria-label="<?php echo esc_attr( sprintf( __( 'Añadir %s a lista de deseos', 'system-cars-theme' ), get_the_title() ) ); ?>"
                    >
                        <i class="fa-heart"></i>
                        <span><?php esc_html_e( 'Añadir a lista de deseos', 'system-cars-theme' ); ?></span>
                    </button>
                </div>
            </div>

            <!-- Product Tabs -->
            <div class="sc-single-product__tabs">
                <?php woocommerce_output_product_data_tabs(); ?>
            </div>

            <!-- Related Products -->
            <?php woocommerce_output_related_products(); ?>

    </div>
</main>

<!-- Lightbox Modal -->
<div id="sc-lightbox" class="sc-lightbox" aria-hidden="true">
    <div class="sc-lightbox__overlay"></div>
    <div class="sc-lightbox__container">
        <button type="button" class="sc-lightbox__close" aria-label="<?php esc_attr_e( 'Cerrar', 'system-cars-theme' ); ?>"></button>
        <button type="button" class="sc-lightbox__nav sc-lightbox__nav--prev" aria-label="<?php esc_attr_e( 'Anterior', 'system-cars-theme' ); ?>">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button type="button" class="sc-lightbox__nav sc-lightbox__nav--next" aria-label="<?php esc_attr_e( 'Siguiente', 'system-cars-theme' ); ?>">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
        <div class="sc-lightbox__content">
            <img src="" alt="" class="sc-lightbox__image">
        </div>
        <div class="sc-lightbox__counter">
            <span class="sc-lightbox__current">1</span> / <span class="sc-lightbox__total"><?php echo count( $all_images ); ?></span>
        </div>
    </div>
</div>

<script>
(function() {
    'use strict';

    // ================================
    // Simple Gallery (No Swiper)
    // ================================
    const gallery = document.getElementById('product-gallery');
    const mainImage = document.getElementById('main-gallery-image');
    const thumbsContainer = document.getElementById('gallery-thumbs');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const zoomBtn = document.getElementById('gallery-zoom');

    let currentIndex = 0;
    let galleryData = [];
    let isAnimating = false;

    // Build gallery data from thumbnails
    if (thumbsContainer) {
        const thumbs = thumbsContainer.querySelectorAll('.sc-product-gallery__thumb');
        thumbs.forEach((thumb, index) => {
            galleryData.push({
                large: thumb.getAttribute('data-large-url'),
                full: thumb.getAttribute('data-full-url')
            });
        });
    } else if (mainImage) {
        // Single image
        galleryData.push({
            large: mainImage.src,
            full: mainImage.getAttribute('data-full-url')
        });
    }

    function goToImage(index, skipAnimation = false) {
        // Prevent multiple animations
        if (isAnimating) return;

        // Normalize index
        if (index < 0) index = galleryData.length - 1;
        if (index >= galleryData.length) index = 0;

        // Don't animate if same image
        if (index === currentIndex && !skipAnimation) return;

        currentIndex = index;

        // Update active thumbnail immediately
        if (thumbsContainer) {
            const thumbs = thumbsContainer.querySelectorAll('.sc-product-gallery__thumb');
            thumbs.forEach((thumb, i) => {
                thumb.classList.toggle('is-active', i === index);
            });
        }

        // Smooth fade transition for main image
        if (mainImage) {
            isAnimating = true;

            // Step 1: Fade out
            mainImage.style.opacity = '0';
            mainImage.style.transform = 'scale(0.98)';

            // Step 2: After fade out, change image
            setTimeout(() => {
                // Preload new image
                const newImg = new Image();
                newImg.onload = function() {
                    mainImage.src = galleryData[index].large;
                    mainImage.setAttribute('data-full-url', galleryData[index].full);

                    // Step 3: Fade in
                    requestAnimationFrame(() => {
                        mainImage.style.opacity = '1';
                        mainImage.style.transform = 'scale(1)';

                        setTimeout(() => {
                            isAnimating = false;
                        }, 300);
                    });
                };
                newImg.onerror = function() {
                    // If preload fails, just change the image
                    mainImage.src = galleryData[index].large;
                    mainImage.setAttribute('data-full-url', galleryData[index].full);
                    mainImage.style.opacity = '1';
                    mainImage.style.transform = 'scale(1)';
                    isAnimating = false;
                };
                newImg.src = galleryData[index].large;
            }, 250); // Wait for fade out
        }
    }

    // Thumbnail clicks
    if (thumbsContainer) {
        const thumbs = thumbsContainer.querySelectorAll('.sc-product-gallery__thumb');
        thumbs.forEach((thumb) => {
            thumb.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'), 10);
                goToImage(index);
            });
        });
    }

    // Navigation arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToImage(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToImage(currentIndex + 1);
        });
    }

    // ================================
    // Lightbox
    // ================================
    const lightbox = document.getElementById('sc-lightbox');
    const lightboxImage = lightbox?.querySelector('.sc-lightbox__image');
    const lightboxClose = lightbox?.querySelector('.sc-lightbox__close');
    const lightboxOverlay = lightbox?.querySelector('.sc-lightbox__overlay');
    const lightboxPrev = lightbox?.querySelector('.sc-lightbox__nav--prev');
    const lightboxNext = lightbox?.querySelector('.sc-lightbox__nav--next');
    const lightboxCurrent = lightbox?.querySelector('.sc-lightbox__current');

    function openLightbox(index) {
        if (!lightbox || !galleryData.length) return;

        currentIndex = index;
        lightboxImage.src = galleryData[index].full;
        if (lightboxCurrent) lightboxCurrent.textContent = index + 1;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Hide nav buttons if only one image
        if (galleryData.length <= 1) {
            if (lightboxPrev) lightboxPrev.style.display = 'none';
            if (lightboxNext) lightboxNext.style.display = 'none';
        }
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        let newIndex = currentIndex + direction;

        // Loop around
        if (newIndex < 0) newIndex = galleryData.length - 1;
        if (newIndex >= galleryData.length) newIndex = 0;

        currentIndex = newIndex;
        lightboxImage.src = galleryData[newIndex].full;
        if (lightboxCurrent) lightboxCurrent.textContent = newIndex + 1;

        // Also update main gallery
        goToImage(newIndex);
    }

    // Zoom button opens lightbox
    if (zoomBtn) {
        zoomBtn.addEventListener('click', function() {
            openLightbox(currentIndex);
        });
    }

    // Lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox?.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });

    // ================================
    // Quantity Buttons
    // ================================
    const quantityContainer = document.querySelector('.sc-quantity');
    if (quantityContainer) {
        const minusBtn = quantityContainer.querySelector('.sc-quantity__btn--minus');
        const plusBtn = quantityContainer.querySelector('.sc-quantity__btn--plus');
        const input = quantityContainer.querySelector('.sc-quantity__input');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                const min = parseInt(input.min) || 1;
                if (value > min) {
                    input.value = value - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });

            plusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                const max = parseInt(input.max) || 9999;
                if (!input.max || value < max) {
                    input.value = value + 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }
    }

    // ================================
    // Wishlist
    // ================================
    const wishlistBtn = document.querySelector('.sc-single-product__wishlist');
    if (wishlistBtn) {
        const STORAGE_KEY = 'sc_wishlist';
        const productId = parseInt(wishlistBtn.getAttribute('data-product-id'), 10);

        function getWishlist() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                return [];
            }
        }

        function isInWishlist(id) {
            return getWishlist().includes(id);
        }

        function toggleWishlist(id) {
            let wishlist = getWishlist();
            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(i => i !== id);
            } else {
                wishlist.push(id);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
            return wishlist.includes(id);
        }

        // Set initial state
        if (isInWishlist(productId)) {
            wishlistBtn.classList.add('is-active');
        }

        // Click handler
        wishlistBtn.addEventListener('click', function() {
            const isNowActive = toggleWishlist(productId);
            this.classList.toggle('is-active', isNowActive);

            // Animation
            this.classList.add('is-animating');
            setTimeout(() => {
                this.classList.remove('is-animating');
            }, 400);
        });
    }
})();
</script>

<?php endwhile; // End of the main product loop ?>

<?php get_footer(); ?>
