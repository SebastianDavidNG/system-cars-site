const { useBlockProps, RichText, MediaUpload, URLInput } = wp.blockEditor;
const { Button, IconButton } = wp.components;
const { createElement, Fragment, useState, useEffect } = wp.element;

function ArrowLeftSVG(props) {
  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 640 640',
      ...props,
      className: `${props.className || ''} w-6 h-6`,
    },
    createElement('path', {
      d: 'M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z',
    })
  );
}

function ArrowRightSVG(props) {
  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 640 640',
      ...props,
      className: `${props.className || ''} w-6 h-6`,
    },
    createElement('path', {
      d: 'M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z',
    })
  );
}

export default function Edit({ attributes, setAttributes }) {
  const { slides } = attributes;
  const [current, setCurrent] = useState(0);

  // Ajustamos current cuando el array cambia
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(Math.max(0, slides.length - 1));
    }
  }, [slides.length, current]);

  const addSlide = () => {
    const next = [...slides, { image: '', text: '', buttonText: '', buttonLink: '' }];
    setAttributes({ slides: next });
    setCurrent(next.length - 1);
  };
  const removeSlide = idx => {
    setAttributes({ slides: slides.filter((_, i) => i !== idx) });
  };
  const updateSlide = (idx, key, val) => {
    setAttributes({
      slides: slides.map((s, i) => i === idx ? { ...s, [key]: val } : s)
    });
  };
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return createElement(
    'div',
    useBlockProps(),
    // Aviso si no hay slides
    slides.length === 0 &&
      createElement('p', { className: 'editor-notice' }, 'Añade un slide para comenzar.'),

    // Panel de edición de cada slide
    slides.map((slide, idx) =>
      createElement(
        'div',
        {
          key: idx,
          className: idx === current ? 'slide-editor-item' : 'hidden',
        },

        createElement(
            'h4',
            { className: 'mb-4 font-bold' },
            `Slide ${idx + 1}`
        ),

        slide.image &&
            createElement('img', {
                src: slide.image,
                alt: `Slide ${idx + 1} preview`,
                className: 'slide-image-preview mb-4 rounded',
        }),
        

        // MediaUpload dentro de <figure> para heredar clases core si quieres
        createElement(
          'figure',
          { className: 'wp-block-image mb-4' },
          createElement(MediaUpload, {
            onSelect: m => updateSlide(idx, 'image', m.url),
            allowedTypes: ['image'],
            render: ({ open }) =>
              createElement(Button, { isSecondary: true, onClick: open, className: 'w-auto mb-4 justify-center' },
                slide.image ? 'Cambiar imagen' : 'Selecciona una imagen'
              ),
          })
        ),

        // Texto del slide
        createElement(RichText, {
          tagName: 'p',
          value: slide.text,
          onChange: v => updateSlide(idx, 'text', v),
          placeholder: 'Texto del slide…',
          className: 'slide-text-input mb-4 p-2 border border-gray-400',
        }),

        // Texto del botón
        createElement(RichText, {
          tagName: 'p',
          value: slide.buttonText,
          onChange: v => updateSlide(idx, 'buttonText', v),
          placeholder: 'Texto del botón…',
          className: 'slide-text-input mb-4 p-2 border border-gray-400',
        }),

        // URL del botón
        createElement(URLInput, {
          value: slide.buttonLink,
          onChange: v => updateSlide(idx, 'buttonLink', v),
        }),

        // Eliminar slide
        createElement(IconButton, {
          icon: 'trash',
          label: 'Eliminar Slide',
          className: 'is-destructive',
          onClick: () => removeSlide(idx),
        })
      )
    ),

    // Controles de paginación en el editor con SVG
    slides.length > 1 &&
      createElement(
        'div',
        { className: 'slider-controls-editor mb-6' },
        // Flecha anterior
        createElement(
          'button',
          {
            onClick: prev,
            disabled: slides.length < 2,
            className: 'slider-nav-btn components-button is-primary',
            'aria-label': 'Anterior slide',
          },
          createElement(ArrowLeftSVG, { className: 'text-white' })
        ),
        // Contador
        createElement(
          'span',
          {
            className:
              'slider-nav-count mx-2 font-medium',
          },
          `${current + 1} / ${slides.length}`
        ),
        // Flecha siguiente
        createElement(
          'button',
          {
            onClick: next,
            disabled: slides.length < 2,
            className: 'slider-nav-btn components-button is-primary',
            'aria-label': 'Siguiente slide',
          },
          createElement(ArrowRightSVG, { className: 'text-white' })
        )
      ),

    // Botón “Agregar slide”
    createElement(
      Button,
      {
        isPrimary: true,
        onClick: addSlide,
        className: 'w-auto mb-4 max-w-40 justify-center',
      },
      'Agregar slide'
    )
  );
}
