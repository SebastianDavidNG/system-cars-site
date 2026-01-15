(function(wp) {
  'use strict';
  const { useBlockProps: useBlockProps$1, RichText: RichText$1 } = wp.blockEditor;
const { createElement: createElement$1 } = wp.element;
function Edit({ attributes, setAttributes }) {
  return createElement$1(
    "div",
    useBlockProps$1(),
    createElement$1(RichText$1, {
      tagName: "h2",
      value: attributes.title,
      onChange: (title) => setAttributes({ title }),
      placeholder: "Título del auto"
    })
  );
}
const { useBlockProps, RichText } = wp.blockEditor;
const { createElement } = wp.element;
function Save({ attributes }) {
  return createElement(
    "div",
    useBlockProps.save(),
    createElement(RichText.Content, {
      tagName: "h2",
      value: attributes.title
    })
  );
}
const name = "system-cars/car-block";
const metadata = {
  name
};
const { registerBlockType } = wp.blocks;
registerBlockType(metadata.name, {
  edit: Edit,
  save: Save
});

})(window.wp || {});