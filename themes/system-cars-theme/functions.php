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

    // Main CSS
    $main_css = get_template_directory() . '/dist/css/main.css';
    if ( file_exists( $main_css ) ) {
        wp_enqueue_style(
            'systemcars-main',
            get_template_directory_uri() . '/dist/css/main.css',
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