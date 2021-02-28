import {
  ActiveRecord,
  sqlView,
  subsetOf,
} from "@autonomy/entity-archetype";

export class Product extends ActiveRecord {
  public static subset = subsetOf(Product);

  public static publishedProducts = Product.subset`published = TRUE`;

  public static batchLoad = Product.subset<{
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

  public id: string;
  public name: string;
  public published?: boolean;
  public category: string;

  public async unpublish() {
    this.published = true;
    await this.update();
  }
}
