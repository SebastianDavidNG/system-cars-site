/**
 * themes/system-cars-theme/blocks/info-image-block/edit.jsx
 */
const { useBlockProps, InspectorControls, RichText, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, SelectControl } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { imageUrl, imagePosition, title, description } = attributes;

  const blockProps = useBlockProps({
    className: `info-image-block position-${imagePosition}`,
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
        { title: 'Configuración', initialOpen: true },

        createElement(SelectControl, {
          label: 'Posición de la Imagen',
          value: imagePosition,
          options: [
            { label: 'Izquierda', value: 'left' },
            { label: 'Derecha', value: 'right' },
          ],
          onChange: (value) => setAttributes({ imagePosition: value }),
        }),

        createElement(MediaUpload, {
          onSelect: (media) => setAttributes({ imageUrl: media.url }),
          allowedTypes: ['image'],
          render: ({ open }) =>
            createElement(
              Button,
              { isSecondary: true, onClick: open },
              imageUrl ? 'Cambiar imagen' : 'Seleccionar imagen'
            ),
        })
      )
    ),

    // Editor Preview
    createElement(
      'div',
      blockProps,

      // Image Column
      imagePosition === 'left'
        ? createElement(
            'div',
            { className: 'info-image-block__image' },
            imageUrl
              ? createElement('img', { src: imageUrl, alt: '' })
              : createElement('div', { className: 'placeholder' }, 'Selecciona una imagen')
          )
        : null,

      // Content Column
      createElement(
        'div',
        { className: 'info-image-block__content' },

        createElement(RichText, {
          tagName: 'h2',
          value: title,
          onChange: (value) => setAttributes({ title: value }),
          placeholder: 'Título...',
        }),

        createElement(RichText, {
          tagName: 'div',
          className: 'info-description',
          value: description,
          onChange: (value) => setAttributes({ description: value }),
          placeholder: 'Descripción...',
        })
      ),

      // Image Column (right)
      imagePosition === 'right'
        ? createElement(
            'div',
            { className: 'info-image-block__image' },
            imageUrl
              ? createElement('img', { src: imageUrl, alt: '' })
              : createElement('div', { className: 'placeholder' }, 'Selecciona una imagen')
          )
        : null
    )
  );
}
