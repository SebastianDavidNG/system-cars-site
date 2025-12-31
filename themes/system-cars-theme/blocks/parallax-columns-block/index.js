import './style.scss';
import edit from './edit.jsx';
import save from './save.jsx';

const { registerBlockType } = wp.blocks;

registerBlockType('system-cars/parallax-columns', {
  edit,
  save,
});
