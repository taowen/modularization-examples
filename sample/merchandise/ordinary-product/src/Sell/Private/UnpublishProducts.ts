import { Command } from "@autonomy/entity-archetype";
import { Product } from "./Product";

export class UnpublishProducts extends Command {
  public readonly productIds: string[];
  public async run() {
    const products = await this.scene.query(Product.batchLoadProducts, {
      productIds: this.productIds,
    });
    for (const product of products) {
      await product.unpublish();
    }
  }
}
