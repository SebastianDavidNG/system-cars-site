/**
 * themes/system-cars-theme/blocks/video-modal-block/save.jsx
 */
const { useBlockProps } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;

  const blockProps = useBlockProps.save();

  return createElement(
    'div',
    blockProps,

    // Main container
    createElement(
      'div',
      { className: 'video-modal-block relative group' },

      // Video thumbnail container - ESTE es el contenedor clickable
      createElement(
        'div',
        {
          className: 'relative w-full h-auto cursor-pointer video-modal-trigger',
          'data-video-url': videoUrl
        },

        // Thumbnail image
        thumbnailUrl && createElement('img', {
          src: thumbnailUrl,
          alt: thumbnailAlt || 'Video Thumbnail',
          className: 'w-full h-auto'
        }),

        // Play button overlay
        createElement(
          'span',
          { className: 'absolute inset-0 flex items-center justify-center pointer-events-none' },

          // SVG Play button (68x68 como la página de ejemplo)
          createElement(
            'svg',
            {
              className: 'play-button-svg drop-shadow-lg transition-transform duration-300 group-hover:scale-110',
              style: { width: '68px', height: '68px' },
              viewBox: '0 0 68 68',
              fill: 'none',
              xmlns: 'http://www.w3.org/2000/svg'
            },

            // White circle
            createElement('circle', {
              cx: '34',
              cy: '34',
              r: '32',
              fill: '#fff',
              stroke: '#fff',
              strokeWidth: '2'
            }),

            // Play triangle
            createElement('polygon', {
              points: '27,22 27,46 48,34',
              fill: 'rgba(0,0,0,0.55)',
              className: 'transition-colors duration-300 group-hover:fill-[#ff0000]'
            })
          )
        )
      )
    )
  );
}
