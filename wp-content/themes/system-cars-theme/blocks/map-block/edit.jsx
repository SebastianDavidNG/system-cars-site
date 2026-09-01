const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, RangeControl, Notice } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { embedUrl, mapTitle, height } = attributes;

  const blockProps = useBlockProps({
    className: 'sc-map',
    style: {
      '--sc-map-height': `${height || 480}px`,
    },
  });

  return createElement(
    Fragment,
    null,
    createElement(
      InspectorControls,
      null,
      createElement(
        PanelBody,
        { title: 'Configuración del mapa', initialOpen: true },
        createElement(TextControl, {
          label: 'URL del embed de Google Maps',
          help: 'Pega una URL con output=embed, o deja la ubicación por defecto de System Cars.',
          value: embedUrl,
          onChange: (value) => setAttributes({ embedUrl: value }),
        }),
        createElement(TextControl, {
          label: 'Título accesible (iframe title)',
          value: mapTitle,
          onChange: (value) => setAttributes({ mapTitle: value }),
        }),
        createElement(RangeControl, {
          label: 'Altura (px)',
          value: height,
          onChange: (value) => setAttributes({ height: value }),
          min: 280,
          max: 800,
          step: 10,
        })
      )
    ),
    createElement(
      'div',
      blockProps,
      createElement(
        'div',
        { className: 'sc-map__frame' },
        embedUrl
          ? createElement('iframe', {
              src: embedUrl,
              title: mapTitle || 'Mapa',
              loading: 'lazy',
              referrerPolicy: 'no-referrer-when-downgrade',
              allowFullScreen: true,
            })
          : createElement(
              Notice,
              { status: 'warning', isDismissible: false },
              'Configura la URL del mapa en el panel lateral.'
            )
      )
    )
  );
}
