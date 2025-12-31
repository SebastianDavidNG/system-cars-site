import './editor.scss';
import './style.scss';
import edit from './edit.jsx';
import save from './save.jsx';

const { registerBlockType } = wp.blocks;

registerBlockType('system-cars/service-card', {
  edit,
  save,
});