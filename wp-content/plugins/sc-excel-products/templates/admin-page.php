<?php
/**
 * Admin Page Template
 *
 * @package SC_Excel_Products
 */

namespace SC_Excel_Products;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$counts = Admin_Page::get_product_counts();
?>

<div class="wrap sc-excel-products-wrap">
    <h1 class="wp-heading-inline">
        <span class="dashicons dashicons-media-spreadsheet"></span>
        <?php esc_html_e( 'Excel Inventario', 'sc-excel-products' ); ?>
    </h1>

    <?php if ( ! $composer_installed ) : ?>
        <div class="notice notice-error">
            <p>
                <strong><?php esc_html_e( 'Dependencias no instaladas', 'sc-excel-products' ); ?></strong><br>
                <?php esc_html_e( 'Ejecuta el siguiente comando en el directorio del plugin:', 'sc-excel-products' ); ?>
                <code>composer install</code>
            </p>
        </div>
    <?php else : ?>

        <!-- Product Stats -->
        <div class="sc-excel-stats">
            <div class="sc-excel-stat">
                <span class="sc-excel-stat__number"><?php echo esc_html( $counts['simple'] ); ?></span>
                <span class="sc-excel-stat__label"><?php esc_html_e( 'Productos Simples', 'sc-excel-products' ); ?></span>
            </div>
            <div class="sc-excel-stat">
                <span class="sc-excel-stat__number"><?php echo esc_html( $counts['variable'] ); ?></span>
                <span class="sc-excel-stat__label"><?php esc_html_e( 'Productos Variables', 'sc-excel-products' ); ?></span>
            </div>
            <div class="sc-excel-stat">
                <span class="sc-excel-stat__number"><?php echo esc_html( $counts['variations'] ); ?></span>
                <span class="sc-excel-stat__label"><?php esc_html_e( 'Variaciones', 'sc-excel-products' ); ?></span>
            </div>
            <div class="sc-excel-stat sc-excel-stat--total">
                <span class="sc-excel-stat__number"><?php echo esc_html( $counts['total'] ); ?></span>
                <span class="sc-excel-stat__label"><?php esc_html_e( 'Total', 'sc-excel-products' ); ?></span>
            </div>
        </div>

        <div class="sc-excel-sections">
            <!-- Export Section -->
            <div class="sc-excel-section sc-excel-section--export">
                <div class="sc-excel-section__header">
                    <h2>
                        <span class="dashicons dashicons-download"></span>
                        <?php esc_html_e( 'Exportar Productos', 'sc-excel-products' ); ?>
                    </h2>
                </div>
                <div class="sc-excel-section__content">
                    <p><?php esc_html_e( 'Descarga todos los productos de WooCommerce en un archivo Excel. Este archivo incluye:', 'sc-excel-products' ); ?></p>
                    <ul>
                        <li><?php esc_html_e( 'Productos simples y variables', 'sc-excel-products' ); ?></li>
                        <li><?php esc_html_e( 'Variaciones de productos', 'sc-excel-products' ); ?></li>
                        <li><?php esc_html_e( 'Precios, stock, categorías, imágenes', 'sc-excel-products' ); ?></li>
                        <li><?php esc_html_e( 'Atributos y dimensiones', 'sc-excel-products' ); ?></li>
                    </ul>
                    <p class="sc-excel-section__note">
                        <span class="dashicons dashicons-info"></span>
                        <?php esc_html_e( 'Puedes modificar este archivo y subirlo de nuevo para actualizar los productos.', 'sc-excel-products' ); ?>
                    </p>
                    <button type="button" id="sc-export-btn" class="button button-primary button-hero">
                        <span class="dashicons dashicons-download"></span>
                        <?php esc_html_e( 'Descargar Excel', 'sc-excel-products' ); ?>
                    </button>
                </div>
            </div>

            <!-- Import Section -->
            <div class="sc-excel-section sc-excel-section--import">
                <div class="sc-excel-section__header">
                    <h2>
                        <span class="dashicons dashicons-upload"></span>
                        <?php esc_html_e( 'Importar Productos', 'sc-excel-products' ); ?>
                    </h2>
                </div>
                <div class="sc-excel-section__content">
                    <p><?php esc_html_e( 'Sube un archivo Excel para crear o actualizar productos. El archivo debe tener el formato correcto (usa un archivo exportado como plantilla).', 'sc-excel-products' ); ?></p>

                    <div class="sc-excel-dropzone" id="sc-dropzone">
                        <div class="sc-excel-dropzone__content">
                            <span class="dashicons dashicons-upload"></span>
                            <p><?php esc_html_e( 'Arrastra un archivo aquí o haz clic para seleccionar', 'sc-excel-products' ); ?></p>
                            <span class="sc-excel-dropzone__formats"><?php esc_html_e( 'Formatos aceptados: .xlsx, .xls', 'sc-excel-products' ); ?></span>
                        </div>
                        <input type="file" id="sc-import-file" accept=".xlsx,.xls" style="display: none;">
                    </div>

                    <div class="sc-excel-file-info" id="sc-file-info" style="display: none;">
                        <span class="dashicons dashicons-media-spreadsheet"></span>
                        <span class="sc-excel-file-info__name" id="sc-file-name"></span>
                        <button type="button" class="sc-excel-file-info__remove" id="sc-file-remove">
                            <span class="dashicons dashicons-no-alt"></span>
                        </button>
                    </div>

                    <!-- Preview Area -->
                    <div class="sc-excel-preview" id="sc-preview" style="display: none;">
                        <h3><?php esc_html_e( 'Vista Previa', 'sc-excel-products' ); ?></h3>
                        <div class="sc-excel-preview__summary" id="sc-preview-summary"></div>
                        <div class="sc-excel-preview__table-wrapper">
                            <table class="wp-list-table widefat fixed striped">
                                <thead>
                                    <tr>
                                        <th><?php esc_html_e( 'Fila', 'sc-excel-products' ); ?></th>
                                        <th><?php esc_html_e( 'Tipo', 'sc-excel-products' ); ?></th>
                                        <th><?php esc_html_e( 'SKU', 'sc-excel-products' ); ?></th>
                                        <th><?php esc_html_e( 'Nombre', 'sc-excel-products' ); ?></th>
                                        <th><?php esc_html_e( 'Precio', 'sc-excel-products' ); ?></th>
                                        <th><?php esc_html_e( 'Acción', 'sc-excel-products' ); ?></th>
                                    </tr>
                                </thead>
                                <tbody id="sc-preview-body"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Import Button -->
                    <div class="sc-excel-import-actions" id="sc-import-actions" style="display: none;">
                        <button type="button" id="sc-import-btn" class="button button-primary button-hero">
                            <span class="dashicons dashicons-database-import"></span>
                            <?php esc_html_e( 'Importar Productos', 'sc-excel-products' ); ?>
                        </button>
                    </div>

                    <!-- Progress -->
                    <div class="sc-excel-progress" id="sc-progress" style="display: none;">
                        <div class="sc-excel-progress__bar">
                            <div class="sc-excel-progress__fill" id="sc-progress-fill"></div>
                        </div>
                        <p class="sc-excel-progress__text" id="sc-progress-text"></p>
                    </div>

                    <!-- Results -->
                    <div class="sc-excel-results" id="sc-results" style="display: none;">
                        <h3><?php esc_html_e( 'Resultados de la Importación', 'sc-excel-products' ); ?></h3>
                        <div class="sc-excel-results__summary" id="sc-results-summary"></div>
                        <div class="sc-excel-results__messages" id="sc-results-messages"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Format Info -->
        <div class="sc-excel-format-info">
            <h3>
                <span class="dashicons dashicons-editor-help"></span>
                <?php esc_html_e( 'Formato del Archivo Excel', 'sc-excel-products' ); ?>
            </h3>
            <p><?php esc_html_e( 'El archivo Excel debe contener las siguientes columnas:', 'sc-excel-products' ); ?></p>
            <div class="sc-excel-format-table">
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th><?php esc_html_e( 'Columna', 'sc-excel-products' ); ?></th>
                            <th><?php esc_html_e( 'Descripción', 'sc-excel-products' ); ?></th>
                            <th><?php esc_html_e( 'Ejemplo', 'sc-excel-products' ); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>ID</strong></td>
                            <td><?php esc_html_e( 'ID del producto (vacío para nuevos)', 'sc-excel-products' ); ?></td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td><strong>Tipo</strong></td>
                            <td><?php esc_html_e( 'simple, variable o variation', 'sc-excel-products' ); ?></td>
                            <td>variable</td>
                        </tr>
                        <tr>
                            <td><strong>SKU</strong></td>
                            <td><?php esc_html_e( 'Código único del producto', 'sc-excel-products' ); ?></td>
                            <td>PROD-001</td>
                        </tr>
                        <tr>
                            <td><strong>Parent SKU</strong></td>
                            <td><?php esc_html_e( 'SKU del producto padre (solo para variaciones)', 'sc-excel-products' ); ?></td>
                            <td>PROD-001</td>
                        </tr>
                        <tr>
                            <td><strong>Categorías</strong></td>
                            <td><?php esc_html_e( 'Categorías separadas por |', 'sc-excel-products' ); ?></td>
                            <td>Ropa | Camisetas</td>
                        </tr>
                        <tr>
                            <td><strong>Imágenes</strong></td>
                            <td><?php esc_html_e( 'URLs de imágenes (galería separada por |)', 'sc-excel-products' ); ?></td>
                            <td>https://...</td>
                        </tr>
                        <tr>
                            <td><strong>Atributos</strong></td>
                            <td><?php esc_html_e( 'Valores separados por coma', 'sc-excel-products' ); ?></td>
                            <td>Rojo, Azul, Verde</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="sc-excel-format-tip">
                <span class="dashicons dashicons-lightbulb"></span>
                <?php esc_html_e( 'Tip: Exporta tus productos actuales para ver el formato exacto y usarlo como plantilla.', 'sc-excel-products' ); ?>
            </p>
        </div>

    <?php endif; ?>
</div>
