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
};

function resolveColor(slug, fallback) {
  return THEME_COLORS[slug] || THEME_COLORS[fallback] || fallback;
}

function buildColumns(attributes) {
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
    { className: 'sc-what-we-do__inner' },
    isMediaLeft ? imagesColumn : textColumn,
    isMediaLeft ? textColumn : imagesColumn
  );
}

const sharedAttrs = {
  subtitle: { type: 'string' },
  title: { type: 'string' },
  content: { type: 'string' },
  image1Url: { type: 'string', default: '' },
  image1Alt: { type: 'string', default: '' },
  image1Id: { type: 'number', default: 0 },
  image2Url: { type: 'string', default: '' },
  image2Alt: { type: 'string', default: '' },
  image2Id: { type: 'number', default: 0 },
  mediaPosition: { type: 'string', default: 'right' },
};

registerBlockType('system-cars/what-we-do', {
  edit,
  save,
  deprecated: [
    // v1.1 — text colors, no background color attr in save styles
    {
      attributes: {
        ...sharedAttrs,
        subtitleColor: { type: 'string', default: 'tertiary' },
        titleColor: { type: 'string', default: 'black' },
        titleAccentColor: { type: 'string', default: 'primary' },
        textColor: { type: 'string', default: 'tertiary' },
      },
      migrate(attributes) {
        return {
          ...attributes,
          backgroundColor: 'light',
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: `sc-what-we-do sc-what-we-do--media-${attributes.mediaPosition || 'right'}`,
          style: {
            '--sc-wwd-subtitle-color': resolveColor(attributes.subtitleColor, 'tertiary'),
            '--sc-wwd-title-color': resolveColor(attributes.titleColor, 'black'),
            '--sc-wwd-title-accent-color': resolveColor(attributes.titleAccentColor, 'primary'),
            '--sc-wwd-text-color': resolveColor(attributes.textColor, 'tertiary'),
          },
        });
        return createElement('div', blockProps, buildColumns(attributes));
      },
    },
    // v1.0 — no color styles
    {
      attributes: {
        ...sharedAttrs,
        subtitle: { type: 'string', default: 'What we do' },
        title: { type: 'string', default: 'Full-Service <strong>Detailing for Cars</strong>' },
        content: { type: 'string', default: '' },
      },
      migrate(attributes) {
        return {
          ...attributes,
          subtitleColor: 'tertiary',
          titleColor: 'black',
          titleAccentColor: 'primary',
          textColor: 'tertiary',
          backgroundColor: 'light',
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: `sc-what-we-do sc-what-we-do--media-${attributes.mediaPosition || 'right'}`,
        });
        return createElement('div', blockProps, buildColumns(attributes));
      },
    },
  ],
});
