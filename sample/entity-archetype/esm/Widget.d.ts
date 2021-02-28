import * as React from "react";
export declare abstract class Widget {
    props?: Record<string, any> | undefined;
    unmounted?: boolean;
    constructor(props?: Record<string, any> | undefined);
    abstract render(): React.ReactElement;
}
export declare type WidgetClass = Function & {
    new (props?: Record<string, any>): Widget;
};
export declare function renderRootWidget(widgetClass: WidgetClass): void;
export declare function renderWidget<T extends new (props: P) => Widget, P>(widgetClass: T, props?: P): JSX.Element;
