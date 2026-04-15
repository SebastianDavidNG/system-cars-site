/**
 * themes/system-cars-theme/blocks/video-modal-block/edit.jsx
 */
const { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, TextControl } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;

  const blockProps = useBlockProps();

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
          label: 'URL del Video',
          value: videoUrl,
          onChange: (value) => setAttributes({ videoUrl: value }),
          placeholder: 'https://www.youtube.com/watch?v=... o https://vimeo.com/... o URL del MP4',
          help: 'Soporta YouTube, Vimeo y archivos .mp4'
        }),

        createElement(MediaUploadCheck, null,
          createElement(MediaUpload, {
            onSelect: (media) => {
              setAttributes({
                thumbnailUrl: media.url,
                thumbnailAlt: media.alt || 'Video Thumbnail'
              });
            },
            allowedTypes: ['image'],
            value: thumbnailUrl,
            render: ({ open }) =>
              createElement(
                Button,
                {
                  variant: 'secondary',
                  onClick: open,
                  style: { marginTop: '10px', marginBottom: '10px', width: '100%' }
                },
                thumbnailUrl ? 'Cambiar imagen thumbnail' : 'Seleccionar imagen thumbnail'
              ),
          })
        ),

        thumbnailUrl && createElement(
          Button,
          {
            variant: 'tertiary',
            isDestructive: true,
            onClick: () => setAttributes({ thumbnailUrl: '', thumbnailAlt: '' }),
            style: { width: '100%' }
          },
          'Eliminar imagen'
        ),

        createElement(TextControl, {
          label: 'Texto alternativo (ALT)',
          value: thumbnailAlt,
          onChange: (value) => setAttributes({ thumbnailAlt: value }),
          help: 'Describe el contenido del video para accesibilidad',
        })
      )
    ),

    // Editor Preview
    createElement(
      'div',
      blockProps,

      createElement(
        'div',
        { className: 'video-modal-block relative group' },

        createElement(
          'div',
          { className: 'relative w-full h-auto cursor-pointer' },

          // Thumbnail image or placeholder
          thumbnailUrl
            ? createElement('img', {
                src: thumbnailUrl,
                alt: thumbnailAlt || 'Video Thumbnail',
                className: 'w-full h-auto',
              })
            : createElement(
                'div',
                {
                  className: 'placeholder',
                  style: {
                    border: '2px dashed #ccc',
                    padding: '80px 40px',
                    textAlign: 'center',
                    color: '#999',
                    background: '#f5f5f5'
                  }
                },
                'Selecciona una imagen thumbnail desde el panel de la derecha →'
              ),

          // Play button overlay (only show if thumbnail exists)
          thumbnailUrl && createElement(
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
    )
  );
}
