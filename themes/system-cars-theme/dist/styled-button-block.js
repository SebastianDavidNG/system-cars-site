(function(wp) {
  'use strict';
  /* empty css                    */
const { useBlockProps: useBlockProps$1, InspectorControls, RichText: RichText$1, URLInput } = wp.blockEditor;
const { PanelBody, ColorPicker, ToggleControl } = wp.components;
const { createElement: createElement$1, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { text, url, gradientStart, gradientEnd, openInNewTab } = attributes;
  const blockProps = useBlockProps$1({
    className: "styled-button-wrapper"
  });
  const buttonStyle = {
    background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
    color: "#fff",
    padding: "27px 38px",
    borderRadius: "0",
    border: "none",
    cursor: "pointer",
    display: "inline-block",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease"
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
        { title: "Configuración del Botón", initialOpen: true },
        createElement$1(URLInput, {
          label: "URL",
          value: url,
          onChange: (newUrl) => setAttributes({ url: newUrl })
        }),
        createElement$1(ToggleControl, {
          label: "Abrir en nueva pestaña",
          checked: openInNewTab,
          onChange: (value) => setAttributes({ openInNewTab: value })
        })
      ),
      createElement$1(
        PanelBody,
        { title: "Gradiente", initialOpen: true },
        createElement$1("p", { style: { marginBottom: "8px" } }, "Color Inicial"),
        createElement$1(ColorPicker, {
          color: gradientStart,
          onChangeComplete: (color) => setAttributes({ gradientStart: color.hex })
        }),
        createElement$1("p", { style: { marginBottom: "8px", marginTop: "16px" } }, "Color Final"),
        createElement$1(ColorPicker, {
          color: gradientEnd,
          onChangeComplete: (color) => setAttributes({ gradientEnd: color.hex })
        })
      )
    ),
    // Editor Preview
    createElement$1(
      "div",
      blockProps,
      createElement$1(
        "a",
        { style: buttonStyle, href: url || "#" },
        createElement$1(RichText$1, {
          tagName: "span",
          value: text,
          onChange: (value) => setAttributes({ text: value }),
          placeholder: "Texto del botón..."
        })
      )
    )
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const { text, url, gradientStart, gradientEnd, openInNewTab } = attributes;
  const blockProps = useBlockProps.save({
    className: "styled-button-wrapper"
  });
  const buttonStyle = {
    background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
  };
  return createElement(
    "div",
    blockProps,
    createElement(
      "a",
      {
        className: "styled-button",
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
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/styled-button", {
  edit: Edit,
  save: Save
});

})(window.wp || {});