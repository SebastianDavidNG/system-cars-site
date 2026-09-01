(function(wp) {
  'use strict';
  /* empty css          */
const { useBlockProps: useBlockProps$1, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, RangeControl, Notice } = wp.components;
const { createElement: createElement$1, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { embedUrl, mapTitle, height } = attributes;
  const blockProps = useBlockProps$1({
    className: "sc-map",
    style: {
      "--sc-map-height": `${height || 480}px`
    }
  });
  return createElement$1(
    Fragment,
    null,
    createElement$1(
      InspectorControls,
      null,
      createElement$1(
        PanelBody,
        { title: "Configuración del mapa", initialOpen: true },
        createElement$1(TextControl, {
          label: "URL del embed de Google Maps",
          help: "Pega una URL con output=embed, o deja la ubicación por defecto de System Cars.",
          value: embedUrl,
          onChange: (value) => setAttributes({ embedUrl: value })
        }),
        createElement$1(TextControl, {
          label: "Título accesible (iframe title)",
          value: mapTitle,
          onChange: (value) => setAttributes({ mapTitle: value })
        }),
        createElement$1(RangeControl, {
          label: "Altura (px)",
          value: height,
          onChange: (value) => setAttributes({ height: value }),
          min: 280,
          max: 800,
          step: 10
        })
      )
    ),
    createElement$1(
      "div",
      blockProps,
      createElement$1(
        "div",
        { className: "sc-map__frame" },
        embedUrl ? createElement$1("iframe", {
          src: embedUrl,
          title: mapTitle || "Mapa",
          loading: "lazy",
          referrerPolicy: "no-referrer-when-downgrade",
          allowFullScreen: true
        }) : createElement$1(
          Notice,
          { status: "warning", isDismissible: false },
          "Configura la URL del mapa en el panel lateral."
        )
      )
    )
  );
}
const { useBlockProps } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const { embedUrl, mapTitle, height } = attributes;
  const blockProps = useBlockProps.save({
    className: "sc-map",
    style: {
      "--sc-map-height": `${height || 480}px`
    }
  });
  if (!embedUrl) {
    return null;
  }
  return createElement(
    "div",
    blockProps,
    createElement(
      "div",
      { className: "sc-map__frame" },
      createElement("iframe", {
        src: embedUrl,
        title: mapTitle || "Mapa",
        loading: "lazy",
        referrerPolicy: "no-referrer-when-downgrade",
        allowFullScreen: true
      })
    )
  );
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/map", {
  edit: Edit,
  save: Save
});

})(window.wp || {});