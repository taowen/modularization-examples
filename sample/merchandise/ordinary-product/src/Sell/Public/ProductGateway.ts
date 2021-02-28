import {
  Gateway,
  toGet,
  toRun,
  toRunMethod,
} from "@autonomy-design-sample/entity-archetype";
import { Product } from "./Product";
import { UnpublishProducts } from "./UnpublishProducts";

export class ProductGateway extends Gateway {
  public getProduct = toGet(Product);
  public unpublishProduct = toRunMethod(Product, "unpublish");
  public unpublishProducts = toRun(UnpublishProducts);
  public draftProductCountOfCategory = Product.draftProductCountOfCategory;
}
