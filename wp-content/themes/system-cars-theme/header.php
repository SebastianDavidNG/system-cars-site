<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Tienda de autos con diseño elegante y moderno">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php if ( function_exists( 'wp_body_open' ) ) { wp_body_open(); } ?>

    <!-- Barra de información editable (hidden on mobile, visible on desktop) -->
    <div class="hidden md:block w-full bg-tertiary text-white text-sm py-2 px-4 md:px-0">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div class="info-bar-left w-full md:w-auto mb-4 md:mb-0 flex justify-center md:justify-start font-extralight text-sm">
                <?php
                    $has_acf = function_exists('get_field');
                    $config_page = get_page_by_path('barra-de-informacion');
                    $config_id   = $config_page ? $config_page->ID : 0;

                    // Inicializar valores
                    $horarios  = $has_acf && $config_id ? get_field('horarios', $config_id) : '';
                    $telefono1 = $has_acf && $config_id ? get_field('telefono_1', $config_id) : '';
                    $telefono2 = $has_acf && $config_id ? get_field('telefono_2', $config_id) : '';
                    $direccion = $has_acf && $config_id ? get_field('direccion', $config_id) : '';

                // Normaliza teléfonos para el enlace tel:
                $tel1_href = $telefono1 ? preg_replace('/\D+/', '', (string) $telefono1) : '';
                $tel2_href = $telefono2 ? preg_replace('/\D+/', '', (string) $telefono2) : '';

                $hay_datos = ($horarios || $telefono1 || $telefono2 || $direccion);

                if ( $has_acf && $hay_datos ) :
                    echo '<p>';

                    if ( $horarios ) {
                        echo '<div class="hidden sm:block"><span>HORARIOS DE ATENCIÓN: ' . esc_html($horarios) . '</span><span class="mx-2">|</span></div>';
                    }

                    if ( $telefono1 || $telefono2 ) {
                        echo '<div class="flex">
                            <span class="flex">
                                <svg class="self-center mr-2" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.88257 0C9.70819 0 12 2.29182 12 5.11743C12 5.4108 11.764 5.64682 11.4706 5.64682C11.1772 5.64682 10.9412 5.4108 10.9412 5.11743C10.9412 2.87635 9.12365 1.05878 6.88257 1.05878C6.5892 1.05878 6.35318 0.82276 6.35318 0.52939C6.35318 0.23602 6.5892 0 6.88257 0ZM7.05903 4.23512C7.44946 4.23512 7.76489 4.55054 7.76489 4.94097C7.76489 5.33139 7.44946 5.64682 7.05903 5.64682C6.66861 5.64682 6.35318 5.33139 6.35318 4.94097C6.35318 4.55054 6.66861 4.23512 7.05903 4.23512ZM6.35318 2.64695C6.35318 2.35358 6.5892 2.11756 6.88257 2.11756C8.53912 2.11756 9.88244 3.46088 9.88244 5.11743C9.88244 5.4108 9.64642 5.64682 9.35305 5.64682C9.05968 5.64682 8.82366 5.4108 8.82366 5.11743C8.82366 4.04542 7.95458 3.17634 6.88257 3.17634C6.5892 3.17634 6.35318 2.94032 6.35318 2.64695ZM2.4732 0.736734C2.90774 0.617621 3.36213 0.840406 3.53418 1.25509L4.42753 3.40133C4.57973 3.76528 4.47385 4.18659 4.16724 4.43805L3.19449 5.23434C3.91137 6.81368 5.15764 8.10187 6.70831 8.87169L7.55975 7.83055C7.809 7.52395 8.23031 7.42028 8.59647 7.57027L10.7427 8.46582C11.1574 8.63787 11.3802 9.09227 11.2611 9.52681L11.228 9.64812C10.8398 11.0753 9.46114 12.2929 7.77812 11.9377C3.91799 11.1194 0.880617 8.08201 0.0622689 4.22188C-0.292863 2.53886 0.924732 1.16025 2.34967 0.769821L2.47099 0.736734H2.4732Z" fill="white"/>
                                </svg>
                            <span>';
                        if ( $telefono1 ) {
                            echo '<a href="tel:' . esc_attr($tel1_href) . '">' . esc_html($telefono1) . '</a>';
                        }
                        if ( $telefono2 ) {
                            echo ' - <a href="tel:' . esc_attr($tel2_href) . '">' . esc_html($telefono2) . '</a>';
                        }
                        echo '</span><span class="mx-2">|</span></div>';
                    }

                    if ( $direccion ) {
                        echo '<a href="https://maps.app.goo.gl/GZrgUUa9p6Dk5tek6?g_st=ipc" target="_blank">
                        <span class="flex">
                            <svg class="self-center mr-2" width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.99766 4.39456C8.99766 1.9666 6.98256 0 4.49883 0C2.0151 0 -1.05016e-07 1.9666 -1.05016e-07 4.39456C-1.05016e-07 7.17437 2.81645 10.5064 3.99271 11.7763C4.2692 12.0746 4.7308 12.0746 5.00729 11.7763C6.18355 10.5064 9 7.17437 9 4.39456H8.99766ZM4.49883 5.96505C3.6717 5.96505 2.99922 5.29631 2.99922 4.47379C2.99922 3.65126 3.6717 2.98252 4.49883 2.98252C5.32596 2.98252 5.99844 3.65126 5.99844 4.47379C5.99844 5.29631 5.32596 5.96505 4.49883 5.96505Z" fill="white"/>
                            </svg> ' . esc_html($direccion) . '</span>
                        </a>';
                    }

                    echo '</p>';
                else :
                    // Fallback si ACF no está activo o no hay datos aún
                    echo '<p><span>HORARIOS DE ATENCIÓN: Lunes - Sábado 8:00AM - 5:30PM</span> | <span><i class="fa-solid fa-phone-volume"></i> <a href="tel:3208159975">320 815 99 75</a> - <a href="tel:3005605344">300 560 53 44</a></span> | <span><i class="fa-solid fa-location-dot"></i> <a href="https://maps.app.goo.gl/GZrgUUa9p6Dk5tek6?g_st=ipc" target="_blank">Av Calle 1 #25-42</a></span></p>';
                endif;
                ?>
            </div>
            <div class="info-bar-right w-full md:w-auto flex justify-center md:justify-end space-x-4 mb-4 md:mb-0">
                <a href="#" class="text-gray-300 hover:text-white text-[18px] md:text-[17px] lg:text-[20px]"><span class="fab fa-facebook-f"></span></a>
                <a href="#" class="text-gray-300 hover:text-white text-[18px] md:text-[17px] lg:text-[20px]"><span class="fab fa-instagram"></span></a>
                <a href="#" class="text-gray-300 hover:text-white text-[18px] md:text-[17px] lg:text-[20px]"><span class="fab fa-youtube"></span></a>
            </div>
        </div>
    </div>

    <header role="banner" class="py-6 md:py-10 px-4 border-b border-gray-200 relative z-50">
    <div class="container mx-auto flex justify-between items-center">
        <!-- Logo -->
        <div class="logo">
            <?php
            if (function_exists('the_custom_logo') && has_custom_logo()) {
                the_custom_logo();
            } else {
                ?>
                <h1 class="text-2xl font-bold">
                    <a href="<?php echo esc_url(home_url('/')); ?>" aria-label="Inicio"><?php bloginfo('name'); ?></a>
                </h1>
                <?php
            }
            ?>
        </div>

        <!-- Menú Desktop + Acciones -->
        <div class="hidden sm:flex items-center space-x-4">
            <nav role="navigation" aria-label="Menú principal">
                <?php
                wp_nav_menu([
                    'theme_location' => 'primary',
                    'menu_class'     => 'nav-menu flex space-x-4 font-medium',
                    'container'      => false,
                ]);
                ?>
            </nav>

            <!-- Usuario -->
            <a href="<?php echo get_permalink( get_option('woocommerce_myaccount_page_id') ); ?>">
                <i class="fa-solid fa-user font-s-icon text-gray-800 hover:text-tertiary"></i>
            </a>

            <!-- Carrito con Mini-Cart Dropdown -->
            <div class="sc-mini-cart-wrapper relative">
                <button type="button" class="sc-mini-cart-trigger" aria-label="<?php esc_attr_e( 'Ver carrito', 'system-cars-theme' ); ?>">
                    <i class="fa-solid fa-cart-shopping font-s-icon text-gray-800 hover:text-tertiary"></i>
                    <?php
                    $cart_count = function_exists('WC') ? WC()->cart->get_cart_contents_count() : 0;
                    if ( $cart_count > 0 ) : ?>
                        <span class="cart-icon-count absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            <?php echo $cart_count; ?>
                        </span>
                    <?php else : ?>
                        <span class="cart-icon-count hidden absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full items-center justify-center"></span>
                    <?php endif; ?>
                </button>

                <!-- Mini-Cart Dropdown -->
                <div class="sc-mini-cart" aria-hidden="true">
                    <div class="sc-mini-cart__header">
                        <span class="sc-mini-cart__title"><?php esc_html_e( 'Tu Carrito', 'system-cars-theme' ); ?></span>
                        <button type="button" class="sc-mini-cart__close" aria-label="<?php esc_attr_e( 'Cerrar', 'system-cars-theme' ); ?>">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="sc-mini-cart__content">
                        <?php if ( function_exists('WC') ) : ?>
                            <?php sc_render_mini_cart_content(); ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>


            <!-- Botón Tienda -->
            <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>"
               class="bg-primary text-white text-center w-full max-w-64 px-4 py-2 rounded-xs font-medium hover:bg-secondary transition uppercase btn-tienda">
               Tienda
            </a>
        </div>

        <!-- Botón toggle Mobile -->
        <button id="menu-toggle" class="sm:hidden flex items-center text-gray-800 focus:outline-none z-50 relative max-w-2xs">
            <i id="icon-open" class="fa-solid fa-bars"></i>
            <i id="icon-close" class="fa-solid fa-xmark hidden"></i>
        </button>
    </div>
</header>

<!-- Menú Mobile (fullscreen with fade animation) -->
<div id="mobile-menu" class="fixed inset-0 bg-white z-50 sm:hidden">
    <!-- Botón de cerrar (mismo estilo que video modal) -->
    <button id="menu-close" class="mobile-menu-close" aria-label="Cerrar menú"></button>

    <div class="mobile-menu-content">
        <?php
        wp_nav_menu([
            'theme_location' => 'primary',
            'menu_class'     => 'flex flex-col space-y-6 text-2xl font-medium uppercase text-center',
            'container'      => false,
        ]);
        ?>

        <!-- Iconos Carrito + Usuario (mobile en línea centrados) -->
        <div class="mobile-menu-icons flex justify-center items-center space-x-8 mt-8">

            <!-- Usuario -->
            <a href="<?php echo get_permalink( get_option('woocommerce_myaccount_page_id') ); ?>">
                <i class="fa-solid fa-user text-2xl text-gray-800 hover:text-primary transition-colors duration-300"></i>
            </a>

            <!-- Carrito -->
            <a href="<?php echo function_exists('WC') ? wc_get_cart_url() : '#'; ?>" class="relative">
                <i class="fa-solid fa-cart-shopping text-2xl text-gray-800 hover:text-primary transition-colors duration-300"></i>

<?php
                $cart_count = function_exists('WC') ? WC()->cart->get_cart_contents_count() : 0;
                if ( $cart_count > 0 ) : ?>
                    <span class="cart-icon-count absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        <?php echo $cart_count; ?>
                    </span>
                <?php else : ?>
                    <span class="cart-icon-count hidden"></span>
                <?php endif; ?>
            </a>

        </div>

        <!-- Botón Tienda (mobile) -->
        <a href="<?php echo get_permalink( wc_get_page_id('shop') ); ?>"
           class="mobile-menu-shop-btn bg-primary text-white px-8 py-3 font-medium hover:bg-secondary transition-colors duration-300 uppercase text-center rounded-xs mt-8">
           Tienda
        </a>
    </div>
</div>