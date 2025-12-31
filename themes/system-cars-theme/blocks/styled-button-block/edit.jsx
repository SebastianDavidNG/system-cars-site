/**
 * themes/system-cars-theme/blocks/styled-button-block/edit.jsx
 */
const { useBlockProps, InspectorControls, RichText, URLInput } = wp.blockEditor;
const { PanelBody, ColorPicker, ToggleControl } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { text, url, gradientStart, gradientEnd, openInNewTab } = attributes;

  const blockProps = useBlockProps({
    className: 'styled-button-wrapper',
  });

  const buttonStyle = {
    background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
    color: '#fff',
    padding: '27px 38px',
    borderRadius: '0',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  };

  return createElement(
    Fragment,
    null,

    // Inspector Controls
    createElement(
      InspectorControls,
      null,

      createElement(
        PanelBody,
        { title: 'Configuración del Botón', initialOpen: true },

        createElement(URLInput, {
          label: 'URL',
          value: url,
          onChange: (newUrl) => setAttributes({ url: newUrl }),
        }),

        createElement(ToggleControl, {
          label: 'Abrir en nueva pestaña',
          checked: openInNewTab,
          onChange: (value) => setAttributes({ openInNewTab: value }),
        })
      ),

      createElement(
        PanelBody,
        { title: 'Gradiente', initialOpen: true },

        createElement('p', { style: { marginBottom: '8px' } }, 'Color Inicial'),
        createElement(ColorPicker, {
          color: gradientStart,
          onChangeComplete: (color) => setAttributes({ gradientStart: color.hex }),
        }),

        createElement('p', { style: { marginBottom: '8px', marginTop: '16px' } }, 'Color Final'),
        createElement(ColorPicker, {
          color: gradientEnd,
          onChangeComplete: (color) => setAttributes({ gradientEnd: color.hex }),
        })
      )
    ),

    // Editor Preview
    createElement(
      'div',
      blockProps,
      createElement(
        'a',
        { style: buttonStyle, href: url || '#' },
        createElement(RichText, {
          tagName: 'span',
          value: text,
          onChange: (value) => setAttributes({ text: value }),
          placeholder: 'Texto del botón...',
        })
      )
    )
  );
}
