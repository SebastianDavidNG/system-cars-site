/**
 * themes/system-cars-theme/blocks/parallax-columns-block/save.jsx
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { columns } = attributes;

  const blockProps = useBlockProps.save({
    className: 'parallax-columns-block',
  });

  return createElement(
    'div',
    blockProps,

    columns.map((column, index) =>
      createElement(
        'div',
        {
          key: index,
          className: 'parallax-column',
          'data-bg-image': column.backgroundImage || '',
        },

        createElement(
          'div',
          { className: 'parallax-column-inner' },

          column.backgroundImage
            ? createElement('div', {
                className: 'parallax-bg',
                style: {
                  backgroundImage: `url(${column.backgroundImage})`,
                },
              })
            : null,

          createElement(
            'div',
            { className: 'column-overlay' },

            createElement(RichText.Content, {
              tagName: 'h3',
              value: column.title,
            }),

            createElement(RichText.Content, {
              tagName: 'div',
              className: 'column-content',
              value: column.content,
            })
          )
        )
      )
    )
  );
}
