const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element; // Usa wp.element en lugar de React

export default function Save({ attributes }) {
  return createElement(
    'div',
    useBlockProps.save(),
    createElement(RichText.Content, {
      tagName: 'h2',
      value: attributes.title,
    })
  );
}