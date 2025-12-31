/**
 * themes/system-cars-theme/blocks/video-modal-block/edit.jsx
 */
const { useBlockProps, InspectorControls, RichText, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, TextControl } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { videoUrl, thumbnailUrl, title, description } = attributes;

  const blockProps = useBlockProps({
    className: 'video-modal-block',
  });

  return createElement(
    Fragment,
    null,

    // Inspector Controls
    createElement(
      InspectorControls,
      null,

      createElement(
        PanelBody,
        { title: 'Configuración del Video', initialOpen: true },

        createElement(TextControl, {
          label: 'URL del Video (YouTube, Vimeo, etc.)',
          value: videoUrl,
          onChange: (value) => setAttributes({ videoUrl: value }),
          placeholder: 'https://www.youtube.com/watch?v=...',
        }),

        createElement(MediaUpload, {
          onSelect: (media) => setAttributes({ thumbnailUrl: media.url }),
          allowedTypes: ['image'],
          render: ({ open }) =>
            createElement(
              Button,
              { isSecondary: true, onClick: open },
              thumbnailUrl ? 'Cambiar miniatura' : 'Seleccionar miniatura'
            ),
        })
      )
    ),

    // Editor Preview
    createElement(
      'div',
      blockProps,

      createElement(
        'div',
        {
          className: 'video-thumbnail',
          style: {
            backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'none',
          },
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
        ),

        !thumbnailUrl &&
          createElement(
            'div',
            { className: 'placeholder' },
            'Selecciona una miniatura'
          )
      ),

      createElement(
        'div',
        { className: 'video-info' },

        createElement(RichText, {
          tagName: 'h3',
          className: 'video-title',
          value: title,
          onChange: (value) => setAttributes({ title: value }),
          placeholder: 'Título del video...',
        }),

        createElement(RichText, {
          tagName: 'div',
          className: 'video-description',
          value: description,
          onChange: (value) => setAttributes({ description: value }),
          placeholder: 'Descripción...',
        })
      )
    )
  );
}
