/**
 * WordPress dependencies
 */
// Disable Reason: Needs to be refactored.
// eslint-disable-next-line no-restricted-imports
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { Icon, page, post } from '@wordpress/icons';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const SHOWN_SUGGESTIONS = 10;

/** @typedef {import('@wordpress/components').WPCompleter} WPCompleter */

/**
 * Creates a suggestion list for links to posts or pages.
 *
 * @return {WPCompleter} A links completer.
 */
function createLinkCompleter() {
  return {
    name: 'links',
    className: 'block-editor-autocompleters__link',
    triggerPrefix: '[[',
    options: async letters => {
      let options = await apiFetch({
        path: addQueryArgs('/wp/v2/search', {
          per_page: SHOWN_SUGGESTIONS,
          search: letters,
          type: 'post',
          order_by: 'menu_order'
        })
      });
      options = options.filter(option => option.title !== '');
      return options;
    },
    getOptionKeywords(item) {
      const expansionWords = item.title.split(/\s+/);
      return [...expansionWords];
    },
    getOptionLabel(item) {
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(Icon, {
          icon: item.subtype === 'page' ? page : post
        }, "icon"), item.title]
      });
    },
    getOptionCompletion(item) {
      return /*#__PURE__*/_jsx("a", {
        href: item.url,
        children: item.title
      });
    }
  };
}

/**
 * Creates a suggestion list for links to posts or pages..
 *
 * @return {WPCompleter} A link completer.
 */
export default createLinkCompleter();
//# sourceMappingURL=link.js.map