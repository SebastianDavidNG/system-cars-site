/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { __experimentalItemGroup as ItemGroup, __experimentalItem as Item, __experimentalHStack as HStack, __experimentalVStack as VStack, __experimentalSpacer as Spacer, __experimentalHeading as Heading, __experimentalView as View, __experimentalNavigatorProvider as NavigatorProvider, __experimentalNavigatorScreen as NavigatorScreen, __experimentalNavigatorButton as NavigatorButton, __experimentalNavigatorBackButton as NavigatorBackButton, FlexBlock } from '@wordpress/components';
import { Icon, chevronRight, chevronLeft } from '@wordpress/icons';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function ScreenHeader({
  title
}) {
  return /*#__PURE__*/_jsx(VStack, {
    spacing: 0,
    children: /*#__PURE__*/_jsx(View, {
      children: /*#__PURE__*/_jsx(Spacer, {
        marginBottom: 0,
        paddingX: 4,
        paddingY: 3,
        children: /*#__PURE__*/_jsxs(HStack, {
          spacing: 2,
          children: [/*#__PURE__*/_jsx(NavigatorBackButton, {
            style:
            // TODO: This style override is also used in ToolsPanelHeader.
            // It should be supported out-of-the-box by Button.
            {
              minWidth: 24,
              padding: 0
            },
            icon: isRTL() ? chevronRight : chevronLeft,
            size: "small",
            label: __('Back')
          }), /*#__PURE__*/_jsx(Spacer, {
            children: /*#__PURE__*/_jsx(Heading, {
              level: 5,
              children: title
            })
          })]
        })
      })
    })
  });
}
export default function MobileTabNavigation({
  categories,
  children
}) {
  return /*#__PURE__*/_jsxs(NavigatorProvider, {
    initialPath: "/",
    className: "block-editor-inserter__mobile-tab-navigation",
    children: [/*#__PURE__*/_jsx(NavigatorScreen, {
      path: "/",
      children: /*#__PURE__*/_jsx(ItemGroup, {
        children: categories.map(category => /*#__PURE__*/_jsx(NavigatorButton, {
          path: `/category/${category.name}`,
          as: Item,
          isAction: true,
          children: /*#__PURE__*/_jsxs(HStack, {
            children: [/*#__PURE__*/_jsx(FlexBlock, {
              children: category.label
            }), /*#__PURE__*/_jsx(Icon, {
              icon: isRTL() ? chevronLeft : chevronRight
            })]
          })
        }, category.name))
      })
    }), categories.map(category => /*#__PURE__*/_jsxs(NavigatorScreen, {
      path: `/category/${category.name}`,
      children: [/*#__PURE__*/_jsx(ScreenHeader, {
        title: __('Back')
      }), children(category)]
    }, category.name))]
  });
}
//# sourceMappingURL=mobile-tab-navigation.js.map