(function(wp) {
  'use strict';
  /* empty css                    */
/* empty css                   */
const { useBlockProps: useBlockProps$1, RichText: RichText$1, MediaUpload, URLInput } = wp.blockEditor;
const { Button, IconButton, SelectControl } = wp.components;
const { createElement: createElement$1, useState } = wp.element;
function Edit({ attributes, setAttributes }) {
  const { cards } = attributes;
  const [expandedCard, setExpandedCard] = useState(null);
  const addCard = () => {
    setAttributes({
      cards: [...cards, {
        iconUrl: "",
        title: "",
        description: "",
        bgColor: "white",
        linkUrl: "",
        hoverBgImage: "",
        columns: 4
      }]
    });
  };
  const removeCard = (idx) => {
    setAttributes({ cards: cards.filter((_, i) => i !== idx) });
    if (expandedCard === idx) setExpandedCard(null);
  };
  const updateCard = (idx, key, val) => {
    setAttributes({
      cards: cards.map((c, i) => i === idx ? { ...c, [key]: val } : c)
    });
  };
  const toggleCardSettings = (idx) => {
    setExpandedCard(expandedCard === idx ? null : idx);
  };
  const colSpanMap = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12"
  };
  return createElement$1(
    "div",
    useBlockProps$1(),
    // Mensaje si no hay cards
    cards.length === 0 && createElement$1(
      "div",
      { className: "text-center p-8 border-2 border-dashed border-gray-300 rounded" },
      createElement$1("p", { className: "mb-4 text-gray-600" }, "No hay tarjetas. Añade una para comenzar."),
      createElement$1(Button, {
        isPrimary: true,
        onClick: addCard
      }, "Agregar primera tarjeta")
    ),
    // Grid preview de todas las cards
    cards.length > 0 && createElement$1(
      "div",
      { className: "grid grid-cols-12 gap-4 mb-4" },
      cards.map((card, idx) => {
        const bgColorClass = `bg-${card.bgColor || "white"}`;
        const textColorClass = card.bgColor === "white" ? "text-black" : "text-white";
        const colSpanClass = `col-span-12 ${colSpanMap[card.columns || 4]}`;
        const isExpanded = expandedCard === idx;
        return createElement$1(
          "div",
          {
            key: idx,
            className: `${bgColorClass} ${textColorClass} ${colSpanClass} p-4 rounded border-2 border-gray-400 relative`,
            style: { minHeight: "200px" }
          },
          // Toolbar en la parte superior (eliminar y settings)
          createElement$1(
            "div",
            { className: "flex justify-end gap-2 mb-2" },
            createElement$1(IconButton, {
              icon: "admin-generic",
              label: "Configuración",
              className: "bg-white",
              onClick: () => toggleCardSettings(idx),
              style: { padding: "4px" }
            }),
            createElement$1(IconButton, {
              icon: "trash",
              label: "Eliminar",
              className: "is-destructive bg-white",
              onClick: () => removeCard(idx),
              style: { padding: "4px" }
            })
          ),
          // Panel de configuración expandible
          isExpanded && createElement$1(
            "div",
            { className: "bg-white text-black p-3 rounded mb-3 border border-gray-300" },
            // Icono
            createElement$1("label", { className: "block mb-1 font-medium text-sm" }, "Icono:"),
            card.iconUrl && createElement$1("img", {
              src: card.iconUrl,
              alt: "Icon",
              className: "mb-2",
              style: { width: "40px", height: "40px", objectFit: "contain" }
            }),
            createElement$1(MediaUpload, {
              onSelect: (m) => updateCard(idx, "iconUrl", m.url),
              allowedTypes: ["image"],
              render: ({ open }) => createElement$1(Button, {
                isSmall: true,
                onClick: open,
                className: "mb-2"
              }, card.iconUrl ? "Cambiar" : "Seleccionar")
            }),
            // Color de fondo
            createElement$1("label", { className: "block mb-1 font-medium text-sm" }, "Color:"),
            createElement$1(SelectControl, {
              value: card.bgColor || "white",
              options: [
                { label: "Blanco", value: "white" },
                { label: "Rojo", value: "primary" },
                { label: "Azul", value: "secondary" },
                { label: "Gris", value: "tertiary" }
              ],
              onChange: (v) => updateCard(idx, "bgColor", v),
              className: "mb-2"
            }),
            // Columnas
            createElement$1("label", { className: "block mb-1 font-medium text-sm" }, "Columnas:"),
            createElement$1(SelectControl, {
              value: card.columns || 4,
              options: [
                { label: "3 (1/4)", value: 3 },
                { label: "4 (1/3)", value: 4 },
                { label: "6 (1/2)", value: 6 },
                { label: "12 (Full)", value: 12 }
              ],
              onChange: (v) => updateCard(idx, "columns", Number(v)),
              className: "mb-2"
            }),
            // URL
            createElement$1("label", { className: "block mb-1 font-medium text-sm" }, "URL:"),
            createElement$1(URLInput, {
              value: card.linkUrl,
              onChange: (v) => updateCard(idx, "linkUrl", v),
              className: "mb-2"
            }),
            // Imagen hover
            createElement$1("label", { className: "block mb-1 font-medium text-sm" }, "Imagen hover:"),
            card.hoverBgImage && createElement$1("img", {
              src: card.hoverBgImage,
              alt: "Hover",
              className: "mb-1",
              style: { maxWidth: "80px", height: "auto" }
            }),
            createElement$1(MediaUpload, {
              onSelect: (m) => updateCard(idx, "hoverBgImage", m.url),
              allowedTypes: ["image"],
              render: ({ open }) => createElement$1(Button, {
                isSmall: true,
                onClick: open
              }, card.hoverBgImage ? "Cambiar" : "Seleccionar")
            })
          ),
          // Preview del contenido
          createElement$1(
            "div",
            { className: "text-center" },
            // Icono
            card.iconUrl && createElement$1("img", {
              src: card.iconUrl,
              alt: "",
              className: "mx-auto mb-2",
              style: { width: "50px", height: "50px", objectFit: "contain" }
            }),
            // Título editable
            createElement$1(RichText$1, {
              tagName: "h3",
              value: card.title,
              onChange: (v) => updateCard(idx, "title", v),
              placeholder: "Título…",
              className: "font-semibold text-lg mb-1"
            }),
            // Descripción editable
            createElement$1(RichText$1, {
              tagName: "p",
              value: card.description,
              onChange: (v) => updateCard(idx, "description", v),
              placeholder: "Descripción…",
              className: "font-light text-sm"
            })
          )
        );
      })
    ),
    // Botón agregar tarjeta
    cards.length > 0 && createElement$1(
      "div",
      { className: "text-center mt-4" },
      createElement$1(Button, {
        isPrimary: true,
        onClick: addCard
      }, "+ Agregar tarjeta")
    )
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  const { cards } = attributes;
  return createElement(
    "div",
    useBlockProps.save({ className: "grid grid-cols-12 gap-0" }),
    cards.map((card, idx) => {
      const Tag = card.linkUrl ? "a" : "div";
      const bgColorClass = `bg-${card.bgColor || "white"}`;
      const textColorClass = card.bgColor === "white" ? "text-black" : "text-white";
      const hasLink = !!card.linkUrl;
      const columns = card.columns || 4;
      const colSpanMap = {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
        4: "md:col-span-4",
        5: "md:col-span-5",
        6: "md:col-span-6",
        7: "md:col-span-7",
        8: "md:col-span-8",
        9: "md:col-span-9",
        10: "md:col-span-10",
        11: "md:col-span-11",
        12: "md:col-span-12"
      };
      const colSpanClass = `col-span-12 ${colSpanMap[columns] || "md:col-span-4"}`;
      const cardProps = {
        key: idx,
        className: `bg-card ${bgColorClass} ${textColorClass} ${colSpanClass} h-[350px] md:h-[300px] lg:h-[400px] p-6 md:p-8 ${hasLink ? "card-item" : "text-center md:text-start"}`,
        style: {
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          ...hasLink && { textDecoration: "none" }
        }
      };
      if (hasLink) {
        cardProps.href = card.linkUrl;
        cardProps.target = "_blank";
        cardProps.rel = "noopener noreferrer";
      }
      return createElement(
        Tag,
        cardProps,
        // Background hover (solo si tiene imagen y tiene link)
        card.hoverBgImage && hasLink && createElement("div", {
          className: "card-bg-hover",
          style: {
            backgroundImage: `url(${card.hoverBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            inset: "0",
            zIndex: 1
          }
        }),
        // Content
        createElement(
          "div",
          {
            className: hasLink ? "card-content text-center md:text-start" : "",
            style: { position: "relative", zIndex: 2 }
          },
          // Icon
          card.iconUrl && createElement(
            "div",
            { className: "flex justify-center md:justify-start mb-2 md:mb-3" },
            createElement("img", {
              src: card.iconUrl,
              alt: "",
              className: hasLink ? "card-icon w-14 h-14 md:w-[75px] md:h-[75px]" : "w-14 h-14 md:w-[75px] md:h-[75px]",
              style: {
                objectFit: "contain",
                borderRadius: "4px",
                display: "block"
              }
            })
          ),
          // Title
          createElement(RichText.Content, {
            tagName: "h3",
            value: card.title,
            className: hasLink ? "card-title font-semibold text-xl md:text-2xl mb-2" : "font-semibold text-xl md:text-2xl mb-2"
          }),
          // Description
          createElement(RichText.Content, {
            tagName: "p",
            value: card.description,
            className: hasLink ? "card-description font-light text-sm md:text-base" : "font-light text-sm md:text-base"
          }),
          // Arrow (solo si tiene link)
          hasLink && createElement(
            "span",
            {
              className: "card-arrow-link",
              style: {
                display: "inline-block",
                width: "32px",
                height: "32px",
                marginTop: "1em"
              }
            },
            createElement("svg", {
              width: "32",
              height: "32",
              viewBox: "0 0 800 800",
              xmlns: "http://www.w3.org/2000/svg",
              fill: textColorClass === "text-white" ? "white" : "black"
            }, createElement("path", {
              d: "M557.956 150.895L792.218 383.149L793.533 384.354C797.537 388.323 799.692 393.431 800 398.627V401.373C799.692 406.568 797.537 411.676 793.533 415.646L792.38 416.622L557.956 649.105C549.282 657.706 535.219 657.706 526.546 649.105C517.872 640.504 517.872 626.558 526.546 617.957L726.726 419.419L22.2104 419.436C9.94387 419.436 0 409.575 0 397.412C0 385.248 9.94387 375.387 22.2104 375.387L721.506 375.37L526.546 182.042C517.872 173.441 517.872 159.496 526.546 150.895C535.219 142.294 549.282 142.294 557.956 150.895ZM780.341 397.393L542.251 633.531L777.826 400.004L777.828 399.919L776.514 398.724L775.172 397.393H780.341Z"
            }))
          )
        )
      );
    })
  );
}
const { registerBlockType } = wp.blocks;
registerBlockType("system-cars/service-card", {
  edit: Edit,
  save: Save
});

})(window.wp || {});