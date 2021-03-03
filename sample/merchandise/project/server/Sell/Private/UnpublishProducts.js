"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnpublishProducts = void 0;

var _io = require("@autonomy/io");

var _Product = require("./Product");

class UnpublishProducts extends _io.Command {
  async run() {
    const products = await this.scene.query(_Product.Product.batchLoadProducts, {
      productIds: this.productIds
    });

    for (const product of products) {
      await product.unpublish();
    }
  }

}

exports.UnpublishProducts = UnpublishProducts;