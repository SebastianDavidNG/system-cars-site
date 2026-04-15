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
     * Handle import AJAX request
     */
    public function handle_import() {
        // Security check
        check_ajax_referer( 'sc_import_products', 'nonce' );

        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_send_json_error( array( 'message' => __( 'No tienes permisos para realizar esta acción.', 'sc-excel-products' ) ) );
        }

        // Check file upload
        if ( empty( $_FILES['file'] ) || $_FILES['file']['error'] !== UPLOAD_ERR_OK ) {
            wp_send_json_error( array( 'message' => __( 'Error al subir el archivo.', 'sc-excel-products' ) ) );
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

        // Increase memory and time limits
        ini_set( 'memory_limit', '512M' );
        set_time_limit( 600 );

        try {
            // Load spreadsheet
            $spreadsheet = IOFactory::load( $file['tmp_name'] );
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();

            // Validate headers
            $headers = $this->get_row_data( $sheet, 1, $highestColumn );
            if ( ! $this->validate_headers( $headers ) ) {
                wp_send_json_error( array( 'message' => __( 'El formato del archivo no es válido. Asegúrate de usar un archivo exportado desde este sistema.', 'sc-excel-products' ) ) );
            }

            // First pass: Process parent products (simple and variable)
            for ( $row = 2; $row <= $highestRow; $row++ ) {
                $row_data = $this->get_row_data( $sheet, $row, $highestColumn );
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                // Skip empty rows
                if ( empty( $mapped_data['name'] ) && empty( $mapped_data['sku'] ) ) {
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
            for ( $row = 2; $row <= $highestRow; $row++ ) {
                $row_data = $this->get_row_data( $sheet, $row, $highestColumn );
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                // Only process variations
                if ( $mapped_data['type'] !== 'variation' ) {
                    continue;
                }

                // Skip if no parent SKU
                if ( empty( $mapped_data['parent_sku'] ) ) {
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

        } catch ( \Exception $e ) {
            wp_send_json_error( array( 'message' => sprintf( __( 'Error al procesar el archivo: %s', 'sc-excel-products' ), $e->getMessage() ) ) );
        }
    }

    /**
     * Handle preview AJAX request
     */
    public function handle_preview() {
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

        try {
            $spreadsheet = IOFactory::load( $file['tmp_name'] );
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();

            // Get headers
            $headers = $this->get_row_data( $sheet, 1, $highestColumn );

            if ( ! $this->validate_headers( $headers ) ) {
                wp_send_json_error( array( 'message' => __( 'El formato del archivo no es válido.', 'sc-excel-products' ) ) );
            }

            // Get preview (first 10 rows)
            $preview = array();
            $max_preview = min( $highestRow, 11 ); // Header + 10 rows

            for ( $row = 2; $row <= $max_preview; $row++ ) {
                $row_data = $this->get_row_data( $sheet, $row, $highestColumn );
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                // Skip empty rows
                if ( empty( $mapped_data['name'] ) && empty( $mapped_data['sku'] ) ) {
                    continue;
                }

                // Determine action (create/update)
                $action = 'create';
                if ( ! empty( $mapped_data['id'] ) ) {
                    $existing = wc_get_product( $mapped_data['id'] );
                    if ( $existing ) {
                        $action = 'update';
                    }
                } elseif ( ! empty( $mapped_data['sku'] ) ) {
                    $existing_id = wc_get_product_id_by_sku( $mapped_data['sku'] );
                    if ( $existing_id ) {
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
            }

            // Count totals
            $totals = array(
                'total'      => $highestRow - 1,
                'products'   => 0,
                'variations' => 0,
            );

            for ( $row = 2; $row <= $highestRow; $row++ ) {
                $row_data = $this->get_row_data( $sheet, $row, $highestColumn );
                $mapped_data = $this->map_row_to_data( $headers, $row_data );

                if ( empty( $mapped_data['name'] ) && empty( $mapped_data['sku'] ) ) {
                    $totals['total']--;
                    continue;
                }

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

        } catch ( \Exception $e ) {
            wp_send_json_error( array( 'message' => sprintf( __( 'Error al leer el archivo: %s', 'sc-excel-products' ), $e->getMessage() ) ) );
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
     * Map row data to product data array using headers
     *
     * @param array $headers  Headers array
     * @param array $row_data Row data array
     * @return array
     */
    private function map_row_to_data( $headers, $row_data ) {
        $data = array();

        // Create header to index map
        $header_map = array_flip( $headers );

        // Map standard fields
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
