/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockSelectionButton from './block-selection-button';
import { PrivateBlockPopover } from '../block-popover';
import useBlockToolbarPopoverProps from './use-block-toolbar-popover-props';
import useSelectedBlockToolProps from './use-selected-block-tool-props';
import { jsx as _jsx } from "react/jsx-runtime";
function BlockToolbarBreadcrumb({
  clientId,
  __unstableContentRef
}, ref) {
  const {
    capturingClientId,
    isInsertionPointVisible,
    lastClientId,
    rootClientId
  } = useSelectedBlockToolProps(clientId);
  const popoverProps = useBlockToolbarPopoverProps({
    contentElement: __unstableContentRef?.current,
    clientId
  });
  return /*#__PURE__*/_jsx(PrivateBlockPopover, {
    clientId: capturingClientId || clientId,
    bottomClientId: lastClientId,
    className: clsx('block-editor-block-list__block-popover', {
      'is-insertion-point-visible': isInsertionPointVisible
    }),
    resize: false,
    ...popoverProps,
    children: /*#__PURE__*/_jsx(BlockSelectionButton, {
      ref: ref,
      clientId: clientId,
      rootClientId: rootClientId
    })
  });
}
export default forwardRef(BlockToolbarBreadcrumb);
//# sourceMappingURL=block-toolbar-breadcrumb.js.map