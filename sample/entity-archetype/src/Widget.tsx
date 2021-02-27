import * as React from 'react';

// 展示界面
export abstract class Widget {
    public unmounted?: boolean;
    constructor(public props?: Record<string, any>) {}
    public abstract render(): React.ReactElement;
}

export type WidgetClass = Function & { new (props?: Record<string, any>): Widget }; 
