"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskList = void 0;

var React = _interopRequireWildcard(require("react"));

var _ioReact = require("@autonomy/io-react");

var _TaskListItem = require("./TaskListItem");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class TaskList extends _ioReact.Widget {
  render() {
    const items = [];

    for (let i = 0; i < 10; i++) {
      items.push( /*#__PURE__*/React.createElement("div", {
        key: i
      }, "Task #", i, ":", ' ', /*#__PURE__*/React.createElement(_ioReact.ErrorBoundary, {
        fallback: /*#__PURE__*/React.createElement("span", null, "\u7B97\u9519\u4E86")
      }, /*#__PURE__*/React.createElement(React.Suspense, {
        fallback: /*#__PURE__*/React.createElement("span", null, "\u8BA1\u7B97\u4E2D...")
      }, (0, _ioReact.renderWidget)(_TaskListItem.TaskListItem)))));
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, items);
  }

}

exports.TaskList = TaskList;