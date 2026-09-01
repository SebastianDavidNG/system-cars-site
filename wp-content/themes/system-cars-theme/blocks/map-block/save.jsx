const { useBlockProps } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { embedUrl, mapTitle, height } = attributes;

  const blockProps = useBlockProps.save({
    className: 'sc-map',
    style: {
      '--sc-map-height': `${height || 480}px`,
    },
  });

  if (!embedUrl) {
    return null;
  }

  return createElement(
    'div',
    blockProps,
    createElement(
      'div',
      { className: 'sc-map__frame' },
      createElement('iframe', {
        src: embedUrl,
        title: mapTitle || 'Mapa',
        loading: 'lazy',
        referrerPolicy: 'no-referrer-when-downgrade',
        allowFullScreen: true,
      })
    )
  );
}
