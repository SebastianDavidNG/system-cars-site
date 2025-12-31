/**
 * themes/system-cars-theme/blocks/video-modal-block/save.jsx
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { videoUrl, thumbnailUrl, title, description } = attributes;

  const blockProps = useBlockProps.save({
    className: 'video-modal-block',
  });

  return createElement(
    'div',
    blockProps,

    createElement(
      'div',
      {
        className: 'video-thumbnail',
        style: {
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'none',
        },
        'data-video-url': videoUrl,
        role: 'button',
        tabIndex: '0',
      },

      createElement(
        'div',
        { className: 'play-button' },
        createElement(
          'svg',
          {
            width: '64',
            height: '64',
            viewBox: '0 0 64 64',
            fill: 'none',
          },
          createElement('circle', {
            cx: '32',
            cy: '32',
            r: '30',
            fill: 'rgba(255,255,255,0.9)',
          }),
          createElement('path', {
            d: 'M26 22L44 32L26 42V22Z',
            fill: '#EA0A0B',
          })
        )
      )
    ),

    createElement(
      'div',
      { className: 'video-info' },

      createElement(RichText.Content, {
        tagName: 'h3',
        className: 'video-title',
        value: title,
      }),

      createElement(RichText.Content, {
        tagName: 'div',
        className: 'video-description',
        value: description,
      })
    ),

    // Modal container (will be populated by JS)
    createElement('div', { className: 'video-modal-overlay', style: { display: 'none' } },
      createElement('div', { className: 'video-modal-content' },
        createElement('button', { className: 'modal-close', 'aria-label': 'Cerrar' }, '×'),
        createElement('div', { className: 'video-container' })
      )
    )
  );
}
