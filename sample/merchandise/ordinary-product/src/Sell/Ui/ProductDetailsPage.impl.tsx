import { override, Scene } from '@autonomy/entity-archetype';
import * as React from 'react';
import { ProductDetailsPage as INF } from '@motherboard/Sell/Ui/ProductDetailsPage';
import type { Product } from '../Private/Product';

function $(scene: Scene) {
    return scene.useServices<typeof Product>();
}

export class ProductDetailsPage extends INF {
    // 每个 Widget 片段自己通过 rpc 去拿自己要的数据
    private theProduct = this.subscribe(async (scene) => {
        return await $(scene).loadProduct({ name: this.props.productName });
    });

    @override
    public renderProductBasics() {
        return <div>product name: {this.theProduct.name}</div>;
    }
}
