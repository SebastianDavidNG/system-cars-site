<?php
/**
 * 404 template
 *
 * @package System_Cars_Theme
 */

get_header();
?>

<main id="main-content" role="main" class="container mx-auto py-12 px-4 text-center">
	<p class="text-lg text-gray-600 mb-8">
		<?php esc_html_e( 'Lo sentimos, la página que buscas no existe o fue movida.', 'system-cars-theme' ); ?>
	</p>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="inline-block bg-primary text-white px-8 py-3 font-bold uppercase hover:bg-secondary transition-colors duration-300">
		<?php esc_html_e( 'Volver al inicio', 'system-cars-theme' ); ?>
	</a>
</main>

<?php
get_footer();
