"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HomePage = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

var _ProductDetailsPage = require("../../Sell/Ui/ProductDetailsPage");

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const greetingWordsGateway = (0, _entityArchetype.use)();

class HomePage extends _entityArchetype.Widget {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "words", greetingWordsGateway.getGreetingWords());
  }

  render() {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    React.useEffect(() => {
      window.addEventListener("hashchange", forceUpdate);
    });

    if (window.location.hash === "#discrete-ui") {
      return (0, _entityArchetype.renderWidget)(_ProductDetailsPage.ProductDetailsPage, {
        productId: "123"
      });
    }

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, this.words), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#discrete-ui"
    }, "\u79BB\u6563\u578B UI"))));
  }

}

exports.HomePage = HomePage;