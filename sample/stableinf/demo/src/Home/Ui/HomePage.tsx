import * as React from 'react';
import { Suspense } from 'react';
import { getLocationHash, renderWidget, Widget } from '@stableinf/rx-react';
import { CounterDemo } from './CounterDemo';
import { Greeting } from './Greeting';
import { TaskList } from './TaskList';
import { RandomNumberPage } from './RandomNumberPage';

export class HomePage extends Widget {
    public render() {
        switch (getLocationHash()) {
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
