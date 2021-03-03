import * as React from 'react';
import { Suspense } from 'react';
import { Scene } from '@autonomy/io';
import { BrowserLocation, renderWidget, Widget } from '@autonomy/io-react';
import { CounterDemo } from './CounterDemo';
import { Greeting } from './Greeting';
import { TaskList } from './TaskList';
import { RandomNumberPage } from './RandomNumberPage';

export class HomePage extends Widget {
    // 把 window.location 同步到内存数据库中
    public async onMount(scene: Scene) {
        await BrowserLocation.startSyncing(scene);
    }
    // 从内存数据库读取到最新的 window.location 达到间接订阅 window hashchange 的目的
    // 当用户点了链接之后，因为这里的订阅会重新渲染
    public locationHash = this.subscribe(async (scene) => {
        return (await scene.get(BrowserLocation)).hash;
    });
    public render() {
        switch (this.locationHash) {
            case '#counter-demo':
                return renderWidget(CounterDemo);
            case '#task-list':
                return (
                    <div>
                        {renderWidget(TaskList)}
                        <hr />
                        {renderWidget(TaskList)}
                    </div>
                );
            case '#random-number':
                return <RandomNumberPage />;
        }
        // 未知 URL，显示默认的首页内容
        return (
            <div>
                <Suspense fallback={<span>loading...</span>}>{renderWidget(Greeting)}</Suspense>
                <ul>
                    <li>
                        <a href="#counter-demo">RPC和I/O订阅</a>
                    </li>
                    <li>
                        <a href="#task-list">Suspense，ErrorBoundary以及I/O合并</a>
                    </li>
                    <li>
                        <a href="#random-number">操作追踪</a>
                    </li>
                </ul>
            </div>
        );
    }
}
