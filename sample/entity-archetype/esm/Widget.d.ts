/// <reference types="react" />
export declare class Widget {
    props?: Record<string, any> | undefined;
    unmounted?: boolean;
    constructor(props?: Record<string, any> | undefined);
    render(): JSX.Element;
}
export declare type WidgetClass = Function & {
    new (props?: Record<string, any>): Widget;
};
