<?php
/**
 * Exporter Class
 *
 * Handles exporting WooCommerce products to Excel
 *
 * @package SC_Excel_Products
 */

namespace SC_Excel_Products;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Exporter
 */
class Exporter {

    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'admin_post_sc_export_products', array( $this, 'handle_export' ) );
    }

    /**
     * Handle export request
     */
    public function handle_export() {
        // Security check
        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_die( __( 'No tienes permisos para realizar esta acción.', 'sc-excel-products' ) );
        }

        // Verify nonce
        if ( ! isset( $_GET['nonce'] ) || ! wp_verify_nonce( $_GET['nonce'], 'sc_export_products' ) ) {
            wp_die( __( 'Token de seguridad inválido.', 'sc-excel-products' ) );
        }

        // Check if PhpSpreadsheet is available
        if ( ! class_exists( 'PhpOffice\PhpSpreadsheet\Spreadsheet' ) ) {
            wp_die( __( 'PhpSpreadsheet no está disponible. Ejecuta "composer install" en el directorio del plugin.', 'sc-excel-products' ) );
        }

        // Increase memory and time limits
        ini_set( 'memory_limit', '512M' );
        set_time_limit( 300 );

        // Generate Excel
        $this->generate_excel();
    }

    /**
     * Generate and download Excel file
     */
    private function generate_excel() {
        // Create new spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle( 'Productos' );

        // Set headers
        $headers = Product_Handler::$headers;
        $col = 'A';
        foreach ( $headers as $column => $header ) {
            $sheet->setCellValue( $column . '1', $header );
            $col = $column;
        }

        // Style headers
        $lastCol = $col;
        $headerRange = 'A1:' . $lastCol . '1';

        $sheet->getStyle( $headerRange )->applyFromArray( array(
            'font' => array(
                'bold' => true,
                'color' => array( 'rgb' => 'FFFFFF' ),
            ),
            'fill' => array(
                'fillType' => Fill::FILL_SOLID,
                'startColor' => array( 'rgb' => '002060' ),
            ),
            'alignment' => array(
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ),
            'borders' => array(
                'allBorders' => array(
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => array( 'rgb' => '000000' ),
                ),
            ),
        ) );

        // Freeze header row
        $sheet->freezePane( 'A2' );

        // Get products
        $products = Product_Handler::get_all_products();

        // Fill data
        $row = 2;
        foreach ( $products as $product ) {
            $sheet->setCellValue( 'A' . $row, $product['id'] );
            $sheet->setCellValue( 'B' . $row, $product['type'] );
            $sheet->setCellValue( 'C' . $row, $product['sku'] );
            $sheet->setCellValue( 'D' . $row, $product['parent_sku'] );
            $sheet->setCellValue( 'E' . $row, $product['name'] );
            $sheet->setCellValue( 'F' . $row, $product['description'] );
            $sheet->setCellValue( 'G' . $row, $product['short_description'] );
            $sheet->setCellValue( 'H' . $row, $product['regular_price'] );
            $sheet->setCellValue( 'I' . $row, $product['sale_price'] );
            $sheet->setCellValue( 'J' . $row, $product['stock_quantity'] );
            $sheet->setCellValue( 'K' . $row, $product['manage_stock'] );
            $sheet->setCellValue( 'L' . $row, $product['stock_status'] );
            $sheet->setCellValue( 'M' . $row, $product['categories'] );
            $sheet->setCellValue( 'N' . $row, $product['tags'] );
            $sheet->setCellValue( 'O' . $row, $product['image'] );
            $sheet->setCellValue( 'P' . $row, $product['gallery'] );

            // Attributes
            $sheet->setCellValue( 'Q' . $row, isset( $product['attr_1_name'] ) ? $product['attr_1_name'] : '' );
            $sheet->setCellValue( 'R' . $row, isset( $product['attr_1_values'] ) ? $product['attr_1_values'] : '' );
            $sheet->setCellValue( 'S' . $row, isset( $product['attr_1_visible'] ) ? $product['attr_1_visible'] : '' );
            $sheet->setCellValue( 'T' . $row, isset( $product['attr_1_variation'] ) ? $product['attr_1_variation'] : '' );

            $sheet->setCellValue( 'U' . $row, isset( $product['attr_2_name'] ) ? $product['attr_2_name'] : '' );
            $sheet->setCellValue( 'V' . $row, isset( $product['attr_2_values'] ) ? $product['attr_2_values'] : '' );
            $sheet->setCellValue( 'W' . $row, isset( $product['attr_2_visible'] ) ? $product['attr_2_visible'] : '' );
            $sheet->setCellValue( 'X' . $row, isset( $product['attr_2_variation'] ) ? $product['attr_2_variation'] : '' );

            $sheet->setCellValue( 'Y' . $row, isset( $product['attr_3_name'] ) ? $product['attr_3_name'] : '' );
            $sheet->setCellValue( 'Z' . $row, isset( $product['attr_3_values'] ) ? $product['attr_3_values'] : '' );
            $sheet->setCellValue( 'AA' . $row, isset( $product['attr_3_visible'] ) ? $product['attr_3_visible'] : '' );
            $sheet->setCellValue( 'AB' . $row, isset( $product['attr_3_variation'] ) ? $product['attr_3_variation'] : '' );

            // Dimensions
            $sheet->setCellValue( 'AC' . $row, $product['weight'] );
            $sheet->setCellValue( 'AD' . $row, $product['length'] );
            $sheet->setCellValue( 'AE' . $row, $product['width'] );
            $sheet->setCellValue( 'AF' . $row, $product['height'] );

            // Status
            $sheet->setCellValue( 'AG' . $row, $product['status'] );

            // Style variation rows differently
            if ( $product['type'] === 'variation' ) {
                $sheet->getStyle( 'A' . $row . ':' . $lastCol . $row )->applyFromArray( array(
                    'fill' => array(
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => array( 'rgb' => 'F5F5F5' ),
                    ),
                ) );
            }

            $row++;
        }

        // Auto-size columns
        foreach ( range( 'A', 'Z' ) as $col ) {
            $sheet->getColumnDimension( $col )->setAutoSize( true );
        }
        $sheet->getColumnDimension( 'AA' )->setAutoSize( true );
        $sheet->getColumnDimension( 'AB' )->setAutoSize( true );
        $sheet->getColumnDimension( 'AC' )->setAutoSize( true );
        $sheet->getColumnDimension( 'AD' )->setAutoSize( true );
        $sheet->getColumnDimension( 'AE' )->setAutoSize( true );
        $sheet->getColumnDimension( 'AF' )->setAutoSize( true );
        $sheet->getColumnDimension( 'AG' )->setAutoSize( true );

        // Set description column width (don't auto-size, it can be too wide)
        $sheet->getColumnDimension( 'F' )->setAutoSize( false );
        $sheet->getColumnDimension( 'F' )->setWidth( 50 );
        $sheet->getColumnDimension( 'G' )->setAutoSize( false );
        $sheet->getColumnDimension( 'G' )->setWidth( 30 );

        // Generate filename with date
        $filename = 'productos-' . date( 'Y-m-d' ) . '.xlsx';

        // Set headers for download
        header( 'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
        header( 'Content-Disposition: attachment;filename="' . $filename . '"' );
        header( 'Cache-Control: max-age=0' );
        header( 'Pragma: public' );

        // Output file
        $writer = new Xlsx( $spreadsheet );
        $writer->save( 'php://output' );

        exit;
    }
}
