import * as React from "react";
import { Scene } from '@autonomy/entity-archetype';
export declare abstract class Widget {
    readonly scene: Scene;
    props?: Record<string, any> | undefined;
    unmounted?: boolean;
    constructor(scene: Scene, props?: Record<string, any> | undefined);
    abstract render(): React.ReactElement;
    protected renderWidget<T extends Widget>(widgetClass: WidgetClass<T>, props?: T["props"]): JSX.Element;
}
export declare type WidgetClass<T extends Widget = any> = Function & {
    new (scene: Scene, props?: Record<string, any>): T;
};
export declare function renderRootWidget(scene: Scene, widgetClass: WidgetClass): void;
export declare function renderWidget<T extends Widget>(scene: Scene, widgetClass: WidgetClass<T>, props?: T["props"]): JSX.Element;
