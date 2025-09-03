/**
 * WordPress dependencies
 */
import { Button, privateApis as componentsPrivateApis } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { forwardRef } from '@wordpress/element';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const {
  Tabs
} = unlock(componentsPrivateApis);
const blocksTab = {
  name: 'blocks',
  /* translators: Blocks tab title in the block inserter. */
  title: __('Blocks')
};
const patternsTab = {
  name: 'patterns',
  /* translators: Theme and Directory Patterns tab title in the block inserter. */
  title: __('Patterns')
};
const mediaTab = {
  name: 'media',
  /* translators: Media tab title in the block inserter. */
  title: __('Media')
};
function InserterTabs({
  onSelect,
  children,
  onClose,
  selectedTab
}, ref) {
  const tabs = [blocksTab, patternsTab, mediaTab];
  return /*#__PURE__*/_jsx("div", {
    className: "block-editor-inserter__tabs",
    ref: ref,
    children: /*#__PURE__*/_jsxs(Tabs, {
      onSelect: onSelect,
      selectedTabId: selectedTab,
      children: [/*#__PURE__*/_jsxs("div", {
        className: "block-editor-inserter__tablist-and-close-button",
        children: [/*#__PURE__*/_jsx(Button, {
          className: "block-editor-inserter__close-button",
          icon: closeSmall,
          label: __('Close block inserter'),
          onClick: () => onClose(),
          size: "small"
        }), /*#__PURE__*/_jsx(Tabs.TabList, {
          className: "block-editor-inserter__tablist",
          children: tabs.map(tab => /*#__PURE__*/_jsx(Tabs.Tab, {
            tabId: tab.name,
            className: "block-editor-inserter__tab",
            children: tab.title
          }, tab.name))
        })]
      }), tabs.map(tab => /*#__PURE__*/_jsx(Tabs.TabPanel, {
        tabId: tab.name,
        focusable: false,
        className: "block-editor-inserter__tabpanel",
        children: children
      }, tab.name))]
    })
  });
}
export default forwardRef(InserterTabs);
//# sourceMappingURL=tabs.js.map