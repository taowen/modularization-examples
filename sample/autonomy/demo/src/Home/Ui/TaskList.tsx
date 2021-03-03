import * as React from 'react';
import { Suspense } from 'react';
import { ErrorBoundary, renderWidget, Widget } from '@autonomy/io-react';
import { TaskListItem } from './TaskListItem';

export class TaskList extends Widget {
    public render() {
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push(
                <div key={i}>
                    Task #{i}:{' '}
                    <ErrorBoundary fallback={<span>算错了</span>}>
                        <Suspense fallback={<span>计算中...</span>}>
                            {renderWidget(TaskListItem)}
                        </Suspense>
                    </ErrorBoundary>
                </div>,
            );
        }
        return <>{items}</>;
    }
}
