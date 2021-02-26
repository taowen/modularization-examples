import { override } from "@autonomy-design-sample/entity-archetype";
import * as React from 'react';
import { ProductDetailsPage as INF } from '@motherboard/Sell/Ui/ProductDetailsPage';

export class ProductDetailsPage extends INF {
    @override
    public renderProductBasics() {
        return <div>products</div>;
    }
}