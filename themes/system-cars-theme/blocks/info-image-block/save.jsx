/**
 * themes/system-cars-theme/blocks/info-image-block/save.jsx
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { imageUrl, imagePosition, title, description } = attributes;

  const blockProps = useBlockProps.save({
    className: `info-image-block position-${imagePosition}`,
  });

  return createElement(
    'div',
    blockProps,

    // Image Column (left)
    imagePosition === 'left'
      ? createElement(
          'div',
          { className: 'info-image-block__image' },
          imageUrl ? createElement('img', { src: imageUrl, alt: '' }) : null
        )
      : null,

    // Content Column
    createElement(
      'div',
      { className: 'info-image-block__content' },

      createElement(RichText.Content, {
        tagName: 'h2',
        value: title,
      }),

      createElement(RichText.Content, {
        tagName: 'div',
        className: 'info-description',
        value: description,
      })
    ),

    // Image Column (right)
    imagePosition === 'right'
      ? createElement(
          'div',
          { className: 'info-image-block__image' },
          imageUrl ? createElement('img', { src: imageUrl, alt: '' }) : null
        )
      : null
  );
}
