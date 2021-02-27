import { use, override } from "@autonomy-design-sample/entity-archetype";
import * as React from 'react';
import { ProductDetailsPage as INF } from '@motherboard/Sell/Ui/ProductDetailsPage';
import type { ProductGateway } from "../Public/ProductGateway";

const productGateway = use<ProductGateway>();

export class ProductDetailsPage extends INF {
    
    // 每个 Widget 片段自己通过 rpc 去拿自己要的数据
    private theProduct = productGateway.getProduct(this.props.productId);
    
    @override
    public renderProductBasics() {
        return <div>product name: {this.theProduct.name}</div>;
    }
}