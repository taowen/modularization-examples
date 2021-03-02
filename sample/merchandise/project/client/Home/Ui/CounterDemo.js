"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CounterDemo = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactiveWidget = require("@autonomy/reactive-widget");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function $(scene) {
  return scene.useServices();
}

class CounterDemo extends _reactiveWidget.Widget {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "greetingWords", this.subscribe(async scene => {
      return await $(scene).getGreetingWords();
    }));

    _defineProperty(this, "counters", this.subscribe(async scene => {
      return await $(scene).queryCounters({});
    }));
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, this.greetingWords), /*#__PURE__*/React.createElement("ul", null, this.counters.map(c => /*#__PURE__*/React.createElement("li", {
      key: c.id
    }, /*#__PURE__*/React.createElement("button", {
      onClick: this.callback('decrement', c)
    }, "-"), c.count, /*#__PURE__*/React.createElement("button", {
      onClick: this.callback('increment', c)
    }, "+")))), /*#__PURE__*/React.createElement("button", {
      onClick: this.callback('addCounter')
    }, "\u65B0\u5EFA counter"));
  }

  async increment(scene, counter) {
    await $(scene).incrementCounter(counter.id);
  }

  async decrement(scene, counter) {
    await $(scene).decrementCounter(counter.id);
  }

  async addCounter(scene) {
    await $(scene).insertCounter({});
  }

}

exports.CounterDemo = CounterDemo;