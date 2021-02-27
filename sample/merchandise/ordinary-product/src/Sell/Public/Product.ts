import { ActiveRecord } from "@autonomy-design-sample/entity-archetype";

export class Product extends ActiveRecord {
    public id: string;
    public name: string;
}