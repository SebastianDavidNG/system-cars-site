const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element; // Usa wp.element en lugar de React

export default function Edit({ attributes, setAttributes }) {
  return createElement(
    'div',
    useBlockProps(),
    createElement(RichText, {
      tagName: 'h2',
      value: attributes.title,
      onChange: (title) => setAttributes({ title }),
      placeholder: 'Título del auto',
    })
  );
}