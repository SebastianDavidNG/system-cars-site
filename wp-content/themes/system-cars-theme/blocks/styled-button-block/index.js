import './style.scss';
import edit from './edit.jsx';
import save from './save.jsx';

const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { RichText } = wp.blockEditor;

// Versiones deprecated del bloque
const deprecated = [
  // Versión 3: Con capitalize (versión anterior a uppercase)
  {
    attributes: {
      text: {
        type: 'string',
        default: 'Botón'
      },
      url: {
        type: 'string',
        default: ''
      },
      openInNewTab: {
        type: 'boolean',
        default: false
      },
      buttonStyle: {
        type: 'string',
        default: 'secondary'
      },
      borderStyle: {
        type: 'string',
        default: 'none'
      }
    },
    save({ attributes }) {
      const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;

      const buttonClasses = [
        'styled-button',
        `styled-button--${buttonStyle}`,
        borderStyle !== 'none' ? `styled-button--border-${borderStyle}` : '',
        'px-10',
        'py-3',
        'font-black',
        'capitalize',
        'text-lg',
      ].filter(Boolean).join(' ');

      return createElement(
        'div',
        { className: 'styled-button-wrapper' },
        createElement(
          'a',
          {
            className: buttonClasses,
            href: url || '#',
            target: openInNewTab ? '_blank' : '_self',
            rel: openInNewTab ? 'noopener noreferrer' : undefined,
          },
          createElement(RichText.Content, {
            tagName: 'span',
            value: text,
          })
        )
      );
    }
  },
  // Versión 2: Sin clases de Tailwind (versión anterior a la actual)
  {
    attributes: {
      text: {
        type: 'string',
        default: 'Botón'
      },
      url: {
        type: 'string',
        default: ''
      },
      openInNewTab: {
        type: 'boolean',
        default: false
      },
      buttonStyle: {
        type: 'string',
        default: 'secondary'
      },
      borderStyle: {
        type: 'string',
        default: 'none'
      }
    },
    save({ attributes }) {
      const { text, url, buttonStyle, borderStyle, openInNewTab } = attributes;

      const buttonClasses = [
        'styled-button px-10 py-3',
        `styled-button--${buttonStyle}`,
        borderStyle !== 'none' ? `styled-button--border-${borderStyle}` : '',
      ].filter(Boolean).join(' ');

      return createElement(
        'div',
        { className: 'styled-button-wrapper' },
        createElement(
          'a',
          {
            className: buttonClasses,
            href: url || '#',
            target: openInNewTab ? '_blank' : '_self',
            rel: openInNewTab ? 'noopener noreferrer' : undefined,
          },
          createElement(RichText.Content, {
            tagName: 'span',
            value: text,
          })
        )
      );
    }
  },
  // Versión 1: Con gradientes (versión muy antigua)
  {
    attributes: {
      text: {
        type: 'string',
        default: 'Botón'
      },
      url: {
        type: 'string',
        default: ''
      },
      gradientStart: {
        type: 'string',
        default: '#FF4311'
      },
      gradientEnd: {
        type: 'string',
        default: '#EA0A0B'
      },
      openInNewTab: {
        type: 'boolean',
        default: false
      }
    },
    save({ attributes }) {
      const { text, url, gradientStart, gradientEnd, openInNewTab } = attributes;

      const buttonStyle = {
        background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
      };

      return createElement(
        'div',
        { className: 'styled-button-wrapper' },
        createElement(
          'a',
          {
            className: 'styled-button px-10 py-3',
            style: buttonStyle,
            href: url || '#',
            target: openInNewTab ? '_blank' : '_self',
            rel: openInNewTab ? 'noopener noreferrer' : undefined,
          },
          createElement(RichText.Content, {
            tagName: 'span',
            value: text,
          })
        )
      );
    },
    migrate(attributes) {
      return {
        text: attributes.text,
        url: attributes.url || '#',
        gradientStart: attributes.gradientStart,
        gradientEnd: attributes.gradientEnd,
        openInNewTab: attributes.openInNewTab,
        buttonStyle: 'gradient',
        hasShadow: false,
        align: 'center',
      };
    }
  }
];

registerBlockType('system-cars/styled-button', {
  edit,
  save,
  deprecated,
});
