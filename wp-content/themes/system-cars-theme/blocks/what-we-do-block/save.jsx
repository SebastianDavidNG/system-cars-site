/**
 * What We Do block – save
 */
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
    '--sc-wwd-subtitle-color': resolveColor(attributes.subtitleColor, 'tertiary'),
    '--sc-wwd-title-color': resolveColor(attributes.titleColor, 'black'),
    '--sc-wwd-title-accent-color': resolveColor(attributes.titleAccentColor, 'primary'),
    '--sc-wwd-text-color': resolveColor(attributes.textColor, 'tertiary'),
    '--sc-wwd-bg-color': resolveColor(attributes.backgroundColor, 'light'),
  };
}

export default function Save({ attributes }) {
  const {
    subtitle,
    title,
    content,
    image1Url,
    image1Alt,
    image2Url,
    image2Alt,
    mediaPosition,
  } = attributes;

  const isMediaLeft = mediaPosition === 'left';

  const blockProps = useBlockProps.save({
    className: `sc-what-we-do sc-what-we-do--media-${mediaPosition || 'right'}`,
    style: getColorStyles(attributes),
  });

  const textColumn = createElement(
    'div',
    { className: 'sc-what-we-do__content' },
    subtitle
      ? createElement(RichText.Content, {
          tagName: 'p',
          className: 'sc-what-we-do__subtitle',
          value: subtitle,
        })
      : null,
    title
      ? createElement(RichText.Content, {
          tagName: 'h2',
          className: 'sc-what-we-do__title',
          value: title,
        })
      : null,
    content
      ? createElement(RichText.Content, {
          tagName: 'div',
          className: 'sc-what-we-do__text',
          value: content,
        })
      : null
  );

  const imagesColumn = createElement(
    'div',
    { className: 'sc-what-we-do__media' },
    createElement(
      'div',
      { className: 'sc-what-we-do__images' },
      image1Url
        ? createElement(
            'div',
            { className: 'sc-what-we-do__image sc-what-we-do__image--primary' },
            createElement('img', {
              src: image1Url,
              alt: image1Alt || '',
              loading: 'lazy',
              decoding: 'async',
            })
          )
        : null,
      image2Url
        ? createElement(
            'div',
            { className: 'sc-what-we-do__image sc-what-we-do__image--secondary' },
            createElement('img', {
              src: image2Url,
              alt: image2Alt || '',
              loading: 'lazy',
              decoding: 'async',
            })
          )
        : null
    )
  );

  return createElement(
    'div',
    blockProps,
    createElement(
      'div',
      { className: 'sc-what-we-do__inner' },
      isMediaLeft ? imagesColumn : textColumn,
      isMediaLeft ? textColumn : imagesColumn
    )
  );
}
