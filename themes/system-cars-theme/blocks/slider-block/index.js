// wp-content/themes/system-cars-theme/blocks/slider-block/index.js
import './style.scss';                  // -> dist/css/slider-block.css
import './slider-block-editor.scss';    // -> dist/css/slider-block-editor.css
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

const { registerBlockType } = wp.blocks;

registerBlockType(metadata.name, {
  edit: Edit,
  save: Save,
  ...metadata,  // para asegurarnos de que block.json se respete
});
