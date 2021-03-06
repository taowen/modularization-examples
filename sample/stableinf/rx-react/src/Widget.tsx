import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Suspense } from 'react';
import {
    Database,
    Operation,
    ServiceProtocol,
    Scene,
    newOperation,
    Atom,
    useTrace,
} from '@stableinf/io';
import { Future } from './Future';
import { currentOperation, runInOperation } from './Operation';
import { reactive, ReactiveObject, Ref } from './reactive';
import { UiScene } from './UiScene';

const trace = useTrace(Symbol.for('Widget'));
const transientProps = new Set<PropertyKey>([
    'unmounted',
    'futures',
    'subscribed',
    'props',
    'render',
]);

// 展示界面，其数据来自三部分
// 父组件传递过来的 props
// 从 I/O 获得的外部状态，保存在 asyncDeps 里
// 从其他 reactive 的对象获得的外部状态，保存在 syncDeps 里
export abstract class Widget<P = any> extends ReactiveObject {
    // 异步操作回调可能发生在组件卸载之后
    private unmounted?: boolean;
    // 外部状态
    private asyncDeps: Map<string, Future> = new Map();
    private syncDeps: Set<Atom> = new Set();
    public readonly props: P;
    // 父组件传入的 props
    constructor(props: P) {
        super({ props });
    }

    // 批量编辑，父子表单等类型的界面需要有可编辑的前端状态，放在本地的内存 database 里
    // onMount 的时候从 remoteService 把数据复制到内存 database 里进行编辑
    // onUnmount 的时候清理本地的内存 database
    public onMount: (scene: Scene) => Promise<void>;
    public onUnmount: (scene: Scene) => Promise<void>;
    // react 的钩子不能写在 render 里，必须写在这里
    public setupHooks(): any {}
    // 当外部状态获取完毕之后，会调用 render
    protected abstract render(hooks: ReturnType<this['setupHooks']>): React.ReactElement;

    // 声明一份对外部状态的依赖，async 计算过程中的所有读到的表（含RPC服务端读的表）都会被收集到依赖关系里
    // 不同于 vue 和 mobx 的细粒度状态订阅，这里实现的订阅是表级别的，而不是行级别的
    // 也就是一张表中的任意新增删除修改，都会触发所有订阅者的刷新
    protected subscribe<T>(compute: (scene: Scene) => Promise<T>): T {
        return new Future(compute, this) as any;
    }

    // 外部状态发生了变化，触发重渲染
    public notifyChange: (op: Operation) => void;

    private async mount(op: Operation) {
        if (this.onMount) {
            await UiScene.createRW(op).execute(this, this.onMount);
        }
        await this.refreshAsyncDeps(op, true);
    }

    private get needMountAsync() {
        return !!this.onMount || this.asyncDeps.size > 0;
    }

    private async refreshAsyncDeps(op: Operation, isMounting: boolean) {
        const promises = new Map<string, Promise<any>>();
        // 并发计算
        for (const [k, future] of this.asyncDeps.entries()) {
            const scene = UiScene.createRO(op);
            const promise = scene.execute(future, future.get);
            promise.catch(op.onError);
            promises.set(k, promise);
        }
        let dirty = false;
        for (const [k, promise] of promises.entries()) {
            try {
                const v = await promise;
                if (Reflect.get(this, k) !== v) {
                    Reflect.set(this, k, v);
                    dirty = true;
                }
            } catch (e) {
                if (isMounting) {
                    throw e;
                }
            }
        }
        if (dirty && !isMounting) {
            this.notifyChange(op);
        }
    }

    private unmount() {
        this.unmounted = true;
        for (const future of this.asyncDeps.values()) {
            future.dispose();
        }
        this.asyncDeps.clear();
        for (const atom of this.syncDeps) {
            atom.deleteSubscriber(this);
        }
        this.syncDeps.clear();
        if (this.onUnmount) {
            UiScene.createRW(`unMount ${this.constructor.name}`).execute(this, this.onUnmount);
        }
    }

    protected isExecuting<M extends keyof this>(methodName: M): boolean {
        const isExecuting = new Ref(false);
        const method = Reflect.get(this, methodName);
        Reflect.set(this, methodName, async function(this: any, scene: Scene, ...args: any) {
            isExecuting.set(true, scene);
            await scene.sleep(0);
            try {
                return method.call(this, scene, ...args);
            } finally {
                isExecuting.set(false, scene);
            }
        })
        const future = this.subscribe(async (scene) => {
            return isExecuting.get(scene);
        }) as any;
        return future;
    }

    protected callback<M extends keyof this>(methodName: M): OmitOneArg<this[M]>;
    protected callback<M extends keyof this>(methodName: M, boundArg1: any): OmitTwoArg<this[M]>;
    protected callback<M extends keyof this>(
        methodName: M,
        boundArg1: any,
        boundArg2: any,
    ): OmitThreeArg<this[M]>;
    protected callback<M extends keyof this>(methodName: M, ...boundArgs: any[]): any {
        const cb = Reflect.get(this, methodName);
        return (...args: any[]) => {
            const traceOp = `callback ${this.constructor.name}.${methodName}`;
            const scene = UiScene.createRW(traceOp);
            return (async () => {
                try {
                    return await scene.execute(this.attachTo(scene), cb, ...boundArgs, ...args);
                } catch (e) {
                    UiScene.onUnhandledCallbackError(scene, e);
                    return undefined;
                }
            })();
        };
    }

    // 以下是 react 的黑魔法，看不懂是正常的
    // 实际交给 react 执行的组件是下面这个函数，它屏蔽了异步 I/O，使得 this.render 只需要处理同步的渲染
    // @internal
    public static reactComponent(
        widgetClass: WidgetClass,
        props: Record<string, any>,
    ): React.ReactElement {
        return trace.execute('render reactComponent', () => {
            // 我们没有把状态存在 react 的体系内，而是完全外置的状态
            // 并不打算支持 react concurrent，也绝对会有 tearing 的问题，don't care
            // 目标就是业务代码中完全没有 useState 和 useContext，全部用 scene 获取的状态代替
            // 外部状态改变的时候，触发 forceRender，重新渲染一遍 UI
            const [isForceRender, forceRender] = React.useState(0);
            trace`isForceRender: ${isForceRender}`;
            // 创建 widget，仅会在首次渲染时执行一次
            const [{ widget, initialRenderOp }, _] = React.useState(() => {
                const widget: Widget = props.__borrowed__ || new widgetClass(props as any);
                for (const [k, v] of Object.entries(widget)) {
                    if (v && v instanceof Future) {
                        widget.asyncDeps.set(k, v);
                    }
                }
                widget.notifyChange = (op) => {
                    trace`notifyChange ${widget}, unmounted: ${widget.unmounted}`;
                    if (!widget.unmounted) {
                        runInOperation(op, () => {
                            forceRender((count) => count + 1);
                        });
                    }
                };
                trace`inited widget instance with ${widget.asyncDeps.size} futures`;
                return { widget, initialRenderOp: currentOperation() };
            });
            trace`widget: ${widget}`;
            const [isReady, setReady] = React.useState<false | true | Promise<void>>(
                !widget.needMountAsync,
            );
            trace`isReady: ${isReady}`;
            // 无论是否要渲染，setupHooks 都必须执行，react 要求 hooks 数量永远不变
            const hooks = widget.setupHooks();
            React.useEffect(
                trace.wrap('mount reactComponent', () => {
                    trace`widget: ${widget}`;
                    // mount 之后触发外部状态的获取
                    if (widget.unmounted) {
                        widget.unmounted = false;
                        trace`reset widget unmounted flag`;
                    }
                    trace`needMountAsync: ${widget.needMountAsync}`;
                    if (widget.needMountAsync) {
                        const promise = (async () => {
                            try {
                                await widget.mount(initialRenderOp);
                                // 如果数据获取成功则开始真正渲染
                                if (!widget.unmounted) {
                                    runInOperation(initialRenderOp, () => {
                                        setReady(true);
                                    });
                                }
                            } catch (e) {
                                // 否则把异常设置到 state 里，下面 throw isReady 的时候抛给父组件
                                runInOperation(initialRenderOp, () => {
                                    setReady(e);
                                });
                            }
                        })();
                        setReady(promise);
                    }
                    // 此处返回的回调会在 unmount 的时候调用
                    return trace.wrap('unmount reactComponent', () => {
                        trace`widget: ${widget}`;
                        widget.unmount();
                    });
                }),
                [],
            ); // [] 表示该 Effect 仅执行一次，也就是 mount/unmount
            // react 组件处于 false => 初始化中 => true 三种状态之一
            if (isReady === true) {
                if (isForceRender) {
                    // isReady 了之后，后续的重渲染都是因为外部状态改变而触发的，所以要刷一下
                    widget.refreshAsyncDeps(currentOperation(), false);
                    // 刷新是异步的，刷新完成了之后会再次重渲染 react 组件重新走到这里
                    // refreshSubscriptions 内部会判重，不会死循环
                }
                reactive.currentChangeTracker = {
                    subscribe: (atom) => {
                        atom.addSubscriber(widget);
                        widget.syncDeps.add(atom);
                    },
                    notifyChange: (atom) => {
                        throw new Error(`render should be readonly, but modified: ${atom}`);
                    },
                };
                try {
                    return widget.attachTo(reactive.currentChangeTracker).render(hooks);
                } finally {
                    reactive.currentChangeTracker = undefined;
                }
            } else if (isReady === false) {
                // 第一次不能直接 throw promise，否则 react 会把所有 state 给扔了，只能渲染个空白出去
                return <></>;
            } else {
                // 把 loading 或者 loadFailed 往父组件抛，被 <Suspense> 或者 <ErrorBoundary> 给抓住
                throw isReady;
            }
        });
    }

    protected shouldTrack(propertyKey: PropertyKey) {
        if (transientProps.has(propertyKey)) {
            return false;
        }
        return super.shouldTrack(propertyKey);
    }

    public toJSON() {
        return { ...this, subscribed: undefined, futures: undefined };
    }

    public get [Symbol.toStringTag]() {
        return `[W]${this.constructor.name} with ${JSON.stringify(this.props)}`;
    }
}

for (const methodName of Object.getOwnPropertyNames(Widget.prototype)) {
    transientProps.add(methodName);
}

// 给回调提供 scene，并统一捕获异常兜底
export function bindCallback<T extends (...args: any[]) => any>(
    traceOp: string,
    cb: T,
    ...boundArgs: any[]
): any;
export function bindCallback<T extends (...args: any[]) => any>(
    traceOp: string,
    cb: T,
    boundArg1: Parameters<T>[1],
    boundArg2: Parameters<T>[2],
): OmitThreeArg<T>;
export function bindCallback<T extends (...args: any[]) => any>(
    traceOp: string,
    cb: T,
    boundArg1: Parameters<T>[1],
): OmitTwoArg<T>;
export function bindCallback<T>(traceOp: string, cb: T): OmitOneArg<T>;
export function bindCallback(traceOp: string, cb: any, ...boundArgs: any[]): any {
    return (...args: any[]) => {
        const scene = UiScene.createRW(traceOp);
        return (async () => {
            try {
                return await scene.execute(undefined, cb, ...boundArgs, ...args);
            } catch (e) {
                UiScene.onUnhandledCallbackError(scene, e);
                return undefined;
            }
        })();
    };
}

export type WidgetClass<T extends Widget = any> = Function & {
    new (props?: Record<string, any>): T;
};

export function renderRootWidget(
    widgetClass: WidgetClass,
    options: { database: Database; serviceProtocol: ServiceProtocol },
) {
    UiScene.database = options.database;
    UiScene.serviceProtocol = options.serviceProtocol;
    const elem = document.getElementById('RootWidget');
    if (!elem) {
        console.error('missing element #RootWidget');
        return;
    }
    const operation = newOperation(`initial render ${window.location.href}`);
    runInOperation(operation, () => {
        ReactDOM.render(
            <Suspense fallback={<span>loading</span>}>{renderWidget(widgetClass as any)}</Suspense>,
            elem,
        );
    });
}

const comps = new Map<WidgetClass<any>, Function>();

export function renderWidget<T extends Widget>(
    widgetClass: WidgetClass<T>,
    props?: T['props'],
): React.ReactElement;
export function renderWidget<T extends Widget>(widget: Widget): React.ReactElement;
export function renderWidget<T extends Widget>(arg1: WidgetClass<T> | Widget, props?: T['props']) {
    let widgetClass: WidgetClass;
    if (arg1 instanceof Widget) {
        widgetClass = arg1.constructor as any;
        props = { __borrowed__: arg1 } as any;
    } else {
        widgetClass = arg1;
    }
    let Component = comps.get(widgetClass);
    if (!Component) {
        Component = React.memo(Widget.reactComponent.bind(undefined, widgetClass));
        comps.set(widgetClass, Component);
    }
    return <Component {...props} />;
}

type OmitOneArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type OmitTwoArg<F> = F extends (x1: any, x2: any, ...args: infer P) => infer R
    ? (...args: P) => R
    : never;
type OmitThreeArg<F> = F extends (x1: any, x2: any, x3: any, ...args: infer P) => infer R
    ? (...args: P) => R
    : never;
