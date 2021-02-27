import { Gateway } from "@autonomy-design-sample/entity-archetype";
import { Product } from "./Product";

export class ProductGateway extends Gateway {

    public getProduct(id: string) {
        return new Product();
    }
}