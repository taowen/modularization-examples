import * as React from 'react';

// 展示界面
export class Widget {
    constructor(props?: Record<string, any>) {}
    public render() {
        return <></>;
    }
}

export type WidgetClass = Function & { new (props?: Record<string, any>): Widget }; 
