import './style.scss';
import edit from './edit.jsx';
import save from './save.jsx';

const { registerBlockType } = wp.blocks;

registerBlockType('system-cars/video-modal', {
  edit,
  save,
});
