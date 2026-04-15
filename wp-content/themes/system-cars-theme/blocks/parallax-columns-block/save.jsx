/**
 * themes/system-cars-theme/blocks/parallax-columns-block/save.jsx
 */
const { useBlockProps, InnerBlocks } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const {
    backgroundImage,
    minHeight,
    parallax,
    mobileOptimized
  } = attributes;

  const blockProps = useBlockProps.save({
    className: 'parallax-columns-block',
    style: {
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      minHeight: `${minHeight}px`,
      '--parallax-offset': '0px',
    },
    'data-parallax': parallax ? 'true' : 'false',
    'data-height': minHeight.toString(),
    'data-mobile-optimized': mobileOptimized ? 'true' : 'false',
  });

  return createElement(
    'div',
    blockProps,

    // Contenedor para el contenido interno con z-index
    createElement(
      'div',
      {
        className: 'parallax-content-wrapper',
        style: {
          position: 'relative',
          zIndex: 2,
          width: '100%',
        }
      },
      createElement(InnerBlocks.Content)
    )
  );
}
