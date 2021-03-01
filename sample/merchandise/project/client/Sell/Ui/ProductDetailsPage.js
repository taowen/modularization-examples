"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductDetailsPage = void 0;

var _reactiveWidget = require("@autonomy/reactive-widget");

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProductDetailsPage extends _reactiveWidget.Widget {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "theProduct", this.future(async scene => {
      const gateway = scene.useGateway();
      return await gateway.loadProduct({
        name: this.props.productName
      });
    }));

    _defineProperty(this, "activeXszkPromotions", this.future(async scene => {
      const gateway = scene.useGateway();
      return await gateway.listActiveXszkPromotions();
    }));
  }

  // 把商品详情页拆分成两个片段
  render() {
    const ProductBasics = this.renderProductBasics.bind(this);
    const Xszk = this.renderXszk.bind(this);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ProductBasics, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Xszk, null));
  } // 留给 ordinary-product 去实现


  renderProductBasics() {
    return /*#__PURE__*/React.createElement("div", null, "product name: ", this.theProduct.name);
  }

  renderXszk() {
    for (const promotion of this.activeXszkPromotions) {
      if (promotion.targetProductName === this.props.productName) {
        return /*#__PURE__*/React.createElement("div", null, "\u9650\u65F6\u6298\u6263");
      }
    }

    return /*#__PURE__*/React.createElement("div", null, "\u65E0\u6298\u6263");
  }

}

exports.ProductDetailsPage = ProductDetailsPage;