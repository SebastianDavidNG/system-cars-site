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
                <li><a href="mailto:contacto@systemcars.com?subject=Quisiera%20recibir%20más%20información&body=Hola,%20es%20System%20Cars,%20quisiera%20una%20cotización%20sobre...">contacto@systemcars.com</a></li>
                <li><a href="tel:3208158975">320 815 89 75</a></li>
                <li><a href="tel:3005605344">300 560 53 44</a></li>
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
                <a href="https://facebook.com" target="_blank" class="w-10 h-10 flex items-center justify-center bg-secondary rounded hover:bg-blue-600">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" target="_blank" class="w-10 h-10 flex items-center justify-center bg-secondary rounded hover:bg-pink-500">
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
