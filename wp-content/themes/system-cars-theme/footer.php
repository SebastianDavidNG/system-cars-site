<footer class="bg-footer text-white">
    <div class="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <!-- Columna 1: Logo -->
        <div class="footer-logo justify-center md:justify-start flex">
            <?php 
            $footer_logo = get_field('logo_footer', 61);  
            if ($footer_logo) : ?>
                <img src="<?php echo esc_url($footer_logo['url']); ?>"
                    alt="<?php echo esc_attr($footer_logo['alt']); ?>"
                    class="h-12 w-auto object-contain">
            <?php endif; ?>
        </div>



        <!-- Columna 2: Información de contacto -->
        <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold mb-4 uppercase">Información de contacto</h3>
            <ul class="space-y-2 text-sm text-white">
                <li>BOGOTÁ - COLOMBIA</li>
                <li><a href="https://maps.app.goo.gl/GZrgUUa9p6Dk5tek6?g_st=ipc" target="_blank">AV CALLE 1 # 25 - 42</a></li>
                <li>
                    <?php
                    $footer_email = function_exists( 'get_field' ) ? get_field( 'email_footer', 61 ) : '';
                    $footer_email = is_string( $footer_email ) ? trim( $footer_email ) : '';
                    if ( $footer_email === '' ) {
                        $footer_email = 'info@systemcars.com';
                    }
                    $footer_mailto = 'mailto:' . $footer_email
                        . '?subject=' . rawurlencode( 'Quisiera recibir más información' )
                        . '&body=' . rawurlencode( 'Hola, es System Cars, quisiera una cotización sobre...' );
                    ?>
                    <a href="<?php echo esc_url( $footer_mailto ); ?>">
                        <?php echo esc_html( $footer_email ); ?>
                    </a>
                </li>
                <?php
                // Mismos teléfonos ACF que la barra de información del header.
                $info_page = get_page_by_path( 'barra-de-informacion' );
                $info_id   = $info_page ? $info_page->ID : 0;
                $telefono1 = ( function_exists( 'get_field' ) && $info_id ) ? get_field( 'telefono_1', $info_id ) : '';
                $telefono2 = ( function_exists( 'get_field' ) && $info_id ) ? get_field( 'telefono_2', $info_id ) : '';
                $tel1_href = $telefono1 ? preg_replace( '/\D+/', '', (string) $telefono1 ) : '';
                $tel2_href = $telefono2 ? preg_replace( '/\D+/', '', (string) $telefono2 ) : '';
                ?>
                <?php if ( $telefono1 && $tel1_href ) : ?>
                    <li><a href="tel:<?php echo esc_attr( $tel1_href ); ?>"><?php echo esc_html( $telefono1 ); ?></a></li>
                <?php endif; ?>
                <?php if ( $telefono2 && $tel2_href ) : ?>
                    <li><a href="tel:<?php echo esc_attr( $tel2_href ); ?>"><?php echo esc_html( $telefono2 ); ?></a></li>
                <?php endif; ?>



                
            </ul>
        </div>

        <!-- Columna 3: Sobre nosotros (menú WP) -->
        <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold mb-4 uppercase">Sobre nosotros</h3>
            <?php
            wp_nav_menu([
                'theme_location' => 'footer',
                'menu_class'     => 'space-y-2 text-sm flex flex-col uppercase text-white',
                'container'      => false,
            ]);
            ?>
        </div>

        <!-- Columna 4: Encuéntranos en (redes sociales) -->
        <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold mb-4 uppercase">Encuéntranos en</h3>
            <div class="footer-social flex space-x-3 justify-center md:justify-start">
                <a href="https://www.facebook.com/system.cars1" target="_blank" class="w-10 h-10 flex items-center justify-center bg-secondary rounded hover:bg-blue-600">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.instagram.com/system.cars" target="_blank" class="w-10 h-10 flex items-center justify-center bg-secondary rounded hover:bg-pink-500">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://youtube.com" target="_blank" class="w-10 h-10 flex items-center justify-center bg-secondary rounded hover:bg-red-600">
                    <i class="fab fa-youtube"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- Separador -->
    <div class="border-t border-gray-700 mt-8"></div>

    <!-- Copyright -->
    <div class="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
        <p>&copy; <?php echo date('Y'); ?> System Cars – Todos los derechos reservados</p>
    </div>
</footer>

<!-- Quick View Modal -->
<div id="quick-view-modal" class="quick-view-modal" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="quick-view-modal__overlay"></div>
    <div class="quick-view-modal__container">
        <!-- Close button (mismo estilo que video modal) -->
        <button type="button" class="quick-view-modal__close" aria-label="<?php esc_attr_e( 'Cerrar', 'system-cars-theme' ); ?>"></button>

        <!-- Modal content -->
        <div class="quick-view-modal__content">
            <!-- Loading spinner -->
            <div class="quick-view-modal__loading">
                <div class="quick-view-modal__spinner"></div>
            </div>

            <!-- Product content will be loaded here via AJAX -->
            <div class="quick-view-modal__product"></div>
        </div>
    </div>
</div>

<?php wp_footer(); ?>
</body>
</html>
