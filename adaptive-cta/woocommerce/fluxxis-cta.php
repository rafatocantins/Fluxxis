<?php
/**
 * Plugin Name: Fluxxis Adaptive CTA
 * Plugin URI:  https://fluxxis.dev/adaptive-cta
 * Description: Intent-driven call-to-action buttons for WooCommerce. AI-powered CTAs that adapt to each visitor — browse, buy, compare, or learn.
 * Version:     0.1.0
 * Author:      FLUXXIS Research Team
 * Author URI:  https://fluxxis.dev
 * License:     MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: fluxxis-cta
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 9.0
 *
 * @package FluxxisCTA
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// ── Plugin Constants ────────────────────────────────────────────────────────

define('FLUXXIS_CTA_VERSION', '0.1.0');
define('FLUXXIS_CTA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FLUXXIS_CTA_PLUGIN_URL', plugin_dir_url(__FILE__));

// ── Activation / Deactivation ───────────────────────────────────────────────

/**
 * Plugin activation hook.
 * Flush rewrite rules and set default options.
 */
function fluxxis_cta_activate(): void
{
    add_option('fluxxis_cta_license_key', '');
    add_option('fluxxis_cta_enabled', 'yes');
    add_option('fluxxis_cta_position', 'woocommerce_single_product_summary');
    add_option('fluxxis_cta_priority', 35);
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'fluxxis_cta_activate');

/**
 * Plugin deactivation hook.
 */
function fluxxis_cta_deactivate(): void
{
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'fluxxis_cta_deactivate');

// ── Enqueue Assets ──────────────────────────────────────────────────────────

/**
 * Enqueue the SmartCTA script and styles on the frontend.
 */
function fluxxis_cta_enqueue_assets(): void
{
    if (!is_product() && !is_cart() && !is_checkout()) {
        return;
    }

    // Fluxxis Design Tokens v2.0
    wp_enqueue_style(
        'fluxxis-tokens',
        FLUXXIS_CTA_PLUGIN_URL . 'assets/tokens.css',
        [],
        FLUXXIS_CTA_VERSION
    );

    // SmartCTA script (UMD build)
    wp_enqueue_script(
        'fluxxis-cta',
        FLUXXIS_CTA_PLUGIN_URL . 'assets/smart-cta.umd.js',
        [],
        FLUXXIS_CTA_VERSION,
        true // in footer
    );

    // Inline configuration
    $config = [
        'intent' => fluxxis_cta_detect_intent(),
        'productId' => is_product() ? get_the_ID() : null,
        'productName' => is_product() ? get_the_title() : null,
        'price' => is_product() ? fluxxis_cta_get_product_price() : null,
        'currency' => get_woocommerce_currency_symbol(),
        'licenseKey' => get_option('fluxxis_cta_license_key', ''),
    ];

    wp_add_inline_script(
        'fluxxis-cta',
        'window.FluxxisCTA = ' . wp_json_encode($config) . ';',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'fluxxis_cta_enqueue_assets');

// ── Intent Detection ────────────────────────────────────────────────────────

/**
 * Detect user intent based on the current page context.
 *
 * @return string One of: browse, buy, compare, learn
 */
function fluxxis_cta_detect_intent(): string
{
    if (is_cart() || is_checkout()) {
        return 'buy';
    }

    if (is_product_category()) {
        return 'browse';
    }

    if (is_product()) {
        // Check URL parameters for intent hints
        $url = $_SERVER['REQUEST_URI'] ?? '';
        if (strpos($url, 'compare') !== false) {
            return 'compare';
        }
        if (strpos($url, 'guide') !== false || strpos($url, 'learn') !== false) {
            return 'learn';
        }
        return 'browse';
    }

    return 'browse';
}

// ── Product Helpers ─────────────────────────────────────────────────────────

/**
 * Get the current product price.
 *
 * @return float|null
 */
function fluxxis_cta_get_product_price(): ?float
{
    if (!is_product()) {
        return null;
    }

    global $product;
    if (!$product instanceof \WC_Product) {
        $product = wc_get_product(get_the_ID());
    }

    if (!$product) {
        return null;
    }

    return (float) $product->get_price();
}

// ── CTA Placement ───────────────────────────────────────────────────────────

/**
 * Render the SmartCTA placeholder on the product page.
 * The actual SmartCTA button is rendered client-side by the UMD script.
 */
function fluxxis_cta_render_placeholder(): void
{
    $enabled = get_option('fluxxis_cta_enabled', 'yes');

    if ($enabled !== 'yes') {
        return;
    }

    echo '<div id="fluxxis-smart-cta" class="fluxxis-cta-wrapper" aria-live="polite"></div>';
}

/**
 * Hook into WooCommerce product summary based on configured position.
 */
function fluxxis_cta_register_hooks(): void
{
    $position = get_option('fluxxis_cta_position', 'woocommerce_single_product_summary');
    $priority = (int) get_option('fluxxis_cta_priority', 35);

    add_action($position, 'fluxxis_cta_render_placeholder', $priority);
}
add_action('init', 'fluxxis_cta_register_hooks');

// ── Admin Settings Page ─────────────────────────────────────────────────────

/**
 * Add plugin settings page to WooCommerce → Settings → Products.
 */
function fluxxis_cta_add_settings_tab($tabs): array
{
    $tabs['fluxxis_cta'] = [
        'label'    => __('Adaptive CTA', 'fluxxis-cta'),
        'target'   => 'fluxxis_cta_options',
        'class'    => [],
        'priority' => 90,
    ];
    return $tabs;
}
add_filter('woocommerce_product_settings_tabs', 'fluxxis_cta_add_settings_tab');

/**
 * Render settings fields.
 */
function fluxxis_cta_render_settings(): void
{
    woocommerce_admin_fields(fluxxis_cta_get_settings());
}

/**
 * Save settings.
 */
function fluxxis_cta_save_settings(): void
{
    woocommerce_update_options(fluxxis_cta_get_settings());
}

add_action('woocommerce_admin_field_fluxxis_cta_options', 'fluxxis_cta_render_settings');
add_action('woocommerce_update_options_fluxxis_cta_options', 'fluxxis_cta_save_settings');

/**
 * Plugin settings array.
 *
 * @return array
 */
function fluxxis_cta_get_settings(): array
{
    return [
        [
            'title' => __('Fluxxis Adaptive CTA Settings', 'fluxxis-cta'),
            'type'  => 'title',
            'desc'  => __('Configure your intent-driven CTA buttons. SaaS subscription required.', 'fluxxis-cta'),
            'id'    => 'fluxxis_cta_options',
        ],
        [
            'title'   => __('License Key', 'fluxxis-cta'),
            'desc'    => __('Enter your Fluxxis Adaptive CTA license key (starts with flx_cta_)', 'fluxxis-cta'),
            'id'      => 'fluxxis_cta_license_key',
            'type'    => 'text',
            'default' => '',
        ],
        [
            'title'   => __('Enable CTA', 'fluxxis-cta'),
            'desc'    => __('Show adaptive CTA buttons on product pages', 'fluxxis-cta'),
            'id'      => 'fluxxis_cta_enabled',
            'type'    => 'checkbox',
            'default' => 'yes',
        ],
        [
            'title'   => __('CTA Position', 'fluxxis-cta'),
            'desc'    => __('Where to display the CTA on the product page', 'fluxxis-cta'),
            'id'      => 'fluxxis_cta_position',
            'type'    => 'select',
            'options' => [
                'woocommerce_single_product_summary'                => __('Inside product summary', 'fluxxis-cta'),
                'woocommerce_after_single_product_summary'         => __('After product summary', 'fluxxis-cta'),
                'woocommerce_before_add_to_cart_button'            => __('Before Add to Cart', 'fluxxis-cta'),
                'woocommerce_after_add_to_cart_button'             => __('After Add to Cart', 'fluxxis-cta'),
            ],
            'default' => 'woocommerce_single_product_summary',
        ],
        [
            'title'   => __('Display Priority', 'fluxxis-cta'),
            'desc'    => __('Lower numbers = earlier display', 'fluxxis-cta'),
            'id'      => 'fluxxis_cta_priority',
            'type'    => 'number',
            'default' => 35,
            'custom_attributes' => [
                'min'  => 1,
                'max'  => 100,
                'step' => 1,
            ],
        ],
        [
            'type' => 'sectionend',
            'id'   => 'fluxxis_cta_options',
        ],
    ];
}

// ── Declare WooCommerce HPOS Compatibility ──────────────────────────────────

add_action('before_woocommerce_init', function () {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
            'custom_order_tables',
            __FILE__,
            true
        );
    }
});
