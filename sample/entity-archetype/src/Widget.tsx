import * as React from 'react';

// 展示界面
export class Widget {
    public unmounted?: boolean;
    constructor(public props?: Record<string, any>) {}
    public render() {
        return <></>;
    }
}

export type WidgetClass = Function & { new (props?: Record<string, any>): Widget }; 
