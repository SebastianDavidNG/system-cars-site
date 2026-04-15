<?php
/**
 * Plugin Name: SC Excel Products
 * Plugin URI: https://systemcars.co
 * Description: Exportar e importar productos de WooCommerce mediante archivos Excel (.xlsx)
 * Version: 1.0.0
 * Author: System Cars
 * Author URI: https://systemcars.co
 * Text Domain: sc-excel-products
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * WC requires at least: 7.0
 * WC tested up to: 10.4
 *
 * @package SC_Excel_Products
 */

namespace SC_Excel_Products;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Plugin constants
define( 'SC_EXCEL_PRODUCTS_VERSION', '1.0.0' );
define( 'SC_EXCEL_PRODUCTS_PATH', plugin_dir_path( __FILE__ ) );
define( 'SC_EXCEL_PRODUCTS_URL', plugin_dir_url( __FILE__ ) );
define( 'SC_EXCEL_PRODUCTS_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main plugin class
 */
final class SC_Excel_Products {

    /**
     * Single instance of the class
     *
     * @var SC_Excel_Products
     */
    private static $instance = null;

    /**
     * Admin page instance
     *
     * @var Admin_Page
     */
    public $admin_page;

    /**
     * Exporter instance
     *
     * @var Exporter
     */
    public $exporter;

    /**
     * Importer instance
     *
     * @var Importer
     */
    public $importer;

    /**
     * Get single instance of the class
     *
     * @return SC_Excel_Products
     */
    public static function instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init_hooks();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Declare HPOS compatibility
        add_action( 'before_woocommerce_init', array( $this, 'declare_hpos_compatibility' ) );

        // Load plugin after all plugins are loaded
        add_action( 'plugins_loaded', array( $this, 'init_plugin' ), 20 );

        // Load text domain
        add_action( 'init', array( $this, 'load_textdomain' ) );
    }

    /**
     * Declare compatibility with WooCommerce HPOS (High-Performance Order Storage)
     */
    public function declare_hpos_compatibility() {
        if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
        }
    }

    /**
     * Check plugin requirements
     *
     * @return bool
     */
    private function check_requirements() {
        // Check if WooCommerce is active
        if ( ! class_exists( 'WooCommerce' ) ) {
            add_action( 'admin_notices', array( $this, 'woocommerce_missing_notice' ) );
            return false;
        }

        // Check if Composer autoload exists
        if ( ! file_exists( SC_EXCEL_PRODUCTS_PATH . 'vendor/autoload.php' ) ) {
            add_action( 'admin_notices', array( $this, 'composer_missing_notice' ) );
            return false;
        }

        return true;
    }

    /**
     * Load dependencies
     */
    private function load_dependencies() {
        // Load Composer autoload for PhpSpreadsheet
        if ( file_exists( SC_EXCEL_PRODUCTS_PATH . 'vendor/autoload.php' ) ) {
            require_once SC_EXCEL_PRODUCTS_PATH . 'vendor/autoload.php';
        }

        // Load plugin classes
        require_once SC_EXCEL_PRODUCTS_PATH . 'includes/class-product-handler.php';
        require_once SC_EXCEL_PRODUCTS_PATH . 'includes/class-exporter.php';
        require_once SC_EXCEL_PRODUCTS_PATH . 'includes/class-importer.php';
        require_once SC_EXCEL_PRODUCTS_PATH . 'includes/class-admin-page.php';
    }

    /**
     * Load plugin text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'sc-excel-products',
            false,
            dirname( SC_EXCEL_PRODUCTS_BASENAME ) . '/languages'
        );
    }

    /**
     * Initialize plugin after all plugins are loaded
     */
    public function init_plugin() {
        // Check requirements first
        if ( ! $this->check_requirements() ) {
            return;
        }

        // Load dependencies
        $this->load_dependencies();

        // Initialize classes
        $this->admin_page = new Admin_Page();
        $this->exporter = new Exporter();
        $this->importer = new Importer();
    }

    /**
     * WooCommerce missing notice
     */
    public function woocommerce_missing_notice() {
        ?>
        <div class="notice notice-error">
            <p>
                <strong><?php esc_html_e( 'SC Excel Products', 'sc-excel-products' ); ?></strong>
                <?php esc_html_e( 'requiere WooCommerce para funcionar. Por favor instala y activa WooCommerce.', 'sc-excel-products' ); ?>
            </p>
        </div>
        <?php
    }

    /**
     * Composer missing notice
     */
    public function composer_missing_notice() {
        ?>
        <div class="notice notice-error">
            <p>
                <strong><?php esc_html_e( 'SC Excel Products', 'sc-excel-products' ); ?></strong>
                <?php esc_html_e( 'requiere las dependencias de Composer. Por favor ejecuta "composer install" en el directorio del plugin.', 'sc-excel-products' ); ?>
            </p>
        </div>
        <?php
    }

    /**
     * Prevent cloning
     */
    private function __clone() {}

    /**
     * Prevent unserializing
     */
    public function __wakeup() {
        throw new \Exception( 'Cannot unserialize singleton' );
    }
}

/**
 * Returns the main instance of SC_Excel_Products
 *
 * @return SC_Excel_Products
 */
function sc_excel_products() {
    return SC_Excel_Products::instance();
}

// Initialize the plugin
sc_excel_products();
