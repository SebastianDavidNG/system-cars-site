/**
 * themes/system-cars-theme/blocks/service-card/edit.jsx
 */
const { useBlockProps, RichText, MediaUpload, URLInput } = wp.blockEditor;
const { Button, IconButton, SelectControl } = wp.components;
const { createElement, useState } = wp.element;

export default function Edit({ attributes, setAttributes }) {
  const { cards } = attributes;
  const [expandedCard, setExpandedCard] = useState(null);

  const addCard = () => {
    setAttributes({
      cards: [...cards, {
        iconUrl: '',
        title: '',
        description: '',
        bgColor: 'white',
        linkUrl: '',
        hoverBgImage: '',
        columns: 4
      }]
    });
  };

  const removeCard = idx => {
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

  // Mapeo de clases para el preview
  const colSpanMap = {
    1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3',
    4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6',
    7: 'md:col-span-7', 8: 'md:col-span-8', 9: 'md:col-span-9',
    10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
  };

  return createElement(
    'div',
    useBlockProps(),

    // Mensaje si no hay cards
    cards.length === 0 &&
      createElement(
        'div',
        { className: 'text-center p-8 border-2 border-dashed border-gray-300 rounded' },
        createElement('p', { className: 'mb-4 text-gray-600' }, 'No hay tarjetas. Añade una para comenzar.'),
        createElement(Button, {
          isPrimary: true,
          onClick: addCard
        }, 'Agregar primera tarjeta')
      ),

    // Grid preview de todas las cards
    cards.length > 0 && createElement(
      'div',
      { className: 'grid grid-cols-12 gap-4 mb-4' },
      cards.map((card, idx) => {
        const bgColorClass = `bg-${card.bgColor || 'white'}`;
        const textColorClass = card.bgColor === 'white' ? 'text-black' : 'text-white';
        const colSpanClass = `col-span-12 ${colSpanMap[card.columns || 4]}`;
        const isExpanded = expandedCard === idx;

        return createElement(
          'div',
          {
            key: idx,
            className: `${bgColorClass} ${textColorClass} ${colSpanClass} p-4 rounded border-2 border-gray-400 relative`,
            style: { minHeight: '200px' }
          },

          // Toolbar en la parte superior (eliminar y settings)
          createElement(
            'div',
            { className: 'flex justify-end gap-2 mb-2' },
            createElement(IconButton, {
              icon: 'admin-generic',
              label: 'Configuración',
              className: 'bg-white',
              onClick: () => toggleCardSettings(idx),
              style: { padding: '4px' }
            }),
            createElement(IconButton, {
              icon: 'trash',
              label: 'Eliminar',
              className: 'is-destructive bg-white',
              onClick: () => removeCard(idx),
              style: { padding: '4px' }
            })
          ),

          // Panel de configuración expandible
          isExpanded && createElement(
            'div',
            { className: 'bg-white text-black p-3 rounded mb-3 border border-gray-300' },

            // Icono
            createElement('label', { className: 'block mb-1 font-medium text-sm' }, 'Icono:'),
            card.iconUrl && createElement('img', {
              src: card.iconUrl,
              alt: 'Icon',
              className: 'mb-2',
              style: { width: '40px', height: '40px', objectFit: 'contain' }
            }),
            createElement(MediaUpload, {
              onSelect: m => updateCard(idx, 'iconUrl', m.url),
              allowedTypes: ['image'],
              render: ({ open }) =>
                createElement(Button, {
                  isSmall: true,
                  onClick: open,
                  className: 'mb-2'
                }, card.iconUrl ? 'Cambiar' : 'Seleccionar'),
            }),

            // Color de fondo
            createElement('label', { className: 'block mb-1 font-medium text-sm' }, 'Color:'),
            createElement(SelectControl, {
              value: card.bgColor || 'white',
              options: [
                { label: 'Blanco', value: 'white' },
                { label: 'Rojo', value: 'primary' },
                { label: 'Azul', value: 'secondary' },
                { label: 'Gris', value: 'tertiary' },
              ],
              onChange: v => updateCard(idx, 'bgColor', v),
              className: 'mb-2'
            }),

            // Columnas
            createElement('label', { className: 'block mb-1 font-medium text-sm' }, 'Columnas:'),
            createElement(SelectControl, {
              value: card.columns || 4,
              options: [
                { label: '3 (1/4)', value: 3 },
                { label: '4 (1/3)', value: 4 },
                { label: '6 (1/2)', value: 6 },
                { label: '12 (Full)', value: 12 },
              ],
              onChange: v => updateCard(idx, 'columns', Number(v)),
              className: 'mb-2'
            }),

            // URL
            createElement('label', { className: 'block mb-1 font-medium text-sm' }, 'URL:'),
            createElement(URLInput, {
              value: card.linkUrl,
              onChange: v => updateCard(idx, 'linkUrl', v),
              className: 'mb-2'
            }),

            // Imagen hover
            createElement('label', { className: 'block mb-1 font-medium text-sm' }, 'Imagen hover:'),
            card.hoverBgImage && createElement('img', {
              src: card.hoverBgImage,
              alt: 'Hover',
              className: 'mb-1',
              style: { maxWidth: '80px', height: 'auto' }
            }),
            createElement(MediaUpload, {
              onSelect: m => updateCard(idx, 'hoverBgImage', m.url),
              allowedTypes: ['image'],
              render: ({ open }) =>
                createElement(Button, {
                  isSmall: true,
                  onClick: open
                }, card.hoverBgImage ? 'Cambiar' : 'Seleccionar'),
            })
          ),

          // Preview del contenido
          createElement(
            'div',
            { className: 'text-center' },

            // Icono
            card.iconUrl && createElement('img', {
              src: card.iconUrl,
              alt: '',
              className: 'mx-auto mb-2',
              style: { width: '50px', height: '50px', objectFit: 'contain' }
            }),

            // Título editable
            createElement(RichText, {
              tagName: 'h3',
              value: card.title,
              onChange: v => updateCard(idx, 'title', v),
              placeholder: 'Título…',
              className: 'font-semibold text-lg mb-1',
            }),

            // Descripción editable
            createElement(RichText, {
              tagName: 'p',
              value: card.description,
              onChange: v => updateCard(idx, 'description', v),
              placeholder: 'Descripción…',
              className: 'font-light text-sm',
            })
          )
        );
      })
    ),

    // Botón agregar tarjeta
    cards.length > 0 && createElement(
      'div',
      { className: 'text-center mt-4' },
      createElement(Button, {
        isPrimary: true,
        onClick: addCard
      }, '+ Agregar tarjeta')
    )
  );
}
