/**
 * WordPress dependencies
 */

import { Slot } from '@wordpress/components';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const FormatToolbar = () => {
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [['bold', 'italic', 'link'].map(format => /*#__PURE__*/_jsx(Slot, {
      name: `RichText.ToolbarControls.${format}`
    }, format)), /*#__PURE__*/_jsx(Slot, {
      name: "RichText.ToolbarControls"
    })]
  });
};
export default FormatToolbar;
//# sourceMappingURL=index.native.js.map