/**
 * themes/system-cars-theme/blocks/service-card/save.jsx
 */
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;

export default function Save({ attributes }) {
  const { cards } = attributes;

  return createElement(
    'div',
    useBlockProps.save({ className: 'grid grid-cols-12 gap-0' }),

    cards.map((card, idx) => {
      const Tag = card.linkUrl ? 'a' : 'div';
      const bgColorClass = `bg-${card.bgColor || 'white'}`;
      const textColorClass = card.bgColor === 'white' ? 'text-black' : 'text-white';
      const hasLink = !!card.linkUrl;
      const columns = card.columns || 4;

      // Mapeo de clases completas para Tailwind
      const colSpanMap = {
        1: 'md:col-span-1',
        2: 'md:col-span-2',
        3: 'md:col-span-3',
        4: 'md:col-span-4',
        5: 'md:col-span-5',
        6: 'md:col-span-6',
        7: 'md:col-span-7',
        8: 'md:col-span-8',
        9: 'md:col-span-9',
        10: 'md:col-span-10',
        11: 'md:col-span-11',
        12: 'md:col-span-12',
      };
      const colSpanClass = `col-span-12 ${colSpanMap[columns] || 'md:col-span-4'}`;

      const cardProps = {
        key: idx,
        className: `bg-card ${bgColorClass} ${textColorClass} ${colSpanClass} h-[350px] md:h-[300px] lg:h-[400px] p-6 md:p-8 ${hasLink ? 'card-item' : 'text-center md:text-start'}`,
        style: {
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...(hasLink && { textDecoration: 'none' })
        }
      };

      if (hasLink) {
        cardProps.href = card.linkUrl;
        cardProps.target = '_blank';
        cardProps.rel = 'noopener noreferrer';
      }

      return createElement(
        Tag,
        cardProps,

        // Background hover (solo si tiene imagen y tiene link)
        card.hoverBgImage && hasLink && createElement('div', {
          className: 'card-bg-hover',
          style: {
            backgroundImage: `url(${card.hoverBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            inset: '0',
            zIndex: 1
          }
        }),

        // Content
        createElement(
          'div',
          {
            className: hasLink ? 'card-content text-center md:text-start' : '',
            style: { position: 'relative', zIndex: 2 }
          },

          // Icon
          card.iconUrl && createElement(
            'div',
            { className: 'flex justify-center md:justify-start mb-2 md:mb-3' },
            createElement('img', {
              src: card.iconUrl,
              alt: '',
              className: hasLink ? 'card-icon w-14 h-14 md:w-[75px] md:h-[75px]' : 'w-14 h-14 md:w-[75px] md:h-[75px]',
              style: {
                objectFit: 'contain',
                borderRadius: '4px',
                display: 'block'
              }
            })
          ),

          // Title
          createElement(RichText.Content, {
            tagName: 'h3',
            value: card.title,
            className: hasLink ? 'card-title font-semibold text-xl md:text-2xl mb-2' : 'font-semibold text-xl md:text-2xl mb-2'
          }),

          // Description
          createElement(RichText.Content, {
            tagName: 'p',
            value: card.description,
            className: hasLink ? 'card-description font-light text-sm md:text-base' : 'font-light text-sm md:text-base'
          }),

          // Arrow (solo si tiene link)
          hasLink && createElement(
            'span',
            {
              className: 'card-arrow-link',
              style: {
                display: 'inline-block',
                width: '32px',
                height: '32px',
                marginTop: '1em'
              }
            },
            createElement('svg', {
              width: '32',
              height: '32',
              viewBox: '0 0 800 800',
              xmlns: 'http://www.w3.org/2000/svg',
              fill: textColorClass === 'text-white' ? 'white' : 'black'
            }, createElement('path', {
              d: 'M557.956 150.895L792.218 383.149L793.533 384.354C797.537 388.323 799.692 393.431 800 398.627V401.373C799.692 406.568 797.537 411.676 793.533 415.646L792.38 416.622L557.956 649.105C549.282 657.706 535.219 657.706 526.546 649.105C517.872 640.504 517.872 626.558 526.546 617.957L726.726 419.419L22.2104 419.436C9.94387 419.436 0 409.575 0 397.412C0 385.248 9.94387 375.387 22.2104 375.387L721.506 375.37L526.546 182.042C517.872 173.441 517.872 159.496 526.546 150.895C535.219 142.294 549.282 142.294 557.956 150.895ZM780.341 397.393L542.251 633.531L777.826 400.004L777.828 399.919L776.514 398.724L775.172 397.393H780.341Z'
            }))
          )
        )
      );
    })
  );
}
