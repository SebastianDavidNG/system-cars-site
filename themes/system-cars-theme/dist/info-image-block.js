(function(wp) {
  'use strict';
  /* empty css                 */
const { useBlockProps: useBlockProps$1, InspectorControls, RichText: RichText$1, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, TextControl, __experimentalBoxControl: BoxControl } = wp.components;
const { createElement: createElement$1, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { mainTitle, mainDescription, imageUrl, imageAlt, columnTitle, columnDescription, topSectionPadding, columnRightPadding } = attributes;
  const blockProps = useBlockProps$1({
    className: "info-image-block"
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
        { title: "Configuración de Imagen", initialOpen: true },
        createElement$1(
          MediaUploadCheck,
          null,
          createElement$1(MediaUpload, {
            onSelect: (media) => {
              setAttributes({
                imageUrl: media.url,
                imageAlt: media.alt || mainTitle || ""
              });
            },
            allowedTypes: ["image"],
            value: imageUrl,
            render: ({ open }) => createElement$1(
              Button,
              {
                variant: "secondary",
                onClick: open,
                style: { marginBottom: "10px", width: "100%" }
              },
              imageUrl ? "Cambiar imagen" : "Seleccionar imagen"
            )
          })
        ),
        imageUrl && createElement$1(
          Button,
          {
            variant: "tertiary",
            isDestructive: true,
            onClick: () => setAttributes({ imageUrl: "", imageAlt: "" }),
            style: { width: "100%" }
          },
          "Eliminar imagen"
        ),
        createElement$1(TextControl, {
          label: "Texto alternativo (ALT)",
          value: imageAlt,
          onChange: (value) => setAttributes({ imageAlt: value }),
          help: "Describe la imagen para accesibilidad"
        })
      ),
      createElement$1(
        PanelBody,
        { title: "Espaciado - Sección Superior", initialOpen: false },
        createElement$1(BoxControl, {
          label: "Padding de títulos y descripción superior",
          values: topSectionPadding,
          onChange: (value) => setAttributes({ topSectionPadding: value }),
          help: "Añade espacio interior a la sección de título y descripción principal"
        })
      ),
      createElement$1(
        PanelBody,
        { title: "Espaciado - Columna Derecha", initialOpen: false },
        createElement$1(BoxControl, {
          label: "Padding de la columna de contenido",
          values: columnRightPadding,
          onChange: (value) => setAttributes({ columnRightPadding: value }),
          help: "Añade espacio interior a la columna de título y descripción (derecha)"
        })
      )
    ),
    // Editor Preview
    createElement$1(
      "div",
      blockProps,
      // Top Section
      createElement$1(
        "div",
        {
          className: "info-top-section text-left max-md:text-center",
          style: {
            paddingTop: (topSectionPadding == null ? void 0 : topSectionPadding.top) || "0px",
            paddingRight: (topSectionPadding == null ? void 0 : topSectionPadding.right) || "0px",
            paddingBottom: (topSectionPadding == null ? void 0 : topSectionPadding.bottom) || "0px",
            paddingLeft: (topSectionPadding == null ? void 0 : topSectionPadding.left) || "0px"
          }
        },
        // Main Title
        createElement$1(RichText$1, {
          tagName: "h2",
          className: "info-main-title",
          value: mainTitle,
          onChange: (value) => setAttributes({ mainTitle: value }),
          placeholder: "Título principal..."
        }),
        // Main Description
        createElement$1(RichText$1, {
          tagName: "p",
          className: "info-main-description",
          value: mainDescription,
          onChange: (value) => setAttributes({ mainDescription: value }),
          placeholder: "Descripción principal...",
          multiline: "br"
        })
      ),
      // Columns Section
      createElement$1(
        "div",
        { className: "info-columns-section" },
        // Left Column (Image)
        createElement$1(
          "div",
          { className: "info-column-left" },
          imageUrl ? createElement$1("img", {
            src: imageUrl,
            alt: imageAlt || mainTitle || "",
            className: "info-image"
          }) : createElement$1(
            "div",
            {
              className: "placeholder",
              style: {
                border: "2px dashed #ccc",
                padding: "40px",
                textAlign: "center",
                color: "#999"
              }
            },
            "Selecciona una imagen desde el panel de la derecha →"
          )
        ),
        // Right Column (Content)
        createElement$1(
          "div",
          {
            className: "info-column-right text-left max-md:text-center",
            style: {
              paddingTop: (columnRightPadding == null ? void 0 : columnRightPadding.top) || "0px",
              paddingRight: (columnRightPadding == null ? void 0 : columnRightPadding.right) || "0px",
              paddingBottom: (columnRightPadding == null ? void 0 : columnRightPadding.bottom) || "0px",
              paddingLeft: (columnRightPadding == null ? void 0 : columnRightPadding.left) || "0px"
            }
          },
          // Column Title
          createElement$1(RichText$1, {
            tagName: "h4",
            className: "info-column-title",
            value: columnTitle,
            onChange: (value) => setAttributes({ columnTitle: value }),
            placeholder: "Título de la columna..."
          }),
          // Column Description
          createElement$1(RichText$1, {
            tagName: "p",
            className: "info-column-description",
            value: columnDescription,
            onChange: (value) => setAttributes({ columnDescription: value }),
            placeholder: "Descripción de la columna...",
            multiline: "br"
          })
        )
      )
    )
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const { mainTitle, mainDescription, imageUrl, imageAlt, columnTitle, columnDescription, topSectionPadding, columnRightPadding } = attributes;
  const blockProps = useBlockProps.save({
    className: "info-image-block"
  });
  return createElement(
    "div",
    blockProps,
    // Top Section
    createElement(
      "div",
      {
        className: "info-top-section text-left max-md:text-center",
        style: {
          paddingTop: (topSectionPadding == null ? void 0 : topSectionPadding.top) || "0px",
          paddingRight: (topSectionPadding == null ? void 0 : topSectionPadding.right) || "0px",
          paddingBottom: (topSectionPadding == null ? void 0 : topSectionPadding.bottom) || "0px",
          paddingLeft: (topSectionPadding == null ? void 0 : topSectionPadding.left) || "0px"
        }
      },
      // Main Title
      createElement(RichText.Content, {
        tagName: "h2",
        className: "info-main-title",
        value: mainTitle
      }),
      // Main Description
      createElement(RichText.Content, {
        tagName: "p",
        className: "info-main-description",
        value: mainDescription
      })
    ),
    // Columns Section
    createElement(
      "div",
      { className: "info-columns-section" },
      // Left Column (Image)
      createElement(
        "div",
        { className: "info-column-left" },
        imageUrl ? createElement("img", {
          src: imageUrl,
          alt: imageAlt || mainTitle || "",
          className: "info-image"
        }) : null
      ),
      // Right Column (Content)
      createElement(
        "div",
        {
          className: "info-column-right text-left max-md:text-center",
          style: {
            paddingTop: (columnRightPadding == null ? void 0 : columnRightPadding.top) || "0px",
            paddingRight: (columnRightPadding == null ? void 0 : columnRightPadding.right) || "0px",
            paddingBottom: (columnRightPadding == null ? void 0 : columnRightPadding.bottom) || "0px",
            paddingLeft: (columnRightPadding == null ? void 0 : columnRightPadding.left) || "0px"
          }
        },
        // Column Title
        createElement(RichText.Content, {
          tagName: "h4",
          className: "info-column-title",
          value: columnTitle
        }),
        // Column Description
        createElement(RichText.Content, {
          tagName: "p",
          className: "info-column-description",
          value: columnDescription
        })
      )
    )
  );
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/info-image", {
  edit: Edit,
  save: Save
});

})(window.wp || {});