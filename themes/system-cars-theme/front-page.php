<?php get_header(); ?>

<main id="main" class="site-main">
    <?php
    // Mostrar contenido del editor de bloques.
    if (have_posts()) {
        while (have_posts()) {
            the_post();
            the_content(); // Aquí se renderizan los bloques de Gutenberg.
        }
    }
    ?>
</main>

<?php get_footer(); ?>