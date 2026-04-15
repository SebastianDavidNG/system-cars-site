<?php
/**
 * Custom product template for shop loop
 *
 * @see     https://woocommerce.com/document/template-structure/
 * @package System_Cars_Theme
 * @version 9.4.0
 */

defined( 'ABSPATH' ) || exit;

global $product;

// Check if the product is a valid WooCommerce product and ensure its visibility before proceeding.
if ( ! is_a( $product, WC_Product::class ) || ! $product->is_visible() ) {
	return;
}

// Check if product is new (created within last 30 days)
$product_created = get_the_date( 'U', $product->get_id() );
$thirty_days_ago = strtotime( '-30 days' );
$is_new_product  = $product_created > $thirty_days_ago;
?>

<li <?php wc_product_class( 'product-card group', $product ); ?>>
    <!-- Imagen del producto con overlay -->
    <div class="product-card__image relative overflow-hidden bg-gray-100">
        <a href="<?php the_permalink(); ?>" class="block">
            <?php
            if ( has_post_thumbnail() ) {
                the_post_thumbnail( 'woocommerce_thumbnail', [
                    'class' => 'w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110',
                    'alt'   => get_the_title(),
                ]);
            } else {
                echo wc_placeholder_img( 'woocommerce_thumbnail' );
            }
            ?>
        </a>

        <!-- Badges container (left side) -->
        <div class="product-card__badges absolute top-3 left-3 flex flex-col gap-2 z-10">
            <?php if ( $product->is_on_sale() ) : ?>
                <span class="product-card__badge product-card__badge--sale">
                    <?php
                    if ( $product->is_type( 'variable' ) ) {
                        echo esc_html__( 'Oferta', 'system-cars-theme' );
                    } else {
                        $regular = (float) $product->get_regular_price();
                        $sale    = (float) $product->get_sale_price();
                        if ( $regular > 0 ) {
                            $percent = round( ( ( $regular - $sale ) / $regular ) * 100 );
                            echo '-' . $percent . '%';
                        }
                    }
                    ?>
                </span>
            <?php endif; ?>

            <?php if ( $is_new_product ) : ?>
                <span class="product-card__badge product-card__badge--new">
                    <?php esc_html_e( 'Nuevo', 'system-cars-theme' ); ?>
                </span>
            <?php endif; ?>
        </div>

        <!-- Wishlist heart icon (right side) -->
        <button
            type="button"
            class="product-card__wishlist"
            data-product-id="<?php echo esc_attr( $product->get_id() ); ?>"
            data-product-name="<?php echo esc_attr( get_the_title() ); ?>"
            aria-label="<?php echo esc_attr( sprintf( __( 'Añadir %s a lista de deseos', 'system-cars-theme' ), get_the_title() ) ); ?>"
        >
            <i class="fa-heart"></i>
        </button>

        <!-- Overlay con botones (aparece en hover) -->
        <div class="product-card__overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="flex flex-col gap-2">
                <!-- Botón añadir al carrito -->
                <?php
                echo apply_filters(
                    'woocommerce_loop_add_to_cart_link',
                    sprintf(
                        '<a href="%s" data-quantity="1" class="%s product-card__btn" %s>%s</a>',
                        esc_url( $product->add_to_cart_url() ),
                        esc_attr( implode( ' ', array_filter( [
                            'button',
                            $product->is_purchasable() && $product->is_in_stock() ? 'add_to_cart_button' : '',
                            $product->supports( 'ajax_add_to_cart' ) && $product->is_purchasable() && $product->is_in_stock() ? 'ajax_add_to_cart' : '',
                        ] ) ) ),
                        wc_implode_html_attributes( [
                            'data-product_id'  => $product->get_id(),
                            'data-product_sku' => $product->get_sku(),
                            'aria-label'       => $product->add_to_cart_description(),
                            'rel'              => 'nofollow',
                        ] ),
                        esc_html( $product->add_to_cart_text() )
                    ),
                    $product
                );
                ?>

                <!-- Botón Vista Rápida -->
                <button
                    type="button"
                    class="product-card__btn quick-view-btn"
                    data-product-id="<?php echo esc_attr( $product->get_id() ); ?>"
                    aria-label="<?php echo esc_attr( sprintf( __( 'Vista rápida de %s', 'system-cars-theme' ), get_the_title() ) ); ?>"
                >
                    <?php esc_html_e( 'Vista Rápida', 'system-cars-theme' ); ?>
                </button>
            </div>
        </div>
    </div>

    <!-- Información del producto -->
    <div class="product-card__info p-4 text-center">
        <!-- Categoría -->
        <?php
        $terms = get_the_terms( $product->get_id(), 'product_cat' );
        if ( $terms && ! is_wp_error( $terms ) ) :
            $term = reset( $terms );
        ?>
            <span class="product-card__category text-xs text-gray-500 uppercase tracking-wider">
                <?php echo esc_html( $term->name ); ?>
            </span>
        <?php endif; ?>

        <!-- Título -->
        <h3 class="product-card__title mt-2">
            <a href="<?php the_permalink(); ?>" class="text-secondary hover:text-primary transition-colors duration-300 font-semibold text-lg">
                <?php the_title(); ?>
            </a>
        </h3>

        <!-- Precio -->
        <div class="product-card__price mt-2 text-lg font-bold text-secondary">
            <?php echo $product->get_price_html(); ?>
        </div>
    </div>
</li>
