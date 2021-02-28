"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalculateCart = exports.calculateCart = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

const calculateCart = _entityArchetype.Command.toRun(CalculateCart);

exports.calculateCart = calculateCart;

class CalculateCart extends _entityArchetype.Command {
  run() {
    return "hello";
  }

}

exports.CalculateCart = CalculateCart;