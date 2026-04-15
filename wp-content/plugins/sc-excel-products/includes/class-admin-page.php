<?php
/**
 * Admin Page Class
 *
 * Handles the admin page for Excel Import/Export
 *
 * @package SC_Excel_Products
 */

namespace SC_Excel_Products;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Admin_Page
 */
class Admin_Page {

    /**
     * Page slug
     *
     * @var string
     */
    private $page_slug = 'sc-excel-products';

    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_menu_page' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
    }

    /**
     * Add menu page under WooCommerce
     */
    public function add_menu_page() {
        add_submenu_page(
            'woocommerce',
            __( 'Excel Inventario', 'sc-excel-products' ),
            __( 'Excel Inventario', 'sc-excel-products' ),
            'manage_woocommerce',
            $this->page_slug,
            array( $this, 'render_page' )
        );
    }

    /**
     * Enqueue admin assets
     *
     * @param string $hook Current admin page hook
     */
    public function enqueue_assets( $hook ) {
        // Only load on our page
        if ( 'woocommerce_page_' . $this->page_slug !== $hook ) {
            return;
        }

        wp_enqueue_style(
            'sc-excel-products-admin',
            SC_EXCEL_PRODUCTS_URL . 'assets/css/admin.css',
            array(),
            SC_EXCEL_PRODUCTS_VERSION
        );

        wp_enqueue_script(
            'sc-excel-products-admin',
            SC_EXCEL_PRODUCTS_URL . 'assets/js/admin.js',
            array( 'jquery' ),
            SC_EXCEL_PRODUCTS_VERSION,
            true
        );

        wp_localize_script( 'sc-excel-products-admin', 'scExcelProducts', array(
            'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
            'importNonce'  => wp_create_nonce( 'sc_import_products' ),
            'exportUrl'    => admin_url( 'admin-post.php?action=sc_export_products&nonce=' . wp_create_nonce( 'sc_export_products' ) ),
            'strings'      => array(
                'selectFile'      => __( 'Selecciona un archivo Excel', 'sc-excel-products' ),
                'uploading'       => __( 'Subiendo archivo...', 'sc-excel-products' ),
                'processing'      => __( 'Procesando productos...', 'sc-excel-products' ),
                'complete'        => __( 'Importación completada', 'sc-excel-products' ),
                'error'           => __( 'Error', 'sc-excel-products' ),
                'confirmImport'   => __( '¿Estás seguro de que deseas importar estos productos?', 'sc-excel-products' ),
                'noFile'          => __( 'Por favor selecciona un archivo.', 'sc-excel-products' ),
                'invalidFile'     => __( 'Solo se permiten archivos Excel (.xlsx, .xls).', 'sc-excel-products' ),
                'created'         => __( 'Creados', 'sc-excel-products' ),
                'updated'         => __( 'Actualizados', 'sc-excel-products' ),
                'skipped'         => __( 'Omitidos', 'sc-excel-products' ),
                'errors'          => __( 'Errores', 'sc-excel-products' ),
            ),
        ) );
    }

    /**
     * Render admin page
     */
    public function render_page() {
        // Check if composer dependencies are installed
        $composer_installed = file_exists( SC_EXCEL_PRODUCTS_PATH . 'vendor/autoload.php' );

        include SC_EXCEL_PRODUCTS_PATH . 'templates/admin-page.php';
    }

    /**
     * Get product count for display
     *
     * @return array
     */
    public static function get_product_counts() {
        $counts = array(
            'simple'     => 0,
            'variable'   => 0,
            'variations' => 0,
            'total'      => 0,
        );

        // Count simple products
        $simple = wc_get_products( array(
            'type'   => 'simple',
            'status' => array( 'publish', 'draft', 'private' ),
            'return' => 'ids',
            'limit'  => -1,
        ) );
        $counts['simple'] = count( $simple );

        // Count variable products
        $variable = wc_get_products( array(
            'type'   => 'variable',
            'status' => array( 'publish', 'draft', 'private' ),
            'return' => 'ids',
            'limit'  => -1,
        ) );
        $counts['variable'] = count( $variable );

        // Count variations
        global $wpdb;
        $counts['variations'] = (int) $wpdb->get_var(
            "SELECT COUNT(ID) FROM {$wpdb->posts} WHERE post_type = 'product_variation' AND post_status IN ('publish', 'private')"
        );

        $counts['total'] = $counts['simple'] + $counts['variable'] + $counts['variations'];

        return $counts;
    }
}
