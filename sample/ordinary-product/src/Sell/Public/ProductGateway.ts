import { Product } from "./Product";

export class ProductGateway {

    public getProduct(id: string) {
        return new Product();
    }
}