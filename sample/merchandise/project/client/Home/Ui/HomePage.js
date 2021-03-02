"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HomePage = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactiveWidget = require("@autonomy/reactive-widget");

var _ProductDetailsPage = require("../../Sell/Ui/ProductDetailsPage");

var _BrowserLocation = require("./BrowserLocation");

var _CounterDemo = require("./CounterDemo");

var _Greeting = require("./Greeting");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HomePage extends _reactiveWidget.Widget {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "locationHash", this.subscribe(async scene => {
      return (await scene.get(_BrowserLocation.BrowserLocation)).hash;
    }));
  }

  async onMount(scene) {
    await scene.insert(_BrowserLocation.BrowserLocation, {
      hash: window.location.hash
    });
    window.addEventListener('hashchange', this.callback('onHashChanged'));
  }

  async onHashChanged(scene) {
    const browserLocation = await scene.get(_BrowserLocation.BrowserLocation);
    browserLocation.hash = window.location.hash;
    await scene.update(browserLocation);
  }

  render() {
    switch (this.locationHash) {
      case '#discrete-ui':
        return (0, _reactiveWidget.renderWidget)(_ProductDetailsPage.ProductDetailsPage, {
          productName: 'apple'
        });

      case '#counter-demo':
        return (0, _reactiveWidget.renderWidget)(_CounterDemo.CounterDemo);
    }

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(React.Suspense, {
      fallback: /*#__PURE__*/React.createElement("span", null, "loading...")
    }, (0, _reactiveWidget.renderWidget)(_Greeting.Greeting)), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#discrete-ui"
    }, "\u79BB\u6563\u578B UI")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#counter-demo"
    }, "RPC\u548CI/O\u8BA2\u9605"))));
  }

}

exports.HomePage = HomePage;