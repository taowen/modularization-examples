/// <reference types="react" />
export declare class Widget {
    constructor(props?: Record<string, any>);
    render(): JSX.Element;
}
export declare type WidgetClass = Function & {
    new (props?: Record<string, any>): Widget;
};
