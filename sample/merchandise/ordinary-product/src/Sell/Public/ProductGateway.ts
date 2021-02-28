import {
  Gateway,
  toLoad,
  toRun,
  toRunMethod,
} from "@autonomy/entity-archetype";
import { Product } from "./Product";
import { UnpublishProducts } from "./UnpublishProducts";

export class ProductGateway extends Gateway {
  public loadProduct = toLoad(Product);
  public unpublishProduct = toRunMethod(Product, "unpublish");
  public unpublishProducts = toRun(UnpublishProducts);
  public draftProductCountOfCategory = Product.draftProductCountOfCategory;
}
