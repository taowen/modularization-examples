"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductGateway = void 0;

var _entityArchetype = require("@autonomy/entity-archetype");

var _Product = require("./Product");

var _UnpublishProducts = require("./UnpublishProducts");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProductGateway extends _entityArchetype.Gateway {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "loadProduct", (0, _entityArchetype.toLoad)(_Product.Product));

    _defineProperty(this, "unpublishProduct", (0, _entityArchetype.toRunMethod)(_Product.Product, "unpublish"));

    _defineProperty(this, "unpublishProducts", (0, _entityArchetype.toRun)(_UnpublishProducts.UnpublishProducts));

    _defineProperty(this, "draftProductCountOfCategory", _Product.Product.draftProductCountOfCategory);
  }

}

exports.ProductGateway = ProductGateway;