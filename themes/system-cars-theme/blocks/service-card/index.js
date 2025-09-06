import { registerBlockType } from '@wordpress/blocks';
import edit from './edit.jsx';
import save from './save.jsx';
import './editor.scss';
import './style.scss';

registerBlockType('system-cars/service-card', {
  edit,
  save,
});