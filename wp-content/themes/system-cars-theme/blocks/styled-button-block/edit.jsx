/**
 * themes/system-cars-theme/blocks/styled-button-block/edit.jsx
 */
const { useBlockProps, InspectorControls, RichText } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;

  const blockProps = useBlockProps({
    className: 'styled-button-wrapper',
  });

  // Mapeo de colores desde variables SCSS
  const styleColors = {
    secondary: '#002060', // Azul
    primary: '#ff0000',   // Rojo
    tertiary: '#232225',  // Gris
    white: '#ffffff',     // Blanco
    black: '#000000',     // Negro
  };

  const backgroundColor = styleColors[buttonStyle] || styleColors.secondary;
  const textColor = buttonStyle === 'white' ? '#000000' : '#ffffff';

  // Determinar color del borde
  let borderColor = 'transparent';
  let borderWidth = '0px';

  if (borderStyle !== 'none' && borderStyle !== 'transparent') {
    borderColor = styleColors[borderStyle] || 'transparent';
    borderWidth = '2px';
  } else if (borderStyle === 'transparent') {
    borderColor = 'transparent';
    borderWidth = '2px';
  }

  const buttonStyles = {
    backgroundColor: backgroundColor,
    color: textColor,
    borderRadius: '0',
    border: `${borderWidth} solid ${borderColor}`,
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
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

        createElement(TextControl, {
          label: 'URL',
          value: url,
          onChange: (newUrl) => setAttributes({ url: newUrl }),
          placeholder: 'https://ejemplo.com',
        }),

        createElement(ToggleControl, {
          label: 'Abrir en nueva pestaña',
          checked: openInNewTab,
          onChange: (value) => setAttributes({ openInNewTab: value }),
        })
      ),

      createElement(
        PanelBody,
        { title: 'Estilo del Botón', initialOpen: true },

        createElement(SelectControl, {
          label: 'Color del Botón',
          value: buttonStyle,
          options: [
            { label: 'Azul (Secondary)', value: 'secondary' },
            { label: 'Rojo (Primary)', value: 'primary' },
            { label: 'Gris (Tertiary)', value: 'tertiary' },
            { label: 'Blanco', value: 'white' },
            { label: 'Negro', value: 'black' },
          ],
          onChange: (value) => setAttributes({ buttonStyle: value }),
        }),

        createElement(SelectControl, {
          label: 'Borde',
          value: borderStyle,
          options: [
            { label: 'Sin borde', value: 'none' },
            { label: 'Transparente', value: 'transparent' },
            { label: 'Azul (Secondary)', value: 'secondary' },
            { label: 'Rojo (Primary)', value: 'primary' },
            { label: 'Gris (Tertiary)', value: 'tertiary' },
            { label: 'Blanco', value: 'white' },
            { label: 'Negro', value: 'black' },
          ],
          onChange: (value) => setAttributes({ borderStyle: value }),
        })
      )
    ),

    // Editor Preview
    createElement(
      'div',
      blockProps,
      createElement(
        'a',
        {
          style: buttonStyles,
          className: 'px-10 py-3 font-black uppercase text-lg',
          href: url || '#'
        },
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
