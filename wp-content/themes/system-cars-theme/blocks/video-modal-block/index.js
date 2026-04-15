/**
 * themes/system-cars-theme/blocks/video-modal-block/index.js
 * Registro del bloque Video Modal con versiones deprecated
 */
import Edit from './edit.jsx';
import Save from './save.jsx';
import deprecated from './deprecated.js';

const { registerBlockType } = wp.blocks;

registerBlockType('system-cars/video-modal', {
  edit: Edit,
  save: Save,
  deprecated: deprecated
});
