/**
 * themes/system-cars-theme/blocks/parallax-columns-block/edit.jsx
 */
const { useBlockProps, InspectorControls, RichText, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, IconButton } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { columns } = attributes;

  const blockProps = useBlockProps({
    className: 'parallax-columns-block',
  });

  const addColumn = () => {
    const newColumns = [
      ...columns,
      { backgroundImage: '', content: '', title: '' },
    ];
    setAttributes({ columns: newColumns });
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setAttributes({ columns: newColumns });
  };

  const updateColumn = (index, field, value) => {
    const newColumns = columns.map((col, i) =>
      i === index ? { ...col, [field]: value } : col
    );
    setAttributes({ columns: newColumns });
  };

  return createElement(
    Fragment,
    null,

    // Inspector Controls
    createElement(
      InspectorControls,
      null,

      createElement(
        PanelBody,
        { title: 'Columnas', initialOpen: true },
        createElement(
          Button,
          { isPrimary: true, onClick: addColumn },
          'Agregar Columna'
        )
      )
    ),

    // Editor Preview
    createElement(
      'div',
      blockProps,

      columns.map((column, index) =>
        createElement(
          'div',
          {
            key: index,
            className: 'parallax-column',
            style: {
              backgroundImage: column.backgroundImage
                ? `url(${column.backgroundImage})`
                : 'none',
            },
          },

          // Remove button
          createElement(IconButton, {
            icon: 'trash',
            label: 'Eliminar columna',
            className: 'remove-column',
            onClick: () => removeColumn(index),
          }),

          // Image Upload
          createElement(MediaUpload, {
            onSelect: (media) =>
              updateColumn(index, 'backgroundImage', media.url),
            allowedTypes: ['image'],
            render: ({ open }) =>
              createElement(
                Button,
                { isSecondary: true, onClick: open, className: 'upload-btn' },
                column.backgroundImage ? 'Cambiar imagen' : 'Seleccionar imagen'
              ),
          }),

          // Title
          createElement(RichText, {
            tagName: 'h3',
            value: column.title,
            onChange: (value) => updateColumn(index, 'title', value),
            placeholder: 'Título de la columna...',
          }),

          // Content
          createElement(RichText, {
            tagName: 'div',
            className: 'column-content',
            value: column.content,
            onChange: (value) => updateColumn(index, 'content', value),
            placeholder: 'Contenido...',
          })
        )
      ),

      // Add button at the end
      createElement(
        'div',
        { className: 'add-column-wrapper' },
        createElement(
          Button,
          { isPrimary: true, onClick: addColumn },
          '+ Agregar Columna'
        )
      )
    )
  );
}
