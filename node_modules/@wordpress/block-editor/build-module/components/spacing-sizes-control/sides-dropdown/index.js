/**
 * WordPress dependencies
 */
import { DropdownMenu, Icon, MenuGroup, MenuItem } from '@wordpress/components';
import { check } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { getSupportedMenuItems, VIEWS } from '../utils';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const checkIcon = /*#__PURE__*/_jsx(Icon, {
  icon: check,
  size: 24
});
export default function SidesDropdown({
  label: labelProp,
  onChange,
  sides,
  value
}) {
  if (!sides || !sides.length) {
    return;
  }
  const supportedItems = getSupportedMenuItems(sides);
  const sideIcon = supportedItems[value].icon;
  const {
    custom: customItem,
    ...menuItems
  } = supportedItems;
  return /*#__PURE__*/_jsx(DropdownMenu, {
    icon: sideIcon,
    label: labelProp,
    className: "spacing-sizes-control__dropdown",
    toggleProps: {
      size: 'small'
    },
    children: ({
      onClose
    }) => {
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(MenuGroup, {
          children: Object.entries(menuItems).map(([slug, {
            label,
            icon
          }]) => {
            const isSelected = value === slug;
            return /*#__PURE__*/_jsx(MenuItem, {
              icon: icon,
              iconPosition: "left",
              isSelected: isSelected,
              role: "menuitemradio",
              onClick: () => {
                onChange(slug);
                onClose();
              },
              suffix: isSelected ? checkIcon : undefined,
              children: label
            }, slug);
          })
        }), !!customItem && /*#__PURE__*/_jsx(MenuGroup, {
          children: /*#__PURE__*/_jsx(MenuItem, {
            icon: customItem.icon,
            iconPosition: "left",
            isSelected: value === VIEWS.custom,
            role: "menuitemradio",
            onClick: () => {
              onChange(VIEWS.custom);
              onClose();
            },
            suffix: value === VIEWS.custom ? checkIcon : undefined,
            children: customItem.label
          })
        })]
      });
    }
  });
}
//# sourceMappingURL=index.js.map