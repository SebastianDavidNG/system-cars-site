(function(wp) {
  'use strict';
  const { useBlockProps: useBlockProps$2, InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, TextControl } = wp.components;
const { createElement: createElement$2, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;
  const blockProps = useBlockProps$2();
  return createElement$2(
    Fragment,
    null,
    // Inspector Controls
    createElement$2(
      InspectorControls,
      null,
      createElement$2(
        PanelBody,
        { title: "Configuración del Video", initialOpen: true },
        createElement$2(TextControl, {
          label: "URL del Video",
          value: videoUrl,
          onChange: (value) => setAttributes({ videoUrl: value }),
          placeholder: "https://www.youtube.com/watch?v=... o https://vimeo.com/... o URL del MP4",
          help: "Soporta YouTube, Vimeo y archivos .mp4"
        }),
        createElement$2(
          MediaUploadCheck,
          null,
          createElement$2(MediaUpload, {
            onSelect: (media) => {
              setAttributes({
                thumbnailUrl: media.url,
                thumbnailAlt: media.alt || "Video Thumbnail"
              });
            },
            allowedTypes: ["image"],
            value: thumbnailUrl,
            render: ({ open }) => createElement$2(
              Button,
              {
                variant: "secondary",
                onClick: open,
                style: { marginTop: "10px", marginBottom: "10px", width: "100%" }
              },
              thumbnailUrl ? "Cambiar imagen thumbnail" : "Seleccionar imagen thumbnail"
            )
          })
        ),
        thumbnailUrl && createElement$2(
          Button,
          {
            variant: "tertiary",
            isDestructive: true,
            onClick: () => setAttributes({ thumbnailUrl: "", thumbnailAlt: "" }),
            style: { width: "100%" }
          },
          "Eliminar imagen"
        ),
        createElement$2(TextControl, {
          label: "Texto alternativo (ALT)",
          value: thumbnailAlt,
          onChange: (value) => setAttributes({ thumbnailAlt: value }),
          help: "Describe el contenido del video para accesibilidad"
        })
      )
    ),
    // Editor Preview
    createElement$2(
      "div",
      blockProps,
      createElement$2(
        "div",
        { className: "video-modal-block relative group" },
        createElement$2(
          "div",
          { className: "relative w-full h-auto cursor-pointer" },
          // Thumbnail image or placeholder
          thumbnailUrl ? createElement$2("img", {
            src: thumbnailUrl,
            alt: thumbnailAlt || "Video Thumbnail",
            className: "w-full h-auto"
          }) : createElement$2(
            "div",
            {
              className: "placeholder",
              style: {
                border: "2px dashed #ccc",
                padding: "80px 40px",
                textAlign: "center",
                color: "#999",
                background: "#f5f5f5"
              }
            },
            "Selecciona una imagen thumbnail desde el panel de la derecha →"
          ),
          // Play button overlay (only show if thumbnail exists)
          thumbnailUrl && createElement$2(
            "span",
            { className: "absolute inset-0 flex items-center justify-center pointer-events-none" },
            createElement$2(
              "svg",
              {
                className: "w-[68px] h-[68px] drop-shadow-lg transition-transform duration-300 group-hover:scale-110",
                viewBox: "0 0 68 68",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              },
              createElement$2("circle", {
                cx: "34",
                cy: "34",
                r: "32",
                fill: "#fff",
                stroke: "#fff",
                strokeWidth: "2"
              }),
              createElement$2("polygon", {
                points: "27,22 27,46 48,34",
                fill: "rgba(0,0,0,0.55)",
                className: "transition-colors duration-300 group-hover:fill-[#ff0000]"
              })
            )
          )
        )
      )
    )
  );
}
const { useBlockProps: useBlockProps$1 } = wp.blockEditor;
const { createElement: createElement$1 } = wp.element;
function Save({ attributes }) {
  const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;
  const blockProps = useBlockProps$1.save();
  return createElement$1(
    "div",
    blockProps,
    // Main container
    createElement$1(
      "div",
      { className: "video-modal-block relative group" },
      // Video thumbnail container - ESTE es el contenedor clickable
      createElement$1(
        "div",
        {
          className: "relative w-full h-auto cursor-pointer video-modal-trigger",
          "data-video-url": videoUrl
        },
        // Thumbnail image
        thumbnailUrl && createElement$1("img", {
          src: thumbnailUrl,
          alt: thumbnailAlt || "Video Thumbnail",
          className: "w-full h-auto"
        }),
        // Play button overlay
        createElement$1(
          "span",
          { className: "absolute inset-0 flex items-center justify-center pointer-events-none" },
          // SVG Play button (68x68 como la página de ejemplo)
          createElement$1(
            "svg",
            {
              className: "play-button-svg drop-shadow-lg transition-transform duration-300 group-hover:scale-110",
              style: { width: "68px", height: "68px" },
              viewBox: "0 0 68 68",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            },
            // White circle
            createElement$1("circle", {
              cx: "34",
              cy: "34",
              r: "32",
              fill: "#fff",
              stroke: "#fff",
              strokeWidth: "2"
            }),
            // Play triangle
            createElement$1("polygon", {
              points: "27,22 27,46 48,34",
              fill: "rgba(0,0,0,0.55)",
              className: "transition-colors duration-300 group-hover:fill-[#ff0000]"
            })
          )
        )
      )
    )
  );
}
const { useBlockProps } = wp.blockEditor;
const { createElement } = wp.element;
const deprecated = [
  // Version 4.0.0 - trigger en DIV + SVG 68x68
  {
    attributes: {
      videoUrl: {
        type: "string",
        default: ""
      },
      thumbnailUrl: {
        type: "string",
        default: ""
      },
      thumbnailAlt: {
        type: "string",
        default: "Video Thumbnail"
      }
    },
    save({ attributes }) {
      const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;
      const blockProps = useBlockProps.save();
      return createElement(
        "div",
        blockProps,
        createElement(
          "div",
          { className: "video-modal-block relative group" },
          createElement(
            "div",
            {
              className: "relative w-full h-auto cursor-pointer video-modal-trigger",
              "data-video-url": videoUrl
            },
            thumbnailUrl && createElement("img", {
              src: thumbnailUrl,
              alt: thumbnailAlt || "Video Thumbnail",
              className: "w-full h-auto"
            }),
            createElement(
              "span",
              { className: "absolute inset-0 flex items-center justify-center pointer-events-none" },
              createElement(
                "svg",
                {
                  className: "w-[68px] h-[68px] drop-shadow-lg transition-transform duration-300 group-hover:scale-110",
                  viewBox: "0 0 68 68",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                },
                createElement("circle", {
                  cx: "34",
                  cy: "34",
                  r: "32",
                  fill: "#fff",
                  stroke: "#fff",
                  strokeWidth: "2"
                }),
                createElement("polygon", {
                  points: "27,22 27,46 48,34",
                  fill: "rgba(0,0,0,0.55)",
                  className: "transition-colors duration-300 group-hover:fill-[#ff0000]"
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
        type: "string",
        default: ""
      },
      thumbnailUrl: {
        type: "string",
        default: ""
      },
      thumbnailAlt: {
        type: "string",
        default: "Video Thumbnail"
      }
    },
    save({ attributes }) {
      const { videoUrl, thumbnailUrl, thumbnailAlt } = attributes;
      const blockProps = useBlockProps.save();
      return createElement(
        "div",
        blockProps,
        createElement(
          "div",
          { className: "video-modal-block relative group" },
          createElement(
            "div",
            { className: "relative w-full h-auto" },
            // Versión ORIGINAL: trigger en la imagen
            thumbnailUrl && createElement("img", {
              src: thumbnailUrl,
              alt: thumbnailAlt || "Video Thumbnail",
              className: "cursor-pointer w-full h-auto video-modal-trigger",
              "data-video-url": videoUrl
            }),
            createElement(
              "span",
              { className: "absolute inset-0 flex items-center justify-center pointer-events-none" },
              createElement(
                "svg",
                {
                  className: "w-20 h-20 md:w-24 md:h-24 drop-shadow-lg transition-transform duration-300 group-hover:scale-110",
                  viewBox: "0 0 80 80",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                },
                createElement("circle", {
                  cx: "40",
                  cy: "40",
                  r: "38",
                  fill: "#fff",
                  stroke: "#fff",
                  strokeWidth: "2"
                }),
                createElement("polygon", {
                  points: "32,26 32,54 56,40",
                  fill: "rgba(0,0,0,0.55)",
                  className: "transition-colors duration-300 group-hover:fill-[#ff0000]"
                })
              )
            )
          )
        )
      );
    }
  }
];
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/video-modal", {
  edit: Edit,
  save: Save,
  deprecated
});

})(window.wp || {});