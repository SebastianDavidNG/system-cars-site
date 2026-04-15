(function(wp) {
  'use strict';
  /* empty css                    */
const { useBlockProps: useBlockProps$1, InspectorControls, RichText: RichText$2 } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
const { createElement: createElement$2, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;
  const blockProps = useBlockProps$1({
    className: "styled-button-wrapper"
  });
  const styleColors = {
    secondary: "#002060",
    // Azul
    primary: "#ff0000",
    // Rojo
    tertiary: "#232225",
    // Gris
    white: "#ffffff",
    // Blanco
    black: "#000000"
    // Negro
  };
  const backgroundColor = styleColors[buttonStyle] || styleColors.secondary;
  const textColor = buttonStyle === "white" ? "#000000" : "#ffffff";
  let borderColor = "transparent";
  let borderWidth = "0px";
  if (borderStyle !== "none" && borderStyle !== "transparent") {
    borderColor = styleColors[borderStyle] || "transparent";
    borderWidth = "2px";
  } else if (borderStyle === "transparent") {
    borderColor = "transparent";
    borderWidth = "2px";
  }
  const buttonStyles = {
    backgroundColor,
    color: textColor,
    borderRadius: "0",
    border: `${borderWidth} solid ${borderColor}`,
    cursor: "pointer",
    display: "inline-block",
    textDecoration: "none",
    transition: "all 0.3s ease"
  };
  return createElement$2(
    Fragment,
    null,
    // Inspector Controls
    createElement$2(
      InspectorControls,
      null,
      createElement$2(
        PanelBody,
        { title: "Configuración del Botón", initialOpen: true },
        createElement$2(TextControl, {
          label: "URL",
          value: url,
          onChange: (newUrl) => setAttributes({ url: newUrl }),
          placeholder: "https://ejemplo.com"
        }),
        createElement$2(ToggleControl, {
          label: "Abrir en nueva pestaña",
          checked: openInNewTab,
          onChange: (value) => setAttributes({ openInNewTab: value })
        })
      ),
      createElement$2(
        PanelBody,
        { title: "Estilo del Botón", initialOpen: true },
        createElement$2(SelectControl, {
          label: "Color del Botón",
          value: buttonStyle,
          options: [
            { label: "Azul (Secondary)", value: "secondary" },
            { label: "Rojo (Primary)", value: "primary" },
            { label: "Gris (Tertiary)", value: "tertiary" },
            { label: "Blanco", value: "white" },
            { label: "Negro", value: "black" }
          ],
          onChange: (value) => setAttributes({ buttonStyle: value })
        }),
        createElement$2(SelectControl, {
          label: "Borde",
          value: borderStyle,
          options: [
            { label: "Sin borde", value: "none" },
            { label: "Transparente", value: "transparent" },
            { label: "Azul (Secondary)", value: "secondary" },
            { label: "Rojo (Primary)", value: "primary" },
            { label: "Gris (Tertiary)", value: "tertiary" },
            { label: "Blanco", value: "white" },
            { label: "Negro", value: "black" }
          ],
          onChange: (value) => setAttributes({ borderStyle: value })
        })
      )
    ),
    // Editor Preview
    createElement$2(
      "div",
      blockProps,
      createElement$2(
        "a",
        {
          style: buttonStyles,
          className: "px-10 py-3 font-black uppercase text-lg",
          href: url || "#"
        },
        createElement$2(RichText$2, {
          tagName: "span",
          value: text,
          onChange: (value) => setAttributes({ text: value }),
          placeholder: "Texto del botón..."
        })
      )
    )
  );
}
const { useBlockProps, RichText: RichText$1 } = wp.blockEditor;
const { createElement: createElement$1 } = wp.element;
function Save({ attributes }) {
  const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;
  const blockProps = useBlockProps.save({
    className: "styled-button-wrapper"
  });
  const buttonClasses = [
    "styled-button",
    "px-10",
    "py-3",
    `styled-button--${buttonStyle}`,
    borderStyle !== "none" ? `styled-button--border-${borderStyle}` : "",
    "font-black",
    "uppercase",
    "text-lg"
  ].filter(Boolean).join(" ");
  return createElement$1(
    "div",
    blockProps,
    createElement$1(
      "a",
      {
        className: buttonClasses,
        href: url || "#",
        target: openInNewTab ? "_blank" : "_self",
        rel: openInNewTab ? "noopener noreferrer" : void 0
      },
      createElement$1(RichText$1.Content, {
        tagName: "span",
        value: text
      })
    )
  );
}
const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { RichText } = wp.blockEditor;
const deprecated = [
  // Versión 3: Con capitalize (versión anterior a uppercase)
  {
    attributes: {
      text: {
        type: "string",
        default: "Botón"
      },
      url: {
        type: "string",
        default: ""
      },
      openInNewTab: {
        type: "boolean",
        default: false
      },
      buttonStyle: {
        type: "string",
        default: "secondary"
      },
      borderStyle: {
        type: "string",
        default: "none"
      }
    },
    save({ attributes }) {
      const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;
      const buttonClasses = [
        "styled-button",
        `styled-button--${buttonStyle}`,
        borderStyle !== "none" ? `styled-button--border-${borderStyle}` : "",
        "px-10",
        "py-3",
        "font-black",
        "capitalize",
        "text-lg"
      ].filter(Boolean).join(" ");
      return createElement(
        "div",
        { className: "styled-button-wrapper" },
        createElement(
          "a",
          {
            className: buttonClasses,
            href: url || "#",
            target: openInNewTab ? "_blank" : "_self",
            rel: openInNewTab ? "noopener noreferrer" : void 0
          },
          createElement(RichText.Content, {
            tagName: "span",
            value: text
          })
        )
      );
    }
  },
  // Versión 2: Sin clases de Tailwind (versión anterior a la actual)
  {
    attributes: {
      text: {
        type: "string",
        default: "Botón"
      },
      url: {
        type: "string",
        default: ""
      },
      openInNewTab: {
        type: "boolean",
        default: false
      },
      buttonStyle: {
        type: "string",
        default: "secondary"
      },
      borderStyle: {
        type: "string",
        default: "none"
      }
    },
    save({ attributes }) {
      const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;
      const buttonClasses = [
        "styled-button px-10 py-3",
        `styled-button--${buttonStyle}`,
        borderStyle !== "none" ? `styled-button--border-${borderStyle}` : ""
      ].filter(Boolean).join(" ");
      return createElement(
        "div",
        { className: "styled-button-wrapper" },
        createElement(
          "a",
          {
            className: buttonClasses,
            href: url || "#",
            target: openInNewTab ? "_blank" : "_self",
            rel: openInNewTab ? "noopener noreferrer" : void 0
          },
          createElement(RichText.Content, {
            tagName: "span",
            value: text
          })
        )
      );
    }
  },
  // Versión 1: Con gradientes (versión muy antigua)
  {
    attributes: {
      text: {
        type: "string",
        default: "Botón"
      },
      url: {
        type: "string",
        default: ""
      },
      gradientStart: {
        type: "string",
        default: "#FF4311"
      },
      gradientEnd: {
        type: "string",
        default: "#EA0A0B"
      },
      openInNewTab: {
        type: "boolean",
        default: false
      }
    },
    save({ attributes }) {
      const { text, url, gradientStart, gradientEnd, openInNewTab } = attributes;
      const buttonStyle = {
        background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
      };
      return createElement(
        "div",
        { className: "styled-button-wrapper" },
        createElement(
          "a",
          {
            className: "styled-button px-10 py-3",
            style: buttonStyle,
            href: url || "#",
            target: openInNewTab ? "_blank" : "_self",
            rel: openInNewTab ? "noopener noreferrer" : void 0
          },
          createElement(RichText.Content, {
            tagName: "span",
            value: text
          })
        )
      );
    },
    migrate(attributes) {
      return {
        text: attributes.text,
        url: attributes.url || "#",
        gradientStart: attributes.gradientStart,
        gradientEnd: attributes.gradientEnd,
        openInNewTab: attributes.openInNewTab,
        buttonStyle: "gradient",
        hasShadow: false,
        align: "center"
      };
    }
  }
];
registerBlockType("system-cars/styled-button", {
  edit: Edit,
  save: Save,
  deprecated
});

})(window.wp || {});