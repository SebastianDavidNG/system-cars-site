/**
 * What We Do block – editor
 * Theme colors from scss/_variables.scss / theme.json
 */
const { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, SelectControl, ColorPalette, BaseControl } = wp.components;
const { createElement, Fragment } = wp.element;

const THEME_COLORS = {
  primary: '#ff0000',
  secondary: '#002060',
  tertiary: '#232225',
  white: '#ffffff',
  black: '#000000',
  light: '#f5f5f5',
  transparent: 'transparent',
};

const THEME_PALETTE = [
  { name: 'Primary', slug: 'primary', color: THEME_COLORS.primary },
  { name: 'Secondary', slug: 'secondary', color: THEME_COLORS.secondary },
  { name: 'Tertiary', slug: 'tertiary', color: THEME_COLORS.tertiary },
  { name: 'White', slug: 'white', color: THEME_COLORS.white },
  { name: 'Black', slug: 'black', color: THEME_COLORS.black },
];

const BACKGROUND_PALETTE = [
  { name: 'Gris claro', slug: 'light', color: THEME_COLORS.light },
  { name: 'White', slug: 'white', color: THEME_COLORS.white },
  { name: 'Primary', slug: 'primary', color: THEME_COLORS.primary },
  { name: 'Secondary', slug: 'secondary', color: THEME_COLORS.secondary },
  { name: 'Tertiary', slug: 'tertiary', color: THEME_COLORS.tertiary },
  { name: 'Black', slug: 'black', color: THEME_COLORS.black },
  { name: 'Transparente', slug: 'transparent', color: 'rgba(0,0,0,0)' },
];

function resolveColor(slug, fallback) {
  if (slug === 'transparent') {
    return 'transparent';
  }
  return THEME_COLORS[slug] || THEME_COLORS[fallback] || fallback;
}

function ThemeColorControl({ label, value, onChange, help, colors }) {
  const palette = colors || THEME_PALETTE;
  const current =
    value === 'transparent'
      ? 'rgba(0,0,0,0)'
      : resolveColor(value, palette[0]?.slug || 'tertiary');

  return createElement(
    BaseControl,
    { label, help },
    createElement(ColorPalette, {
      colors: palette,
      value: current,
      disableCustomColors: true,
      clearable: false,
      onChange: (color) => {
        const match = palette.find((item) => item.color === color);
        onChange(match ? match.slug : value);
      },
    })
  );
}

function ImagePicker({ label, url, onSelect, onRemove }) {
  return createElement(
    'div',
    { style: { marginBottom: '16px' } },
    createElement('p', { style: { fontWeight: 600, marginBottom: '8px' } }, label),
    createElement(
      MediaUploadCheck,
      null,
      createElement(MediaUpload, {
        onSelect,
        allowedTypes: ['image'],
        value: url,
        render: ({ open }) =>
          createElement(
            Fragment,
            null,
            url
              ? createElement('img', {
                  src: url,
                  alt: '',
                  style: {
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    marginBottom: '8px',
                    borderRadius: '4px',
                  },
                })
              : null,
            createElement(
              Button,
              {
                variant: url ? 'secondary' : 'primary',
                onClick: open,
                style: { width: '100%', marginBottom: url ? '8px' : 0 },
              },
              url ? 'Cambiar imagen' : 'Seleccionar imagen'
            ),
            url
              ? createElement(
                  Button,
                  {
                    variant: 'tertiary',
                    isDestructive: true,
                    onClick: onRemove,
                    style: { width: '100%' },
                  },
                  'Eliminar'
                )
              : null
          ),
      })
    )
  );
}

function getColorStyles(attributes) {
  return {
    '--sc-wwd-subtitle-color': resolveColor(attributes.subtitleColor, 'tertiary'),
    '--sc-wwd-title-color': resolveColor(attributes.titleColor, 'black'),
    '--sc-wwd-title-accent-color': resolveColor(attributes.titleAccentColor, 'primary'),
    '--sc-wwd-text-color': resolveColor(attributes.textColor, 'tertiary'),
    '--sc-wwd-bg-color': resolveColor(attributes.backgroundColor, 'light'),
  };
}

export default function Edit({ attributes, setAttributes }) {
  const {
    subtitle,
    title,
    content,
    image1Url,
    image1Alt,
    image2Url,
    image2Alt,
    mediaPosition,
    subtitleColor,
    titleColor,
    titleAccentColor,
    textColor,
    backgroundColor,
  } = attributes;

  const isMediaLeft = mediaPosition === 'left';

  const blockProps = useBlockProps({
    className: `sc-what-we-do sc-what-we-do--media-${mediaPosition || 'right'}`,
    style: getColorStyles(attributes),
  });

  const textColumn = createElement(
    'div',
    { className: 'sc-what-we-do__content' },
    createElement(RichText, {
      tagName: 'p',
      className: 'sc-what-we-do__subtitle',
      value: subtitle,
      onChange: (value) => setAttributes({ subtitle: value }),
      placeholder: 'Subtítulo...',
      allowedFormats: [],
    }),
    createElement(RichText, {
      tagName: 'h2',
      className: 'sc-what-we-do__title',
      value: title,
      onChange: (value) => setAttributes({ title: value }),
      placeholder: 'Título principal...',
      allowedFormats: ['core/bold', 'core/italic'],
    }),
    createElement(RichText, {
      tagName: 'div',
      className: 'sc-what-we-do__text',
      value: content,
      onChange: (value) => setAttributes({ content: value }),
      placeholder: 'Texto descriptivo...',
      multiline: 'p',
    })
  );

  const imagesColumn = createElement(
    'div',
    { className: 'sc-what-we-do__media' },
    createElement(
      'div',
      { className: 'sc-what-we-do__images' },
      createElement(
        'div',
        { className: 'sc-what-we-do__image sc-what-we-do__image--primary' },
        image1Url
          ? createElement('img', {
              src: image1Url,
              alt: image1Alt || '',
            })
          : createElement(
              'div',
              { className: 'sc-what-we-do__placeholder' },
              'Imagen principal'
            )
      ),
      createElement(
        'div',
        { className: 'sc-what-we-do__image sc-what-we-do__image--secondary' },
        image2Url
          ? createElement('img', {
              src: image2Url,
              alt: image2Alt || '',
            })
          : createElement(
              'div',
              { className: 'sc-what-we-do__placeholder sc-what-we-do__placeholder--sm' },
              'Imagen secundaria'
            )
      )
    )
  );

  return createElement(
    Fragment,
    null,

    createElement(
      InspectorControls,
      null,
      createElement(
        PanelBody,
        { title: 'Diseño', initialOpen: true },
        createElement(SelectControl, {
          label: 'Posición de las imágenes',
          value: mediaPosition || 'right',
          options: [
            { label: 'Derecha (texto a la izquierda)', value: 'right' },
            { label: 'Izquierda (texto a la derecha)', value: 'left' },
          ],
          onChange: (value) => setAttributes({ mediaPosition: value }),
          help: 'En móvil el bloque se apila en una columna.',
        })
      ),
      createElement(
        PanelBody,
        { title: 'Colores', initialOpen: true },
        createElement(ThemeColorControl, {
          label: 'Color del subtítulo',
          value: subtitleColor || 'tertiary',
          onChange: (slug) => setAttributes({ subtitleColor: slug }),
        }),
        createElement(ThemeColorControl, {
          label: 'Color del título',
          value: titleColor || 'black',
          onChange: (slug) => setAttributes({ titleColor: slug }),
        }),
        createElement(ThemeColorControl, {
          label: 'Color de énfasis del título (negrita)',
          value: titleAccentColor || 'primary',
          onChange: (slug) => setAttributes({ titleAccentColor: slug }),
          help: 'Aplica al texto en negrita dentro del título.',
        }),
        createElement(ThemeColorControl, {
          label: 'Color del texto',
          value: textColor || 'tertiary',
          onChange: (slug) => setAttributes({ textColor: slug }),
        }),
        createElement(ThemeColorControl, {
          label: 'Color de fondo',
          value: backgroundColor || 'light',
          onChange: (slug) => setAttributes({ backgroundColor: slug }),
          colors: BACKGROUND_PALETTE,
          help: 'El fondo siempre va a full width; el contenido permanece centrado.',
        })
      ),
      createElement(
        PanelBody,
        { title: 'Imágenes', initialOpen: false },
        createElement(ImagePicker, {
          label: 'Imagen principal (frente)',
          url: image1Url,
          onSelect: (media) =>
            setAttributes({
              image1Url: media.url,
              image1Alt: media.alt || '',
              image1Id: media.id || 0,
            }),
          onRemove: () =>
            setAttributes({ image1Url: '', image1Alt: '', image1Id: 0 }),
        }),
        createElement(ImagePicker, {
          label: 'Imagen secundaria (fondo / arriba)',
          url: image2Url,
          onSelect: (media) =>
            setAttributes({
              image2Url: media.url,
              image2Alt: media.alt || '',
              image2Id: media.id || 0,
            }),
          onRemove: () =>
            setAttributes({ image2Url: '', image2Alt: '', image2Id: 0 }),
        })
      )
    ),

    createElement(
      'div',
      blockProps,
      createElement(
        'div',
        { className: 'sc-what-we-do__inner' },
        isMediaLeft ? imagesColumn : textColumn,
        isMediaLeft ? textColumn : imagesColumn
      )
    )
  );
}
