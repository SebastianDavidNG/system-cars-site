<?php get_header(); ?>

<?php
// Check if this is a WooCommerce page (cart, checkout, my-account)
$is_wc_page = function_exists('is_cart') && (is_cart() || is_checkout() || is_account_page());

if ($is_wc_page) :
    // Get page title
    $page_title = get_the_title();
?>
<!-- Page Header for WooCommerce pages -->
<section class="sc-page-header">
    <h1 class="sc-page-header__title"><?php echo esc_html( $page_title ); ?></h1>
    <nav class="sc-page-header__breadcrumbs">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Inicio', 'system-cars-theme' ); ?></a>
        <span class="breadcrumb-separator"></span>
        <?php if (function_exists('wc_get_page_id') && !is_cart()) : ?>
            <a href="<?php echo esc_url( get_permalink( wc_get_page_id('shop') ) ); ?>"><?php esc_html_e( 'Tienda', 'system-cars-theme' ); ?></a>
            <span class="breadcrumb-separator"></span>
        <?php endif; ?>
        <span class="breadcrumb-current"><?php echo esc_html( $page_title ); ?></span>
    </nav>
</section>
<?php endif; ?>

<main<?php echo $is_wc_page ? ' class="container mx-auto py-8 px-4"' : ''; ?>>
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <?php if (!$is_wc_page) : ?>
            <h1><?php the_title(); ?></h1>
        <?php endif; ?>
        <?php the_content(); ?>
    <?php endwhile; endif; ?>
</main>
<?php get_footer(); ?>