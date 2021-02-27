"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductGateway = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

var _Product = require("./Product");

class ProductGateway extends _entityArchetype.Gateway {
  async getProduct(id) {
    const product = new _Product.Product();
    product.id = id;
    product.name = "hello";
    return product;
  }

}

exports.ProductGateway = ProductGateway;