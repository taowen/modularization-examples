import * as React from 'react';
import { Database, Operation, ServiceProtocol, Scene } from '@autonomy/entity-archetype';
import { Future } from './Future';
export declare abstract class Widget {
    props?: Record<string, any> | undefined;
    static database: Database;
    static serviceProtocol: ServiceProtocol;
    unmounted?: boolean;
    subscriptions: Map<string, Future>;
    constructor(props?: Record<string, any> | undefined);
    onMount(scene: Scene): Promise<void>;
    onUnmount(scene: Scene): Promise<void>;
    setupHooks(): any;
    abstract render(hooks: ReturnType<this['setupHooks']>): React.ReactElement;
    protected subscribe<T>(compute: (scene: Scene) => Promise<T>): T;
    notifyChange: () => void;
    mount(op: Operation): Promise<void>;
    refreshSubscriptions(op: Operation): Promise<void>;
    private computeFuture;
    unmount(): void;
    protected callback<M extends keyof this>(methodName: M): OmitFirstArg<this[M]>;
}
export declare type WidgetClass<T extends Widget = any> = Function & {
    new (scene: Scene, props?: Record<string, any>): T;
};
export declare function renderRootWidget(widgetClass: WidgetClass, options: {
    project: string;
    database: Database;
    serviceProtocol: ServiceProtocol;
}): void;
export declare function renderWidget<T extends Widget>(widgetClass: WidgetClass<T>, props?: T['props']): JSX.Element;
declare type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export {};
