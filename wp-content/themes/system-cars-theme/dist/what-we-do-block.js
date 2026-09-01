(function(wp) {
  'use strict';
  /* empty css                 */
const { useBlockProps: useBlockProps$2, InspectorControls, RichText: RichText$2, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, SelectControl, ColorPalette, BaseControl } = wp.components;
const { createElement: createElement$2, Fragment } = wp.element;
const THEME_COLORS$2 = {
  primary: "#ff0000",
  secondary: "#002060",
  tertiary: "#232225",
  white: "#ffffff",
  black: "#000000",
  light: "#f5f5f5",
  transparent: "transparent"
};
const THEME_PALETTE = [
  { name: "Primary", slug: "primary", color: THEME_COLORS$2.primary },
  { name: "Secondary", slug: "secondary", color: THEME_COLORS$2.secondary },
  { name: "Tertiary", slug: "tertiary", color: THEME_COLORS$2.tertiary },
  { name: "White", slug: "white", color: THEME_COLORS$2.white },
  { name: "Black", slug: "black", color: THEME_COLORS$2.black }
];
const BACKGROUND_PALETTE = [
  { name: "Gris claro", slug: "light", color: THEME_COLORS$2.light },
  { name: "White", slug: "white", color: THEME_COLORS$2.white },
  { name: "Primary", slug: "primary", color: THEME_COLORS$2.primary },
  { name: "Secondary", slug: "secondary", color: THEME_COLORS$2.secondary },
  { name: "Tertiary", slug: "tertiary", color: THEME_COLORS$2.tertiary },
  { name: "Black", slug: "black", color: THEME_COLORS$2.black },
  { name: "Transparente", slug: "transparent", color: "rgba(0,0,0,0)" }
];
function resolveColor$2(slug, fallback) {
  if (slug === "transparent") {
    return "transparent";
  }
  return THEME_COLORS$2[slug] || THEME_COLORS$2[fallback] || fallback;
}
function ThemeColorControl({ label, value, onChange, help, colors }) {
  var _a;
  const palette = colors || THEME_PALETTE;
  const current = value === "transparent" ? "rgba(0,0,0,0)" : resolveColor$2(value, ((_a = palette[0]) == null ? void 0 : _a.slug) || "tertiary");
  return createElement$2(
    BaseControl,
    { label, help },
    createElement$2(ColorPalette, {
      colors: palette,
      value: current,
      disableCustomColors: true,
      clearable: false,
      onChange: (color) => {
        const match = palette.find((item) => item.color === color);
        onChange(match ? match.slug : value);
      }
    })
  );
}
function ImagePicker({ label, url, onSelect, onRemove }) {
  return createElement$2(
    "div",
    { style: { marginBottom: "16px" } },
    createElement$2("p", { style: { fontWeight: 600, marginBottom: "8px" } }, label),
    createElement$2(
      MediaUploadCheck,
      null,
      createElement$2(MediaUpload, {
        onSelect,
        allowedTypes: ["image"],
        value: url,
        render: ({ open }) => createElement$2(
          Fragment,
          null,
          url ? createElement$2("img", {
            src: url,
            alt: "",
            style: {
              width: "100%",
              height: "auto",
              display: "block",
              marginBottom: "8px",
              borderRadius: "4px"
            }
          }) : null,
          createElement$2(
            Button,
            {
              variant: url ? "secondary" : "primary",
              onClick: open,
              style: { width: "100%", marginBottom: url ? "8px" : 0 }
            },
            url ? "Cambiar imagen" : "Seleccionar imagen"
          ),
          url ? createElement$2(
            Button,
            {
              variant: "tertiary",
              isDestructive: true,
              onClick: onRemove,
              style: { width: "100%" }
            },
            "Eliminar"
          ) : null
        )
      })
    )
  );
}
function getColorStyles$1(attributes) {
  return {
    "--sc-wwd-subtitle-color": resolveColor$2(attributes.subtitleColor, "tertiary"),
    "--sc-wwd-title-color": resolveColor$2(attributes.titleColor, "black"),
    "--sc-wwd-title-accent-color": resolveColor$2(attributes.titleAccentColor, "primary"),
    "--sc-wwd-text-color": resolveColor$2(attributes.textColor, "tertiary"),
    "--sc-wwd-bg-color": resolveColor$2(attributes.backgroundColor, "light")
  };
}
function Edit({ attributes, setAttributes }) {
  const {
    subtitle,
    title,
    content,
    image1Url,
    image1Alt,
    image2Url,
    image2Alt,
    mediaPosition,
    subtitleColor,
    titleColor,
    titleAccentColor,
    textColor,
    backgroundColor
  } = attributes;
  const isMediaLeft = mediaPosition === "left";
  const blockProps = useBlockProps$2({
    className: `sc-what-we-do sc-what-we-do--media-${mediaPosition || "right"}`,
    style: getColorStyles$1(attributes)
  });
  const textColumn = createElement$2(
    "div",
    { className: "sc-what-we-do__content" },
    createElement$2(RichText$2, {
      tagName: "p",
      className: "sc-what-we-do__subtitle",
      value: subtitle,
      onChange: (value) => setAttributes({ subtitle: value }),
      placeholder: "Subtítulo...",
      allowedFormats: []
    }),
    createElement$2(RichText$2, {
      tagName: "h2",
      className: "sc-what-we-do__title",
      value: title,
      onChange: (value) => setAttributes({ title: value }),
      placeholder: "Título principal...",
      allowedFormats: ["core/bold", "core/italic"]
    }),
    createElement$2(RichText$2, {
      tagName: "div",
      className: "sc-what-we-do__text",
      value: content,
      onChange: (value) => setAttributes({ content: value }),
      placeholder: "Texto descriptivo...",
      multiline: "p"
    })
  );
  const imagesColumn = createElement$2(
    "div",
    { className: "sc-what-we-do__media" },
    createElement$2(
      "div",
      { className: "sc-what-we-do__images" },
      createElement$2(
        "div",
        { className: "sc-what-we-do__image sc-what-we-do__image--primary" },
        image1Url ? createElement$2("img", {
          src: image1Url,
          alt: image1Alt || ""
        }) : createElement$2(
          "div",
          { className: "sc-what-we-do__placeholder" },
          "Imagen principal"
        )
      ),
      createElement$2(
        "div",
        { className: "sc-what-we-do__image sc-what-we-do__image--secondary" },
        image2Url ? createElement$2("img", {
          src: image2Url,
          alt: image2Alt || ""
        }) : createElement$2(
          "div",
          { className: "sc-what-we-do__placeholder sc-what-we-do__placeholder--sm" },
          "Imagen secundaria"
        )
      )
    )
  );
  return createElement$2(
    Fragment,
    null,
    createElement$2(
      InspectorControls,
      null,
      createElement$2(
        PanelBody,
        { title: "Diseño", initialOpen: true },
        createElement$2(SelectControl, {
          label: "Posición de las imágenes",
          value: mediaPosition || "right",
          options: [
            { label: "Derecha (texto a la izquierda)", value: "right" },
            { label: "Izquierda (texto a la derecha)", value: "left" }
          ],
          onChange: (value) => setAttributes({ mediaPosition: value }),
          help: "En móvil el bloque se apila en una columna."
        })
      ),
      createElement$2(
        PanelBody,
        { title: "Colores", initialOpen: true },
        createElement$2(ThemeColorControl, {
          label: "Color del subtítulo",
          value: subtitleColor || "tertiary",
          onChange: (slug) => setAttributes({ subtitleColor: slug })
        }),
        createElement$2(ThemeColorControl, {
          label: "Color del título",
          value: titleColor || "black",
          onChange: (slug) => setAttributes({ titleColor: slug })
        }),
        createElement$2(ThemeColorControl, {
          label: "Color de énfasis del título (negrita)",
          value: titleAccentColor || "primary",
          onChange: (slug) => setAttributes({ titleAccentColor: slug }),
          help: "Aplica al texto en negrita dentro del título."
        }),
        createElement$2(ThemeColorControl, {
          label: "Color del texto",
          value: textColor || "tertiary",
          onChange: (slug) => setAttributes({ textColor: slug })
        }),
        createElement$2(ThemeColorControl, {
          label: "Color de fondo",
          value: backgroundColor || "light",
          onChange: (slug) => setAttributes({ backgroundColor: slug }),
          colors: BACKGROUND_PALETTE,
          help: "El fondo siempre va a full width; el contenido permanece centrado."
        })
      ),
      createElement$2(
        PanelBody,
        { title: "Imágenes", initialOpen: false },
        createElement$2(ImagePicker, {
          label: "Imagen principal (frente)",
          url: image1Url,
          onSelect: (media) => setAttributes({
            image1Url: media.url,
            image1Alt: media.alt || "",
            image1Id: media.id || 0
          }),
          onRemove: () => setAttributes({ image1Url: "", image1Alt: "", image1Id: 0 })
        }),
        createElement$2(ImagePicker, {
          label: "Imagen secundaria (fondo / arriba)",
          url: image2Url,
          onSelect: (media) => setAttributes({
            image2Url: media.url,
            image2Alt: media.alt || "",
            image2Id: media.id || 0
          }),
          onRemove: () => setAttributes({ image2Url: "", image2Alt: "", image2Id: 0 })
        })
      )
    ),
    createElement$2(
      "div",
      blockProps,
      createElement$2(
        "div",
        { className: "sc-what-we-do__inner" },
        isMediaLeft ? imagesColumn : textColumn,
        isMediaLeft ? textColumn : imagesColumn
      )
    )
  );
}
const { useBlockProps: useBlockProps$1, RichText: RichText$1 } = wp.blockEditor;
const { createElement: createElement$1 } = wp.element;
const THEME_COLORS$1 = {
  primary: "#ff0000",
  secondary: "#002060",
  tertiary: "#232225",
  white: "#ffffff",
  black: "#000000",
  light: "#f5f5f5",
  transparent: "transparent"
};
function resolveColor$1(slug, fallback) {
  if (slug === "transparent") {
    return "transparent";
  }
  return THEME_COLORS$1[slug] || THEME_COLORS$1[fallback] || fallback;
}
function getColorStyles(attributes) {
  return {
    "--sc-wwd-subtitle-color": resolveColor$1(attributes.subtitleColor, "tertiary"),
    "--sc-wwd-title-color": resolveColor$1(attributes.titleColor, "black"),
    "--sc-wwd-title-accent-color": resolveColor$1(attributes.titleAccentColor, "primary"),
    "--sc-wwd-text-color": resolveColor$1(attributes.textColor, "tertiary"),
    "--sc-wwd-bg-color": resolveColor$1(attributes.backgroundColor, "light")
  };
}
function Save({ attributes }) {
  const {
    subtitle,
    title,
    content,
    image1Url,
    image1Alt,
    image2Url,
    image2Alt,
    mediaPosition
  } = attributes;
  const isMediaLeft = mediaPosition === "left";
  const blockProps = useBlockProps$1.save({
    className: `sc-what-we-do sc-what-we-do--media-${mediaPosition || "right"}`,
    style: getColorStyles(attributes)
  });
  const textColumn = createElement$1(
    "div",
    { className: "sc-what-we-do__content" },
    subtitle ? createElement$1(RichText$1.Content, {
      tagName: "p",
      className: "sc-what-we-do__subtitle",
      value: subtitle
    }) : null,
    title ? createElement$1(RichText$1.Content, {
      tagName: "h2",
      className: "sc-what-we-do__title",
      value: title
    }) : null,
    content ? createElement$1(RichText$1.Content, {
      tagName: "div",
      className: "sc-what-we-do__text",
      value: content
    }) : null
  );
  const imagesColumn = createElement$1(
    "div",
    { className: "sc-what-we-do__media" },
    createElement$1(
      "div",
      { className: "sc-what-we-do__images" },
      image1Url ? createElement$1(
        "div",
        { className: "sc-what-we-do__image sc-what-we-do__image--primary" },
        createElement$1("img", {
          src: image1Url,
          alt: image1Alt || "",
          loading: "lazy",
          decoding: "async"
        })
      ) : null,
      image2Url ? createElement$1(
        "div",
        { className: "sc-what-we-do__image sc-what-we-do__image--secondary" },
        createElement$1("img", {
          src: image2Url,
          alt: image2Alt || "",
          loading: "lazy",
          decoding: "async"
        })
      ) : null
    )
  );
  return createElement$1(
    "div",
    blockProps,
    createElement$1(
      "div",
      { className: "sc-what-we-do__inner" },
      isMediaLeft ? imagesColumn : textColumn,
      isMediaLeft ? textColumn : imagesColumn
    )
  );
}
const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { useBlockProps, RichText } = wp.blockEditor;
const THEME_COLORS = {
  primary: "#ff0000",
  secondary: "#002060",
  tertiary: "#232225",
  white: "#ffffff",
  black: "#000000",
  light: "#f5f5f5"
};
function resolveColor(slug, fallback) {
  return THEME_COLORS[slug] || THEME_COLORS[fallback] || fallback;
}
function buildColumns(attributes) {
  const {
    subtitle,
    title,
    content,
    image1Url,
    image1Alt,
    image2Url,
    image2Alt,
    mediaPosition
  } = attributes;
  const isMediaLeft = mediaPosition === "left";
  const textColumn = createElement(
    "div",
    { className: "sc-what-we-do__content" },
    subtitle ? createElement(RichText.Content, {
      tagName: "p",
      className: "sc-what-we-do__subtitle",
      value: subtitle
    }) : null,
    title ? createElement(RichText.Content, {
      tagName: "h2",
      className: "sc-what-we-do__title",
      value: title
    }) : null,
    content ? createElement(RichText.Content, {
      tagName: "div",
      className: "sc-what-we-do__text",
      value: content
    }) : null
  );
  const imagesColumn = createElement(
    "div",
    { className: "sc-what-we-do__media" },
    createElement(
      "div",
      { className: "sc-what-we-do__images" },
      image1Url ? createElement(
        "div",
        { className: "sc-what-we-do__image sc-what-we-do__image--primary" },
        createElement("img", {
          src: image1Url,
          alt: image1Alt || "",
          loading: "lazy",
          decoding: "async"
        })
      ) : null,
      image2Url ? createElement(
        "div",
        { className: "sc-what-we-do__image sc-what-we-do__image--secondary" },
        createElement("img", {
          src: image2Url,
          alt: image2Alt || "",
          loading: "lazy",
          decoding: "async"
        })
      ) : null
    )
  );
  return createElement(
    "div",
    { className: "sc-what-we-do__inner" },
    isMediaLeft ? imagesColumn : textColumn,
    isMediaLeft ? textColumn : imagesColumn
  );
}
const sharedAttrs = {
  subtitle: { type: "string" },
  title: { type: "string" },
  content: { type: "string" },
  image1Url: { type: "string", default: "" },
  image1Alt: { type: "string", default: "" },
  image1Id: { type: "number", default: 0 },
  image2Url: { type: "string", default: "" },
  image2Alt: { type: "string", default: "" },
  image2Id: { type: "number", default: 0 },
  mediaPosition: { type: "string", default: "right" }
};
registerBlockType("system-cars/what-we-do", {
  edit: Edit,
  save: Save,
  deprecated: [
    // v1.1 — text colors, no background color attr in save styles
    {
      attributes: {
        ...sharedAttrs,
        subtitleColor: { type: "string", default: "tertiary" },
        titleColor: { type: "string", default: "black" },
        titleAccentColor: { type: "string", default: "primary" },
        textColor: { type: "string", default: "tertiary" }
      },
      migrate(attributes) {
        return {
          ...attributes,
          backgroundColor: "light"
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: `sc-what-we-do sc-what-we-do--media-${attributes.mediaPosition || "right"}`,
          style: {
            "--sc-wwd-subtitle-color": resolveColor(attributes.subtitleColor, "tertiary"),
            "--sc-wwd-title-color": resolveColor(attributes.titleColor, "black"),
            "--sc-wwd-title-accent-color": resolveColor(attributes.titleAccentColor, "primary"),
            "--sc-wwd-text-color": resolveColor(attributes.textColor, "tertiary")
          }
        });
        return createElement("div", blockProps, buildColumns(attributes));
      }
    },
    // v1.0 — no color styles
    {
      attributes: {
        ...sharedAttrs,
        subtitle: { type: "string", default: "What we do" },
        title: { type: "string", default: "Full-Service <strong>Detailing for Cars</strong>" },
        content: { type: "string", default: "" }
      },
      migrate(attributes) {
        return {
          ...attributes,
          subtitleColor: "tertiary",
          titleColor: "black",
          titleAccentColor: "primary",
          textColor: "tertiary",
          backgroundColor: "light"
        };
      },
      save({ attributes }) {
        const blockProps = useBlockProps.save({
          className: `sc-what-we-do sc-what-we-do--media-${attributes.mediaPosition || "right"}`
        });
        return createElement("div", blockProps, buildColumns(attributes));
      }
    }
  ]
});

})(window.wp || {});