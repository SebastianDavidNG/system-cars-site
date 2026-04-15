<?php

function sc_theme_setup() {
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_editor_style('dist/css/main-style.css');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('custom-logo', [
        'height'      => 100,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    add_theme_support('block-templates');

    register_nav_menus([
        'primary' => __('Menú Principal', 'system-cars-theme'),
        'footer'  => __('Menú Footer',    'system-cars-theme'),
    ]);
}
add_action('after_setup_theme', 'sc_theme_setup');


// Add "active" class to menu items
function sc_menu_active_class($classes, $item) {
    if ( in_array('current-menu-item', $classes, true) || in_array('current_page_item', $classes, true) ) {
        $classes[] = 'active';
    }
    return $classes;
}
add_filter('nav_menu_css_class', 'sc_menu_active_class', 10, 2);


add_filter('block_categories_all', 'sc_add_block_category', 10, 2);
function sc_add_block_category( $categories, $editor_context ) {
    if ( ! empty( $editor_context->post ) ) {
        $categories[] = [
            'slug'  => 'system-cars',
            'title' => __( 'System Cars Blocks', 'system-cars-theme' ),
            'icon'  => 'dashicons-car',
        ];
    }
    return $categories;
}

function sc_register_blocks_from_metadata() {
    $blocks = [
        'car-block',
        'slider-block',
        'service-card',
        'styled-button-block',
        'info-image-block',
        'parallax-columns-block',
        'video-modal-block',
    ];

    foreach ( $blocks as $block ) {
        $path = get_template_directory() . "/blocks/{$block}";
        if ( ! file_exists( "{$path}/block.json" ) ) continue;
        register_block_type( $path );
    }
}
add_action('init', 'sc_register_blocks_from_metadata');

function sc_enqueue_frontend_assets() {
    // Google Fonts
    wp_enqueue_style(
        'systemcars-roboto-condensed',
        'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@200;300;400;500;700&display=swap',
        [], null
    );

    // Font Awesome
    wp_enqueue_style(
        'fa-cdn',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
        [], '6.6.0'
    );

    // CSS principal (Tailwind)
    $file = get_template_directory() . '/dist/css/style.css';
    if ( file_exists( $file ) ) {
        wp_enqueue_style(
            'systemcars-style',
            get_template_directory_uri() . '/dist/css/style.css',
            [],
            filemtime( $file )
        );
    }

    // Main CSS (product cards, navigation, etc.)
    $main_css = get_template_directory() . '/dist/css/main-style.css';
    if ( file_exists( $main_css ) ) {
        wp_enqueue_style(
            'systemcars-main',
            get_template_directory_uri() . '/dist/css/main-style.css',
            [],
            filemtime( $main_css )
        );
    }

    // Swiper en frontend (CDN) - necesario para slider-block
    wp_enqueue_style(
        'swiper-css',
        'https://unpkg.com/swiper/swiper-bundle.min.css',
        [], '10.3.1'
    );
    wp_enqueue_script(
        'swiper-js',
        'https://unpkg.com/swiper/swiper-bundle.min.js',
        [], '10.3.1', true
    );

    // slider-frontend.js se carga manualmente porque necesita Swiper como dependencia
    // (block.json no permite especificar dependencias)
    $slider_frontend = get_template_directory() . '/dist/slider-frontend.js';
    if ( file_exists( $slider_frontend ) ) {
        wp_enqueue_script(
            'system-cars-slider-frontend',
            get_template_directory_uri() . '/dist/slider-frontend.js',
            [ 'swiper-js' ],
            filemtime( $slider_frontend ),
            true
        );
        wp_script_add_data( 'system-cars-slider-frontend', 'type', 'module' );
    }

    // NOTA: parallax-columns-frontend.js se carga automáticamente desde block.json

    // video-modal-frontend.js - siempre cargar para asegurar que funcione
    $video_modal_frontend = get_template_directory() . '/dist/video-modal-frontend.js';
    if ( file_exists( $video_modal_frontend ) ) {
        wp_enqueue_script(
            'system-cars-video-modal-frontend',
            get_template_directory_uri() . '/dist/video-modal-frontend.js',
            [],
            filemtime( $video_modal_frontend ),
            true
        );
    }

    // Wishlist functionality - cargar en páginas de tienda y productos
    if ( is_shop() || is_product_category() || is_product_tag() || is_product() ) {
        $wishlist_js = get_template_directory() . '/dist/wishlist.js';
        if ( file_exists( $wishlist_js ) ) {
            wp_enqueue_script(
                'system-cars-wishlist',
                get_template_directory_uri() . '/dist/wishlist.js',
                [],
                filemtime( $wishlist_js ),
                true
            );
        }
    }
}
add_action('wp_enqueue_scripts', 'sc_enqueue_frontend_assets', 999);

/**
 * Encolar video-modal-frontend.js cuando el bloque está presente
 * Usando render_block para mayor confiabilidad
 */
function system_cars_enqueue_video_modal_script($block_content, $block) {
    if ('system-cars/video-modal' === $block['blockName']) {
        $script_path = get_template_directory() . '/dist/video-modal-frontend.js';

        if (file_exists($script_path)) {
            wp_enqueue_script(
                'system-cars-video-modal-frontend',
                get_template_directory_uri() . '/dist/video-modal-frontend.js',
                [],
                filemtime($script_path),
                true
            );
        }
    }
    return $block_content;
}
add_filter('render_block', 'system_cars_enqueue_video_modal_script', 10, 2);

/**
 * LIMPIEZA DE CACHÉ - YA SE EJECUTÓ, COMENTADO PARA NO EJECUTAR NUEVAMENTE
 * IMPORTANTE: Esta función ya se ejecutó y limpió la caché
 */
/*
function system_cars_clear_block_cache() {
    // Limpiar todos los transients de WordPress
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_%'");
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_site_transient_%'");

    // Limpiar caché de bloques específicamente
    wp_cache_flush();

    // Forzar regeneración de metadatos de bloques
    delete_option('wp_theme_files_patterns-system-cars-theme');

    // Solo ejecutar una vez, luego se auto-desactiva
    remove_action('init', 'system_cars_clear_block_cache');
}
add_action('init', 'system_cars_clear_block_cache', 1);
*/

/**
 * Carga scripts y estilos para el Block Editor
 * Encolamos manualmente los scripts del editor (no desde block.json)
 */
function system_cars_block_editor_assets() {
    $theme_dir = get_template_directory();
    $theme_uri = get_template_directory_uri();

    $blocks = [
        'car-block' => [],
        'slider-block' => ['editorStyle' => 'slider-block-editor.css'],
        'service-card' => ['editorStyle' => 'service-card-editor.css'],
        // 'styled-button-block' se carga desde block.json
        'info-image-block' => [],
        'parallax-columns-block' => [],
        'video-modal-block' => [],
    ];

    foreach ($blocks as $block_name => $config) {
        $script_path = "{$theme_dir}/dist/{$block_name}.js";
        if (file_exists($script_path)) {
            wp_enqueue_script(
                "system-cars-{$block_name}",
                "{$theme_uri}/dist/{$block_name}.js",
                ['wp-blocks', 'wp-block-editor', 'wp-element', 'wp-i18n', 'wp-components'],
                filemtime($script_path),
                false // Cargar en header, no en footer
            );
        }

        if (isset($config['editorStyle'])) {
            $style_path = "{$theme_dir}/dist/css/{$config['editorStyle']}";
            if (file_exists($style_path)) {
                wp_enqueue_style(
                    "system-cars-{$block_name}-editor",
                    "{$theme_uri}/dist/css/{$config['editorStyle']}",
                    [],
                    filemtime($style_path)
                );
            }
        }

        if (isset($config['style'])) {
            $style_path = "{$theme_dir}/dist/css/{$config['style']}";
            if (file_exists($style_path)) {
                wp_enqueue_style(
                    "system-cars-{$block_name}-style",
                    "{$theme_uri}/dist/css/{$config['style']}",
                    [],
                    filemtime($style_path)
                );
            }
        }
    }
}
add_action('enqueue_block_editor_assets', 'system_cars_block_editor_assets');


// Refrescar el contador del ícono de carrito
add_filter( 'woocommerce_add_to_cart_fragments', 'refresh_cart_icon_count' );
function refresh_cart_icon_count( $fragments ) {
    $count = WC()->cart->get_cart_contents_count();
    ob_start();
    if ( $count > 0 ) : ?>
        <span class="cart-icon-count absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            <?php echo $count; ?>
        </span>
    <?php else : ?>
        <span class="cart-icon-count hidden"></span>
    <?php endif;
    $fragments['.cart-icon-count'] = ob_get_clean();
    return $fragments;
}

function systemcars_scripts() {
    wp_enqueue_script(
        'mi-menu-mobile',
        get_template_directory_uri() . '/js/menu-mobile.js',
        array('jquery'),
        null,
        true
    );
}
add_action('wp_enqueue_scripts', 'systemcars_scripts');


/**
 * Carga assets del front-end (página pública)
 * NOTA: Esta función estaba duplicada - se eliminó.
 * Los assets se cargan en sc_enqueue_frontend_assets()
 */
// function system_cars_frontend_assets() { ... }
// add_action( 'wp_enqueue_scripts', 'system_cars_frontend_assets' );

// DEBUG: Registrar todos los scripts que se cargan
function system_cars_debug_scripts() {
    if (is_admin() && current_user_can('manage_options')) {
        global $wp_scripts;
        error_log('=== SCRIPTS ENCOLADOS ===');
        foreach ($wp_scripts->queue as $handle) {
            $src = isset($wp_scripts->registered[$handle]) ? $wp_scripts->registered[$handle]->src : 'N/A';
            if (strpos($src, '/dist/') !== false) {
                error_log("Handle: {$handle} | Src: {$src}");
            }
        }
    }
}
add_action('admin_enqueue_scripts', 'system_cars_debug_scripts', 9999);

function system_cars_add_module_type($tag, $handle, $src) {
    // Solo agregar type="module" a scripts frontend específicos
    $module_handles = [
        'system-cars-slider-frontend',
    ];

    if (in_array($handle, $module_handles)) {
        $tag = str_replace('<script ', '<script type="module" ', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'system_cars_add_module_type', 10, 3);

register_sidebar([
    'name'          => __('Footer Widgets', 'system-cars-theme'),
    'id'            => 'footer-widgets',
    'before_widget' => '<div class="widget %2$s">',
    'after_widget'  => '</div>',
    'before_title'  => '<h3 class="widget-title">',
    'after_title'   => '</h3>',
]);

if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
        'page_title'  => __('Opciones del Tema', 'system-cars-theme'),
        'menu_title'  => __('Opciones del Tema', 'system-cars-theme'),
        'menu_slug'   => 'theme-general-settings',
        'capability'  => 'edit_posts',
        'redirect'    => false
    ]);
}

// ============================
// Quick View Modal
// ============================

/**
 * Enqueue Quick View scripts
 */
function sc_enqueue_quick_view_scripts() {
    // Load on shop, category, tag, and single product pages (for Related Products)
    if ( ! is_shop() && ! is_product_category() && ! is_product_tag() && ! is_product() ) {
        return;
    }

    wp_enqueue_script(
        'systemcars-quick-view',
        get_template_directory_uri() . '/js/quick-view.js',
        [],
        filemtime( get_template_directory() . '/js/quick-view.js' ),
        true
    );

    wp_localize_script( 'systemcars-quick-view', 'quickViewData', [
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'quick_view_nonce' ),
    ]);
}
add_action( 'wp_enqueue_scripts', 'sc_enqueue_quick_view_scripts' );

/**
 * AJAX handler: Get product data for Quick View
 */
function sc_quick_view_product() {
    // Verify nonce
    if ( ! wp_verify_nonce( $_POST['nonce'] ?? '', 'quick_view_nonce' ) ) {
        wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
    }

    $product_id = intval( $_POST['product_id'] ?? 0 );
    if ( ! $product_id ) {
        wp_send_json_error( [ 'message' => 'Invalid product ID' ] );
    }

    $product = wc_get_product( $product_id );
    if ( ! $product ) {
        wp_send_json_error( [ 'message' => 'Product not found' ] );
    }

    // Get product data
    $image_id = $product->get_image_id();
    $image_url = $image_id ? wp_get_attachment_image_url( $image_id, 'woocommerce_single' ) : wc_placeholder_img_src( 'woocommerce_single' );
    $gallery_ids = $product->get_gallery_image_ids();

    // Get categories
    $terms = get_the_terms( $product_id, 'product_cat' );
    $category = $terms && ! is_wp_error( $terms ) ? $terms[0]->name : '';

    // Check if variable product
    $is_variable = $product->is_type( 'variable' );
    $variations_data = [];
    $attributes = [];

    if ( $is_variable ) {
        /** @var \WC_Product_Variable $product */
        $available_variations = $product->get_available_variations();
        $attributes = $product->get_variation_attributes();

        // Build variations data for JavaScript
        foreach ( $available_variations as $variation ) {
            $variations_data[] = [
                'variation_id'     => $variation['variation_id'],
                'attributes'       => $variation['attributes'],
                'price_html'       => $variation['price_html'],
                'is_in_stock'      => $variation['is_in_stock'],
                'max_qty'          => $variation['max_qty'],
                'image'            => $variation['image']['url'] ?? '',
            ];
        }
    }

    // Build HTML
    ob_start();
    ?>
    <div class="quick-view-product" data-product-type="<?php echo esc_attr( $product->get_type() ); ?>">
        <div class="quick-view-product__gallery">
            <div class="quick-view-product__image">
                <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?>">
            </div>
            <?php if ( ! empty( $gallery_ids ) ) : ?>
            <div class="quick-view-product__thumbnails">
                <button class="thumbnail active" data-image="<?php echo esc_url( $image_url ); ?>">
                    <img src="<?php echo esc_url( wp_get_attachment_image_url( $image_id, 'thumbnail' ) ); ?>" alt="">
                </button>
                <?php foreach ( array_slice( $gallery_ids, 0, 3 ) as $gallery_id ) : ?>
                <button class="thumbnail" data-image="<?php echo esc_url( wp_get_attachment_image_url( $gallery_id, 'woocommerce_single' ) ); ?>">
                    <img src="<?php echo esc_url( wp_get_attachment_image_url( $gallery_id, 'thumbnail' ) ); ?>" alt="">
                </button>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>

        <div class="quick-view-product__info">
            <?php if ( $category ) : ?>
            <span class="quick-view-product__category"><?php echo esc_html( $category ); ?></span>
            <?php endif; ?>

            <h2 class="quick-view-product__title"><?php echo esc_html( $product->get_name() ); ?></h2>

            <div class="quick-view-product__price">
                <?php echo $product->get_price_html(); ?>
            </div>

            <?php if ( $product->get_short_description() ) : ?>
            <div class="quick-view-product__description">
                <?php echo wp_kses_post( $product->get_short_description() ); ?>
            </div>
            <?php endif; ?>

            <?php if ( $is_variable ) : ?>
                <!-- Variable Product: Show variation selectors -->
                <div class="quick-view-product__variations"
                     data-product-id="<?php echo esc_attr( $product_id ); ?>"
                     data-variations="<?php echo esc_attr( wp_json_encode( $variations_data ) ); ?>">

                    <?php foreach ( $attributes as $attribute_name => $options ) : ?>
                    <div class="quick-view-variation">
                        <label class="quick-view-variation__label" for="qv-<?php echo esc_attr( sanitize_title( $attribute_name ) ); ?>">
                            <?php echo wc_attribute_label( $attribute_name ); ?>
                        </label>
                        <select class="quick-view-variation__select"
                                id="qv-<?php echo esc_attr( sanitize_title( $attribute_name ) ); ?>"
                                data-attribute="<?php echo esc_attr( 'attribute_' . sanitize_title( $attribute_name ) ); ?>">
                            <option value=""><?php esc_html_e( 'Seleccionar', 'system-cars-theme' ); ?> <?php echo wc_attribute_label( $attribute_name ); ?></option>
                            <?php foreach ( $options as $option ) : ?>
                            <option value="<?php echo esc_attr( $option ); ?>"><?php echo esc_html( $option ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <?php endforeach; ?>

                    <a href="#" class="quick-view-variation__reset" style="display: none;">
                        <?php esc_html_e( 'Limpiar', 'system-cars-theme' ); ?>
                    </a>
                </div>

                <?php if ( $product->is_in_stock() ) : ?>
                <div class="quick-view-product__actions">
                    <div class="quick-view-product__quantity">
                        <button type="button" class="qty-minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" max="999">
                        <button type="button" class="qty-plus">+</button>
                    </div>

                    <button type="button" class="quick-view-add-to-cart"
                            data-product-id="<?php echo esc_attr( $product_id ); ?>"
                            data-variation-id=""
                            disabled>
                        <?php esc_html_e( 'Seleccionar opciones', 'system-cars-theme' ); ?>
                    </button>
                </div>
                <?php else : ?>
                <p class="quick-view-product__out-of-stock"><?php esc_html_e( 'Agotado', 'system-cars-theme' ); ?></p>
                <?php endif; ?>

            <?php elseif ( $product->is_in_stock() && $product->is_purchasable() ) : ?>
                <!-- Simple Product -->
                <div class="quick-view-product__actions">
                    <div class="quick-view-product__quantity">
                        <button type="button" class="qty-minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" max="<?php echo esc_attr( $product->get_stock_quantity() ?: 999 ); ?>">
                        <button type="button" class="qty-plus">+</button>
                    </div>

                    <button type="button" class="quick-view-add-to-cart" data-product-id="<?php echo esc_attr( $product_id ); ?>">
                        <?php esc_html_e( 'Añadir al carrito', 'system-cars-theme' ); ?>
                    </button>
                </div>
            <?php else : ?>
                <p class="quick-view-product__out-of-stock"><?php esc_html_e( 'Agotado', 'system-cars-theme' ); ?></p>
            <?php endif; ?>

            <a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>" class="quick-view-product__link">
                <?php esc_html_e( 'Ver detalles completos', 'system-cars-theme' ); ?>
            </a>
        </div>
    </div>
    <?php
    $html = ob_get_clean();

    wp_send_json_success( [ 'html' => $html ] );
}
add_action( 'wp_ajax_quick_view_product', 'sc_quick_view_product' );
add_action( 'wp_ajax_nopriv_quick_view_product', 'sc_quick_view_product' );

/**
 * AJAX handler: Add to cart from Quick View
 */
function sc_quick_view_add_to_cart() {
    // Verify nonce
    if ( ! wp_verify_nonce( $_POST['nonce'] ?? '', 'quick_view_nonce' ) ) {
        wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
    }

    $product_id = intval( $_POST['product_id'] ?? 0 );
    $quantity = intval( $_POST['quantity'] ?? 1 );
    $variation_id = intval( $_POST['variation_id'] ?? 0 );

    if ( ! $product_id ) {
        wp_send_json_error( [ 'message' => 'Invalid product ID' ] );
    }

    $product = wc_get_product( $product_id );
    if ( ! $product ) {
        wp_send_json_error( [ 'message' => 'Product not found' ] );
    }

    // Handle variable products
    if ( $product->is_type( 'variable' ) ) {
        if ( ! $variation_id ) {
            wp_send_json_error( [ 'message' => 'Por favor selecciona las opciones del producto' ] );
        }

        $variation = wc_get_product( $variation_id );
        if ( ! $variation || ! $variation->is_purchasable() ) {
            wp_send_json_error( [ 'message' => 'Variación no disponible' ] );
        }

        if ( ! $variation->is_in_stock() ) {
            wp_send_json_error( [ 'message' => 'Variación agotada' ] );
        }

        // Get variation attributes from POST
        $variation_attributes = [];
        if ( ! empty( $_POST['variation'] ) && is_array( $_POST['variation'] ) ) {
            foreach ( $_POST['variation'] as $key => $value ) {
                $variation_attributes[ sanitize_text_field( $key ) ] = sanitize_text_field( $value );
            }
        }

        $added = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation_attributes );
    } else {
        // Simple product
        if ( ! $product->is_purchasable() || ! $product->is_in_stock() ) {
            wp_send_json_error( [ 'message' => 'Producto no disponible' ] );
        }

        $added = WC()->cart->add_to_cart( $product_id, $quantity );
    }

    if ( $added ) {
        wp_send_json_success( [
            'message'    => 'Product added to cart',
            'cart_count' => WC()->cart->get_cart_contents_count(),
        ]);
    } else {
        wp_send_json_error( [ 'message' => 'No se pudo añadir al carrito' ] );
    }
}
add_action( 'wp_ajax_quick_view_add_to_cart', 'sc_quick_view_add_to_cart' );
add_action( 'wp_ajax_nopriv_quick_view_add_to_cart', 'sc_quick_view_add_to_cart' );

// ============================
// AJAX Category Filter for Shop Page
// ============================

/**
 * Filter products by category via AJAX (no page reload)
 */
function sc_filter_products_by_category() {
    // Verify nonce
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'sc_filter_products' ) ) {
        wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
    }

    $category = isset( $_POST['category'] ) ? sanitize_text_field( $_POST['category'] ) : 'all';

    // Build query args
    $args = [
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => apply_filters( 'loop_shop_per_page', wc_get_default_products_per_row() * wc_get_default_product_rows_per_page() ),
        'orderby'        => 'date',
        'order'          => 'DESC',
    ];

    // Add category filter if not "all"
    if ( $category !== 'all' ) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => $category,
            ],
        ];
    }

    $products = new WP_Query( $args );

    ob_start();

    if ( $products->have_posts() ) {
        while ( $products->have_posts() ) {
            $products->the_post();
            wc_get_template_part( 'content', 'product' );
        }
    } else {
        echo '<li class="no-products-found" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">';
        esc_html_e( 'No se encontraron productos en esta categoría.', 'system-cars-theme' );
        echo '</li>';
    }

    $html = ob_get_clean();

    // Get pagination
    ob_start();
    if ( $products->max_num_pages > 1 ) {
        echo '<nav class="woocommerce-pagination">';
        echo paginate_links( [
            'total'   => $products->max_num_pages,
            'current' => 1,
            'format'  => '?paged=%#%',
            'type'    => 'list',
        ] );
        echo '</nav>';
    }
    $pagination = ob_get_clean();

    wp_reset_postdata();

    wp_send_json_success( [
        'html'       => $html,
        'pagination' => $pagination,
        'count'      => $products->found_posts,
    ] );
}
add_action( 'wp_ajax_sc_filter_products_by_category', 'sc_filter_products_by_category' );
add_action( 'wp_ajax_nopriv_sc_filter_products_by_category', 'sc_filter_products_by_category' );

// ============================
// Price Filter for Shop Page
// ============================

/**
 * Filter products by price range
 */
function sc_filter_products_by_price( $query ) {
    if ( ! is_admin() && $query->is_main_query() && ( is_shop() || is_product_category() || is_product_tag() ) ) {
        $min_price = isset( $_GET['min_price'] ) ? floatval( $_GET['min_price'] ) : '';
        $max_price = isset( $_GET['max_price'] ) ? floatval( $_GET['max_price'] ) : '';

        if ( $min_price !== '' || $max_price !== '' ) {
            $meta_query = $query->get( 'meta_query' );
            if ( ! is_array( $meta_query ) ) {
                $meta_query = [];
            }

            $price_filter = [
                'key'     => '_price',
                'type'    => 'NUMERIC',
                'compare' => 'BETWEEN',
            ];

            if ( $min_price !== '' && $max_price !== '' ) {
                $price_filter['value'] = [ $min_price, $max_price ];
            } elseif ( $min_price !== '' ) {
                $price_filter['compare'] = '>=';
                $price_filter['value'] = $min_price;
            } elseif ( $max_price !== '' ) {
                $price_filter['compare'] = '<=';
                $price_filter['value'] = $max_price;
            }

            $meta_query[] = $price_filter;
            $query->set( 'meta_query', $meta_query );
        }
    }
}
add_action( 'pre_get_posts', 'sc_filter_products_by_price' );

// ============================
// Custom Translations
// ============================

/**
 * Translate WooCommerce strings to Spanish (PHP)
 */
function sc_custom_translations( $translated_text, $text, $domain ) {
    $translations = [
        'Add coupons' => 'Agregar cupones',
        'Add a coupon' => 'Agregar un cupón',
        'There are no payment methods available. Please contact us for help placing your order.' => 'No hay métodos de pago disponibles. Por favor contáctanos para ayudarte con tu pedido.',
    ];

    if ( isset( $translations[ $text ] ) ) {
        return $translations[ $text ];
    }

    return $translated_text;
}
add_filter( 'gettext', 'sc_custom_translations', 20, 3 );

/**
 * Inject custom translations for WooCommerce Blocks via JavaScript
 */
function sc_woocommerce_blocks_custom_translations() {
    if ( ! is_checkout() && ! is_cart() ) {
        return;
    }
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Override WooCommerce Blocks translations
        if (typeof wp !== 'undefined' && wp.i18n && wp.i18n.setLocaleData) {
            wp.i18n.setLocaleData({
                'Add coupons': ['Agregar cupones'],
                'Add a coupon': ['Agregar un cupón'],
                'There are no payment methods available. Please contact us for help placing your order.': ['No hay métodos de pago disponibles. Por favor contáctanos para ayudarte con tu pedido.'],
                'No registered Payment Methods': ['No hay métodos de pago registrados']
            }, 'woocommerce');
        }

        // Also update any existing elements with MutationObserver
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Update "Add coupons" text
                        const elements = node.querySelectorAll ? node.querySelectorAll('button, span, a') : [];
                        elements.forEach(function(el) {
                            if (el.textContent === 'Add coupons') {
                                el.textContent = 'Agregar cupones';
                            }
                            if (el.textContent === 'Add a coupon') {
                                el.textContent = 'Agregar un cupón';
                            }
                            if (el.textContent.includes('There are no payment methods available')) {
                                el.textContent = 'No hay métodos de pago disponibles. Por favor contáctanos para ayudarte con tu pedido.';
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Initial check
        setTimeout(function() {
            document.querySelectorAll('button, span, a, p, div').forEach(function(el) {
                if (el.textContent === 'Add coupons') {
                    el.textContent = 'Agregar cupones';
                }
                if (el.textContent === 'Add a coupon') {
                    el.textContent = 'Agregar un cupón';
                }
                if (el.textContent.includes('There are no payment methods available')) {
                    el.innerHTML = el.innerHTML.replace(
                        'There are no payment methods available. Please contact us for help placing your order.',
                        'No hay métodos de pago disponibles. Por favor contáctanos para ayudarte con tu pedido.'
                    );
                }
            });
        }, 500);
    });
    </script>
    <?php
}
add_action( 'wp_footer', 'sc_woocommerce_blocks_custom_translations', 999 );

/**
 * Add +/- buttons to WooCommerce quantity inputs for variable products
 */
function sc_variable_product_quantity_buttons() {
    if ( ! is_product() ) {
        return;
    }
    ?>
    <script>
    (function() {
        'use strict';

        function initQuantityButtons() {
            // Find all quantity wrappers that haven't been processed
            var quantityContainers = document.querySelectorAll('.sc-variation-add-to-cart .quantity:not(.sc-qty-wrapped)');

            quantityContainers.forEach(function(container) {
                var input = container.querySelector('input.qty, input[type="number"]');
                if (!input) return;

                // Mark as processed
                container.classList.add('sc-qty-wrapped');

                // Create minus button
                var minusBtn = document.createElement('button');
                minusBtn.type = 'button';
                minusBtn.className = 'sc-qty-btn sc-qty-btn--minus';
                minusBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
                minusBtn.setAttribute('aria-label', 'Reducir cantidad');

                // Create plus button
                var plusBtn = document.createElement('button');
                plusBtn.type = 'button';
                plusBtn.className = 'sc-qty-btn sc-qty-btn--plus';
                plusBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
                plusBtn.setAttribute('aria-label', 'Aumentar cantidad');

                // Insert buttons
                container.insertBefore(minusBtn, input);
                container.appendChild(plusBtn);

                // Event handlers - using named functions to avoid duplicates
                function handleMinus(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var value = parseInt(input.value) || 1;
                    var min = parseInt(input.getAttribute('min')) || 1;
                    if (value > min) {
                        input.value = value - 1;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                function handlePlus(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var value = parseInt(input.value) || 1;
                    var max = parseInt(input.getAttribute('max')) || 9999;
                    if (!input.getAttribute('max') || value < max) {
                        input.value = value + 1;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                minusBtn.addEventListener('click', handleMinus);
                plusBtn.addEventListener('click', handlePlus);
            });
        }

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initQuantityButtons);
        } else {
            initQuantityButtons();
        }

        // Re-initialize when WooCommerce shows a variation
        if (typeof jQuery !== 'undefined') {
            jQuery(document).on('show_variation', function(event, variation) {
                // Small delay to ensure DOM is updated
                setTimeout(initQuantityButtons, 50);
            });

            // Also handle when variation form is reset
            jQuery(document).on('reset_data', function() {
                setTimeout(initQuantityButtons, 50);
            });
        }
    })();
    </script>
    <?php
}
add_action( 'wp_footer', 'sc_variable_product_quantity_buttons', 100 );

// ============================
// Mini Cart Dropdown
// ============================

/**
 * Render mini cart content
 */
function sc_render_mini_cart_content() {
    if ( ! function_exists( 'WC' ) ) {
        return;
    }

    $cart = WC()->cart;
    $cart_items = $cart->get_cart();
    $cart_count = $cart->get_cart_contents_count();
    $cart_subtotal = $cart->get_cart_subtotal();
    ?>

    <?php if ( $cart_count > 0 ) : ?>
        <div class="sc-mini-cart__items">
            <?php foreach ( $cart_items as $cart_item_key => $cart_item ) :
                $product = $cart_item['data'];
                $product_id = $cart_item['product_id'];
                $quantity = $cart_item['quantity'];
                $product_name = $product->get_name();
                $product_price = WC()->cart->get_product_price( $product );
                $product_permalink = $product->is_visible() ? $product->get_permalink( $cart_item ) : '';
                $thumbnail = $product->get_image( 'thumbnail' );
            ?>
                <div class="sc-mini-cart__item" data-key="<?php echo esc_attr( $cart_item_key ); ?>">
                    <div class="sc-mini-cart__item-image">
                        <?php if ( $product_permalink ) : ?>
                            <a href="<?php echo esc_url( $product_permalink ); ?>">
                                <?php echo $thumbnail; ?>
                            </a>
                        <?php else : ?>
                            <?php echo $thumbnail; ?>
                        <?php endif; ?>
                    </div>
                    <div class="sc-mini-cart__item-details">
                        <h4 class="sc-mini-cart__item-name">
                            <?php if ( $product_permalink ) : ?>
                                <a href="<?php echo esc_url( $product_permalink ); ?>"><?php echo esc_html( $product_name ); ?></a>
                            <?php else : ?>
                                <?php echo esc_html( $product_name ); ?>
                            <?php endif; ?>
                        </h4>
                        <div class="sc-mini-cart__item-meta">
                            <span class="sc-mini-cart__item-qty"><?php echo $quantity; ?> &times;</span>
                            <span class="sc-mini-cart__item-price"><?php echo $product_price; ?></span>
                        </div>
                    </div>
                    <button type="button"
                            class="sc-mini-cart__item-remove"
                            data-cart-item-key="<?php echo esc_attr( $cart_item_key ); ?>"
                            aria-label="<?php echo esc_attr( sprintf( __( 'Eliminar %s del carrito', 'system-cars-theme' ), $product_name ) ); ?>">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="sc-mini-cart__footer">
            <div class="sc-mini-cart__subtotal">
                <span><?php esc_html_e( 'Subtotal:', 'system-cars-theme' ); ?></span>
                <span class="sc-mini-cart__subtotal-amount"><?php echo $cart_subtotal; ?></span>
            </div>
            <div class="sc-mini-cart__buttons">
                <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="sc-mini-cart__btn sc-mini-cart__btn--cart">
                    <?php esc_html_e( 'Ver Carrito', 'system-cars-theme' ); ?>
                </a>
                <a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="sc-mini-cart__btn sc-mini-cart__btn--checkout">
                    <?php esc_html_e( 'Finalizar Compra', 'system-cars-theme' ); ?>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>

    <?php else : ?>
        <div class="sc-mini-cart__empty">
            <i class="fa-solid fa-cart-shopping"></i>
            <p><?php esc_html_e( 'Tu carrito está vacío', 'system-cars-theme' ); ?></p>
            <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="sc-mini-cart__btn sc-mini-cart__btn--shop">
                <?php esc_html_e( 'Ir a la tienda', 'system-cars-theme' ); ?>
            </a>
        </div>
    <?php endif; ?>

    <?php
}

/**
 * AJAX: Get mini cart content
 */
function sc_ajax_get_mini_cart() {
    ob_start();
    sc_render_mini_cart_content();
    $html = ob_get_clean();

    $cart_count = function_exists( 'WC' ) ? WC()->cart->get_cart_contents_count() : 0;

    wp_send_json_success( [
        'html'       => $html,
        'cart_count' => $cart_count,
    ] );
}
add_action( 'wp_ajax_sc_get_mini_cart', 'sc_ajax_get_mini_cart' );
add_action( 'wp_ajax_nopriv_sc_get_mini_cart', 'sc_ajax_get_mini_cart' );

/**
 * AJAX: Remove item from cart
 */
function sc_ajax_remove_cart_item() {
    $cart_item_key = isset( $_POST['cart_item_key'] ) ? sanitize_text_field( $_POST['cart_item_key'] ) : '';

    if ( ! $cart_item_key ) {
        wp_send_json_error( [ 'message' => 'Invalid cart item' ] );
    }

    $removed = WC()->cart->remove_cart_item( $cart_item_key );

    if ( $removed ) {
        ob_start();
        sc_render_mini_cart_content();
        $html = ob_get_clean();

        wp_send_json_success( [
            'html'       => $html,
            'cart_count' => WC()->cart->get_cart_contents_count(),
        ] );
    } else {
        wp_send_json_error( [ 'message' => 'Could not remove item' ] );
    }
}
add_action( 'wp_ajax_sc_remove_cart_item', 'sc_ajax_remove_cart_item' );
add_action( 'wp_ajax_nopriv_sc_remove_cart_item', 'sc_ajax_remove_cart_item' );

/**
 * Enqueue mini cart scripts
 */
function sc_enqueue_mini_cart_scripts() {
    wp_enqueue_script(
        'systemcars-mini-cart',
        get_template_directory_uri() . '/js/mini-cart.js',
        [],
        filemtime( get_template_directory() . '/js/mini-cart.js' ),
        true
    );

    wp_localize_script( 'systemcars-mini-cart', 'miniCartData', [
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
    ] );
}
add_action( 'wp_enqueue_scripts', 'sc_enqueue_mini_cart_scripts' );

/**
 * Refresh mini cart fragments via WooCommerce AJAX
 */
function sc_mini_cart_fragments( $fragments ) {
    ob_start();
    sc_render_mini_cart_content();
    $fragments['.sc-mini-cart__content'] = '<div class="sc-mini-cart__content">' . ob_get_clean() . '</div>';

    // Also update cart count
    $cart_count = WC()->cart->get_cart_contents_count();
    if ( $cart_count > 0 ) {
        $fragments['.cart-icon-count'] = '<span class="cart-icon-count absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">' . $cart_count . '</span>';
    } else {
        $fragments['.cart-icon-count'] = '<span class="cart-icon-count hidden absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full items-center justify-center"></span>';
    }

    return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'sc_mini_cart_fragments' );

/**
 * Fix REST API and loopback requests in Docker local development.
 *
 * Inside the Docker container the web server listens on port 80.
 * The host machine accesses WordPress via localhost:8080 (mapped to container:80),
 * but server-side loopback requests from within the container cannot reach
 * localhost:8080 — they must use localhost (port 80 internally).
 *
 * This filter only activates when the site URL contains "localhost".
 */
if ( str_contains( get_option( 'siteurl' ), 'localhost' ) ) {
    add_filter( 'pre_http_request', 'sc_fix_docker_loopback', 5, 3 );
}

function sc_fix_docker_loopback( $preempt, $args, $url ) {
    static $is_rewriting = false;

    // Prevent infinite recursion
    if ( $is_rewriting ) {
        return $preempt;
    }

    // Only intercept requests to our own localhost:8080
    if ( str_starts_with( $url, 'http://localhost:8080' ) ) {
        $is_rewriting = true;
        $internal_url = str_replace( 'http://localhost:8080', 'http://localhost', $url );
        $response     = wp_remote_request( $internal_url, $args );
        $is_rewriting = false;
        return $response;
    }

    return $preempt;
}