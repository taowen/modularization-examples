"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Greeting = void 0;

var _reactiveWidget = require("@autonomy/reactive-widget");

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Greeting extends _reactiveWidget.Widget {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "words", this.subscribe(async scene => {
      const gateway = scene.useGateway();
      return await gateway.getGreetingWords();
    }));
  }

  render() {
    return /*#__PURE__*/React.createElement("h1", null, this.words);
  }

}

exports.Greeting = Greeting;