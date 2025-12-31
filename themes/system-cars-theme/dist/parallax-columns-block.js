(function(wp) {
  'use strict';
  /* empty css                       */
const { useBlockProps: useBlockProps$1, InspectorControls, RichText: RichText$1, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, IconButton } = wp.components;
const { createElement: createElement$1, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { columns } = attributes;
  const blockProps = useBlockProps$1({
    className: "parallax-columns-block"
  });
  const addColumn = () => {
    const newColumns = [
      ...columns,
      { backgroundImage: "", content: "", title: "" }
    ];
    setAttributes({ columns: newColumns });
  };
  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setAttributes({ columns: newColumns });
  };
  const updateColumn = (index, field, value) => {
    const newColumns = columns.map(
      (col, i) => i === index ? { ...col, [field]: value } : col
    );
    setAttributes({ columns: newColumns });
  };
  return createElement$1(
    Fragment,
    null,
    // Inspector Controls
    createElement$1(
      InspectorControls,
      null,
      createElement$1(
        PanelBody,
        { title: "Columnas", initialOpen: true },
        createElement$1(
          Button,
          { isPrimary: true, onClick: addColumn },
          "Agregar Columna"
        )
      )
    ),
    // Editor Preview
    createElement$1(
      "div",
      blockProps,
      columns.map(
        (column, index) => createElement$1(
          "div",
          {
            key: index,
            className: "parallax-column",
            style: {
              backgroundImage: column.backgroundImage ? `url(${column.backgroundImage})` : "none"
            }
          },
          // Remove button
          createElement$1(IconButton, {
            icon: "trash",
            label: "Eliminar columna",
            className: "remove-column",
            onClick: () => removeColumn(index)
          }),
          // Image Upload
          createElement$1(MediaUpload, {
            onSelect: (media) => updateColumn(index, "backgroundImage", media.url),
            allowedTypes: ["image"],
            render: ({ open }) => createElement$1(
              Button,
              { isSecondary: true, onClick: open, className: "upload-btn" },
              column.backgroundImage ? "Cambiar imagen" : "Seleccionar imagen"
            )
          }),
          // Title
          createElement$1(RichText$1, {
            tagName: "h3",
            value: column.title,
            onChange: (value) => updateColumn(index, "title", value),
            placeholder: "Título de la columna..."
          }),
          // Content
          createElement$1(RichText$1, {
            tagName: "div",
            className: "column-content",
            value: column.content,
            onChange: (value) => updateColumn(index, "content", value),
            placeholder: "Contenido..."
          })
        )
      ),
      // Add button at the end
      createElement$1(
        "div",
        { className: "add-column-wrapper" },
        createElement$1(
          Button,
          { isPrimary: true, onClick: addColumn },
          "+ Agregar Columna"
        )
      )
    )
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const { columns } = attributes;
  const blockProps = useBlockProps.save({
    className: "parallax-columns-block"
  });
  return createElement(
    "div",
    blockProps,
    columns.map(
      (column, index) => createElement(
        "div",
        {
          key: index,
          className: "parallax-column",
          "data-bg-image": column.backgroundImage || ""
        },
        createElement(
          "div",
          { className: "parallax-column-inner" },
          column.backgroundImage ? createElement("div", {
            className: "parallax-bg",
            style: {
              backgroundImage: `url(${column.backgroundImage})`
            }
          }) : null,
          createElement(
            "div",
            { className: "column-overlay" },
            createElement(RichText.Content, {
              tagName: "h3",
              value: column.title
            }),
            createElement(RichText.Content, {
              tagName: "div",
              className: "column-content",
              value: column.content
            })
          )
        )
      )
    )
  );
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/parallax-columns", {
  edit: Edit,
  save: Save
});

})(window.wp || {});