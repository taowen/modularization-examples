import { use, Widget } from "@autonomy-design-sample/entity-archetype";
import * as React from 'react';
import type { ProductGateway } from "../../Sell/Public/ProductGateway";

const productGateway = use<ProductGateway>();

export class HomePage extends Widget {
    
    private product = productGateway.getProduct('123');

    constructor(props: {}) {
        super(props);
    }

    public render() {
        return <div>{this.product.name}</div>;
    }
}