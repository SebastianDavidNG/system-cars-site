/**
 * themes/system-cars-theme/blocks/parallax-columns-block/edit.jsx
 */
const { useBlockProps, InspectorControls, InnerBlocks, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, RangeControl, ToggleControl } = wp.components;
const { createElement, Fragment } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const {
    backgroundImage,
    backgroundImageId,
    minHeight,
    parallax,
    mobileOptimized
  } = attributes;

  const blockProps = useBlockProps({
    className: 'parallax-block-editor',
    style: {
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: `${minHeight}px`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: '40px 20px',
    }
  });

  return createElement(
    Fragment,
    null,

    // Inspector Controls
    createElement(
      InspectorControls,
      null,

      createElement(
        PanelBody,
        { title: 'Imagen de Fondo', initialOpen: true },

        createElement(MediaUpload, {
          onSelect: (media) => {
            setAttributes({
              backgroundImage: media.url,
              backgroundImageId: media.id
            });
          },
          allowedTypes: ['image'],
          value: backgroundImageId,
          render: ({ open }) =>
            createElement(
              Button,
              {
                isPrimary: !backgroundImage,
                isSecondary: !!backgroundImage,
                onClick: open,
                style: { marginBottom: '10px', width: '100%' }
              },
              backgroundImage ? 'Cambiar imagen' : 'Seleccionar imagen'
            ),
        }),

        backgroundImage && createElement(
          Button,
          {
            isDestructive: true,
            onClick: () => setAttributes({ backgroundImage: '', backgroundImageId: 0 }),
            style: { width: '100%' }
          },
          'Eliminar imagen'
        )
      ),

      createElement(
        PanelBody,
        { title: 'Configuración', initialOpen: true },

        createElement(RangeControl, {
          label: 'Altura (px)',
          value: minHeight,
          onChange: (value) => setAttributes({ minHeight: value }),
          min: 100,
          max: 1000,
          step: 10,
        }),

        createElement(ToggleControl, {
          label: 'Efecto parallax',
          checked: parallax,
          onChange: (value) => setAttributes({ parallax: value }),
        }),

        createElement(ToggleControl, {
          label: 'Optimizado para móvil',
          checked: mobileOptimized,
          onChange: (value) => setAttributes({ mobileOptimized: value }),
          help: 'Desactiva parallax en móviles',
        })
      )
    ),

    // Editor con InnerBlocks
    createElement(
      'div',
      blockProps,

      // Contenedor para InnerBlocks con z-index para estar sobre el fondo
      createElement(
        'div',
        {
          style: {
            position: 'relative',
            zIndex: 2,
            width: '100%',
          }
        },
        createElement(InnerBlocks, {
          template: [
            // Plantilla sugerida con un botón centrado
            ['core/buttons', { layout: { type: 'flex', justifyContent: 'center' } }, [
              ['system-cars/styled-button', {}]
            ]]
          ],
          templateLock: false, // Permite agregar/eliminar bloques
        })
      )
    )
  );
}
