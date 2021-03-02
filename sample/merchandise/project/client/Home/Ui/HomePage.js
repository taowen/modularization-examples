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

var _TaskList = require("./TaskList");

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

  // 把 window.location 同步到内存数据库中
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
  } // 从内存数据库读取到最新的 window.location 达到间接订阅 window hashchange 的目的
  // 当用户点了链接之后，因为这里的订阅会重新渲染


  render() {
    switch (this.locationHash) {
      case '#discrete-ui':
        return (0, _reactiveWidget.renderWidget)(_ProductDetailsPage.ProductDetailsPage, {
          productName: 'apple'
        });

      case '#counter-demo':
        return (0, _reactiveWidget.renderWidget)(_CounterDemo.CounterDemo);

      case '#task-list':
        return (0, _reactiveWidget.renderWidget)(_TaskList.TaskList);
    } // 未知 URL，显示默认的首页内容


    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(React.Suspense, {
      fallback: /*#__PURE__*/React.createElement("span", null, "loading...")
    }, (0, _reactiveWidget.renderWidget)(_Greeting.Greeting)), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#discrete-ui"
    }, "\u79BB\u6563\u578B UI \u96C6\u6210")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#counter-demo"
    }, "RPC\u548CI/O\u8BA2\u9605")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "#task-list"
    }, "Suspense\uFF0CErrorBoundary\u4EE5\u53CAI/O\u5408\u5E76"))));
  }

}

exports.HomePage = HomePage;