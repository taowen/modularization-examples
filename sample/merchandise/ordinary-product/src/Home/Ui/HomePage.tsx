import * as React from 'react';
import { Suspense } from 'react';
import { Scene } from '@autonomy/io';
import { renderWidget, Widget } from '@autonomy/io-react';
import { ProductDetailsPage } from '@motherboard/Sell/Ui/ProductDetailsPage';
import { BrowserLocation } from './BrowserLocation';
import { CounterDemo } from './CounterDemo';
import { Greeting } from './Greeting';
import { TaskList } from './TaskList';

export class HomePage extends Widget {
    // 把 window.location 同步到内存数据库中
    public async onMount(scene: Scene) {
        await scene.insert(BrowserLocation, { hash: window.location.hash });
        window.addEventListener('hashchange', this.callback('onHashChanged'));
    }
    public async onHashChanged(scene: Scene) {
        const browserLocation = await scene.get(BrowserLocation);
        browserLocation.hash = window.location.hash;
        await scene.update(browserLocation);
    }
    // 从内存数据库读取到最新的 window.location 达到间接订阅 window hashchange 的目的
    // 当用户点了链接之后，因为这里的订阅会重新渲染
    public locationHash = this.subscribe(async (scene) => {
        return (await scene.get(BrowserLocation)).hash;
    });
    public render() {
        switch (this.locationHash) {
            case '#discrete-ui':
                return renderWidget(ProductDetailsPage, { productName: 'apple' });
            case '#counter-demo':
                return renderWidget(CounterDemo);
            case '#task-list':
                return <div>{renderWidget(TaskList)}<hr/>{renderWidget(TaskList)}</div>;
        }
        // 未知 URL，显示默认的首页内容
        return (
            <div>
                <Suspense fallback={<span>loading...</span>}>{renderWidget(Greeting)}</Suspense>
                <ul>
                    <li>
                        <a href="#discrete-ui">离散型 UI 集成</a>
                    </li>
                    <li>
                        <a href="#counter-demo">RPC和I/O订阅</a>
                    </li>
                    <li>
                        <a href="#task-list">Suspense，ErrorBoundary以及I/O合并</a>
                    </li>
                </ul>
            </div>
        );
    }
}
