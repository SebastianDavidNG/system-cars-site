<?php
function sc_theme_setup() {
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_editor_style('dist/css/main.css');

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

    // CSS principal (Tailwind + SCSS)
    $file = get_template_directory() . '/dist/style.css';
    if ( file_exists( $file ) ) {
        wp_enqueue_style(
            'systemcars-style',
            get_template_directory_uri() . '/dist/style.css',
            [],
            filemtime( $file )
        );
    }


    // Swiper en frontend (CDN)
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

    // slider-frontend.js (solo front-end, depende de Swiper CDN)
    wp_enqueue_script(
        'system-cars-slider-frontend',
        get_template_directory_uri() . '/dist/slider-frontend.js',
        [ 'swiper-js' ],
        filemtime( get_template_directory() . '/dist/slider-frontend.js' ),
        true
    );
    wp_script_add_data( 'system-cars-slider-frontend', 'type', 'module' );

    // Bloque service-card front-end (CSS)
    wp_enqueue_style(
        'system-cars-service-card',
        get_template_directory_uri() . '/dist/css/service-card-style.css',
        [], filemtime( get_template_directory() . '/dist/css/service-card-style.css' )
    );
}
add_action('wp_enqueue_scripts', 'sc_enqueue_frontend_assets');

/**
 * Carga scripts y estilos para el Block Editor
 */
function system_cars_block_editor_assets() {
    wp_enqueue_script(
        'system-cars-car-block',
        get_template_directory_uri() . '/dist/car-block.js',
        [ 'wp-blocks','wp-i18n','wp-element','underscore' ],
        filemtime( get_template_directory() . '/dist/car-block.js' ),
        true
    );
    wp_enqueue_script(
        'system-cars-slider-block',
        get_template_directory_uri() . '/dist/slider-block.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-components' ],
        null,
        true
    );
    wp_script_add_data( 'system-cars-slider-block', 'type', 'module' );

    wp_enqueue_style(
        'system-cars-slider-block-editor',
        get_template_directory_uri() . '/dist/css/slider-block-editor.css',
        [],
        filemtime( get_template_directory() . '/dist/css/slider-block-editor.css' )
    );

    wp_enqueue_script(
        'system-cars-service-card',
        get_template_directory_uri() . '/dist/service-card.js',
        [ 'wp-blocks','wp-i18n','wp-element','underscore' ],
        filemtime( get_template_directory() . '/dist/service-card.js' ),
        true
    );
    wp_script_add_data( 'system-cars-service-card', 'type', 'module' );

    wp_enqueue_style(
        'system-cars-service-card-editor',
        get_template_directory_uri() . '/dist/css/service-card-editor.css',
        [],
        filemtime( get_template_directory() . '/dist/css/service-card-editor.css' )
    );
}
add_action( 'enqueue_block_editor_assets', 'system_cars_block_editor_assets' );


// Refrescar el contador del ícono de carrito (fa-bag-shopping)
add_filter( 'woocommerce_add_to_cart_fragments', 'refresh_cart_icon_count' );
function refresh_cart_icon_count( $fragments ) {
    ob_start(); ?>
    <span class="cart-icon-count absolute -top-2 -right-2 bg-tertiary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        <?php echo WC()->cart->get_cart_contents_count(); ?>
    </span>
    <?php
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
 */
function system_cars_frontend_assets() {
    wp_enqueue_style(
        'systemcars-roboto-condensed',
        'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@200;300;400;500;700&display=swap',
        [], null
    );
    wp_enqueue_style(
        'fa-cdn',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
        [], '6.6.0'
    );
    wp_enqueue_style(
        'systemcars-style',
        get_template_directory_uri() . '/dist/css/main.css',
        [], filemtime( get_template_directory() . '/dist/css/main.css' )
    );
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
    wp_enqueue_script(
        'system-cars-slider-frontend',
        get_template_directory_uri() . '/dist/slider-frontend.js',
        [ 'swiper-js' ],
        filemtime( get_template_directory() . '/dist/slider-frontend.js' ),
        true
    );
    wp_script_add_data( 'system-cars-slider-frontend', 'type', 'module' );
    wp_enqueue_style(
        'system-cars-service-card',
        get_template_directory_uri() . '/dist/css/service-card-style.css',
        [], filemtime( get_template_directory() . '/dist/css/service-card-style.css' )
    );
}
add_action( 'wp_enqueue_scripts', 'system_cars_frontend_assets' );

function system_cars_add_module_type($tag, $handle, $src) {
    $module_handles = [
        'system-cars-car-block',
        'system-cars-slider-block',
        'system-cars-slider-frontend',
        'system-cars-service-card', // <-- must be present
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