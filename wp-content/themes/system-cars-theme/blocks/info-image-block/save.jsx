/**
 * themes/system-cars-theme/blocks/info-image-block/save.jsx
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { mainTitle, mainDescription, imageUrl, imageAlt, columnTitle, columnDescription, topSectionPadding, columnRightPadding } = attributes;

  const blockProps = useBlockProps.save({
    className: 'info-image-block',
  });

  return createElement(
    'div',
    blockProps,

    // Top Section
    createElement(
      'div',
      {
        className: 'info-top-section text-left max-md:text-center',
        style: {
          paddingTop: topSectionPadding?.top || '0px',
          paddingRight: topSectionPadding?.right || '0px',
          paddingBottom: topSectionPadding?.bottom || '0px',
          paddingLeft: topSectionPadding?.left || '0px'
        }
      },

      // Main Title
      createElement(RichText.Content, {
        tagName: 'h2',
        className: 'info-main-title',
        value: mainTitle,
      }),

      // Main Description
      createElement(RichText.Content, {
        tagName: 'p',
        className: 'info-main-description',
        value: mainDescription,
      })
    ),

    // Columns Section
    createElement(
      'div',
      { className: 'info-columns-section' },

      // Left Column (Image)
      createElement(
        'div',
        { className: 'info-column-left' },
        imageUrl
          ? createElement('img', {
              src: imageUrl,
              alt: imageAlt || mainTitle || '',
              className: 'info-image',
            })
          : null
      ),

      // Right Column (Content)
      createElement(
        'div',
        {
          className: 'info-column-right text-left max-md:text-center',
          style: {
            paddingTop: columnRightPadding?.top || '0px',
            paddingRight: columnRightPadding?.right || '0px',
            paddingBottom: columnRightPadding?.bottom || '0px',
            paddingLeft: columnRightPadding?.left || '0px'
          }
        },

        // Column Title
        createElement(RichText.Content, {
          tagName: 'h4',
          className: 'info-column-title',
          value: columnTitle,
        }),

        // Column Description
        createElement(RichText.Content, {
          tagName: 'p',
          className: 'info-column-description',
          value: columnDescription,
        })
      )
    )
  );
}
