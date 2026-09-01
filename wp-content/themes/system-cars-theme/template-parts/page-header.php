<?php
/**
 * Internal page header: title + breadcrumbs
 *
 * Expects $args from get_template_part() with:
 * - title (string)
 * - breadcrumbs (array of [ label, url ])
 *
 * @package System_Cars_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$title       = isset( $args['title'] ) ? $args['title'] : '';
$breadcrumbs = isset( $args['breadcrumbs'] ) && is_array( $args['breadcrumbs'] ) ? $args['breadcrumbs'] : array();

if ( $title === '' ) {
	return;
}
?>
<section class="sc-page-header">
	<h1 class="sc-page-header__title"><?php echo esc_html( $title ); ?></h1>
	<?php if ( ! empty( $breadcrumbs ) ) : ?>
		<nav class="sc-page-header__breadcrumbs" aria-label="<?php esc_attr_e( 'Breadcrumb', 'system-cars-theme' ); ?>">
			<?php
			$count = count( $breadcrumbs );
			foreach ( $breadcrumbs as $index => $crumb ) :
				$label = isset( $crumb['label'] ) ? $crumb['label'] : '';
				$url   = isset( $crumb['url'] ) ? $crumb['url'] : '';
				if ( $label === '' ) {
					continue;
				}
				$is_last = ( $index === $count - 1 );
				if ( $index > 0 ) :
					?>
					<span class="breadcrumb-separator"></span>
					<?php
				endif;
				if ( ! $is_last && $url ) :
					?>
					<a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $label ); ?></a>
					<?php
				else :
					?>
					<span class="breadcrumb-current"><?php echo esc_html( $label ); ?></span>
					<?php
				endif;
			endforeach;
			?>
		</nav>
	<?php endif; ?>
</section>
