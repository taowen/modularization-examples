import * as React from 'react';
export declare abstract class Widget {
    props?: Record<string, any> | undefined;
    unmounted?: boolean;
    constructor(props?: Record<string, any> | undefined);
    abstract render(): React.ReactElement;
}
export declare type WidgetClass = Function & {
    new (props?: Record<string, any>): Widget;
};
