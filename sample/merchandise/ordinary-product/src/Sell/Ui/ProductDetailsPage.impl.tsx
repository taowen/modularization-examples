import { use, override } from "@autonomy-design-sample/entity-archetype";
import * as React from 'react';
import { ProductDetailsPage as INF } from '@motherboard/Sell/Ui/ProductDetailsPage';
import type { ProductGateway } from "../Public/ProductGateway";

const productGateway = use<ProductGateway>();

export class ProductDetailsPage extends INF {
    
    private theProduct = productGateway.getProduct(this.props.productId);
    
    @override
    public renderProductBasics() {
        return <div>{this.theProduct.name}</div>;
    }
}