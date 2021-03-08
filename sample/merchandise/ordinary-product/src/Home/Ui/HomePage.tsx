import * as React from 'react';
import { getLocationHash, renderWidget, Widget } from '@stableinf/rx-react';
import { ProductDetailsPage } from '@motherboard/Sell/Ui/ProductDetailsPage';

export class HomePage extends Widget {
    public render() {
        switch (getLocationHash()) {
            case '#discrete-ui':
                return renderWidget(ProductDetailsPage, { productName: 'apple' });
        }
        // 未知 URL，显示默认的首页内容
        return (
            <div>
                <ul>
                    <li>
                        <a href="#discrete-ui">离散型 UI 集成</a>
                    </li>
                </ul>
            </div>
        );
    }
}
