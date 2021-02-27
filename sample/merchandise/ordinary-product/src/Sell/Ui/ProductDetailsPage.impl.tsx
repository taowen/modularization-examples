import { call, override } from "@autonomy-design-sample/entity-archetype";
import * as React from 'react';
import { ProductDetailsPage as INF } from '@motherboard/Sell/Ui/ProductDetailsPage';
import type { ProductGateway } from "../Public/ProductGateway";

export class ProductDetailsPage extends INF {
    @override
    public renderProductBasics() {
        return <div>{this.theProduct.name}</div>;
    }

    public get theProduct() {
        return call<ProductGateway>().getProduct('123');
    }
}