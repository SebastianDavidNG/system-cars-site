const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

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

export default function Save({ attributes }) {
  const {
    subtitle,
    title,
    titleAccent,
    description,
    address,
    phone,
    phoneLink,
    email,
    recipientEmail,
    emailSubject,
    buttonText,
    privacyText,
    successMessage,
    errorMessage,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: 'sc-contact',
    style: getColorStyles(attributes),
  });

  const mailTo = email ? `mailto:${email}` : undefined;
  const telHref = phoneLink || (phone ? `tel:${phone.replace(/\s+/g, '')}` : undefined);
  const hasTitle = Boolean(title || titleAccent);

  return createElement(
    'div',
    blockProps,
    createElement(
      'div',
      { className: 'sc-contact__inner' },
      createElement(
        'div',
        { className: 'sc-contact__info' },
        subtitle
          ? createElement(RichText.Content, {
              tagName: 'p',
              className: 'sc-contact__subtitle',
              value: subtitle,
            })
          : null,
        hasTitle
          ? createElement(
              'h2',
              { className: 'sc-contact__title' },
              title
                ? createElement(RichText.Content, {
                    tagName: 'span',
                    className: 'sc-contact__title-main',
                    value: title,
                  })
                : null,
              titleAccent
                ? createElement(RichText.Content, {
                    tagName: 'span',
                    className: 'sc-contact__title-accent',
                    value: titleAccent,
                  })
                : null
            )
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
      ),
      createElement(
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
      )
    )
  );
}
