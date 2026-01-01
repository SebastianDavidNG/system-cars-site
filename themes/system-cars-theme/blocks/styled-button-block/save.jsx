/**
 * themes/system-cars-theme/blocks/styled-button-block/save.jsx
 * Updated: 2025-12-31 - Added Tailwind CSS classes
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;

  const blockProps = useBlockProps.save({
    className: 'styled-button-wrapper',
  });

  // Crear clases CSS basadas en los atributos (incluye Tailwind)
  const buttonClasses = [
    'styled-button',
    `styled-button--${buttonStyle}`,
    borderStyle !== 'none' ? `styled-button--border-${borderStyle}` : '',
    'px-10',
    'py-3',
    'font-black',
    'capitalize',
    'text-base',
  ].filter(Boolean).join(' ');

  return createElement(
    'div',
    blockProps,
    createElement(
      'a',
      {
        className: buttonClasses,
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
