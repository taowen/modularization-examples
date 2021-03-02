"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Counter = void 0;

var _entityArchetype = require("@autonomy/entity-archetype");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Counter extends _entityArchetype.ActiveRecord {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "count", 100);
  }

  increment() {
    this.count++;
    this.update();
  }

  decrement() {
    this.count--;
    this.update();
  }

}

exports.Counter = Counter;

_defineProperty(Counter, "queryCounters", (0, _entityArchetype.toQuery)(Counter));

_defineProperty(Counter, "insertCounter", (0, _entityArchetype.toInsert)(Counter));

_defineProperty(Counter, "incrementCounter", (0, _entityArchetype.toRunMethod)(Counter, 'increment'));

_defineProperty(Counter, "decrementCounter", (0, _entityArchetype.toRunMethod)(Counter, 'decrement'));