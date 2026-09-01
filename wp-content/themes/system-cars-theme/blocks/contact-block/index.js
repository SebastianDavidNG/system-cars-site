import './style.scss';
import edit from './edit.jsx';
import save from './save.jsx';

const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { useBlockProps, RichText } = wp.blockEditor;

const THEME_COLORS = {
  primary: '#ff0000',
  secondary: '#002060',
  tertiary: '#232225',
  white: '#ffffff',
  black: '#000000',
  light: '#f5f5f5',
  transparent: 'transparent',
};

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

function splitLegacyTitle(title) {
  const raw = title || '';
  const strongMatch = raw.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
  const accent = strongMatch
    ? strongMatch[1].replace(/<[^>]+>/g, '').trim()
    : '';
  const main = raw
    .replace(/<strong[^>]*>[\s\S]*?<\/strong>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: main || '¿Tienes preguntas?',
    titleAccent: accent || '¡Escríbenos!',
  };
}

function buildForm(attributes) {
  const {
    recipientEmail,
    emailSubject,
    buttonText,
    privacyText,
    successMessage,
    errorMessage,
  } = attributes;

  return createElement(
    'div',
    { className: 'sc-contact__form-wrap' },
    createElement(
      'form',
      {
        className: 'sc-contact__form',
        noValidate: true,
        'data-recipient': recipientEmail || '',
        'data-subject': emailSubject || 'Formulario desde la web',
        'data-success': successMessage || '',
        'data-error': errorMessage || '',
      },
      createElement('input', {
        type: 'text',
        name: 'sc_hp',
        className: 'sc-contact__honeypot',
        tabIndex: -1,
        autoComplete: 'off',
        'aria-hidden': 'true',
      }),
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('label', { className: 'screen-reader-text', htmlFor: 'sc-contact-name' }, 'Nombre'),
        createElement('input', {
          id: 'sc-contact-name',
          type: 'text',
          name: 'name',
          className: 'sc-contact__input',
          placeholder: 'Nombre *',
          required: true,
          autoComplete: 'name',
        })
      ),
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('label', { className: 'screen-reader-text', htmlFor: 'sc-contact-email' }, 'Email'),
        createElement('input', {
          id: 'sc-contact-email',
          type: 'email',
          name: 'email',
          className: 'sc-contact__input',
          placeholder: 'Email *',
          required: true,
          autoComplete: 'email',
        })
      ),
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('label', { className: 'screen-reader-text', htmlFor: 'sc-contact-phone' }, 'Teléfono'),
        createElement('input', {
          id: 'sc-contact-phone',
          type: 'tel',
          name: 'phone',
          className: 'sc-contact__input',
          placeholder: 'Teléfono',
          autoComplete: 'tel',
        })
      ),
      createElement(
        'div',
        { className: 'sc-contact__field' },
        createElement('label', { className: 'screen-reader-text', htmlFor: 'sc-contact-message' }, 'Mensaje'),
        createElement('textarea', {
          id: 'sc-contact-message',
          name: 'message',
          className: 'sc-contact__textarea',
          placeholder: 'Mensaje *',
          rows: 5,
          required: true,
        })
      ),
      createElement(
        'label',
        { className: 'sc-contact__privacy' },
        createElement('input', {
          type: 'checkbox',
          name: 'privacy',
          required: true,
        }),
        createElement('span', null, privacyText || 'Acepto la política de privacidad del sitio.')
      ),
      createElement(
        'div',
        {
          className: 'sc-contact__feedback',
          role: 'status',
          'aria-live': 'polite',
          hidden: true,
        }
      ),
      createElement(
        'button',
        { type: 'submit', className: 'sc-contact__submit' },
        buttonText || 'Enviar mensaje'
      )
    )
  );
}

function buildInfoLegacySingleTitle(attributes) {
  const { subtitle, title, description, address, phone, phoneLink, email } = attributes;
  const mailTo = email ? `mailto:${email}` : undefined;
  const telHref = phoneLink || (phone ? `tel:${String(phone).replace(/\s+/g, '')}` : undefined);

  return createElement(
    'div',
    { className: 'sc-contact__info' },
    subtitle
      ? createElement(RichText.Content, {
          tagName: 'p',
          className: 'sc-contact__subtitle',
          value: subtitle,
        })
      : null,
    title
      ? createElement(RichText.Content, {
          tagName: 'h2',
          className: 'sc-contact__title',
          value: title,
        })
      : null,
    description
      ? createElement(RichText.Content, {
          tagName: 'p',
          className: 'sc-contact__description',
          value: description,
        })
      : null,
    createElement(
      'ul',
      { className: 'sc-contact__details' },
      address
        ? createElement(
            'li',
            { className: 'sc-contact__detail sc-contact__detail--address' },
            createElement('i', {
              className: 'fa-solid fa-location-dot',
              'aria-hidden': 'true',
            }),
            createElement(RichText.Content, { tagName: 'span', value: address })
          )
        : null,
      phone
        ? createElement(
            'li',
            { className: 'sc-contact__detail sc-contact__detail--phone' },
            createElement('i', {
              className: 'fa-solid fa-phone',
              'aria-hidden': 'true',
            }),
            telHref
              ? createElement('a', { href: telHref }, phone)
              : createElement('span', null, phone)
          )
        : null,
      email
        ? createElement(
            'li',
            { className: 'sc-contact__detail sc-contact__detail--email' },
            createElement('i', {
              className: 'fa-solid fa-envelope',
              'aria-hidden': 'true',
            }),
            createElement('a', { href: mailTo }, email)
          )
        : null
    )
  );
}

const sharedLegacyAttrs = {
  subtitle: { type: 'string' },
  title: { type: 'string' },
  description: { type: 'string' },
  address: { type: 'string' },
  phone: { type: 'string' },
  phoneLink: { type: 'string' },
  email: { type: 'string' },
  recipientEmail: { type: 'string' },
  emailSubject: { type: 'string' },
  buttonText: { type: 'string' },
  privacyText: { type: 'string' },
  successMessage: { type: 'string' },
  errorMessage: { type: 'string' },
};

registerBlockType('system-cars/contact', {
  edit,
  save,
  deprecated: [
    // v1.1 — colors + single combined title
    {
      attributes: {
        ...sharedLegacyAttrs,
        subtitleColor: { type: 'string', default: 'tertiary' },
        titleColor: { type: 'string', default: 'black' },
        titleAccentColor: { type: 'string', default: 'primary' },
        textColor: { type: 'string', default: 'tertiary' },
        backgroundColor: { type: 'string', default: 'white' },
      },
      migrate(attributes) {
        return {
          ...attributes,
          ...splitLegacyTitle(attributes.title),
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: 'sc-contact',
          style: getColorStyles(attributes),
        });
        return createElement(
          'div',
          blockProps,
          createElement(
            'div',
            { className: 'sc-contact__inner' },
            buildInfoLegacySingleTitle(attributes),
            buildForm(attributes)
          )
        );
      },
    },
    // v1.0 — no color styles, single title
    {
      attributes: sharedLegacyAttrs,
      migrate(attributes) {
        return {
          ...attributes,
          ...splitLegacyTitle(attributes.title),
          subtitleColor: 'tertiary',
          titleColor: 'black',
          titleAccentColor: 'primary',
          textColor: 'tertiary',
          backgroundColor: 'white',
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: 'sc-contact',
        });
        return createElement(
          'div',
          blockProps,
          createElement(
            'div',
            { className: 'sc-contact__inner' },
            buildInfoLegacySingleTitle(attributes),
            buildForm(attributes)
          )
        );
      },
    },
  ],
});
