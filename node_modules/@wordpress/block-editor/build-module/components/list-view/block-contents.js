/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ListViewBlockSelectButton from './block-select-button';
import BlockDraggable from '../block-draggable';
import { store as blockEditorStore } from '../../store';
import { useListViewContext } from './context';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const ListViewBlockContents = forwardRef(({
  onClick,
  onToggleExpanded,
  block,
  isSelected,
  position,
  siblingBlockCount,
  level,
  isExpanded,
  selectedClientIds,
  ...props
}, ref) => {
  const {
    clientId
  } = block;
  const {
    blockMovingClientId,
    selectedBlockInBlockEditor
  } = useSelect(select => {
    const {
      hasBlockMovingClientId,
      getSelectedBlockClientId
    } = select(blockEditorStore);
    return {
      blockMovingClientId: hasBlockMovingClientId(),
      selectedBlockInBlockEditor: getSelectedBlockClientId()
    };
  }, []);
  const {
    AdditionalBlockContent,
    insertedBlock,
    setInsertedBlock
  } = useListViewContext();
  const isBlockMoveTarget = blockMovingClientId && selectedBlockInBlockEditor === clientId;
  const className = clsx('block-editor-list-view-block-contents', {
    'is-dropping-before': isBlockMoveTarget
  });

  // Only include all selected blocks if the currently clicked on block
  // is one of the selected blocks. This ensures that if a user attempts
  // to drag a block that isn't part of the selection, they're still able
  // to drag it and rearrange its position.
  const draggableClientIds = selectedClientIds.includes(clientId) ? selectedClientIds : [clientId];
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [AdditionalBlockContent && /*#__PURE__*/_jsx(AdditionalBlockContent, {
      block: block,
      insertedBlock: insertedBlock,
      setInsertedBlock: setInsertedBlock
    }), /*#__PURE__*/_jsx(BlockDraggable, {
      appendToOwnerDocument: true,
      clientIds: draggableClientIds,
      cloneClassname: "block-editor-list-view-draggable-chip",
      children: ({
        draggable,
        onDragStart,
        onDragEnd
      }) => /*#__PURE__*/_jsx(ListViewBlockSelectButton, {
        ref: ref,
        className: className,
        block: block,
        onClick: onClick,
        onToggleExpanded: onToggleExpanded,
        isSelected: isSelected,
        position: position,
        siblingBlockCount: siblingBlockCount,
        level: level,
        draggable: draggable,
        onDragStart: onDragStart,
        onDragEnd: onDragEnd,
        isExpanded: isExpanded,
        ...props
      })
    })]
  });
});
export default ListViewBlockContents;
//# sourceMappingURL=block-contents.js.map