"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HomePage = void 0;

var _reactiveWidget = require("@autonomy/reactive-widget");

var _ProductDetailsPage = require("../../Sell/Ui/ProductDetailsPage");

var React = _interopRequireWildcard(require("react"));

var _Greeting = require("./Greeting");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class HomePage extends _reactiveWidget.Widget {
  setup() {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    React.useEffect(() => {
      window.addEventListener("hashchange", forceUpdate);
    });
  }

  render() {
    if (window.location.hash === "#discrete-ui") {
      return this.renderWidget(_ProductDetailsPage.ProductDetailsPage, {
        productName: "apple"
      });
    }

    return /*#__PURE__*/React.createElement("div", null, this.renderWidget(_Greeting.Greeting), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#discrete-ui"
    }, "\u79BB\u6563\u578B UI"))));
  }

}

exports.HomePage = HomePage;