import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

const { registerBlockType } = wp.blocks;

registerBlockType(metadata.name, {
  edit: Edit,
  save: Save,
});