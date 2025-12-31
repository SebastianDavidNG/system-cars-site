(function(wp) {
  'use strict';
  /* empty css                  */
const { useBlockProps: useBlockProps$1, InspectorControls, RichText: RichText$1, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, TextControl } = wp.components;
const { createElement: createElement$1, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { videoUrl, thumbnailUrl, title, description } = attributes;
  const blockProps = useBlockProps$1({
    className: "video-modal-block"
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
        { title: "Configuración del Video", initialOpen: true },
        createElement$1(TextControl, {
          label: "URL del Video (YouTube, Vimeo, etc.)",
          value: videoUrl,
          onChange: (value) => setAttributes({ videoUrl: value }),
          placeholder: "https://www.youtube.com/watch?v=..."
        }),
        createElement$1(MediaUpload, {
          onSelect: (media) => setAttributes({ thumbnailUrl: media.url }),
          allowedTypes: ["image"],
          render: ({ open }) => createElement$1(
            Button,
            { isSecondary: true, onClick: open },
            thumbnailUrl ? "Cambiar miniatura" : "Seleccionar miniatura"
          )
        })
      )
    ),
    // Editor Preview
    createElement$1(
      "div",
      blockProps,
      createElement$1(
        "div",
        {
          className: "video-thumbnail",
          style: {
            backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : "none"
          }
        },
        createElement$1(
          "div",
          { className: "play-button" },
          createElement$1(
            "svg",
            {
              width: "64",
              height: "64",
              viewBox: "0 0 64 64",
              fill: "none"
            },
            createElement$1("circle", {
              cx: "32",
              cy: "32",
              r: "30",
              fill: "rgba(255,255,255,0.9)"
            }),
            createElement$1("path", {
              d: "M26 22L44 32L26 42V22Z",
              fill: "#EA0A0B"
            })
          )
        ),
        !thumbnailUrl && createElement$1(
          "div",
          { className: "placeholder" },
          "Selecciona una miniatura"
        )
      ),
      createElement$1(
        "div",
        { className: "video-info" },
        createElement$1(RichText$1, {
          tagName: "h3",
          className: "video-title",
          value: title,
          onChange: (value) => setAttributes({ title: value }),
          placeholder: "Título del video..."
        }),
        createElement$1(RichText$1, {
          tagName: "div",
          className: "video-description",
          value: description,
          onChange: (value) => setAttributes({ description: value }),
          placeholder: "Descripción..."
        })
      )
    )
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const { videoUrl, thumbnailUrl, title, description } = attributes;
  const blockProps = useBlockProps.save({
    className: "video-modal-block"
  });
  return createElement(
    "div",
    blockProps,
    createElement(
      "div",
      {
        className: "video-thumbnail",
        style: {
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : "none"
        },
        "data-video-url": videoUrl,
        role: "button",
        tabIndex: "0"
      },
      createElement(
        "div",
        { className: "play-button" },
        createElement(
          "svg",
          {
            width: "64",
            height: "64",
            viewBox: "0 0 64 64",
            fill: "none"
          },
          createElement("circle", {
            cx: "32",
            cy: "32",
            r: "30",
            fill: "rgba(255,255,255,0.9)"
          }),
          createElement("path", {
            d: "M26 22L44 32L26 42V22Z",
            fill: "#EA0A0B"
          })
        )
      )
    ),
    createElement(
      "div",
      { className: "video-info" },
      createElement(RichText.Content, {
        tagName: "h3",
        className: "video-title",
        value: title
      }),
      createElement(RichText.Content, {
        tagName: "div",
        className: "video-description",
        value: description
      })
    ),
    // Modal container (will be populated by JS)
    createElement(
      "div",
      { className: "video-modal-overlay", style: { display: "none" } },
      createElement(
        "div",
        { className: "video-modal-content" },
        createElement("button", { className: "modal-close", "aria-label": "Cerrar" }, "×"),
        createElement("div", { className: "video-container" })
      )
    )
  );
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/video-modal", {
  edit: Edit,
  save: Save
});

})(window.wp || {});