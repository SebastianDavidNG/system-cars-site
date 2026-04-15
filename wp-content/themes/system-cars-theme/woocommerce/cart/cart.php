<?php
/**
 * Cart Page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/cart.php.
 *
 * @see     https://woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 10.1.0
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_cart' ); ?>

<div class="sc-cart">
    <form class="woocommerce-cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
        <?php do_action( 'woocommerce_before_cart_table' ); ?>

        <div class="sc-cart__layout">
            <!-- Cart Items Section -->
            <div class="sc-cart__items">
                <div class="sc-cart__header">
                    <div class="sc-cart__header-product"><?php esc_html_e( 'Producto', 'system-cars-theme' ); ?></div>
                    <div class="sc-cart__header-price"><?php esc_html_e( 'Precio', 'system-cars-theme' ); ?></div>
                    <div class="sc-cart__header-quantity"><?php esc_html_e( 'Cantidad', 'system-cars-theme' ); ?></div>
                    <div class="sc-cart__header-subtotal"><?php esc_html_e( 'Subtotal', 'system-cars-theme' ); ?></div>
                    <div class="sc-cart__header-remove"></div>
                </div>

                <?php do_action( 'woocommerce_before_cart_contents' ); ?>

                <?php
                foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
                    $_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
                    $product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

                    if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
                        $product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
                        ?>
                        <div class="sc-cart__item woocommerce-cart-form__cart-item <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">

                            <!-- Product Image & Name -->
                            <div class="sc-cart__item-product">
                                <div class="sc-cart__item-image">
                                    <?php
                                    $thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );

                                    if ( ! $product_permalink ) {
                                        echo $thumbnail;
                                    } else {
                                        printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail );
                                    }
                                    ?>
                                </div>
                                <div class="sc-cart__item-details">
                                    <h4 class="sc-cart__item-name">
                                        <?php
                                        if ( ! $product_permalink ) {
                                            echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;' );
                                        } else {
                                            echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', sprintf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $_product->get_name() ), $cart_item, $cart_item_key ) );
                                        }

                                        do_action( 'woocommerce_after_cart_item_name', $cart_item, $cart_item_key );

                                        // Meta data.
                                        echo wc_get_formatted_cart_item_data( $cart_item );

                                        // Backorder notification.
                                        if ( $_product->backorders_require_notification() && $_product->is_on_backorder( $cart_item['quantity'] ) ) {
                                            echo wp_kses_post( apply_filters( 'woocommerce_cart_item_backorder_notification', '<p class="backorder_notification">' . esc_html__( 'Disponible en reserva', 'system-cars-theme' ) . '</p>', $product_id ) );
                                        }
                                        ?>
                                    </h4>
                                    <?php
                                    // Show category
                                    $terms = get_the_terms( $product_id, 'product_cat' );
                                    if ( $terms && ! is_wp_error( $terms ) ) {
                                        $category = $terms[0];
                                        echo '<span class="sc-cart__item-category">' . esc_html( $category->name ) . '</span>';
                                    }
                                    ?>
                                </div>
                            </div>

                            <!-- Price -->
                            <div class="sc-cart__item-price" data-title="<?php esc_attr_e( 'Precio', 'system-cars-theme' ); ?>">
                                <?php
                                    echo apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key );
                                ?>
                            </div>

                            <!-- Quantity -->
                            <div class="sc-cart__item-quantity" data-title="<?php esc_attr_e( 'Cantidad', 'system-cars-theme' ); ?>">
                                <?php
                                if ( $_product->is_sold_individually() ) {
                                    $min_quantity = 1;
                                    $max_quantity = 1;
                                } else {
                                    $min_quantity = 0;
                                    $max_quantity = $_product->get_max_purchase_quantity();
                                }

                                $product_quantity = woocommerce_quantity_input(
                                    array(
                                        'input_name'   => "cart[{$cart_item_key}][qty]",
                                        'input_value'  => $cart_item['quantity'],
                                        'max_value'    => $max_quantity,
                                        'min_value'    => $min_quantity,
                                        'product_name' => $_product->get_name(),
                                    ),
                                    $_product,
                                    false
                                );

                                echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item );
                                ?>
                            </div>

                            <!-- Subtotal -->
                            <div class="sc-cart__item-subtotal" data-title="<?php esc_attr_e( 'Subtotal', 'system-cars-theme' ); ?>">
                                <?php
                                    echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key );
                                ?>
                            </div>

                            <!-- Remove -->
                            <div class="sc-cart__item-remove">
                                <?php
                                    echo apply_filters(
                                        'woocommerce_cart_item_remove_link',
                                        sprintf(
                                            '<a href="%s" class="sc-cart__remove-btn" aria-label="%s" data-product_id="%s" data-product_sku="%s">&times;</a>',
                                            esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
                                            esc_attr( sprintf( __( 'Eliminar %s del carrito', 'system-cars-theme' ), wp_strip_all_tags( $_product->get_name() ) ) ),
                                            esc_attr( $product_id ),
                                            esc_attr( $_product->get_sku() )
                                        ),
                                        $cart_item_key
                                    );
                                ?>
                            </div>
                        </div>
                        <?php
                    }
                }
                ?>

                <?php do_action( 'woocommerce_cart_contents' ); ?>

                <!-- Cart Actions -->
                <div class="sc-cart__actions">
                    <div class="sc-cart__coupon">
                        <?php if ( wc_coupons_enabled() ) { ?>
                            <div class="coupon">
                                <label for="coupon_code" class="screen-reader-text"><?php esc_html_e( 'Cupón:', 'system-cars-theme' ); ?></label>
                                <input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="<?php esc_attr_e( 'Código de cupón', 'system-cars-theme' ); ?>" />
                                <button type="submit" class="button<?php echo esc_attr( wc_wp_theme_get_element_class_name( 'button' ) ? ' ' . wc_wp_theme_get_element_class_name( 'button' ) : '' ); ?>" name="apply_coupon" value="<?php esc_attr_e( 'Aplicar cupón', 'system-cars-theme' ); ?>"><?php esc_html_e( 'Aplicar', 'system-cars-theme' ); ?></button>
                                <?php do_action( 'woocommerce_cart_coupon' ); ?>
                            </div>
                        <?php } ?>
                    </div>

                    <button type="submit" class="button<?php echo esc_attr( wc_wp_theme_get_element_class_name( 'button' ) ? ' ' . wc_wp_theme_get_element_class_name( 'button' ) : '' ); ?> sc-cart__update-btn" name="update_cart" value="<?php esc_attr_e( 'Actualizar carrito', 'system-cars-theme' ); ?>"><?php esc_html_e( 'Actualizar carrito', 'system-cars-theme' ); ?></button>

                    <?php do_action( 'woocommerce_cart_actions' ); ?>

                    <?php wp_nonce_field( 'woocommerce-cart', 'woocommerce-cart-nonce' ); ?>
                </div>

                <?php do_action( 'woocommerce_after_cart_contents' ); ?>
            </div>

            <!-- Cart Totals Section -->
            <div class="sc-cart__totals">
                <?php do_action( 'woocommerce_before_cart_collaterals' ); ?>

                <div class="cart-collaterals">
                    <?php
                        /**
                         * Cart collaterals hook.
                         *
                         * @hooked woocommerce_cross_sell_display
                         * @hooked woocommerce_cart_totals - 10
                         */
                        do_action( 'woocommerce_cart_collaterals' );
                    ?>
                </div>
            </div>
        </div>

        <?php do_action( 'woocommerce_after_cart_table' ); ?>
    </form>

    <?php do_action( 'woocommerce_after_cart' ); ?>
</div>

<script>
(function() {
    'use strict';

    // Add +/- buttons to quantity inputs
    function initCartQuantity() {
        const quantityContainers = document.querySelectorAll('.sc-cart__item-quantity .quantity');

        quantityContainers.forEach(function(container) {
            // Skip if already processed
            if (container.classList.contains('sc-cart-qty-processed')) {
                return;
            }

            const input = container.querySelector('input.qty');
            if (!input) return;

            // Mark as processed
            container.classList.add('sc-cart-qty-processed');

            // Add wrapper class to existing container
            container.classList.add('sc-cart-qty');

            // Get min/max values
            const min = parseInt(input.getAttribute('min')) || 0;
            const max = parseInt(input.getAttribute('max')) || 9999;

            // Create minus button
            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.className = 'sc-cart-qty__btn sc-cart-qty__btn--minus';
            minusBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
            minusBtn.setAttribute('aria-label', 'Disminuir cantidad');

            // Create plus button
            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.className = 'sc-cart-qty__btn sc-cart-qty__btn--plus';
            plusBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
            plusBtn.setAttribute('aria-label', 'Aumentar cantidad');

            // Insert buttons before and after input
            container.insertBefore(minusBtn, input);
            container.appendChild(plusBtn);

            // Add class to input
            input.classList.add('sc-cart-qty__input');

            // Minus button click
            minusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                if (value > min) {
                    input.value = value - 1;
                    // Trigger change event for WooCommerce
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            // Plus button click
            plusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 0;
                if (value < max) {
                    input.value = value + 1;
                    // Trigger change event for WooCommerce
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartQuantity);
    } else {
        initCartQuantity();
    }

    // Re-initialize after cart updates (AJAX)
    jQuery(document.body).on('updated_cart_totals', function() {
        initCartQuantity();
    });
})();
</script>
