import { Gateway } from "@autonomy-design-sample/entity-archetype";
import { Product } from "./Product";

export class ProductGateway extends Gateway {
  public async getProduct(id: string) {
    const product = new Product();
    product.id = id;
    product.name = "hello";
    return product;
  }
}
