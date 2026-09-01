(function(wp) {
  'use strict';
  /* empty css                 */
const { useBlockProps: useBlockProps$2, InspectorControls, RichText: RichText$2, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, TextControl, __experimentalBoxControl: BoxControl } = wp.components;
const { createElement: createElement$2, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { mainTitle, mainDescription, imageUrl, imageAlt, columnTitle, columnDescription, topSectionPadding, columnRightPadding } = attributes;
  const blockProps = useBlockProps$2({
    className: "info-image-block"
  });
  return createElement$2(
    Fragment,
    null,
    // Inspector Controls
    createElement$2(
      InspectorControls,
      null,
      createElement$2(
        PanelBody,
        { title: "Configuración de Imagen", initialOpen: true },
        createElement$2(
          MediaUploadCheck,
          null,
          createElement$2(MediaUpload, {
            onSelect: (media) => {
              setAttributes({
                imageUrl: media.url,
                imageAlt: media.alt || mainTitle || ""
              });
            },
            allowedTypes: ["image"],
            value: imageUrl,
            render: ({ open }) => createElement$2(
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
        imageUrl && createElement$2(
          Button,
          {
            variant: "tertiary",
            isDestructive: true,
            onClick: () => setAttributes({ imageUrl: "", imageAlt: "" }),
            style: { width: "100%" }
          },
          "Eliminar imagen"
        ),
        createElement$2(TextControl, {
          label: "Texto alternativo (ALT)",
          value: imageAlt,
          onChange: (value) => setAttributes({ imageAlt: value }),
          help: "Describe la imagen para accesibilidad"
        })
      ),
      createElement$2(
        PanelBody,
        { title: "Espaciado - Sección Superior", initialOpen: false },
        createElement$2(BoxControl, {
          label: "Padding de títulos y descripción superior",
          values: topSectionPadding,
          onChange: (value) => setAttributes({ topSectionPadding: value }),
          help: "Añade espacio interior a la sección de título y descripción principal"
        })
      ),
      createElement$2(
        PanelBody,
        { title: "Espaciado - Columna Derecha", initialOpen: false },
        createElement$2(BoxControl, {
          label: "Padding de la columna de contenido",
          values: columnRightPadding,
          onChange: (value) => setAttributes({ columnRightPadding: value }),
          help: "Añade espacio interior a la columna de título y descripción (derecha)"
        })
      )
    ),
    // Editor Preview
    createElement$2(
      "div",
      blockProps,
      // Top Section
      createElement$2(
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
        createElement$2(
          "div",
          { className: "info-image-field info-image-field--main-title" },
          createElement$2(RichText$2, {
            identifier: "mainTitle",
            tagName: "h2",
            className: "info-main-title",
            value: mainTitle,
            onChange: (value) => setAttributes({ mainTitle: value }),
            placeholder: "Título principal...",
            allowedFormats: ["core/bold", "core/italic"]
          })
        ),
        // Main Description
        createElement$2(
          "div",
          { className: "info-image-field info-image-field--main-description" },
          createElement$2(RichText$2, {
            identifier: "mainDescription",
            tagName: "div",
            className: "info-main-description",
            value: mainDescription,
            onChange: (value) => setAttributes({ mainDescription: value }),
            placeholder: "Descripción principal...",
            multiline: "p",
            allowedFormats: ["core/bold", "core/italic", "core/link"]
          })
        )
      ),
      // Columns Section
      createElement$2(
        "div",
        { className: "info-columns-section" },
        // Left Column (Image)
        createElement$2(
          "div",
          { className: "info-column-left" },
          imageUrl ? createElement$2("img", {
            src: imageUrl,
            alt: imageAlt || mainTitle || "",
            className: "info-image"
          }) : createElement$2(
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
        createElement$2(
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
          createElement$2(
            "div",
            { className: "info-image-field info-image-field--column-title" },
            createElement$2(RichText$2, {
              identifier: "columnTitle",
              tagName: "h4",
              className: "info-column-title",
              value: columnTitle,
              onChange: (value) => setAttributes({ columnTitle: value }),
              placeholder: "Título de la columna...",
              allowedFormats: ["core/bold", "core/italic"]
            })
          ),
          // Column Description
          createElement$2(
            "div",
            { className: "info-image-field info-image-field--column-description" },
            createElement$2(RichText$2, {
              identifier: "columnDescription",
              tagName: "div",
              className: "info-column-description",
              value: columnDescription,
              onChange: (value) => setAttributes({ columnDescription: value }),
              placeholder: "Descripción de la columna...",
              multiline: "p",
              allowedFormats: ["core/bold", "core/italic", "core/link"]
            })
          )
        )
      )
    )
  );
}
const { useBlockProps: useBlockProps$1, RichText: RichText$1 } = wp.blockEditor;
const { createElement: createElement$1 } = wp.element;
function Save({ attributes }) {
  const { mainTitle, mainDescription, imageUrl, imageAlt, columnTitle, columnDescription, topSectionPadding, columnRightPadding } = attributes;
  const blockProps = useBlockProps$1.save({
    className: "info-image-block"
  });
  return createElement$1(
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
      createElement$1(RichText$1.Content, {
        tagName: "h2",
        className: "info-main-title",
        value: mainTitle
      }),
      // Main Description
      createElement$1(RichText$1.Content, {
        tagName: "div",
        className: "info-main-description",
        value: mainDescription
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
        }) : null
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
        createElement$1(RichText$1.Content, {
          tagName: "h4",
          className: "info-column-title",
          value: columnTitle
        }),
        // Column Description
        createElement$1(RichText$1.Content, {
          tagName: "div",
          className: "info-column-description",
          value: columnDescription
        })
      )
    )
  );
}
const { registerBlockType } = wp.blocks;
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function SaveLegacyDescriptions({ attributes }) {
  const {
    mainTitle,
    mainDescription,
    imageUrl,
    imageAlt,
    columnTitle,
    columnDescription,
    topSectionPadding,
    columnRightPadding
  } = attributes;
  const blockProps = useBlockProps.save({
    className: "info-image-block"
  });
  return createElement(
    "div",
    blockProps,
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
      createElement(RichText.Content, {
        tagName: "h2",
        className: "info-main-title",
        value: mainTitle
      }),
      createElement(RichText.Content, {
        tagName: "p",
        className: "info-main-description",
        value: mainDescription
      })
    ),
    createElement(
      "div",
      { className: "info-columns-section" },
      createElement(
        "div",
        { className: "info-column-left" },
        imageUrl ? createElement("img", {
          src: imageUrl,
          alt: imageAlt || mainTitle || "",
          className: "info-image"
        }) : null
      ),
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
        createElement(RichText.Content, {
          tagName: "h4",
          className: "info-column-title",
          value: columnTitle
        }),
        createElement(RichText.Content, {
          tagName: "p",
          className: "info-column-description",
          value: columnDescription
        })
      )
    )
  );
}
registerBlockType("system-cars/info-image", {
  edit: Edit,
  save: Save,
  deprecated: [
    {
      attributes: {
        mainTitle: { type: "string" },
        mainDescription: { type: "string" },
        imageUrl: { type: "string" },
        imageAlt: { type: "string" },
        columnTitle: { type: "string" },
        columnDescription: { type: "string" },
        topSectionPadding: { type: "object" },
        columnRightPadding: { type: "object" }
      },
      save: SaveLegacyDescriptions
    }
  ]
});

})(window.wp || {});