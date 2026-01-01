(function(wp) {
  'use strict';
  /* empty css                       */
const { useBlockProps: useBlockProps$1, InspectorControls, InnerBlocks: InnerBlocks$1, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, RangeControl, ToggleControl } = wp.components;
const { createElement: createElement$1, Fragment } = wp.element;
function Edit({ attributes, setAttributes }) {
  const {
    backgroundImage,
    backgroundImageId,
    minHeight,
    parallax,
    mobileOptimized
  } = attributes;
  const blockProps = useBlockProps$1({
    className: "parallax-block-editor",
    style: {
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: `${minHeight}px`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      padding: "40px 20px"
    }
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
        { title: "Imagen de Fondo", initialOpen: true },
        createElement$1(MediaUpload, {
          onSelect: (media) => {
            setAttributes({
              backgroundImage: media.url,
              backgroundImageId: media.id
            });
          },
          allowedTypes: ["image"],
          value: backgroundImageId,
          render: ({ open }) => createElement$1(
            Button,
            {
              isPrimary: !backgroundImage,
              isSecondary: !!backgroundImage,
              onClick: open,
              style: { marginBottom: "10px", width: "100%" }
            },
            backgroundImage ? "Cambiar imagen" : "Seleccionar imagen"
          )
        }),
        backgroundImage && createElement$1(
          Button,
          {
            isDestructive: true,
            onClick: () => setAttributes({ backgroundImage: "", backgroundImageId: 0 }),
            style: { width: "100%" }
          },
          "Eliminar imagen"
        )
      ),
      createElement$1(
        PanelBody,
        { title: "Configuración", initialOpen: true },
        createElement$1(RangeControl, {
          label: "Altura (px)",
          value: minHeight,
          onChange: (value) => setAttributes({ minHeight: value }),
          min: 100,
          max: 1e3,
          step: 10
        }),
        createElement$1(ToggleControl, {
          label: "Efecto parallax",
          checked: parallax,
          onChange: (value) => setAttributes({ parallax: value })
        }),
        createElement$1(ToggleControl, {
          label: "Optimizado para móvil",
          checked: mobileOptimized,
          onChange: (value) => setAttributes({ mobileOptimized: value }),
          help: "Desactiva parallax en móviles"
        })
      )
    ),
    // Editor con InnerBlocks
    createElement$1(
      "div",
      blockProps,
      // Contenedor para InnerBlocks con z-index para estar sobre el fondo
      createElement$1(
        "div",
        {
          style: {
            position: "relative",
            zIndex: 2,
            width: "100%"
          }
        },
        createElement$1(InnerBlocks$1, {
          template: [
            // Plantilla sugerida con un botón centrado
            ["core/buttons", { layout: { type: "flex", justifyContent: "center" } }, [
              ["system-cars/styled-button", {}]
            ]]
          ],
          templateLock: false
          // Permite agregar/eliminar bloques
        })
      )
    )
  );
}
const { useBlockProps, InnerBlocks } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const {
    backgroundImage,
    minHeight,
    parallax,
    mobileOptimized
  } = attributes;
  const blockProps = useBlockProps.save({
    className: "parallax-columns-block",
    style: {
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      minHeight: `${minHeight}px`,
      "--parallax-offset": "0px"
    },
    "data-parallax": parallax ? "true" : "false",
    "data-height": minHeight.toString(),
    "data-mobile-optimized": mobileOptimized ? "true" : "false"
  });
  return createElement(
    "div",
    blockProps,
    // Contenedor para el contenido interno con z-index
    createElement(
      "div",
      {
        className: "parallax-content-wrapper",
        style: {
          position: "relative",
          zIndex: 2,
          width: "100%"
        }
      },
      createElement(InnerBlocks.Content)
    )
  );
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/parallax-columns", {
  edit: Edit,
  save: Save
});

})(window.wp || {});