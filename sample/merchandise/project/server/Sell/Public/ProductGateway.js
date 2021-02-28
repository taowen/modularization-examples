"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductGateway = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

var _Product = require("./Product");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProductGateway extends _entityArchetype.Gateway {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "getProduct", _Product.Product.toGet(_Product.Product));
  }

}

exports.ProductGateway = ProductGateway;