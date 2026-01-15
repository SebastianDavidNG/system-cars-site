(function(wp) {
  'use strict';
  /* empty css                    */
/* empty css                   */
const { useBlockProps: useBlockProps$1, RichText: RichText$1, MediaUpload, URLInput } = wp.blockEditor;
const { Button, IconButton, SelectControl } = wp.components;
const { createElement: createElement$1, useState, useEffect } = wp.element;
function ArrowLeftSVG(props) {
  return createElement$1(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 640 640",
      ...props,
      className: `${props.className || ""} w-6 h-6`
    },
    createElement$1("path", {
      d: "M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"
    })
  );
}
function ArrowRightSVG(props) {
  return createElement$1(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 640 640",
      ...props,
      className: `${props.className || ""} w-6 h-6`
    },
    createElement$1("path", {
      d: "M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"
    })
  );
}
function Edit({ attributes, setAttributes }) {
  const { cards } = attributes;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (current >= cards.length) {
      setCurrent(Math.max(0, cards.length - 1));
    }
  }, [cards.length, current]);
  const addCard = () => {
    const next2 = [...cards, {
      iconUrl: "",
      title: "",
      description: "",
      bgColor: "white",
      linkUrl: "",
      hoverBgImage: "",
      columns: 4
    }];
    setAttributes({ cards: next2 });
    setCurrent(next2.length - 1);
  };
  const removeCard = (idx) => {
    setAttributes({ cards: cards.filter((_, i) => i !== idx) });
  };
  const updateCard = (idx, key, val) => {
    setAttributes({
      cards: cards.map((c, i) => i === idx ? { ...c, [key]: val } : c)
    });
  };
  const prev = () => setCurrent((c) => (c - 1 + cards.length) % cards.length);
  const next = () => setCurrent((c) => (c + 1) % cards.length);
  return createElement$1(
    "div",
    useBlockProps$1(),
    // Aviso si no hay cards
    cards.length === 0 && createElement$1("p", { className: "editor-notice" }, "Añade una tarjeta para comenzar."),
    // Panel de edición de cada card
    cards.map(
      (card, idx) => createElement$1(
        "div",
        {
          key: idx,
          className: idx === current ? "card-editor-item" : "hidden"
        },
        createElement$1(
          "h4",
          { className: "mb-4 font-bold" },
          `Tarjeta ${idx + 1}`
        ),
        // Preview del icono
        card.iconUrl && createElement$1("img", {
          src: card.iconUrl,
          alt: `Card ${idx + 1} icon`,
          className: "card-icon-preview mb-4",
          style: { width: "75px", height: "75px", objectFit: "contain" }
        }),
        // MediaUpload para icono
        createElement$1(
          "figure",
          { className: "wp-block-image mb-4" },
          createElement$1(MediaUpload, {
            onSelect: (m) => updateCard(idx, "iconUrl", m.url),
            allowedTypes: ["image"],
            render: ({ open }) => createElement$1(
              Button,
              {
                isSecondary: true,
                onClick: open,
                className: "w-auto mb-4 justify-center"
              },
              card.iconUrl ? "Cambiar icono" : "Selecciona un icono"
            )
          })
        ),
        // Título de la tarjeta
        createElement$1(RichText$1, {
          tagName: "h3",
          value: card.title,
          onChange: (v) => updateCard(idx, "title", v),
          placeholder: "Título de la tarjeta…",
          className: "card-title-input mb-4 p-2 border border-gray-400 font-semibold text-2xl"
        }),
        // Descripción de la tarjeta
        createElement$1(RichText$1, {
          tagName: "p",
          value: card.description,
          onChange: (v) => updateCard(idx, "description", v),
          placeholder: "Descripción de la tarjeta…",
          className: "card-description-input mb-4 p-2 border border-gray-400"
        }),
        // Selector de color de fondo
        createElement$1(
          "div",
          { className: "mb-4" },
          createElement$1("label", { className: "block mb-2 font-medium" }, "Color de fondo:"),
          createElement$1(SelectControl, {
            value: card.bgColor || "white",
            options: [
              { label: "Blanco", value: "white" },
              { label: "Rojo (Primary)", value: "primary" },
              { label: "Azul (Secondary)", value: "secondary" },
              { label: "Gris (Tertiary)", value: "tertiary" }
            ],
            onChange: (v) => updateCard(idx, "bgColor", v)
          })
        ),
        // Selector de columnas
        createElement$1(
          "div",
          { className: "mb-4" },
          createElement$1("label", { className: "block mb-2 font-medium" }, "Tamaño de columnas (1-12):"),
          createElement$1(SelectControl, {
            value: card.columns || 4,
            options: [
              { label: "1 columna (1/12)", value: 1 },
              { label: "2 columnas (2/12)", value: 2 },
              { label: "3 columnas (3/12 - 1/4)", value: 3 },
              { label: "4 columnas (4/12 - 1/3)", value: 4 },
              { label: "5 columnas (5/12)", value: 5 },
              { label: "6 columnas (6/12 - 1/2)", value: 6 },
              { label: "7 columnas (7/12)", value: 7 },
              { label: "8 columnas (8/12 - 2/3)", value: 8 },
              { label: "9 columnas (9/12 - 3/4)", value: 9 },
              { label: "10 columnas (10/12)", value: 10 },
              { label: "11 columnas (11/12)", value: 11 },
              { label: "12 columnas (12/12 - completo)", value: 12 }
            ],
            onChange: (v) => updateCard(idx, "columns", Number(v))
          })
        ),
        // URL del enlace
        createElement$1(
          "div",
          { className: "mb-4" },
          createElement$1("label", { className: "block mb-2 font-medium" }, "URL del enlace (opcional):"),
          createElement$1(URLInput, {
            value: card.linkUrl,
            onChange: (v) => updateCard(idx, "linkUrl", v)
          })
        ),
        // Imagen de fondo hover (opcional)
        createElement$1(
          "div",
          { className: "mb-4" },
          createElement$1("label", { className: "block mb-2 font-medium" }, "Imagen de fondo al hover (opcional):"),
          card.hoverBgImage && createElement$1("img", {
            src: card.hoverBgImage,
            alt: "Hover background preview",
            className: "mb-2 rounded",
            style: { maxWidth: "200px", height: "auto" }
          }),
          createElement$1(MediaUpload, {
            onSelect: (m) => updateCard(idx, "hoverBgImage", m.url),
            allowedTypes: ["image"],
            render: ({ open }) => createElement$1(
              Button,
              {
                isSecondary: true,
                onClick: open
              },
              card.hoverBgImage ? "Cambiar imagen hover" : "Seleccionar imagen hover"
            )
          })
        ),
        // Eliminar tarjeta
        createElement$1(IconButton, {
          icon: "trash",
          label: "Eliminar Tarjeta",
          className: "is-destructive",
          onClick: () => removeCard(idx)
        })
      )
    ),
    // Controles de paginación en el editor
    cards.length > 1 && createElement$1(
      "div",
      { className: "card-controls-editor mb-6 flex items-center justify-center gap-4" },
      // Flecha anterior
      createElement$1(
        "button",
        {
          onClick: prev,
          disabled: cards.length < 2,
          className: "card-nav-btn components-button is-primary",
          "aria-label": "Tarjeta anterior"
        },
        createElement$1(ArrowLeftSVG, { className: "text-white" })
      ),
      // Contador
      createElement$1(
        "span",
        { className: "card-nav-count mx-2 font-medium" },
        `${current + 1} / ${cards.length}`
      ),
      // Flecha siguiente
      createElement$1(
        "button",
        {
          onClick: next,
          disabled: cards.length < 2,
          className: "card-nav-btn components-button is-primary",
          "aria-label": "Siguiente tarjeta"
        },
        createElement$1(ArrowRightSVG, { className: "text-white" })
      )
    ),
    // Botón "Agregar tarjeta"
    createElement$1(
      Button,
      {
        isPrimary: true,
        onClick: addCard,
        className: "w-auto mb-4 max-w-40 justify-center"
      },
      "Agregar tarjeta"
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