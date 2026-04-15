/**
 * themes/system-cars-theme/blocks/video-modal-block/deprecated.js
 * Versiones antiguas del bloque para migración automática
 */
const { useBlockProps } = wp.blockEditor;
const { createElement } = wp.element;

const deprecated = [
  // Version 4.0.0 - trigger en DIV + SVG 68x68
  {
    attributes: {
      videoUrl: {
        type: 'string',
        default: ''
      },
      thumbnailUrl: {
        type: 'string',
        default: ''
      },
      thumbnailAlt: {
        type: 'string',
        default: 'Video Thumbnail'
      }
    },
    save({ attributes }) {
      const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;
      const blockProps = useBlockProps.save();

      return createElement(
        'div',
        blockProps,

        createElement(
          'div',
          { className: 'video-modal-block relative group' },

          createElement(
            'div',
            {
              className: 'relative w-full h-auto cursor-pointer video-modal-trigger',
              'data-video-url': videoUrl
            },

            thumbnailUrl && createElement('img', {
              src: thumbnailUrl,
              alt: thumbnailAlt || 'Video Thumbnail',
              className: 'w-full h-auto'
            }),

            createElement(
              'span',
              { className: 'absolute inset-0 flex items-center justify-center pointer-events-none' },

              createElement(
                'svg',
                {
                  className: 'w-[68px] h-[68px] drop-shadow-lg transition-transform duration-300 group-hover:scale-110',
                  viewBox: '0 0 68 68',
                  fill: 'none',
                  xmlns: 'http://www.w3.org/2000/svg'
                },

                createElement('circle', {
                  cx: '34',
                  cy: '34',
                  r: '32',
                  fill: '#fff',
                  stroke: '#fff',
                  strokeWidth: '2'
                }),

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
  },

  // Version 3.0.0 - trigger en IMG + SVG 80x80 (VERSIÓN ORIGINAL)
  {
    attributes: {
      videoUrl: {
        type: 'string',
        default: ''
      },
      thumbnailUrl: {
        type: 'string',
        default: ''
      },
      thumbnailAlt: {
        type: 'string',
        default: 'Video Thumbnail'
      }
    },
    save({ attributes }) {
      const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;
      const blockProps = useBlockProps.save();

      return createElement(
        'div',
        blockProps,

        createElement(
          'div',
          { className: 'video-modal-block relative group' },

          createElement(
            'div',
            { className: 'relative w-full h-auto' },

            // Versión ORIGINAL: trigger en la imagen
            thumbnailUrl && createElement('img', {
              src: thumbnailUrl,
              alt: thumbnailAlt || 'Video Thumbnail',
              className: 'cursor-pointer w-full h-auto video-modal-trigger',
              'data-video-url': videoUrl
            }),

            createElement(
              'span',
              { className: 'absolute inset-0 flex items-center justify-center pointer-events-none' },

              createElement(
                'svg',
                {
                  className: 'w-20 h-20 md:w-24 md:h-24 drop-shadow-lg transition-transform duration-300 group-hover:scale-110',
                  viewBox: '0 0 80 80',
                  fill: 'none',
                  xmlns: 'http://www.w3.org/2000/svg'
                },

                createElement('circle', {
                  cx: '40',
                  cy: '40',
                  r: '38',
                  fill: '#fff',
                  stroke: '#fff',
                  strokeWidth: '2'
                }),

                createElement('polygon', {
                  points: '32,26 32,54 56,40',
                  fill: 'rgba(0,0,0,0.55)',
                  className: 'transition-colors duration-300 group-hover:fill-[#ff0000]'
                })
              )
            )
          )
        )
      );
    }
  }
];

export default deprecated;
