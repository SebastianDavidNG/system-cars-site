/**
 * WordPress dependencies
 */
import { ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useImageEditingContext } from './context';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export default function FormControls() {
  const {
    isInProgress,
    apply,
    cancel
  } = useImageEditingContext();
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(ToolbarButton, {
      onClick: apply,
      disabled: isInProgress,
      children: __('Apply')
    }), /*#__PURE__*/_jsx(ToolbarButton, {
      onClick: cancel,
      children: __('Cancel')
    })]
  });
}
//# sourceMappingURL=form-controls.js.map