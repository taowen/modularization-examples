import { ActiveRecord } from "@autonomy-design-sample/entity-archetype";

export class Product extends ActiveRecord {
    public static insert = ActiveRecord.toInsert(Product);
    public static query = ActiveRecord.toQuery(Product);
    public static get = ActiveRecord.toGet(Product);
    public id: string;
    public name: string;
}