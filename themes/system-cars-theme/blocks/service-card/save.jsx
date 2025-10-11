/**
 * themes/system-cars-theme/blocks/service-card/save.jsx
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement, Fragment } = wp.element;

export default function Save({ attributes }) {
  const {
    linkUrl,
    columns,
    bgColor,
    hoverBgImage,
    svgIcon,
    title,
    description
  } = attributes;

  const blockProps = useBlockProps.save({
    tagName: 'a',
    className: `col-span-${columns} bg-${bgColor} service-card`,
    style: {
      '--hover-bg-image': hoverBgImage ? `url(${hoverBgImage})` : 'none'
    },
    href: linkUrl || undefined,
    'data-hover-bg': hoverBgImage || undefined
  });

  return createElement(
    'a',
    blockProps,

    svgIcon && createElement('img', {
      src: svgIcon,
      alt: '',
      className: 'service-card__icon',
      style: { fill: `var(--tw-color-${bgColor})` }
    }),

    createElement(RichText.Content, {
      tagName: 'h3',
      value: title
    }),

    createElement(RichText.Content, {
      tagName: 'p',
      value: description
    }),

    createElement('div', { className: 'service-card__arrow' }, '→')
  );
}
