/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { GridVisualizer, useGridLayoutSync } from '../components/grid';
import { store as blockEditorStore } from '../store';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function GridLayoutSync(props) {
  useGridLayoutSync(props);
}
function GridTools({
  clientId,
  layout
}) {
  const {
    isSelected,
    isDragging
  } = useSelect(select => {
    const {
      isBlockSelected,
      isDraggingBlocks
    } = select(blockEditorStore);
    return {
      isSelected: isBlockSelected(clientId),
      isDragging: isDraggingBlocks()
    };
  });
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(GridLayoutSync, {
      clientId: clientId
    }), (isSelected || isDragging) && /*#__PURE__*/_jsx(GridVisualizer, {
      clientId: clientId,
      parentLayout: layout
    })]
  });
}
const addGridVisualizerToBlockEdit = createHigherOrderComponent(BlockEdit => props => {
  if (props.attributes.layout?.type !== 'grid') {
    return /*#__PURE__*/_jsx(BlockEdit, {
      ...props
    }, "edit");
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(GridTools, {
      clientId: props.clientId,
      layout: props.attributes.layout
    }), /*#__PURE__*/_jsx(BlockEdit, {
      ...props
    }, "edit")]
  });
}, 'addGridVisualizerToBlockEdit');
addFilter('editor.BlockEdit', 'core/editor/grid-visualizer', addGridVisualizerToBlockEdit);
//# sourceMappingURL=grid-visualizer.js.map