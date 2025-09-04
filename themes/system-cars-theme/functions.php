<?php
function system_cars_theme_setup() {
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_editor_style('dist/css/main.css');
    
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('block-templates');

    register_nav_menus([
        'primary' => __('Menú Principal', 'system-cars-theme'),
        'footer'  => __('Menú Footer', 'system-cars-theme'),
    ]);

    // Add "active" class to menu items
    function agregar_clase_active_a_menu($classes, $item) {
        if (in_array('current-menu-item', $classes) || in_array('current_page_item', $classes)) {
            $classes[] = 'active';
        }
        return $classes;
    }
    add_filter('nav_menu_css_class', 'agregar_clase_active_a_menu', 10, 2);
}
add_action('after_setup_theme', 'system_cars_theme_setup');

function system_cars_enqueue_frontend_assets() {
    // Google Fonts
    wp_enqueue_style(
        'systemcars-roboto-condensed',
        'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@200;300;400;500;700&display=swap',
        [],
        null
    );

    // Font Awesome
    wp_enqueue_style(
        'fa-cdn',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
        [],
        '6.6.0'
    );


    // Theme CSS (Tailwind + SCSS merged)
    $dist_css = get_template_directory() . '/dist/style.css';
    if (file_exists($dist_css)) {
        wp_enqueue_style(
            'systemcars-style',
            get_template_directory_uri() . '/dist/style.css',
            [],
            filemtime($dist_css)
        );
    }

    // Preconnects for fonts
    wp_enqueue_script('systemcars-preconnect', '', [], null, false);
    wp_add_inline_script(
        'systemcars-preconnect',
        'if (document.createElement && window.addEventListener) { var link = document.createElement("link"); link.rel = "preconnect"; link.href = "https://fonts.googleapis.com"; document.head.appendChild(link); var link2 = document.createElement("link"); link2.rel = "preconnect"; link2.href = "https://fonts.gstatic.com"; link2.crossOrigin = "anonymous"; document.head.appendChild(link2); }',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'system_cars_enqueue_frontend_assets');

function system_cars_enqueue_block_assets() {
    // Enqueue Tailwind CSS
    wp_enqueue_style(
        'system-cars-tailwind',
        get_template_directory_uri() . '/dist/css/main.css',
        [],
        filemtime(get_template_directory() . '/dist/css/main.css')
    );

    // Enqueue Swiper CSS
    wp_enqueue_style(
        'swiper-css',
        'https://unpkg.com/swiper/swiper-bundle.min.css',
        [],
        '10.3.1'
    );

    // Enqueue Swiper JS
    wp_enqueue_script(
        'swiper-js',
        'https://unpkg.com/swiper/swiper-bundle.min.js',
        [],
        '10.3.1',
        true
    );

    // Enqueue Underscore explicitly
    wp_enqueue_script('underscore');

    // Enqueue car-block script
    wp_enqueue_script(
        'system-cars-car-block',
        get_template_directory_uri() . '/dist/car-block.js',
        ['wp-blocks', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-element', 'underscore'],
        filemtime(get_template_directory() . '/dist/car-block.js'),
        true
    );

    // Enqueue slider-block script
    wp_enqueue_script(
        'system-cars-slider-block',
        get_template_directory_uri() . '/dist/slider-block.js',
        ['wp-blocks', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-element', 'underscore'],
        filemtime(get_template_directory() . '/dist/slider-block.js'),
        true
    );

    // Enqueue slider-frontend script
    wp_enqueue_script(
        'system-cars-slider-frontend',
        get_template_directory_uri() . '/dist/slider-frontend.js',
        ['swiper-js'],
        filemtime(get_template_directory() . '/dist/slider-frontend.js'),
        true
    );
}
add_action('enqueue_block_assets', 'system_cars_enqueue_block_assets');

function system_cars_add_module_type($tag, $handle, $src) {
    $module_handles = [
        'system-cars-car-block',
        'system-cars-slider-block',
        'system-cars-slider-frontend'
    ];
    if (in_array($handle, $module_handles)) {
        error_log('Adding type=module to script: ' . $handle);
        $tag = str_replace('<script ', '<script type="module" ', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'system_cars_add_module_type', 10, 3);

function register_custom_blocks() {
    $blocks = [
        'car-block',
        'slider-block',
    ];
    foreach ($blocks as $block) {
        $block_path = get_template_directory() . '/blocks/' . $block;
        if (file_exists($block_path . '/block.json')) {
            register_block_type($block_path);
        } else {
            error_log('Block registration failed: ' . $block_path . '/block.json not found');
        }
    }
}
add_action('init', 'register_custom_blocks');

function system_cars_add_block_category($categories) {
    return array_merge(
        $categories,
        [
            [
                'slug'  => 'system-cars',
                'title' => __('System Cars Blocks', 'system-cars-theme'),
                'icon'  => 'dashicons-car'
            ],
        ]
    );
}
add_filter('block_categories_all', 'system_cars_add_block_category', 10, 2);

register_sidebar([
    'name'          => __('Footer Widgets', 'system-cars-theme'),
    'id'            => 'footer-widgets',
    'before_widget' => '<div class="widget %2$s">',
    'after_widget'  => '</div>',
    'before_title'  => '<h3 class="widget-title">',
    'after_title'   => '</h3>',
]);

// ACF Options Page
if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
        'page_title'  => __('Opciones del Tema', 'system-cars-theme'),
        'menu_title'  => __('Opciones del Tema', 'system-cars-theme'),
        'menu_slug'   => 'theme-general-settings',
        'capability'  => 'edit_posts',
        'redirect'    => false
    ]);
}