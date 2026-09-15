<?php
/**
 * Battery checkout shipping restrictions.
 *
 * Batteries (category "baterias"):
 * - Departamento: Ninguno (Distrito Capital) o Cundinamarca
 * - Ciudad: Bogotá (o municipios vía Zona cuando hay Cundinamarca)
 * - Zona: localidades de Bogotá si no hay depto / Ninguno; municipios si Cundinamarca
 *
 * Other products: full Colombia departments/cities.
 *
 * @package System_Cars_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Product category slug used for battery products.
 */
function sc_battery_category_slug() {
	return 'baterias';
}

/**
 * Nearby municipalities available as Ciudad.
 *
 * @return string[]
 */
function sc_battery_municipalities() {
	return apply_filters(
		'sc_battery_municipalities',
		array(
			'Cajicá',
			'Chía',
			'Facatativá',
			'La Calera',
			'Soacha',
			'Zipaquirá',
		)
	);
}

/**
 * Bogotá localidades available as Zona when Ciudad is Bogotá.
 *
 * @return string[]
 */
function sc_battery_bogota_zones() {
	return apply_filters(
		'sc_battery_bogota_zones',
		array(
			'Antonio Nariño',
			'Barrios Unidos',
			'Bosa',
			'Chapinero',
			'Ciudad Bolívar',
			'Engativá',
			'Fontibón',
			'Kennedy',
			'La Candelaria',
			'Los Mártires',
			'Puente Aranda',
			'Rafael Uribe Uribe',
			'San Cristóbal',
			'Santa Fe',
			'Suba',
			'Sumapaz',
			'Teusaquillo',
			'Tunjuelito',
			'Usaquén',
			'Usme',
		)
	);
}

/**
 * Ciudad options for battery checkout.
 * Nearby towns are chosen in Zona when Ciudad is not Bogotá.
 *
 * @return string[]
 */
function sc_battery_city_options() {
	return array( 'Bogotá' );
}

/**
 * Normalize a place name for comparison.
 *
 * @param string $value Place name.
 * @return string
 */
function sc_normalize_city_name( $value ) {
	$value = trim( (string) $value );
	if ( $value === '' ) {
		return '';
	}

	if ( function_exists( 'remove_accents' ) ) {
		$value = remove_accents( $value );
	}

	$value = strtolower( $value );
	$value = preg_replace( '/\s+/', ' ', $value );

	return $value;
}

/**
 * Build normalized => canonical lookup for a list of labels.
 *
 * @param string[] $labels Labels.
 * @return array<string, string>
 */
function sc_battery_label_lookup( $labels ) {
	$lookup = array();
	foreach ( $labels as $label ) {
		$lookup[ sc_normalize_city_name( $label ) ] = $label;
	}
	return $lookup;
}

/**
 * Canonical label from a list, or empty string.
 *
 * @param string   $value  User value.
 * @param string[] $labels Allowed labels.
 * @return string
 */
function sc_battery_canonical_label( $value, $labels ) {
	$lookup = sc_battery_label_lookup( $labels );
	$key    = sc_normalize_city_name( $value );
	return isset( $lookup[ $key ] ) ? $lookup[ $key ] : '';
}

/**
 * Whether value is Bogotá city.
 *
 * @param string $city City.
 * @return bool
 */
function sc_battery_is_bogota_city( $city ) {
	return sc_normalize_city_name( $city ) === sc_normalize_city_name( 'Bogotá' );
}

/**
 * Extract zone/localidad from address line 2.
 *
 * @param string $address_2 Address line 2.
 * @return string
 */
function sc_battery_parse_zone_from_address_2( $address_2 ) {
	$address_2 = trim( (string) $address_2 );
	if ( $address_2 === '' ) {
		return '';
	}

	if ( preg_match( '/^(?:Localidad|Zona)\s*:\s*(.+)$/iu', $address_2, $matches ) ) {
		return trim( $matches[1] );
	}

	return $address_2;
}

/**
 * Format zone into address line 2.
 *
 * @param string $zone Zone label.
 * @return string
 */
function sc_battery_format_zone_address_2( $zone ) {
	$zone = trim( (string) $zone );
	if ( $zone === '' ) {
		return '';
	}
	return 'Localidad: ' . $zone;
}

/**
 * Whether a battery shipping address is valid.
 *
 * @param string $city      City.
 * @param string $address_2 Address line 2 (may contain zona).
 * @param string $zone      Optional explicit zone.
 * @return bool
 */
function sc_battery_address_is_valid( $city, $address_2 = '', $zone = '' ) {
	$zone_value = $zone !== '' ? $zone : sc_battery_parse_zone_from_address_2( $address_2 );

	if ( sc_battery_is_bogota_city( $city ) ) {
		return sc_battery_canonical_label( $zone_value, sc_battery_bogota_zones() ) !== '';
	}

	if ( sc_battery_canonical_label( $city, sc_battery_municipalities() ) !== '' ) {
		return true;
	}

	// Legacy: localidad stored directly as city.
	return sc_battery_canonical_label( $city, sc_battery_bogota_zones() ) !== '';
}

/**
 * Check if a product ID (or its parent) is in the batteries category.
 *
 * @param int $product_id Product or variation ID.
 * @return bool
 */
function sc_product_is_battery( $product_id ) {
	$product_id = (int) $product_id;
	if ( $product_id <= 0 ) {
		return false;
	}

	$slug = sc_battery_category_slug();

	if ( has_term( $slug, 'product_cat', $product_id ) ) {
		return true;
	}

	$parent_id = wp_get_post_parent_id( $product_id );
	if ( $parent_id && has_term( $slug, 'product_cat', $parent_id ) ) {
		return true;
	}

	return false;
}

/**
 * Whether the current cart contains at least one battery product.
 *
 * @return bool
 */
function sc_cart_contains_batteries() {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return false;
	}

	foreach ( WC()->cart->get_cart() as $item ) {
		$product_id   = ! empty( $item['product_id'] ) ? (int) $item['product_id'] : 0;
		$variation_id = ! empty( $item['variation_id'] ) ? (int) $item['variation_id'] : 0;

		if ( sc_product_is_battery( $product_id ) || sc_product_is_battery( $variation_id ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Whether an order contains battery products.
 *
 * @param WC_Order $order Order.
 * @return bool
 */
function sc_order_contains_batteries( $order ) {
	if ( ! $order instanceof WC_Order ) {
		return false;
	}

	foreach ( $order->get_items() as $item ) {
		if ( ! $item instanceof WC_Order_Item_Product ) {
			continue;
		}
		if ( sc_product_is_battery( $item->get_product_id() ) || sc_product_is_battery( $item->get_variation_id() ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Human-readable restriction message.
 *
 * @return string
 */
function sc_battery_allowed_cities_message() {
	return __(
		'Bogotá (eligiendo una zona/localidad) o municipios: Cajicá, Chía, Facatativá, La Calera, Soacha y Zipaquirá',
		'system-cars-theme'
	);
}

/**
 * Normalize order address for batteries (city/state/zone).
 *
 * @param WC_Order $order Order.
 * @param string   $type  shipping|billing.
 * @return bool True when address is valid.
 */
function sc_battery_normalize_order_address( $order, $type = 'shipping' ) {
	$is_shipping = ( 'shipping' === $type );

	$city      = $is_shipping ? $order->get_shipping_city() : $order->get_billing_city();
	$address_2 = $is_shipping ? $order->get_shipping_address_2() : $order->get_billing_address_2();
	$zone_raw  = sc_battery_parse_zone_from_address_2( $address_2 );

	$municipality = sc_battery_canonical_label( $city, sc_battery_municipalities() );
	if ( $municipality !== '' ) {
		if ( $is_shipping ) {
			$order->set_shipping_city( $municipality );
			$order->set_shipping_state( 'CO-CUN' );
		} else {
			$order->set_billing_city( $municipality );
			$order->set_billing_state( 'CO-CUN' );
		}
		return true;
	}

	$zone = sc_battery_canonical_label( $zone_raw, sc_battery_bogota_zones() );
	if ( $zone === '' ) {
		$zone = sc_battery_canonical_label( $city, sc_battery_bogota_zones() );
	}

	if ( sc_battery_is_bogota_city( $city ) || $zone !== '' ) {
		if ( $zone === '' ) {
			return false;
		}
		$formatted = sc_battery_format_zone_address_2( $zone );
		// Distrito Capital (Bogotá); UI option "Ninguno" also uses CO-DC.
		if ( $is_shipping ) {
			$order->set_shipping_city( 'Bogotá' );
			$order->set_shipping_state( 'CO-DC' );
			$order->set_shipping_address_2( $formatted );
		} else {
			$order->set_billing_city( 'Bogotá' );
			$order->set_billing_state( 'CO-DC' );
			$order->set_billing_address_2( $formatted );
		}
		return true;
	}

	return false;
}

/**
 * Validate shipping/billing for battery orders (Store API / Blocks).
 *
 * @param WC_Order        $order   Order being updated.
 * @param WP_REST_Request $request Request.
 * @throws \Automattic\WooCommerce\StoreApi\Exceptions\RouteException When address is not allowed.
 */
function sc_validate_battery_checkout_address( $order, $request ) {
	if ( ! sc_order_contains_batteries( $order ) && ! sc_cart_contains_batteries() ) {
		return;
	}

	$needs_shipping = $order->needs_shipping();
	$shipping_city  = $order->get_shipping_city();
	$billing_city   = $order->get_billing_city();

	$ok = true;
	if ( $needs_shipping && $shipping_city !== '' ) {
		$ok = sc_battery_normalize_order_address( $order, 'shipping' );
	} elseif ( $billing_city !== '' ) {
		$ok = sc_battery_normalize_order_address( $order, 'billing' );
	}

	if ( $ok && $billing_city !== '' ) {
		sc_battery_normalize_order_address( $order, 'billing' );
	}

	if ( $ok ) {
		return;
	}

	$message = sprintf(
		/* translators: %s: list of allowed places */
		__( 'Las baterías solo se envían a: %s.', 'system-cars-theme' ),
		sc_battery_allowed_cities_message()
	);

	if ( class_exists( '\Automattic\WooCommerce\StoreApi\Exceptions\RouteException' ) ) {
		throw new \Automattic\WooCommerce\StoreApi\Exceptions\RouteException(
			'sc_battery_city_restricted',
			$message,
			400
		);
	}

	throw new Exception( $message );
}
add_action( 'woocommerce_store_api_checkout_update_order_from_request', 'sc_validate_battery_checkout_address', 10, 2 );

/**
 * Classic checkout validation fallback.
 *
 * @param array    $data   Posted data.
 * @param WP_Error $errors Errors.
 */
function sc_validate_battery_checkout_classic( $data, $errors ) {
	if ( ! sc_cart_contains_batteries() ) {
		return;
	}

	$city      = '';
	$address_2 = '';
	if ( ! empty( $data['ship_to_different_address'] ) ) {
		$city      = isset( $data['shipping_city'] ) ? $data['shipping_city'] : '';
		$address_2 = isset( $data['shipping_address_2'] ) ? $data['shipping_address_2'] : '';
	} else {
		$city      = isset( $data['billing_city'] ) ? $data['billing_city'] : '';
		$address_2 = isset( $data['billing_address_2'] ) ? $data['billing_address_2'] : '';
	}

	if ( $city === '' || sc_battery_address_is_valid( $city, $address_2 ) ) {
		return;
	}

	$errors->add(
		'sc_battery_city_restricted',
		sprintf(
			/* translators: %s: list of allowed places */
			__( 'Las baterías solo se envían a: %s.', 'system-cars-theme' ),
			sc_battery_allowed_cities_message()
		)
	);
}
add_action( 'woocommerce_after_checkout_validation', 'sc_validate_battery_checkout_classic', 10, 2 );

/**
 * Enqueue Blocks checkout UI for battery address restrictions.
 */
function sc_enqueue_battery_checkout_script() {
	if ( ! function_exists( 'is_checkout' ) || ! is_checkout() || is_order_received_page() ) {
		return;
	}

	$path = get_template_directory() . '/js/battery-checkout.js';
	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'systemcars-battery-checkout',
		get_template_directory_uri() . '/js/battery-checkout.js',
		array(),
		filemtime( $path ),
		true
	);

	wp_localize_script(
		'systemcars-battery-checkout',
		'scBatteryCheckout',
		array(
			'restrict'        => (bool) sc_cart_contains_batteries(),
			'cities'          => sc_battery_city_options(),
			'bogotaZones'     => sc_battery_bogota_zones(),
			'municipalities'  => sc_battery_municipalities(),
			'allowedStates'   => array( 'CO-DC', 'CO-CUN' ),
			'bogotaCity'      => 'Bogotá',
			'notice'          => __(
				'Tu pedido incluye baterías. Elige Ciudad, Departamento y Zona. Con “Selecciona un departamento” o “Ninguno” verás zonas de Bogotá; con Cundinamarca, los municipios cercanos.',
				'system-cars-theme'
			),
			'cityLabel'       => __( 'Ciudad', 'system-cars-theme' ),
			'zoneLabel'       => __( 'Zona', 'system-cars-theme' ),
			'cityPlaceholder' => __( 'Selecciona ciudad', 'system-cars-theme' ),
			'zonePlaceholder' => __( 'Selecciona zona', 'system-cars-theme' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'sc_enqueue_battery_checkout_script', 30 );
