// save.jsx
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement, Fragment } = wp.element;

export default function Save({ attributes }) {
  const { slides } = attributes;

  return createElement(
    'div',
    useBlockProps.save({ className: 'swiper wp-block-system-cars-slider-block', 'data-slide-count': slides.length }),
    createElement(
      'div',
      { className: 'swiper-wrapper' },
      slides.map((slide, idx) =>
        createElement(
          'div',
          { className: 'swiper-slide', key: idx },
          createElement('img', { src: slide.image, alt: '' }),
          createElement(
            'div',
            { className: 'slide-content' },
            createElement(RichText.Content, {
              tagName: 'p',
              value: slide.text,
              className: 'slide-text'
            }),
            slide.buttonText && slide.buttonLink &&
              createElement(
                'a',
                { href: slide.buttonLink, className: 'slide-button' },
                slide.buttonText
              )
          )
        )
      )
    ),
    // flechas para Swiper
    slides.length > 1 && createElement(Fragment, null, [
      createElement('div', { className: 'swiper-button-prev', key: 'prev' }),
      createElement('div', { className: 'swiper-button-next', key: 'next' }),
    ])
  );
}