/**
 * themes/system-cars-theme/blocks/service-card/edit.jsx
 */
const { useBlockProps, InspectorControls, RichText, MediaUpload, URLInputButton } = wp.blockEditor;
const { PanelBody, SelectControl, ColorPalette, Button } = wp.components;
const { createElement, Fragment } = wp.element;

const COLORS = [
  { name: 'Rojo',   slug: 'primary',   color: '#ff0000' },
  { name: 'Azul',   slug: 'secondary', color: '#002060' },
  { name: 'Gris',   slug: 'tertiary',  color: '#232225' },
  { name: 'Blanco', slug: 'white',     color: '#ffffff' },
  { name: 'Negro',  slug: 'black',     color: '#000000' }
];

export default function Edit({ attributes, setAttributes }) {
  const {
    linkUrl,
    columns,
    bgColor,
    hoverBgImage,
    svgIcon,
    title,
    description
  } = attributes;

  const blockProps = useBlockProps({
    tagName: 'a',
    className: `col-span-${columns} bg-${bgColor} service-card`,
    style: {
      '--hover-bg-image': hoverBgImage ? `url(${hoverBgImage})` : 'none'
    },
    href: linkUrl || undefined,
    'data-hover-bg': hoverBgImage || undefined
  });

  return createElement(
    Fragment,
    null,

    // Inspector Controls
    createElement(
      InspectorControls,
      null,

      createElement(
        PanelBody,
        { title: 'Enlace', initialOpen: true },
        createElement(URLInputButton, {
          url: linkUrl,
          onChange: (url) => setAttributes({ linkUrl: url }),
        })
      ),

      createElement(
        PanelBody,
        { title: 'Columnas (1–12)', initialOpen: true },
        createElement(SelectControl, {
          value: columns,
          options: Array.from({ length: 12 }, (_, i) => ({
            label: `${i + 1}`,
            value: i + 1
          })),
          onChange: (val) => setAttributes({ columns: Number(val) })
        })
      ),

      createElement(
        PanelBody,
        { title: 'Color de fondo', initialOpen: true },
        createElement(ColorPalette, {
          colors: COLORS,
          value: bgColor,
          onChange: (val) => setAttributes({ bgColor: val })
        })
      ),

      createElement(
        PanelBody,
        { title: 'Imagen hover (opcional)', initialOpen: false },
        createElement(MediaUpload, {
          onSelect: (media) => setAttributes({ hoverBgImage: media.url }),
          allowedTypes: ['image'],
          render: ({ open }) => createElement(
            Button,
            { isSecondary: true, onClick: open },
            hoverBgImage ? 'Cambiar imagen' : 'Seleccionar imagen'
          )
        })
      ),

      createElement(
        PanelBody,
        { title: 'Icono SVG (opcional)', initialOpen: false },
        createElement(MediaUpload, {
          onSelect: (media) => setAttributes({ svgIcon: media.url }),
          allowedTypes: ['image/svg+xml'],
          render: ({ open }) => createElement(
            Button,
            { isSecondary: true, onClick: open },
            svgIcon ? 'Cambiar SVG' : 'Seleccionar SVG'
          )
        })
      )
    ),

    // Frontend Preview
    createElement(
      'a',
      blockProps,

      svgIcon && createElement('img', {
        src: svgIcon,
        alt: '',
        className: 'service-card__icon',
        style: { fill: `var(--tw-color-${bgColor})` }
      }),

      createElement(RichText, {
        tagName: 'h3',
        placeholder: 'Título',
        value: title,
        onChange: (val) => setAttributes({ title: val })
      }),

      createElement(RichText, {
        tagName: 'p',
        placeholder: 'Descripción',
        value: description,
        onChange: (val) => setAttributes({ description: val })
      }),

      createElement('div', { className: 'service-card__arrow' }, '→')
    )
  );
}
