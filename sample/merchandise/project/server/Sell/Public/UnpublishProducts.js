"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnpublishProducts = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

var _Product = require("./Product");

class UnpublishProducts extends _entityArchetype.Command {
  async run() {
    const products = await this.scene.query(_Product.Product.batchLoad, {
      productIds: this.productIds
    });

    for (const product of products) {
      await product.unpublish();
    }
  }

}

exports.UnpublishProducts = UnpublishProducts;