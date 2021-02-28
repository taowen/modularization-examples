"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Product = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Product extends _entityArchetype.ActiveRecord {}

exports.Product = Product;

_defineProperty(Product, "insert", _entityArchetype.ActiveRecord.toInsert(Product));

_defineProperty(Product, "query", _entityArchetype.ActiveRecord.toQuery(Product));

_defineProperty(Product, "get", _entityArchetype.ActiveRecord.toGet(Product));