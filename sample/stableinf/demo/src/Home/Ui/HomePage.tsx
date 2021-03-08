import * as React from 'react';
import { Suspense } from 'react';
import { getLocationHash, renderWidget, Widget } from '@stableinf/rx-react';
import { RemoteCounterDemo } from './RemoteCounterDemo';
import { Greeting } from './Greeting';
import { TaskList } from './TaskList';
import { RandomNumberPage } from './RandomNumberPage';
import { LocalCounterDemo } from './LocalCounterDemo';
import { BatchSaveCounterDemo } from './BatchSaveCounterDemo';

export class HomePage extends Widget {
    public render() {
        switch (getLocationHash()) {
            case '#local-counter-demo':
                return renderWidget(LocalCounterDemo);
            case '#remote-counter-demo':
                return renderWidget(RemoteCounterDemo);
            case '#batch-save-counter-demo':
                return renderWidget(BatchSaveCounterDemo);
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
                        <a href="#local-counter-demo">本地订阅</a>
                    </li>
                    <li>
                        <a href="#remote-counter-demo">RPC和I/O订阅</a>
                    </li>
                    <li>
                        <a href="#batch-save-counter-demo">父子表单初始化，父子订阅，批量保存</a>
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
