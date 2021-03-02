import * as React from 'react';
import { Suspense} from 'react';
import { Scene } from '@autonomy/entity-archetype';
import { renderWidget, Widget } from '@autonomy/reactive-widget';
import { ProductDetailsPage } from '@motherboard/Sell/Ui/ProductDetailsPage';
import { BrowserLocation } from './BrowserLocation';
import { CounterDemo } from './CounterDemo';
import { Greeting } from './Greeting';

export class HomePage extends Widget {
    public async onMount(scene: Scene) {
        await scene.insert(BrowserLocation, { hash: window.location.hash });
        window.addEventListener('hashchange', this.callback('onHashChanged'));
    }
    public async onHashChanged(scene: Scene) {
        const browserLocation = await scene.get(BrowserLocation);
        browserLocation.hash = window.location.hash;
        await scene.update(browserLocation);
    }
    public locationHash = this.subscribe(async (scene) => {
        return (await scene.get(BrowserLocation)).hash;
    });
    public render() {
        switch (this.locationHash) {
            case '#discrete-ui':
                return renderWidget(ProductDetailsPage, { productName: 'apple' });
            case '#counter-demo':
                return renderWidget(CounterDemo);
        }
        return (
            <div>
                <Suspense fallback={<span>loading...</span>}>{renderWidget(Greeting)}</Suspense>
                <ul>
                    <li>
                        <a href="#discrete-ui">离散型 UI</a>
                    </li>
                    <li>
                        <a href="#counter-demo">RPC和I/O订阅</a>
                    </li>
                </ul>
            </div>
        );
    }
}
