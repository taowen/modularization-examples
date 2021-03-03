import { renderWidget } from '@autonomy/io-react';
import * as React from 'react';
import { Suspense } from 'react';
import { RandomNumber } from './RandomNumber';
import { ErrorBoundary } from 'react-error-boundary';

export function RandomNumberPage() {
    return (
        <ErrorBoundary fallback={<span>算错了</span>}>
            <Suspense fallback={<span>计算中...</span>}>{renderWidget(RandomNumber)}</Suspense>
        </ErrorBoundary>
    );
}
