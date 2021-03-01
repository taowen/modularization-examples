import * as React from "react";
import { Database, RemoteService, Scene } from "@autonomy/entity-archetype";
import { Future } from "./Future";
export declare abstract class Widget {
    props?: Record<string, any> | undefined;
    static database: Database;
    static remoteService: RemoteService;
    futures: Map<string, Future>;
    unmounted?: boolean;
    constructor(props?: Record<string, any> | undefined);
    setup(): any;
    abstract render(hooks: ReturnType<this['setup']>): React.ReactElement;
    protected renderWidget<T extends Widget>(widgetClass: WidgetClass<T>, props?: T["props"]): JSX.Element;
    protected future<T>(compute: (scene: Scene) => Promise<T>): T;
    notifyChange(): void;
    unmount(): void;
}
export declare type WidgetClass<T extends Widget = any> = Function & {
    new (scene: Scene, props?: Record<string, any>): T;
};
export declare function renderRootWidget(widgetClass: WidgetClass, options: {
    project: string;
    database: Database;
    remoteService: RemoteService;
}): void;
export declare function renderWidget<T extends Widget>(widgetClass: WidgetClass<T>, props?: T["props"]): JSX.Element;
