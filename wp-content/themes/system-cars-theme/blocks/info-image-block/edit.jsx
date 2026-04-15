/**
 * themes/system-cars-theme/blocks/info-image-block/edit.jsx
 */
const { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, TextControl, __experimentalBoxControl: BoxControl } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { mainTitle, mainDescription, imageUrl, imageAlt, columnTitle, columnDescription, topSectionPadding, columnRightPadding } = attributes;

  const blockProps = useBlockProps({
    className: 'info-image-block',
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
        { title: 'Configuración de Imagen', initialOpen: true },

        createElement(MediaUploadCheck, null,
          createElement(MediaUpload, {
            onSelect: (media) => {
              setAttributes({
                imageUrl: media.url,
                imageAlt: media.alt || mainTitle || ''
              });
            },
            allowedTypes: ['image'],
            value: imageUrl,
            render: ({ open }) =>
              createElement(
                Button,
                {
                  variant: 'secondary',
                  onClick: open,
                  style: { marginBottom: '10px', width: '100%' }
                },
                imageUrl ? 'Cambiar imagen' : 'Seleccionar imagen'
              ),
          })
        ),

        imageUrl && createElement(
          Button,
          {
            variant: 'tertiary',
            isDestructive: true,
            onClick: () => setAttributes({ imageUrl: '', imageAlt: '' }),
            style: { width: '100%' }
          },
          'Eliminar imagen'
        ),

        createElement(TextControl, {
          label: 'Texto alternativo (ALT)',
          value: imageAlt,
          onChange: (value) => setAttributes({ imageAlt: value }),
          help: 'Describe la imagen para accesibilidad',
        })
      ),

      createElement(
        PanelBody,
        { title: 'Espaciado - Sección Superior', initialOpen: false },

        createElement(BoxControl, {
          label: 'Padding de títulos y descripción superior',
          values: topSectionPadding,
          onChange: (value) => setAttributes({ topSectionPadding: value }),
          help: 'Añade espacio interior a la sección de título y descripción principal'
        })
      ),

      createElement(
        PanelBody,
        { title: 'Espaciado - Columna Derecha', initialOpen: false },

        createElement(BoxControl, {
          label: 'Padding de la columna de contenido',
          values: columnRightPadding,
          onChange: (value) => setAttributes({ columnRightPadding: value }),
          help: 'Añade espacio interior a la columna de título y descripción (derecha)'
        })
      )
    ),

    // Editor Preview
    createElement(
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
        createElement(RichText, {
          tagName: 'h2',
          className: 'info-main-title',
          value: mainTitle,
          onChange: (value) => setAttributes({ mainTitle: value }),
          placeholder: 'Título principal...',
        }),

        // Main Description
        createElement(RichText, {
          tagName: 'p',
          className: 'info-main-description',
          value: mainDescription,
          onChange: (value) => setAttributes({ mainDescription: value }),
          placeholder: 'Descripción principal...',
          multiline: 'br',
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
            : createElement(
                'div',
                {
                  className: 'placeholder',
                  style: {
                    border: '2px dashed #ccc',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999'
                  }
                },
                'Selecciona una imagen desde el panel de la derecha →'
              )
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
          createElement(RichText, {
            tagName: 'h4',
            className: 'info-column-title',
            value: columnTitle,
            onChange: (value) => setAttributes({ columnTitle: value }),
            placeholder: 'Título de la columna...',
          }),

          // Column Description
          createElement(RichText, {
            tagName: 'p',
            className: 'info-column-description',
            value: columnDescription,
            onChange: (value) => setAttributes({ columnDescription: value }),
            placeholder: 'Descripción de la columna...',
            multiline: 'br',
          })
        )
      )
    )
  );
}
