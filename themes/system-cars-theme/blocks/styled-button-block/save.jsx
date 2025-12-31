/**
 * themes/system-cars-theme/blocks/styled-button-block/save.jsx
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { text, url, gradientStart, gradientEnd, openInNewTab } = attributes;

  const blockProps = useBlockProps.save({
    className: 'styled-button-wrapper',
  });

  const buttonStyle = {
    background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
  };

  return createElement(
    'div',
    blockProps,
    createElement(
      'a',
      {
        className: 'styled-button',
        style: buttonStyle,
        href: url || '#',
        target: openInNewTab ? '_blank' : '_self',
        rel: openInNewTab ? 'noopener noreferrer' : undefined,
      },
      createElement(RichText.Content, {
        tagName: 'span',
        value: text,
      })
    )
  );
}
