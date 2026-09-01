<?php
/**
 * Fallback index template
 *
 * @package System_Cars_Theme
 */

get_header();

$is_wc_page = function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() );
$main_class = $is_wc_page
	? 'container mx-auto py-8 px-4'
	: 'sc-page-main';
?>

<main id="main-content" role="main" class="<?php echo esc_attr( $main_class ); ?>">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<?php the_content(); ?>
		<?php endwhile; ?>
	<?php endif; ?>
</main>

<?php
get_footer();
