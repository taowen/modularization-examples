"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductGateway = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

var _Product = require("./Product");

class ProductGateway extends _entityArchetype.Gateway {
  async getProduct(id) {
    return new _Product.Product();
  }

}

exports.ProductGateway = ProductGateway;