<?php
/**
 * Template Name: WooCommerce Shop
 * Template for displaying the shop page.
 *
 * @package System_Cars_Theme
 */

get_header(); ?>

<main id="main-content" role="main" class="container mx-auto py-8">
    <header class="woocommerce-products-header mb-8">
        <?php if ( apply_filters( 'woocommerce_show_page_title', true ) ) : ?>
            <h1 class="woocommerce-products-header__title text-3xl font-bold text-center"><?php woocommerce_page_title(); ?></h1>
        <?php endif; ?>
    </header>

    <?php if ( woocommerce_product_loop() ) : ?>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php
            while ( have_posts() ) :
                the_post();
                wc_get_template_part( 'content', 'product' );
            endwhile;
            ?>
        </div>
        <?php
        do_action( 'woocommerce_after_shop_loop' );
        ?>
    <?php else : ?>
        <p class="text-center"><?php esc_html_e( 'No hay productos disponibles.', 'system-cars-theme' ); ?></p>
    <?php endif; ?>
</main>

<?php get_footer(); ?>