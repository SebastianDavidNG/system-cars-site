<?php
/**
 * Importer Class
 *
 * Handles importing WooCommerce products from Excel
 *
 * @package SC_Excel_Products
 */

namespace SC_Excel_Products;

use PhpOffice\PhpSpreadsheet\IOFactory;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Importer
 */
class Importer {

    /**
     * Batch size for processing
     *
     * @var int
     */
    private $batch_size = 50;

    /**
     * Import results
     *
     * @var array
     */
    private $results = array(
        'created'  => 0,
        'updated'  => 0,
        'skipped'  => 0,
        'errors'   => 0,
        'messages' => array(),
    );

    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'wp_ajax_sc_import_products', array( $this, 'handle_import' ) );
        add_action( 'wp_ajax_sc_import_preview', array( $this, 'handle_preview' ) );
    }

    /**
     * Raise PHP limits for Excel processing (hosting often defaults to 128M).
     * Note: set_time_limit / ini_set are frequently disabled on shared hosting.
     */
    private function raise_limits() {
        if ( function_exists( 'wp_raise_memory_limit' ) ) {
            wp_raise_memory_limit( 'admin' );
        }

        // Leading '\' is required inside a namespace; also guard disabled functions.
        if ( function_exists( '\ini_set' ) ) {
            @\ini_set( 'memory_limit', '512M' );
            @\ini_set( 'max_execution_time', '600' );
        }

        if ( function_exists( '\set_time_limit' ) ) {
            @\set_time_limit( 600 );
        }
    }

    /**
     * Load spreadsheet rows into a plain PHP array, then free PhpSpreadsheet memory.
     *
     * @param string $file_path Absolute path to uploaded temp file
     * @param string $original_name Original upload filename (used to detect xlsx/xls)
     * @return array{headers: array, rows: array<int, array>}
     * @throws \Exception
     */
    private function load_rows_from_file( $file_path, $original_name = '' ) {
        // PHP upload tmp paths have no extension — detect type from original filename.
        $ext = strtolower( pathinfo( $original_name !== '' ? $original_name : $file_path, PATHINFO_EXTENSION ) );

        if ( $ext === 'xlsx' ) {
            $reader = IOFactory::createReader( 'Xlsx' );
        } elseif ( $ext === 'xls' ) {
            $reader = IOFactory::createReader( 'Xls' );
        } else {
            // Fallback: sniff file contents (works for tmp uploads without extension).
            $reader = IOFactory::createReaderForFile( $file_path );
        }

        if ( method_exists( $reader, 'setReadDataOnly' ) ) {
            $reader->setReadDataOnly( true );
        }

        $spreadsheet = $reader->load( $file_path );
        $sheet       = $spreadsheet->getActiveSheet();
        $highest_row = max( 1, (int) $sheet->getHighestDataRow() );
        $highest_col = $sheet->getHighestDataColumn();

        $headers = $this->normalize_row_values( $this->get_row_data( $sheet, 1, $highest_col ) );
        $rows    = array();

        for ( $row = 2; $row <= $highest_row; $row++ ) {
            $rows[ $row ] = $this->normalize_row_values( $this->get_row_data( $sheet, $row, $highest_col ) );
        }

        // Free PhpSpreadsheet before WooCommerce product writes (avoids 128M OOM on shared hosting).
        $spreadsheet->disconnectWorksheets();
        unset( $spreadsheet, $sheet, $reader );
        if ( function_exists( '\gc_collect_cycles' ) ) {
            \gc_collect_cycles();
        }

        return array(
            'headers' => $headers,
            'rows'    => $rows,
        );
    }

    /**
     * Normalize Excel cell values (floats/RichText → stable strings for ID/SKU barcodes).
     *
     * @param array $row_data Raw row values
     * @return array
     */
    private function normalize_row_values( $row_data ) {
        foreach ( $row_data as $i => $value ) {
            if ( $value === null ) {
                $row_data[ $i ] = '';
                continue;
            }

            // PhpSpreadsheet may return RichText for formatted cells.
            if ( is_object( $value ) ) {
                if ( method_exists( $value, 'getPlainText' ) ) {
                    $value = $value->getPlainText();
                } elseif ( method_exists( $value, '__toString' ) ) {
                    $value = (string) $value;
                } else {
                    $value = '';
                }
            }

            if ( is_bool( $value ) ) {
                $row_data[ $i ] = $value ? '1' : '';
                continue;
            }

            if ( is_float( $value ) ) {
                // Avoid scientific notation for barcode-like numeric SKUs/IDs.
                if ( floor( $value ) == $value ) {
                    $row_data[ $i ] = sprintf( '%.0f', $value );
                } else {
                    $row_data[ $i ] = rtrim( rtrim( sprintf( '%.8F', $value ), '0' ), '.' );
                }
                continue;
            }

            if ( is_int( $value ) ) {
                $row_data[ $i ] = (string) $value;
                continue;
            }

            if ( is_string( $value ) ) {
                $row_data[ $i ] = trim( $value );
                continue;
            }

            $row_data[ $i ] = '';
        }

        return $row_data;
    }

    /**
     * Ensure AJAX fatals return JSON instead of the WP "critical error" HTML page.
     */
    private function register_ajax_fatal_handler() {
        register_shutdown_function( function () {
            $error = error_get_last();
            if ( ! $error ) {
                return;
            }

            $fatal_types = array( E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR );
            if ( ! in_array( $error['type'], $fatal_types, true ) ) {
                return;
            }

            // Clear any partial HTML output from WP critical error handler if possible.
            while ( ob_get_level() > 0 ) {
                ob_end_clean();
            }

            if ( ! headers_sent() ) {
                status_header( 500 );
                header( 'Content-Type: application/json; charset=utf-8' );
            }

            echo wp_json_encode( array(
                'success' => false,
                'data'    => array(
                    'message' => sprintf(
                        /* translators: 1: error message, 2: file, 3: line */
                        __( 'Error crítico PHP: %1$s en %2$s:%3$d', 'sc-excel-products' ),
                        $error['message'],
                        basename( $error['file'] ),
                        $error['line']
                    ),
                ),
            ) );
        } );
    }

    /**
     * Handle import AJAX request
     */
    public function handle_import() {
        $this->register_ajax_fatal_handler();

        // Security check
        check_ajax_referer( 'sc_import_products', 'nonce' );

        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_send_json_error( array( 'message' => __( 'No tienes permisos para realizar esta acción.', 'sc-excel-products' ) ) );
        }

        // Check file upload
        if ( empty( $_FILES['file'] ) || $_FILES['file']['error'] !== UPLOAD_ERR_OK ) {
            $upload_error = isset( $_FILES['file']['error'] ) ? (int) $_FILES['file']['error'] : -1;
            wp_send_json_error( array(
                'message' => sprintf(
                    /* translators: %d: PHP upload error code */
                    __( 'Error al subir el archivo (código %d).', 'sc-excel-products' ),
                    $upload_error
                ),
            ) );
        }

        // Validate file type
        $file = $_FILES['file'];
        $file_ext = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );

        if ( ! in_array( $file_ext, array( 'xlsx', 'xls' ), true ) ) {
            wp_send_json_error( array( 'message' => __( 'Solo se permiten archivos Excel (.xlsx, .xls).', 'sc-excel-products' ) ) );
        }

        // Check if PhpSpreadsheet is available
        if ( ! class_exists( 'PhpOffice\PhpSpreadsheet\IOFactory' ) ) {
            wp_send_json_error( array( 'message' => __( 'PhpSpreadsheet no está disponible.', 'sc-excel-products' ) ) );
        }

        $this->raise_limits();

        try {
            $loaded  = $this->load_rows_from_file( $file['tmp_name'], $file['name'] );
            $headers = $loaded['headers'];
            $rows    = $loaded['rows'];

            if ( ! $this->validate_headers( $headers ) ) {
                wp_send_json_error( array( 'message' => __( 'El formato del archivo no es válido. Se requieren al menos las columnas: ID, Tipo, SKU y Nombre.', 'sc-excel-products' ) ) );
            }

            // First pass: Process parent products (simple and variable)
            foreach ( $rows as $row => $row_data ) {
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                // Skip empty rows
                if ( $mapped_data['name'] === '' && $mapped_data['sku'] === '' ) {
                    continue;
                }

                // Skip variations in first pass
                if ( $mapped_data['type'] === 'variation' ) {
                    continue;
                }

                $result = Product_Handler::create_or_update_product( $mapped_data );
                $this->process_result( $result, $row );
            }

            // Second pass: Process variations
            foreach ( $rows as $row => $row_data ) {
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                // Only process variations
                if ( $mapped_data['type'] !== 'variation' ) {
                    continue;
                }

                // Skip if no parent SKU
                if ( $mapped_data['parent_sku'] === '' ) {
                    $this->results['skipped']++;
                    $this->results['messages'][] = sprintf(
                        __( 'Fila %d: Variación omitida - no tiene SKU del producto padre.', 'sc-excel-products' ),
                        $row
                    );
                    continue;
                }

                $result = Product_Handler::create_or_update_product( $mapped_data );
                $this->process_result( $result, $row );
            }

            wp_send_json_success( array(
                'results' => $this->results,
                'message' => sprintf(
                    __( 'Importación completada. Creados: %d, Actualizados: %d, Omitidos: %d, Errores: %d', 'sc-excel-products' ),
                    $this->results['created'],
                    $this->results['updated'],
                    $this->results['skipped'],
                    $this->results['errors']
                ),
            ) );

        } catch ( \Throwable $e ) {
            wp_send_json_error( array(
                'message' => sprintf(
                    __( 'Error al procesar el archivo: %s', 'sc-excel-products' ),
                    $e->getMessage()
                ),
            ) );
        }
    }

    /**
     * Handle preview AJAX request
     */
    public function handle_preview() {
        $this->register_ajax_fatal_handler();

        // Security check
        check_ajax_referer( 'sc_import_products', 'nonce' );

        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_send_json_error( array( 'message' => __( 'No tienes permisos para realizar esta acción.', 'sc-excel-products' ) ) );
        }

        // Check file upload
        if ( empty( $_FILES['file'] ) || $_FILES['file']['error'] !== UPLOAD_ERR_OK ) {
            wp_send_json_error( array( 'message' => __( 'Error al subir el archivo.', 'sc-excel-products' ) ) );
        }

        $file = $_FILES['file'];
        $file_ext = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );

        if ( ! in_array( $file_ext, array( 'xlsx', 'xls' ), true ) ) {
            wp_send_json_error( array( 'message' => __( 'Solo se permiten archivos Excel (.xlsx, .xls).', 'sc-excel-products' ) ) );
        }

        $this->raise_limits();

        try {
            $loaded  = $this->load_rows_from_file( $file['tmp_name'], $file['name'] );
            $headers = $loaded['headers'];
            $rows    = $loaded['rows'];

            if ( ! $this->validate_headers( $headers ) ) {
                wp_send_json_error( array( 'message' => __( 'El formato del archivo no es válido.', 'sc-excel-products' ) ) );
            }

            // Get preview (first 10 rows)
            $preview     = array();
            $preview_max = 10;
            $shown       = 0;

            foreach ( $rows as $row => $row_data ) {
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                // Skip empty rows
                if ( $mapped_data['name'] === '' && $mapped_data['sku'] === '' ) {
                    continue;
                }

                if ( $shown < $preview_max ) {
                    // Determine action (create/update) — prefer SKU; Excel ID is often a barcode, not WP ID
                    $action = 'create';
                    if ( $mapped_data['sku'] !== '' ) {
                        $existing_id = wc_get_product_id_by_sku( $mapped_data['sku'] );
                        if ( $existing_id ) {
                            $action = 'update';
                        }
                    } elseif ( $mapped_data['id'] !== '' && absint( $mapped_data['id'] ) ) {
                        $existing = wc_get_product( absint( $mapped_data['id'] ) );
                        if ( $existing ) {
                            $action = 'update';
                        }
                    }

                    $preview[] = array(
                        'row'    => $row,
                        'type'   => $mapped_data['type'],
                        'sku'    => $mapped_data['sku'],
                        'name'   => $mapped_data['name'],
                        'price'  => $mapped_data['regular_price'],
                        'action' => $action,
                    );
                    $shown++;
                }
            }

            // Count totals
            $totals = array(
                'total'      => 0,
                'products'   => 0,
                'variations' => 0,
            );

            foreach ( $rows as $row_data ) {
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                if ( $mapped_data['name'] === '' && $mapped_data['sku'] === '' ) {
                    continue;
                }

                $totals['total']++;
                if ( $mapped_data['type'] === 'variation' ) {
                    $totals['variations']++;
                } else {
                    $totals['products']++;
                }
            }

            wp_send_json_success( array(
                'preview' => $preview,
                'totals'  => $totals,
            ) );

        } catch ( \Throwable $e ) {
            wp_send_json_error( array(
                'message' => sprintf(
                    __( 'Error al leer el archivo: %s', 'sc-excel-products' ),
                    $e->getMessage()
                ),
            ) );
        }
    }

    /**
     * Get row data as array
     *
     * @param object $sheet         Spreadsheet sheet
     * @param int    $row           Row number
     * @param string $highestColumn Highest column letter
     * @return array
     */
    private function get_row_data( $sheet, $row, $highestColumn ) {
        $data = array();
        $columns = range( 'A', 'Z' );
        $columns = array_merge( $columns, array( 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG' ) );

        foreach ( $columns as $col ) {
            $data[] = $sheet->getCell( $col . $row )->getValue();
            if ( $col === $highestColumn ) {
                break;
            }
        }

        return $data;
    }

    /**
     * Validate that headers match expected format
     *
     * @param array $headers Headers array
     * @return bool
     */
    private function validate_headers( $headers ) {
        $required = array( 'ID', 'Tipo', 'SKU', 'Nombre' );

        foreach ( $required as $header ) {
            if ( ! in_array( $header, $headers, true ) ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Alternate header names accepted on import (client Excel formats).
     * Canonical export headers remain the primary keys in $field_map.
     *
     * @var array
     */
    private static $header_aliases = array(
        'sale_price' => array( 'Precio dejando batería antigua' ),
        'weight'     => array( 'Peso en kilos' ),
    );

    /**
     * Map row data to product data array using headers
     *
     * @param array $headers  Headers array
     * @param array $row_data Row data array
     * @return array
     */
    private function map_row_to_data( $headers, $row_data ) {
        $data = array();

        // Create header to index map (only string/int keys — avoids PHP 8 TypeError on array_flip).
        $header_map = array();
        foreach ( $headers as $index => $header ) {
            if ( is_string( $header ) && $header !== '' ) {
                $header_map[ $header ] = $index;
            }
        }

        // Map standard fields (canonical headers used by export)
        $field_map = array(
            'ID'                => 'id',
            'Tipo'              => 'type',
            'SKU'               => 'sku',
            'Parent SKU'        => 'parent_sku',
            'Nombre'            => 'name',
            'Descripción'       => 'description',
            'Descripción corta' => 'short_description',
            'Precio regular'    => 'regular_price',
            'Precio oferta'     => 'sale_price',
            'Stock'             => 'stock_quantity',
            'Gestionar stock'   => 'manage_stock',
            'Estado stock'      => 'stock_status',
            'Categorías'        => 'categories',
            'Etiquetas'         => 'tags',
            'Imagen principal'  => 'image',
            'Galería'           => 'gallery',
            'Peso'              => 'weight',
            'Largo'             => 'length',
            'Ancho'             => 'width',
            'Alto'              => 'height',
            'Estado'            => 'status',
        );

        foreach ( $field_map as $header => $key ) {
            if ( isset( $header_map[ $header ] ) && isset( $row_data[ $header_map[ $header ] ] ) ) {
                $data[ $key ] = $row_data[ $header_map[ $header ] ];
            } else {
                $data[ $key ] = '';
            }
        }

        // Apply client/alternate header aliases when canonical column is empty
        foreach ( self::$header_aliases as $key => $aliases ) {
            if ( $data[ $key ] !== '' && $data[ $key ] !== null ) {
                continue;
            }
            foreach ( $aliases as $alias ) {
                if ( isset( $header_map[ $alias ] ) && isset( $row_data[ $header_map[ $alias ] ] ) ) {
                    $data[ $key ] = $row_data[ $header_map[ $alias ] ];
                    break;
                }
            }
        }

        // Map attributes
        for ( $i = 1; $i <= 3; $i++ ) {
            $name_header = 'Atributo ' . $i . ' nombre';
            $values_header = 'Atributo ' . $i . ' valor(es)';
            $visible_header = 'Atributo ' . $i . ' visible';
            $variation_header = 'Atributo ' . $i . ' variación';

            $data[ 'attr_' . $i . '_name' ] = isset( $header_map[ $name_header ] ) && isset( $row_data[ $header_map[ $name_header ] ] )
                ? $row_data[ $header_map[ $name_header ] ]
                : '';

            $data[ 'attr_' . $i . '_values' ] = isset( $header_map[ $values_header ] ) && isset( $row_data[ $header_map[ $values_header ] ] )
                ? $row_data[ $header_map[ $values_header ] ]
                : '';

            $data[ 'attr_' . $i . '_visible' ] = isset( $header_map[ $visible_header ] ) && isset( $row_data[ $header_map[ $visible_header ] ] )
                ? $row_data[ $header_map[ $visible_header ] ]
                : '';

            $data[ 'attr_' . $i . '_variation' ] = isset( $header_map[ $variation_header ] ) && isset( $row_data[ $header_map[ $variation_header ] ] )
                ? $row_data[ $header_map[ $variation_header ] ]
                : '';
        }

        // Set default type if empty
        if ( empty( $data['type'] ) ) {
            $data['type'] = 'simple';
        }

        return $data;
    }

    /**
     * Process import result and update counters
     *
     * @param array $result Result from create_or_update_product
     * @param int   $row    Row number
     */
    private function process_result( $result, $row ) {
        if ( $result['success'] ) {
            if ( $result['action'] === 'created' ) {
                $this->results['created']++;
            } else {
                $this->results['updated']++;
            }
            $this->results['messages'][] = sprintf( __( 'Fila %d: %s', 'sc-excel-products' ), $row, $result['message'] );
        } else {
            $this->results['errors']++;
            $this->results['messages'][] = sprintf( __( 'Fila %d: %s', 'sc-excel-products' ), $row, $result['message'] );
        }
    }
}
