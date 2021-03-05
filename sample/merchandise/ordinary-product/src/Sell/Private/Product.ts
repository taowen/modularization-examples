import {
  ActiveRecord,
  sqlView,
  subsetOf,
  toLoad,
  toRun,
} from "@stableinf/io";
import { UnpublishProducts } from "./UnpublishProducts";

export class Product extends ActiveRecord {
  private static subset = subsetOf(Product);

  public static loadProduct = toLoad(Product);

  public static publishedProducts = Product.subset`published = TRUE`;

  public static batchLoadProducts = Product.subset<{
    productIds: string[];
  }>`id IN :productIds`;

  public static draftProductCountOfCategory = sqlView<
    {
      totalCount: string;
    },
    {
      category: string;
    }
  >`SELECT COUNT(*) as totalCount FROM ${Product} WHERE NOT published AND category = :category`;

  public static unpublishProducts = toRun(UnpublishProducts);

  public id: string;
  public name: string;
  public published?: boolean;
  public category: string;

  public async unpublish() {
    this.published = true;
    await this.update();
  }
}
