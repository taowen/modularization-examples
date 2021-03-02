import * as React from 'react';
import { Database, ServiceProtocol, Scene } from '@autonomy/entity-archetype';
export declare abstract class Widget {
    props?: Record<string, any> | undefined;
    static database: Database;
    static serviceProtocol: ServiceProtocol;
    private unmounted?;
    private subscriptions;
    constructor(props?: Record<string, any> | undefined);
    onMount(scene: Scene): Promise<void>;
    onUnmount(scene: Scene): Promise<void>;
    setupHooks(): any;
    abstract render(hooks: ReturnType<this['setupHooks']>): React.ReactElement;
    protected subscribe<T>(compute: (scene: Scene) => Promise<T>): T;
    notifyChange: () => void;
    private mount;
    private refreshSubscriptions;
    private unmount;
    protected callback<M extends keyof this>(methodName: M): OmitOneArg<this[M]>;
    protected callback<M extends keyof this>(methodName: M, boundArg1: any): OmitTwoArg<this[M]>;
    protected callback<M extends keyof this>(methodName: M, boundArg1: any, boundArg2: any): OmitThreeArg<this[M]>;
    static reactComponent(widgetClass: WidgetClass, props?: Record<string, any>): JSX.Element;
}
export declare type WidgetClass<T extends Widget = any> = Function & {
    new (scene: Scene, props?: Record<string, any>): T;
};
export declare function renderRootWidget(widgetClass: WidgetClass, options: {
    database: Database;
    serviceProtocol: ServiceProtocol;
}): void;
export declare function renderWidget<T extends Widget>(widgetClass: WidgetClass<T>, props?: T['props']): JSX.Element;
declare type OmitOneArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
declare type OmitTwoArg<F> = F extends (x1: any, x2: any, ...args: infer P) => infer R ? (...args: P) => R : never;
declare type OmitThreeArg<F> = F extends (x1: any, x2: any, x3: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export {};
