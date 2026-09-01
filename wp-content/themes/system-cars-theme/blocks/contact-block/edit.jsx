const { useBlockProps, InspectorControls, RichText } = wp.blockEditor;
const { PanelBody, TextControl, TextareaControl, ColorPalette, BaseControl } = wp.components;
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
  { name: 'White', slug: 'white', color: THEME_COLORS.white },
  { name: 'Gris claro', slug: 'light', color: THEME_COLORS.light },
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

function getColorStyles(attributes) {
  return {
    '--sc-contact-subtitle-color': resolveColor(attributes.subtitleColor, 'tertiary'),
    '--sc-contact-title-color': resolveColor(attributes.titleColor, 'black'),
    '--sc-contact-title-accent-color': resolveColor(attributes.titleAccentColor, 'primary'),
    '--sc-contact-text-color': resolveColor(attributes.textColor, 'tertiary'),
    '--sc-contact-bg-color': resolveColor(attributes.backgroundColor, 'white'),
  };
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

function ContactInfoPreview({ attributes, setAttributes }) {
  const { subtitle, title, titleAccent, description, address, phone, email } = attributes;

  return createElement(
    'div',
    { className: 'sc-contact__info' },
    createElement(RichText, {
      tagName: 'p',
      className: 'sc-contact__subtitle',
      value: subtitle,
      onChange: (value) => setAttributes({ subtitle: value }),
      placeholder: 'Contáctenos',
    }),
    createElement(
      'h2',
      { className: 'sc-contact__title' },
      createElement(RichText, {
        tagName: 'span',
        className: 'sc-contact__title-main',
        value: title,
        onChange: (value) => setAttributes({ title: value }),
        placeholder: '¿Tienes preguntas?',
        allowedFormats: [],
      }),
      createElement(RichText, {
        tagName: 'span',
        className: 'sc-contact__title-accent',
        value: titleAccent,
        onChange: (value) => setAttributes({ titleAccent: value }),
        placeholder: '¡Escríbenos!',
        allowedFormats: [],
      })
    ),
    createElement(RichText, {
      tagName: 'p',
      className: 'sc-contact__description',
      value: description,
      onChange: (value) => setAttributes({ description: value }),
      placeholder: 'Descripción...',
    }),
    createElement(
      'ul',
      { className: 'sc-contact__details' },
      createElement(
        'li',
        { className: 'sc-contact__detail sc-contact__detail--address' },
        createElement('i', { className: 'fa-solid fa-location-dot', 'aria-hidden': 'true' }),
        createElement(RichText, {
          tagName: 'span',
          value: address,
          onChange: (value) => setAttributes({ address: value }),
          placeholder: 'Dirección',
        })
      ),
      createElement(
        'li',
        { className: 'sc-contact__detail sc-contact__detail--phone' },
        createElement('i', { className: 'fa-solid fa-phone', 'aria-hidden': 'true' }),
        createElement(RichText, {
          tagName: 'span',
          value: phone,
          onChange: (value) => setAttributes({ phone: value }),
          placeholder: 'Teléfono',
        })
      ),
      createElement(
        'li',
        { className: 'sc-contact__detail sc-contact__detail--email' },
        createElement('i', { className: 'fa-solid fa-envelope', 'aria-hidden': 'true' }),
        createElement(RichText, {
          tagName: 'span',
          value: email,
          onChange: (value) => setAttributes({ email: value }),
          placeholder: 'Email',
        })
      )
    )
  );
}

function FormPreview({ attributes }) {
  const { buttonText, privacyText } = attributes;

  return createElement(
    'div',
    { className: 'sc-contact__form-wrap' },
    createElement(
      'form',
      { className: 'sc-contact__form', onSubmit: (e) => e.preventDefault() },
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('input', {
          type: 'text',
          className: 'sc-contact__input',
          placeholder: 'Nombre *',
          disabled: true,
        })
      ),
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('input', {
          type: 'email',
          className: 'sc-contact__input',
          placeholder: 'Email *',
          disabled: true,
        })
      ),
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('input', {
          type: 'tel',
          className: 'sc-contact__input',
          placeholder: 'Teléfono',
          disabled: true,
        })
      ),
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('textarea', {
          className: 'sc-contact__textarea',
          placeholder: 'Mensaje *',
          rows: 5,
          disabled: true,
        })
      ),
      createElement(
        'label',
        { className: 'sc-contact__privacy' },
        createElement('input', { type: 'checkbox', disabled: true }),
        createElement('span', null, privacyText || 'Acepto la política de privacidad del sitio.')
      ),
      createElement(
        'button',
        { type: 'button', className: 'sc-contact__submit', disabled: true },
        buttonText || 'Enviar mensaje'
      )
    )
  );
}

export default function Edit({ attributes, setAttributes }) {
  const {
    recipientEmail,
    emailSubject,
    buttonText,
    privacyText,
    successMessage,
    errorMessage,
    phoneLink,
    subtitleColor,
    titleColor,
    titleAccentColor,
    textColor,
    backgroundColor,
  } = attributes;

  const blockProps = useBlockProps({
    className: 'sc-contact',
    style: getColorStyles(attributes),
  });

  return createElement(
    Fragment,
    null,
    createElement(
      InspectorControls,
      null,
      createElement(
        PanelBody,
        { title: 'Colores (igual que What We Do)', initialOpen: true },
        createElement(ThemeColorControl, {
          label: 'Subtítulo',
          value: subtitleColor || 'tertiary',
          onChange: (value) => setAttributes({ subtitleColor: value }),
        }),
        createElement(ThemeColorControl, {
          label: 'Título (ej. ¿Tienes preguntas?)',
          value: titleColor || 'black',
          onChange: (value) => setAttributes({ titleColor: value }),
        }),
        createElement(ThemeColorControl, {
          label: 'Acento del título (ej. ¡Escríbenos!)',
          help: 'Color de la segunda línea del título.',
          value: titleAccentColor || 'primary',
          onChange: (value) => setAttributes({ titleAccentColor: value }),
        }),
        createElement(ThemeColorControl, {
          label: 'Texto / detalles',
          value: textColor || 'tertiary',
          onChange: (value) => setAttributes({ textColor: value }),
        }),
        createElement(ThemeColorControl, {
          label: 'Fondo de la sección',
          value: backgroundColor || 'white',
          onChange: (value) => setAttributes({ backgroundColor: value }),
          colors: BACKGROUND_PALETTE,
        })
      ),
      createElement(
        PanelBody,
        { title: 'Envío del formulario', initialOpen: false },
        createElement(TextControl, {
          label: 'Correo de destino',
          help: 'Los mensajes del formulario llegarán a este correo.',
          type: 'email',
          value: recipientEmail,
          onChange: (value) => setAttributes({ recipientEmail: value }),
        }),
        createElement(TextControl, {
          label: 'Asunto del correo',
          value: emailSubject,
          onChange: (value) => setAttributes({ emailSubject: value }),
        }),
        createElement(TextControl, {
          label: 'Texto del botón',
          value: buttonText,
          onChange: (value) => setAttributes({ buttonText: value }),
        }),
        createElement(TextareaControl, {
          label: 'Texto de privacidad',
          value: privacyText,
          onChange: (value) => setAttributes({ privacyText: value }),
        }),
        createElement(TextControl, {
          label: 'Mensaje de éxito',
          value: successMessage,
          onChange: (value) => setAttributes({ successMessage: value }),
        }),
        createElement(TextControl, {
          label: 'Mensaje de error',
          value: errorMessage,
          onChange: (value) => setAttributes({ errorMessage: value }),
        })
      ),
      createElement(
        PanelBody,
        { title: 'Enlaces de contacto', initialOpen: false },
        createElement(TextControl, {
          label: 'Link del teléfono (tel:)',
          value: phoneLink,
          onChange: (value) => setAttributes({ phoneLink: value }),
        })
      )
    ),
    createElement(
      'div',
      blockProps,
      createElement(
        'div',
        { className: 'sc-contact__inner' },
        createElement(ContactInfoPreview, { attributes, setAttributes }),
        createElement(FormPreview, { attributes })
      )
    )
  );
}
