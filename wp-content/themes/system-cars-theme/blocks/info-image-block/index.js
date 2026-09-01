import './style.scss';
import edit from './edit.jsx';
import save from './save.jsx';

const { registerBlockType } = wp.blocks;
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

function SaveLegacyDescriptions({ attributes }) {
  const {
    mainTitle,
    mainDescription,
    imageUrl,
    imageAlt,
    columnTitle,
    columnDescription,
    topSectionPadding,
    columnRightPadding,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: 'info-image-block',
  });

  return createElement(
    'div',
    blockProps,
    createElement(
      'div',
      {
        className: 'info-top-section text-left max-md:text-center',
        style: {
          paddingTop: topSectionPadding?.top || '0px',
          paddingRight: topSectionPadding?.right || '0px',
          paddingBottom: topSectionPadding?.bottom || '0px',
          paddingLeft: topSectionPadding?.left || '0px',
        },
      },
      createElement(RichText.Content, {
        tagName: 'h2',
        className: 'info-main-title',
        value: mainTitle,
      }),
      createElement(RichText.Content, {
        tagName: 'p',
        className: 'info-main-description',
        value: mainDescription,
      })
    ),
    createElement(
      'div',
      { className: 'info-columns-section' },
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
      createElement(
        'div',
        {
          className: 'info-column-right text-left max-md:text-center',
          style: {
            paddingTop: columnRightPadding?.top || '0px',
            paddingRight: columnRightPadding?.right || '0px',
            paddingBottom: columnRightPadding?.bottom || '0px',
            paddingLeft: columnRightPadding?.left || '0px',
          },
        },
        createElement(RichText.Content, {
          tagName: 'h4',
          className: 'info-column-title',
          value: columnTitle,
        }),
        createElement(RichText.Content, {
          tagName: 'p',
          className: 'info-column-description',
          value: columnDescription,
        })
      )
    )
  );
}

registerBlockType('system-cars/info-image', {
  edit,
  save,
  deprecated: [
    {
      attributes: {
        mainTitle: { type: 'string' },
        mainDescription: { type: 'string' },
        imageUrl: { type: 'string' },
        imageAlt: { type: 'string' },
        columnTitle: { type: 'string' },
        columnDescription: { type: 'string' },
        topSectionPadding: { type: 'object' },
        columnRightPadding: { type: 'object' },
      },
      save: SaveLegacyDescriptions,
    },
  ],
});
