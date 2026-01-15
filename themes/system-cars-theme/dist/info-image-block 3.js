(function(wp) {
  'use strict';
  /* empty css                 */
const { useBlockProps: useBlockProps$1, InspectorControls, RichText: RichText$1, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, SelectControl } = wp.components;
const { createElement: createElement$1, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { imageUrl, imagePosition, title, description } = attributes;
  const blockProps = useBlockProps$1({
    className: `info-image-block position-${imagePosition}`
  });
  return createElement$1(
    Fragment,
    null,
    // Inspector Controls
    createElement$1(
      InspectorControls,
      null,
      createElement$1(
        PanelBody,
        { title: "Configuración", initialOpen: true },
        createElement$1(SelectControl, {
          label: "Posición de la Imagen",
          value: imagePosition,
          options: [
            { label: "Izquierda", value: "left" },
            { label: "Derecha", value: "right" }
          ],
          onChange: (value) => setAttributes({ imagePosition: value })
        }),
        createElement$1(MediaUpload, {
          onSelect: (media) => setAttributes({ imageUrl: media.url }),
          allowedTypes: ["image"],
          render: ({ open }) => createElement$1(
            Button,
            { isSecondary: true, onClick: open },
            imageUrl ? "Cambiar imagen" : "Seleccionar imagen"
          )
        })
      )
    ),
    // Editor Preview
    createElement$1(
      "div",
      blockProps,
      // Image Column
      imagePosition === "left" ? createElement$1(
        "div",
        { className: "info-image-block__image" },
        imageUrl ? createElement$1("img", { src: imageUrl, alt: "" }) : createElement$1("div", { className: "placeholder" }, "Selecciona una imagen")
      ) : null,
      // Content Column
      createElement$1(
        "div",
        { className: "info-image-block__content" },
        createElement$1(RichText$1, {
          tagName: "h2",
          value: title,
          onChange: (value) => setAttributes({ title: value }),
          placeholder: "Título..."
        }),
        createElement$1(RichText$1, {
          tagName: "div",
          className: "info-description",
          value: description,
          onChange: (value) => setAttributes({ description: value }),
          placeholder: "Descripción..."
        })
      ),
      // Image Column (right)
      imagePosition === "right" ? createElement$1(
        "div",
        { className: "info-image-block__image" },
        imageUrl ? createElement$1("img", { src: imageUrl, alt: "" }) : createElement$1("div", { className: "placeholder" }, "Selecciona una imagen")
      ) : null
    )
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const { imageUrl, imagePosition, title, description } = attributes;
  const blockProps = useBlockProps.save({
    className: `info-image-block position-${imagePosition}`
  });
  return createElement(
    "div",
    blockProps,
    // Image Column (left)
    imagePosition === "left" ? createElement(
      "div",
      { className: "info-image-block__image" },
      imageUrl ? createElement("img", { src: imageUrl, alt: "" }) : null
    ) : null,
    // Content Column
    createElement(
      "div",
      { className: "info-image-block__content" },
      createElement(RichText.Content, {
        tagName: "h2",
        value: title
      }),
      createElement(RichText.Content, {
        tagName: "div",
        className: "info-description",
        value: description
      })
    ),
    // Image Column (right)
    imagePosition === "right" ? createElement(
      "div",
      { className: "info-image-block__image" },
      imageUrl ? createElement("img", { src: imageUrl, alt: "" }) : null
    ) : null
  );
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/info-image", {
  edit: Edit,
  save: Save
});

})(window.wp || {});