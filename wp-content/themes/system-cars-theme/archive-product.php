<?php
/**
 * Template Name: WooCommerce Shop
 * Template for displaying the shop page.
 *
 * @package System_Cars_Theme
 */

get_header();

// Get min and max prices from products
global $wpdb;
$price_range = $wpdb->get_row("
    SELECT MIN(CAST(meta_value AS DECIMAL(10,2))) as min_price,
           MAX(CAST(meta_value AS DECIMAL(10,2))) as max_price
    FROM {$wpdb->postmeta}
    WHERE meta_key = '_price'
    AND meta_value != ''
");

$min_price = floor($price_range->min_price ?? 0);
$max_price = ceil($price_range->max_price ?? 1000);

// Get current filter values from URL
$current_min = isset($_GET['min_price']) ? floatval($_GET['min_price']) : $min_price;
$current_max = isset($_GET['max_price']) ? floatval($_GET['max_price']) : $max_price;

// Get page title
$page_title = woocommerce_page_title( false );
?>

<!-- Page Header -->
<section class="sc-page-header">
    <h1 class="sc-page-header__title"><?php echo esc_html( $page_title ); ?></h1>
    <nav class="sc-page-header__breadcrumbs">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Inicio', 'system-cars-theme' ); ?></a>
        <span class="breadcrumb-separator"></span>
        <span class="breadcrumb-current"><?php echo esc_html( $page_title ); ?></span>
    </nav>
</section>

<main id="main-content" role="main" class="container mx-auto py-8 px-4">
    <div class="shop-layout">
        <!-- Sidebar con filtros -->
        <aside class="shop-sidebar">
            <!-- Filtro por categorías (PRIMERO) -->
            <?php
            $product_categories = get_terms([
                'taxonomy'   => 'product_cat',
                'hide_empty' => true,
            ]);
            $current_category = get_queried_object();
            $is_category_page = is_product_category();

            if ( ! empty( $product_categories ) && ! is_wp_error( $product_categories ) ) :
            ?>
            <div class="shop-filter">
                <h3 class="shop-filter__title"><?php esc_html_e( 'Categorías', 'system-cars-theme' ); ?></h3>
                <ul class="shop-filter__categories" id="category-filter">
                    <!-- Opción "Todos los productos" -->
                    <li>
                        <a href="#"
                           class="category-filter-link <?php echo ! $is_category_page ? 'active' : ''; ?>"
                           data-category="all">
                            <?php esc_html_e( 'Todos los productos', 'system-cars-theme' ); ?>
                        </a>
                    </li>
                    <?php foreach ( $product_categories as $category ) : ?>
                        <li>
                            <a href="#"
                               class="category-filter-link <?php echo ( $is_category_page && $current_category->term_id === $category->term_id ) ? 'active' : ''; ?>"
                               data-category="<?php echo esc_attr( $category->slug ); ?>">
                                <?php echo esc_html( $category->name ); ?>
                                <span class="count">(<?php echo esc_html( $category->count ); ?>)</span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <!-- Filtro por precio (SEGUNDO) -->
            <div class="shop-filter">
                <h3 class="shop-filter__title"><?php esc_html_e( 'Filtrar por precio', 'system-cars-theme' ); ?></h3>

                <form method="get" class="shop-filter__form" id="price-filter-form">
                    <!-- Mantener otros parámetros de la URL -->
                    <?php foreach ( $_GET as $key => $value ) : ?>
                        <?php if ( ! in_array( $key, ['min_price', 'max_price'] ) ) : ?>
                            <input type="hidden" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $value ); ?>">
                        <?php endif; ?>
                    <?php endforeach; ?>

                    <div class="price-slider">
                        <div class="price-slider__track">
                            <div class="price-slider__range" id="price-range"></div>
                        </div>
                        <input type="range"
                               id="price-min"
                               name="min_price"
                               min="<?php echo esc_attr( $min_price ); ?>"
                               max="<?php echo esc_attr( $max_price ); ?>"
                               value="<?php echo esc_attr( $current_min ); ?>"
                               step="1">
                        <input type="range"
                               id="price-max"
                               name="max_price"
                               min="<?php echo esc_attr( $min_price ); ?>"
                               max="<?php echo esc_attr( $max_price ); ?>"
                               value="<?php echo esc_attr( $current_max ); ?>"
                               step="1">
                    </div>

                    <div class="price-inputs">
                        <div class="price-inputs__field">
                            <span class="price-inputs__currency">$</span>
                            <input type="number"
                                   id="price-min-input"
                                   value="<?php echo esc_attr( $current_min ); ?>"
                                   min="<?php echo esc_attr( $min_price ); ?>"
                                   max="<?php echo esc_attr( $max_price ); ?>">
                        </div>
                        <span class="price-inputs__separator">-</span>
                        <div class="price-inputs__field">
                            <span class="price-inputs__currency">$</span>
                            <input type="number"
                                   id="price-max-input"
                                   value="<?php echo esc_attr( $current_max ); ?>"
                                   min="<?php echo esc_attr( $min_price ); ?>"
                                   max="<?php echo esc_attr( $max_price ); ?>">
                        </div>
                    </div>

                    <button type="submit" class="shop-filter__btn">
                        <?php esc_html_e( 'Filtrar', 'system-cars-theme' ); ?>
                    </button>

                    <?php if ( isset($_GET['min_price']) || isset($_GET['max_price']) ) : ?>
                        <a href="<?php echo esc_url( get_permalink( wc_get_page_id('shop') ) ); ?>" class="shop-filter__clear">
                            <?php esc_html_e( 'Limpiar filtros', 'system-cars-theme' ); ?>
                        </a>
                    <?php endif; ?>
                </form>
            </div>
        </aside>

        <!-- Contenido principal: productos -->
        <div class="shop-content">
            <?php if ( woocommerce_product_loop() ) : ?>
                <div class="shop-content__header">
                    <?php do_action( 'woocommerce_before_shop_loop' ); ?>
                </div>

                <!-- Loading overlay -->
                <div class="shop-content__loading" id="shop-loading" style="display: none;">
                    <div class="shop-content__spinner"></div>
                </div>

                <ul class="products columns-3" id="products-grid">
                    <?php
                    while ( have_posts() ) :
                        the_post();
                        wc_get_template_part( 'content', 'product' );
                    endwhile;
                    ?>
                </ul>

                <div id="shop-pagination">
                    <?php do_action( 'woocommerce_after_shop_loop' ); ?>
                </div>
            <?php else : ?>
                <p class="text-center"><?php esc_html_e( 'No hay productos disponibles.', 'system-cars-theme' ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</main>

<script>
(function() {
    // ================================
    // Price Slider Functionality
    // ================================
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    const minInput = document.getElementById('price-min-input');
    const maxInput = document.getElementById('price-max-input');
    const range = document.getElementById('price-range');

    if (minSlider && maxSlider) {
        const minVal = parseInt(minSlider.min);
        const maxVal = parseInt(minSlider.max);

        function updateRange() {
            const minPercent = ((minSlider.value - minVal) / (maxVal - minVal)) * 100;
            const maxPercent = ((maxSlider.value - minVal) / (maxVal - minVal)) * 100;
            range.style.left = minPercent + '%';
            range.style.width = (maxPercent - minPercent) + '%';
        }

        function updateSliders() {
            let min = parseInt(minSlider.value);
            let max = parseInt(maxSlider.value);

            if (min > max) {
                [minSlider.value, maxSlider.value] = [max, min];
                [min, max] = [max, min];
            }

            minInput.value = min;
            maxInput.value = max;
            updateRange();
        }

        minSlider.addEventListener('input', updateSliders);
        maxSlider.addEventListener('input', updateSliders);

        minInput.addEventListener('change', function() {
            minSlider.value = this.value;
            updateSliders();
        });

        maxInput.addEventListener('change', function() {
            maxSlider.value = this.value;
            updateSliders();
        });

        // Initialize
        updateRange();
    }

    // ================================
    // AJAX Category Filter
    // ================================
    const categoryLinks = document.querySelectorAll('.category-filter-link');
    const productsGrid = document.getElementById('products-grid');
    const shopLoading = document.getElementById('shop-loading');
    const shopPagination = document.getElementById('shop-pagination');

    if (categoryLinks.length > 0 && productsGrid) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const category = this.getAttribute('data-category');

                // Update active state
                categoryLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Show loading
                if (shopLoading) {
                    shopLoading.style.display = 'flex';
                }
                productsGrid.style.opacity = '0.5';

                // AJAX request
                const formData = new FormData();
                formData.append('action', 'sc_filter_products_by_category');
                formData.append('category', category);
                formData.append('nonce', '<?php echo wp_create_nonce( 'sc_filter_products' ); ?>');

                fetch('<?php echo admin_url( 'admin-ajax.php' ); ?>', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update products
                        productsGrid.innerHTML = data.data.html;

                        // Update pagination
                        if (shopPagination) {
                            shopPagination.innerHTML = data.data.pagination;
                        }

                        // Re-initialize wishlist buttons for new products
                        if (typeof initWishlistButtons === 'function') {
                            initWishlistButtons();
                        }

                        // Trigger custom event for other scripts
                        document.dispatchEvent(new CustomEvent('productsUpdated'));
                    }
                })
                .catch(error => {
                    console.error('Error filtering products:', error);
                })
                .finally(() => {
                    // Hide loading
                    if (shopLoading) {
                        shopLoading.style.display = 'none';
                    }
                    productsGrid.style.opacity = '1';
                });
            });
        });
    }
})();
</script>

<?php get_footer(); ?>