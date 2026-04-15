<?php
/**
 * Product Handler Class
 *
 * Handles product data extraction and creation for WooCommerce products
 *
 * @package SC_Excel_Products
 */

namespace SC_Excel_Products;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Product_Handler
 */
class Product_Handler {

    /**
     * Excel column headers
     *
     * @var array
     */
    public static $headers = array(
        'A' => 'ID',
        'B' => 'Tipo',
        'C' => 'SKU',
        'D' => 'Parent SKU',
        'E' => 'Nombre',
        'F' => 'Descripción',
        'G' => 'Descripción corta',
        'H' => 'Precio regular',
        'I' => 'Precio oferta',
        'J' => 'Stock',
        'K' => 'Gestionar stock',
        'L' => 'Estado stock',
        'M' => 'Categorías',
        'N' => 'Etiquetas',
        'O' => 'Imagen principal',
        'P' => 'Galería',
        'Q' => 'Atributo 1 nombre',
        'R' => 'Atributo 1 valor(es)',
        'S' => 'Atributo 1 visible',
        'T' => 'Atributo 1 variación',
        'U' => 'Atributo 2 nombre',
        'V' => 'Atributo 2 valor(es)',
        'W' => 'Atributo 2 visible',
        'X' => 'Atributo 2 variación',
        'Y' => 'Atributo 3 nombre',
        'Z' => 'Atributo 3 valor(es)',
        'AA' => 'Atributo 3 visible',
        'AB' => 'Atributo 3 variación',
        'AC' => 'Peso',
        'AD' => 'Largo',
        'AE' => 'Ancho',
        'AF' => 'Alto',
        'AG' => 'Estado',
    );

    /**
     * Get all products for export
     *
     * @return array
     */
    public static function get_all_products() {
        $products = array();

        // Get all product types
        $args = array(
            'limit'  => -1,
            'status' => array( 'publish', 'draft', 'private' ),
            'type'   => array( 'simple', 'variable' ),
        );

        $wc_products = wc_get_products( $args );

        foreach ( $wc_products as $product ) {
            // Add the main product
            $products[] = self::extract_product_data( $product );

            // If variable, add variations
            if ( $product->is_type( 'variable' ) ) {
                $variations = $product->get_children();
                foreach ( $variations as $variation_id ) {
                    $variation = wc_get_product( $variation_id );
                    if ( $variation ) {
                        $products[] = self::extract_variation_data( $variation, $product );
                    }
                }
            }
        }

        return $products;
    }

    /**
     * Extract product data for export
     *
     * @param \WC_Product $product Product object
     * @return array
     */
    public static function extract_product_data( $product ) {
        $data = array(
            'id'                => $product->get_id(),
            'type'              => $product->get_type(),
            'sku'               => $product->get_sku(),
            'parent_sku'        => '',
            'name'              => $product->get_name(),
            'description'       => $product->get_description(),
            'short_description' => $product->get_short_description(),
            'regular_price'     => $product->get_regular_price(),
            'sale_price'        => $product->get_sale_price(),
            'stock_quantity'    => $product->get_stock_quantity(),
            'manage_stock'      => $product->get_manage_stock() ? 'yes' : 'no',
            'stock_status'      => $product->get_stock_status(),
            'categories'        => self::get_product_categories( $product ),
            'tags'              => self::get_product_tags( $product ),
            'image'             => self::get_product_image( $product ),
            'gallery'           => self::get_product_gallery( $product ),
            'weight'            => $product->get_weight(),
            'length'            => $product->get_length(),
            'width'             => $product->get_width(),
            'height'            => $product->get_height(),
            'status'            => $product->get_status(),
        );

        // Add attributes
        $attributes = self::get_product_attributes( $product );
        $data = array_merge( $data, $attributes );

        return $data;
    }

    /**
     * Extract variation data for export
     *
     * @param \WC_Product_Variation $variation Variation object
     * @param \WC_Product_Variable  $parent    Parent product
     * @return array
     */
    public static function extract_variation_data( $variation, $parent ) {
        $data = array(
            'id'                => $variation->get_id(),
            'type'              => 'variation',
            'sku'               => $variation->get_sku(),
            'parent_sku'        => $parent->get_sku(),
            'name'              => $variation->get_name(),
            'description'       => $variation->get_description(),
            'short_description' => '',
            'regular_price'     => $variation->get_regular_price(),
            'sale_price'        => $variation->get_sale_price(),
            'stock_quantity'    => $variation->get_stock_quantity(),
            'manage_stock'      => $variation->get_manage_stock() ? 'yes' : 'no',
            'stock_status'      => $variation->get_stock_status(),
            'categories'        => '',
            'tags'              => '',
            'image'             => self::get_product_image( $variation ),
            'gallery'           => '',
            'weight'            => $variation->get_weight(),
            'length'            => $variation->get_length(),
            'width'             => $variation->get_width(),
            'height'            => $variation->get_height(),
            'status'            => $variation->get_status(),
        );

        // Add variation attributes
        $attributes = $variation->get_attributes();
        $attr_index = 1;
        foreach ( $attributes as $attr_name => $attr_value ) {
            if ( $attr_index > 3 ) break;

            // Clean attribute name (remove 'pa_' prefix if present)
            $clean_name = str_replace( 'pa_', '', $attr_name );

            $data[ 'attr_' . $attr_index . '_name' ]      = $clean_name;
            $data[ 'attr_' . $attr_index . '_values' ]    = $attr_value;
            $data[ 'attr_' . $attr_index . '_visible' ]   = 'yes';
            $data[ 'attr_' . $attr_index . '_variation' ] = 'yes';
            $attr_index++;
        }

        // Fill empty attribute slots
        while ( $attr_index <= 3 ) {
            $data[ 'attr_' . $attr_index . '_name' ]      = '';
            $data[ 'attr_' . $attr_index . '_values' ]    = '';
            $data[ 'attr_' . $attr_index . '_visible' ]   = '';
            $data[ 'attr_' . $attr_index . '_variation' ] = '';
            $attr_index++;
        }

        return $data;
    }

    /**
     * Get product categories as string
     *
     * @param \WC_Product $product Product object
     * @return string
     */
    public static function get_product_categories( $product ) {
        $categories = array();
        $terms = get_the_terms( $product->get_id(), 'product_cat' );

        if ( $terms && ! is_wp_error( $terms ) ) {
            foreach ( $terms as $term ) {
                $categories[] = $term->name;
            }
        }

        return implode( ' | ', $categories );
    }

    /**
     * Get product tags as string
     *
     * @param \WC_Product $product Product object
     * @return string
     */
    public static function get_product_tags( $product ) {
        $tags = array();
        $terms = get_the_terms( $product->get_id(), 'product_tag' );

        if ( $terms && ! is_wp_error( $terms ) ) {
            foreach ( $terms as $term ) {
                $tags[] = $term->name;
            }
        }

        return implode( ' | ', $tags );
    }

    /**
     * Get product main image URL
     *
     * @param \WC_Product $product Product object
     * @return string
     */
    public static function get_product_image( $product ) {
        $image_id = $product->get_image_id();
        if ( $image_id ) {
            return wp_get_attachment_url( $image_id );
        }
        return '';
    }

    /**
     * Get product gallery images URLs
     *
     * @param \WC_Product $product Product object
     * @return string
     */
    public static function get_product_gallery( $product ) {
        $gallery_ids = $product->get_gallery_image_ids();
        $urls = array();

        foreach ( $gallery_ids as $id ) {
            $url = wp_get_attachment_url( $id );
            if ( $url ) {
                $urls[] = $url;
            }
        }

        return implode( ' | ', $urls );
    }

    /**
     * Get product attributes formatted for export
     *
     * @param \WC_Product $product Product object
     * @return array
     */
    public static function get_product_attributes( $product ) {
        $attributes = $product->get_attributes();
        $data = array();
        $attr_index = 1;

        foreach ( $attributes as $attribute ) {
            if ( $attr_index > 3 ) break;

            if ( $attribute instanceof \WC_Product_Attribute ) {
                $name = $attribute->get_name();

                // Check if it's a taxonomy attribute
                if ( $attribute->is_taxonomy() ) {
                    $name = str_replace( 'pa_', '', $name );
                    $terms = $attribute->get_terms();
                    $values = array();
                    foreach ( $terms as $term ) {
                        $values[] = $term->name;
                    }
                    $values_str = implode( ', ', $values );
                } else {
                    $values_str = implode( ', ', $attribute->get_options() );
                }

                $data[ 'attr_' . $attr_index . '_name' ]      = $name;
                $data[ 'attr_' . $attr_index . '_values' ]    = $values_str;
                $data[ 'attr_' . $attr_index . '_visible' ]   = $attribute->get_visible() ? 'yes' : 'no';
                $data[ 'attr_' . $attr_index . '_variation' ] = $attribute->get_variation() ? 'yes' : 'no';
                $attr_index++;
            }
        }

        // Fill empty attribute slots
        while ( $attr_index <= 3 ) {
            $data[ 'attr_' . $attr_index . '_name' ]      = '';
            $data[ 'attr_' . $attr_index . '_values' ]    = '';
            $data[ 'attr_' . $attr_index . '_visible' ]   = '';
            $data[ 'attr_' . $attr_index . '_variation' ] = '';
            $attr_index++;
        }

        return $data;
    }

    /**
     * Create or update product from import data
     *
     * @param array $data Row data from Excel
     * @return array Result with status and message
     */
    public static function create_or_update_product( $data ) {
        try {
            $product_id = ! empty( $data['id'] ) ? absint( $data['id'] ) : 0;
            $sku = ! empty( $data['sku'] ) ? sanitize_text_field( $data['sku'] ) : '';
            $type = ! empty( $data['type'] ) ? sanitize_text_field( $data['type'] ) : 'simple';

            // Handle variations separately
            if ( $type === 'variation' ) {
                return self::create_or_update_variation( $data );
            }

            // Try to find existing product
            $product = null;
            if ( $product_id ) {
                $product = wc_get_product( $product_id );
            }
            if ( ! $product && $sku ) {
                $existing_id = wc_get_product_id_by_sku( $sku );
                if ( $existing_id ) {
                    $product = wc_get_product( $existing_id );
                }
            }

            // Create new product if not found
            $is_new = false;
            if ( ! $product ) {
                $is_new = true;
                if ( $type === 'variable' ) {
                    $product = new \WC_Product_Variable();
                } else {
                    $product = new \WC_Product_Simple();
                }
            }

            // Set product data
            self::set_product_data( $product, $data );

            // Save product
            $product_id = $product->save();

            return array(
                'success' => true,
                'id'      => $product_id,
                'action'  => $is_new ? 'created' : 'updated',
                'message' => $is_new
                    ? sprintf( __( 'Producto creado: %s (ID: %d)', 'sc-excel-products' ), $product->get_name(), $product_id )
                    : sprintf( __( 'Producto actualizado: %s (ID: %d)', 'sc-excel-products' ), $product->get_name(), $product_id ),
            );

        } catch ( \Exception $e ) {
            return array(
                'success' => false,
                'message' => sprintf( __( 'Error: %s', 'sc-excel-products' ), $e->getMessage() ),
            );
        }
    }

    /**
     * Create or update variation from import data
     *
     * @param array $data Row data from Excel
     * @return array Result with status and message
     */
    public static function create_or_update_variation( $data ) {
        try {
            $variation_id = ! empty( $data['id'] ) ? absint( $data['id'] ) : 0;
            $parent_sku = ! empty( $data['parent_sku'] ) ? sanitize_text_field( $data['parent_sku'] ) : '';
            $sku = ! empty( $data['sku'] ) ? sanitize_text_field( $data['sku'] ) : '';

            // Find parent product
            $parent_id = wc_get_product_id_by_sku( $parent_sku );
            if ( ! $parent_id ) {
                return array(
                    'success' => false,
                    'message' => sprintf( __( 'Producto padre no encontrado con SKU: %s', 'sc-excel-products' ), $parent_sku ),
                );
            }

            $parent = wc_get_product( $parent_id );
            if ( ! $parent || ! $parent->is_type( 'variable' ) ) {
                return array(
                    'success' => false,
                    'message' => sprintf( __( 'El producto padre con SKU %s no es variable', 'sc-excel-products' ), $parent_sku ),
                );
            }

            // Try to find existing variation
            $variation = null;
            if ( $variation_id ) {
                $variation = wc_get_product( $variation_id );
            }
            if ( ! $variation && $sku ) {
                $existing_id = wc_get_product_id_by_sku( $sku );
                if ( $existing_id ) {
                    $variation = wc_get_product( $existing_id );
                }
            }

            // Create new variation if not found
            $is_new = false;
            if ( ! $variation ) {
                $is_new = true;
                $variation = new \WC_Product_Variation();
                $variation->set_parent_id( $parent_id );
            }

            // Set variation data
            self::set_variation_data( $variation, $data );

            // Save variation
            $variation_id = $variation->save();

            return array(
                'success' => true,
                'id'      => $variation_id,
                'action'  => $is_new ? 'created' : 'updated',
                'message' => $is_new
                    ? sprintf( __( 'Variación creada: %s (ID: %d)', 'sc-excel-products' ), $sku, $variation_id )
                    : sprintf( __( 'Variación actualizada: %s (ID: %d)', 'sc-excel-products' ), $sku, $variation_id ),
            );

        } catch ( \Exception $e ) {
            return array(
                'success' => false,
                'message' => sprintf( __( 'Error en variación: %s', 'sc-excel-products' ), $e->getMessage() ),
            );
        }
    }

    /**
     * Set product data from import row
     *
     * @param \WC_Product $product Product object
     * @param array       $data    Row data
     */
    public static function set_product_data( $product, $data ) {
        // Basic data
        if ( ! empty( $data['name'] ) ) {
            $product->set_name( sanitize_text_field( $data['name'] ) );
        }
        if ( ! empty( $data['sku'] ) ) {
            $product->set_sku( sanitize_text_field( $data['sku'] ) );
        }
        if ( isset( $data['description'] ) ) {
            $product->set_description( wp_kses_post( $data['description'] ) );
        }
        if ( isset( $data['short_description'] ) ) {
            $product->set_short_description( wp_kses_post( $data['short_description'] ) );
        }

        // Prices
        if ( isset( $data['regular_price'] ) && $data['regular_price'] !== '' ) {
            $product->set_regular_price( wc_format_decimal( $data['regular_price'] ) );
        }
        if ( isset( $data['sale_price'] ) && $data['sale_price'] !== '' ) {
            $product->set_sale_price( wc_format_decimal( $data['sale_price'] ) );
        }

        // Stock
        if ( isset( $data['manage_stock'] ) ) {
            $product->set_manage_stock( $data['manage_stock'] === 'yes' );
        }
        if ( isset( $data['stock_quantity'] ) && $data['stock_quantity'] !== '' ) {
            $product->set_stock_quantity( absint( $data['stock_quantity'] ) );
        }
        if ( ! empty( $data['stock_status'] ) ) {
            $product->set_stock_status( sanitize_text_field( $data['stock_status'] ) );
        }

        // Dimensions
        if ( isset( $data['weight'] ) && $data['weight'] !== '' ) {
            $product->set_weight( wc_format_decimal( $data['weight'] ) );
        }
        if ( isset( $data['length'] ) && $data['length'] !== '' ) {
            $product->set_length( wc_format_decimal( $data['length'] ) );
        }
        if ( isset( $data['width'] ) && $data['width'] !== '' ) {
            $product->set_width( wc_format_decimal( $data['width'] ) );
        }
        if ( isset( $data['height'] ) && $data['height'] !== '' ) {
            $product->set_height( wc_format_decimal( $data['height'] ) );
        }

        // Status
        if ( ! empty( $data['status'] ) ) {
            $product->set_status( sanitize_text_field( $data['status'] ) );
        }

        // Categories
        if ( ! empty( $data['categories'] ) ) {
            $category_ids = self::get_category_ids( $data['categories'] );
            $product->set_category_ids( $category_ids );
        }

        // Tags
        if ( ! empty( $data['tags'] ) ) {
            $tag_ids = self::get_tag_ids( $data['tags'] );
            $product->set_tag_ids( $tag_ids );
        }

        // Images
        if ( ! empty( $data['image'] ) ) {
            $image_id = self::get_or_import_image( $data['image'] );
            if ( $image_id ) {
                $product->set_image_id( $image_id );
            }
        }

        if ( ! empty( $data['gallery'] ) ) {
            $gallery_ids = self::get_or_import_gallery( $data['gallery'] );
            $product->set_gallery_image_ids( $gallery_ids );
        }

        // Attributes (only for non-variations)
        if ( ! $product->is_type( 'variation' ) ) {
            $attributes = self::parse_attributes( $data );
            if ( ! empty( $attributes ) ) {
                $product->set_attributes( $attributes );
            }
        }
    }

    /**
     * Set variation data from import row
     *
     * @param \WC_Product_Variation $variation Variation object
     * @param array                 $data      Row data
     */
    public static function set_variation_data( $variation, $data ) {
        // Basic data
        if ( ! empty( $data['sku'] ) ) {
            $variation->set_sku( sanitize_text_field( $data['sku'] ) );
        }
        if ( isset( $data['description'] ) ) {
            $variation->set_description( wp_kses_post( $data['description'] ) );
        }

        // Prices
        if ( isset( $data['regular_price'] ) && $data['regular_price'] !== '' ) {
            $variation->set_regular_price( wc_format_decimal( $data['regular_price'] ) );
        }
        if ( isset( $data['sale_price'] ) && $data['sale_price'] !== '' ) {
            $variation->set_sale_price( wc_format_decimal( $data['sale_price'] ) );
        }

        // Stock
        if ( isset( $data['manage_stock'] ) ) {
            $variation->set_manage_stock( $data['manage_stock'] === 'yes' );
        }
        if ( isset( $data['stock_quantity'] ) && $data['stock_quantity'] !== '' ) {
            $variation->set_stock_quantity( absint( $data['stock_quantity'] ) );
        }
        if ( ! empty( $data['stock_status'] ) ) {
            $variation->set_stock_status( sanitize_text_field( $data['stock_status'] ) );
        }

        // Dimensions
        if ( isset( $data['weight'] ) && $data['weight'] !== '' ) {
            $variation->set_weight( wc_format_decimal( $data['weight'] ) );
        }
        if ( isset( $data['length'] ) && $data['length'] !== '' ) {
            $variation->set_length( wc_format_decimal( $data['length'] ) );
        }
        if ( isset( $data['width'] ) && $data['width'] !== '' ) {
            $variation->set_width( wc_format_decimal( $data['width'] ) );
        }
        if ( isset( $data['height'] ) && $data['height'] !== '' ) {
            $variation->set_height( wc_format_decimal( $data['height'] ) );
        }

        // Status
        if ( ! empty( $data['status'] ) ) {
            $variation->set_status( sanitize_text_field( $data['status'] ) );
        }

        // Image
        if ( ! empty( $data['image'] ) ) {
            $image_id = self::get_or_import_image( $data['image'] );
            if ( $image_id ) {
                $variation->set_image_id( $image_id );
            }
        }

        // Variation attributes
        $attributes = array();
        for ( $i = 1; $i <= 3; $i++ ) {
            $name_key = 'attr_' . $i . '_name';
            $value_key = 'attr_' . $i . '_values';

            if ( ! empty( $data[ $name_key ] ) && ! empty( $data[ $value_key ] ) ) {
                $attr_name = sanitize_title( $data[ $name_key ] );
                $attributes[ 'pa_' . $attr_name ] = sanitize_text_field( $data[ $value_key ] );
            }
        }

        if ( ! empty( $attributes ) ) {
            $variation->set_attributes( $attributes );
        }
    }

    /**
     * Get or create category IDs from pipe-separated string
     *
     * @param string $categories Pipe-separated categories
     * @return array
     */
    public static function get_category_ids( $categories ) {
        $ids = array();
        $names = array_map( 'trim', explode( '|', $categories ) );

        foreach ( $names as $name ) {
            if ( empty( $name ) ) continue;

            $term = get_term_by( 'name', $name, 'product_cat' );
            if ( $term ) {
                $ids[] = $term->term_id;
            } else {
                // Create new category
                $result = wp_insert_term( $name, 'product_cat' );
                if ( ! is_wp_error( $result ) ) {
                    $ids[] = $result['term_id'];
                }
            }
        }

        return $ids;
    }

    /**
     * Get or create tag IDs from pipe-separated string
     *
     * @param string $tags Pipe-separated tags
     * @return array
     */
    public static function get_tag_ids( $tags ) {
        $ids = array();
        $names = array_map( 'trim', explode( '|', $tags ) );

        foreach ( $names as $name ) {
            if ( empty( $name ) ) continue;

            $term = get_term_by( 'name', $name, 'product_tag' );
            if ( $term ) {
                $ids[] = $term->term_id;
            } else {
                // Create new tag
                $result = wp_insert_term( $name, 'product_tag' );
                if ( ! is_wp_error( $result ) ) {
                    $ids[] = $result['term_id'];
                }
            }
        }

        return $ids;
    }

    /**
     * Get or import image from URL
     *
     * @param string $url Image URL
     * @return int|false Image attachment ID or false
     */
    public static function get_or_import_image( $url ) {
        $url = trim( $url );
        if ( empty( $url ) ) {
            return false;
        }

        // Check if it's a local URL
        $upload_dir = wp_upload_dir();
        if ( strpos( $url, $upload_dir['baseurl'] ) !== false ) {
            // Find attachment by URL
            global $wpdb;
            $attachment_id = $wpdb->get_var( $wpdb->prepare(
                "SELECT ID FROM {$wpdb->posts} WHERE guid = %s",
                $url
            ) );
            if ( $attachment_id ) {
                return (int) $attachment_id;
            }
        }

        // Import external image
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $image_id = media_sideload_image( $url, 0, '', 'id' );

        if ( is_wp_error( $image_id ) ) {
            return false;
        }

        return $image_id;
    }

    /**
     * Get or import gallery images from pipe-separated URLs
     *
     * @param string $gallery Pipe-separated URLs
     * @return array
     */
    public static function get_or_import_gallery( $gallery ) {
        $ids = array();
        $urls = array_map( 'trim', explode( '|', $gallery ) );

        foreach ( $urls as $url ) {
            $image_id = self::get_or_import_image( $url );
            if ( $image_id ) {
                $ids[] = $image_id;
            }
        }

        return $ids;
    }

    /**
     * Parse attributes from import data
     *
     * @param array $data Import row data
     * @return array WC_Product_Attribute array
     */
    public static function parse_attributes( $data ) {
        $attributes = array();

        for ( $i = 1; $i <= 3; $i++ ) {
            $name_key = 'attr_' . $i . '_name';
            $values_key = 'attr_' . $i . '_values';
            $visible_key = 'attr_' . $i . '_visible';
            $variation_key = 'attr_' . $i . '_variation';

            if ( empty( $data[ $name_key ] ) ) {
                continue;
            }

            $name = sanitize_text_field( $data[ $name_key ] );
            $values_str = isset( $data[ $values_key ] ) ? $data[ $values_key ] : '';
            $visible = isset( $data[ $visible_key ] ) && $data[ $visible_key ] === 'yes';
            $variation = isset( $data[ $variation_key ] ) && $data[ $variation_key ] === 'yes';

            // Parse values (comma-separated)
            $values = array_map( 'trim', explode( ',', $values_str ) );
            $values = array_filter( $values );

            if ( empty( $values ) ) {
                continue;
            }

            // Check if taxonomy attribute exists
            $taxonomy = 'pa_' . sanitize_title( $name );
            $taxonomy_exists = taxonomy_exists( $taxonomy );

            $attribute = new \WC_Product_Attribute();

            if ( $taxonomy_exists ) {
                $attribute->set_id( wc_attribute_taxonomy_id_by_name( $taxonomy ) );
                $attribute->set_name( $taxonomy );

                // Get or create terms
                $term_ids = array();
                foreach ( $values as $value ) {
                    $term = get_term_by( 'name', $value, $taxonomy );
                    if ( ! $term ) {
                        $term = wp_insert_term( $value, $taxonomy );
                        if ( ! is_wp_error( $term ) ) {
                            $term_ids[] = $term['term_id'];
                        }
                    } else {
                        $term_ids[] = $term->term_id;
                    }
                }
                $attribute->set_options( $term_ids );
            } else {
                $attribute->set_id( 0 );
                $attribute->set_name( $name );
                $attribute->set_options( $values );
            }

            $attribute->set_visible( $visible );
            $attribute->set_variation( $variation );
            $attribute->set_position( $i - 1 );

            $attributes[ $taxonomy_exists ? $taxonomy : sanitize_title( $name ) ] = $attribute;
        }

        return $attributes;
    }
}
