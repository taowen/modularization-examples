import { Gateway } from "@autonomy-design-sample/entity-archetype";
import { Product } from "./Product";

export class ProductGateway extends Gateway {

    public async getProduct(id: string) {
        return new Product();
    }
}