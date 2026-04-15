(function(wp) {
  'use strict';
  /* empty css                   */
/* empty css                    */
const { useBlockProps: useBlockProps$1, RichText: RichText$1, MediaUpload, URLInput } = wp.blockEditor;
const { Button, IconButton } = wp.components;
const { createElement: createElement$1, Fragment: Fragment$1, useState, useEffect } = wp.element;
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
function Edit({ attributes: attributes2, setAttributes }) {
  const { slides } = attributes2;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(Math.max(0, slides.length - 1));
    }
  }, [slides.length, current]);
  const addSlide = () => {
    const next2 = [...slides, { image: "", text: "", buttonText: "", buttonLink: "" }];
    setAttributes({ slides: next2 });
    setCurrent(next2.length - 1);
  };
  const removeSlide = (idx) => {
    setAttributes({ slides: slides.filter((_, i) => i !== idx) });
  };
  const updateSlide = (idx, key, val) => {
    setAttributes({
      slides: slides.map((s, i) => i === idx ? { ...s, [key]: val } : s)
    });
  };
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  return createElement$1(
    "div",
    useBlockProps$1(),
    // Aviso si no hay slides
    slides.length === 0 && createElement$1("p", { className: "editor-notice" }, "Añade un slide para comenzar."),
    // Panel de edición de cada slide
    slides.map(
      (slide, idx) => createElement$1(
        "div",
        {
          key: idx,
          className: idx === current ? "slide-editor-item" : "hidden"
        },
        createElement$1(
          "h4",
          { className: "mb-4 font-bold" },
          `Slide ${idx + 1}`
        ),
        slide.image && createElement$1("img", {
          src: slide.image,
          alt: `Slide ${idx + 1} preview`,
          className: "slide-image-preview mb-4 rounded"
        }),
        // MediaUpload dentro de <figure> para heredar clases core si quieres
        createElement$1(
          "figure",
          { className: "wp-block-image mb-4" },
          createElement$1(MediaUpload, {
            onSelect: (m) => updateSlide(idx, "image", m.url),
            allowedTypes: ["image"],
            render: ({ open }) => createElement$1(
              Button,
              { isSecondary: true, onClick: open, className: "w-auto mb-4 justify-center" },
              slide.image ? "Cambiar imagen" : "Selecciona una imagen"
            )
          })
        ),
        // Texto del slide
        createElement$1(RichText$1, {
          tagName: "p",
          value: slide.text,
          onChange: (v) => updateSlide(idx, "text", v),
          placeholder: "Texto del slide…",
          className: "slide-text-input mb-4 p-2 border border-gray-400"
        }),
        // Texto del botón
        createElement$1(RichText$1, {
          tagName: "p",
          value: slide.buttonText,
          onChange: (v) => updateSlide(idx, "buttonText", v),
          placeholder: "Texto del botón…",
          className: "slide-text-input mb-4 p-2 border border-gray-400"
        }),
        // URL del botón
        createElement$1(URLInput, {
          value: slide.buttonLink,
          onChange: (v) => updateSlide(idx, "buttonLink", v)
        }),
        // Eliminar slide
        createElement$1(IconButton, {
          icon: "trash",
          label: "Eliminar Slide",
          className: "is-destructive",
          onClick: () => removeSlide(idx)
        })
      )
    ),
    // Controles de paginación en el editor con SVG
    slides.length > 1 && createElement$1(
      "div",
      { className: "slider-controls-editor mb-6" },
      // Flecha anterior
      createElement$1(
        "button",
        {
          onClick: prev,
          disabled: slides.length < 2,
          className: "slider-nav-btn components-button is-primary",
          "aria-label": "Anterior slide"
        },
        createElement$1(ArrowLeftSVG, { className: "text-white" })
      ),
      // Contador
      createElement$1(
        "span",
        {
          className: "slider-nav-count mx-2 font-medium"
        },
        `${current + 1} / ${slides.length}`
      ),
      // Flecha siguiente
      createElement$1(
        "button",
        {
          onClick: next,
          disabled: slides.length < 2,
          className: "slider-nav-btn components-button is-primary",
          "aria-label": "Siguiente slide"
        },
        createElement$1(ArrowRightSVG, { className: "text-white" })
      )
    ),
    // Botón “Agregar slide”
    createElement$1(
      Button,
      {
        isPrimary: true,
        onClick: addSlide,
        className: "w-auto mb-4 max-w-40 justify-center"
      },
      "Agregar slide"
    )
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement, Fragment } = wp.element;
function Save({ attributes: attributes2 }) {
  const { slides } = attributes2;
  return createElement(
    "div",
    useBlockProps.save({ className: "swiper wp-block-system-cars-slider-block", "data-slide-count": slides.length }),
    createElement(
      "div",
      { className: "swiper-wrapper" },
      slides.map(
        (slide, idx) => createElement(
          "div",
          { className: "swiper-slide", key: idx },
          createElement("img", { src: slide.image, alt: "" }),
          createElement(
            "div",
            { className: "slide-content" },
            createElement(RichText.Content, {
              tagName: "p",
              value: slide.text,
              className: "slide-text"
            }),
            slide.buttonText && slide.buttonLink && createElement(RichText.Content, {
              tagName: "a",
              value: slide.buttonText,
              href: slide.buttonLink,
              className: "slide-button"
            })
          )
        )
      )
    ),
    // flechas para Swiper
    slides.length > 1 && createElement(Fragment, null, [
      createElement("div", { className: "swiper-button-prev", key: "prev" }),
      createElement("div", { className: "swiper-button-next", key: "next" })
    ])
  );
}
const apiVersion = 3;
const name = "system-cars/slider-block";
const title = "Slider Block";
const category = "system-cars";
const icon = "images-alt2";
const description = "Un bloque de slider personalizado.";
const supports = {
  html: false
};
const textdomain = "system-cars-theme";
const attributes = {
  slides: {
    type: "array",
    "default": [],
    source: "query",
    selector: ".swiper-slide",
    query: {
      image: {
        type: "string",
        source: "attribute",
        selector: "img",
        attribute: "src"
      },
      text: {
        type: "string",
        source: "html",
        selector: ".slide-text"
      },
      buttonText: {
        type: "string",
        source: "html",
        selector: ".slide-button"
      },
      buttonLink: {
        type: "string",
        source: "attribute",
        selector: ".slide-button",
        attribute: "href"
      }
    }
  }
};
const editorScript = "file:../../dist/slider-block.js";
const editorStyle = "file:../../dist/css/slider-block-editor.css";
const style = "file:../../dist/css/slider-block-style.css";
const metadata = {
  apiVersion,
  name,
  title,
  category,
  icon,
  description,
  supports,
  textdomain,
  attributes,
  editorScript,
  editorStyle,
  style
};
const { registerBlockType } = wp.blocks;
registerBlockType(metadata.name, {
  edit: Edit,
  save: Save,
  ...metadata
  // para asegurarnos de que block.json se respete
});

})(window.wp || {});