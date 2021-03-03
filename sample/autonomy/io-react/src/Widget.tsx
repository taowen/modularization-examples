import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Suspense } from 'react';
import { Database, Operation, ServiceProtocol, Scene } from '@autonomy/io';
import {
    enableChangeNotification,
    enableDependencyTracking,
    ensureReadonly,
    Future,
} from './Future';
import { currentOperation, newOperation, runInOperation } from './Operation';

// 展示界面，其数据来自两部分
// 父组件传递过来的 props
// 从 I/O 获得的外部状态，保存在 futures 里
export abstract class Widget {
    // 可以覆盖这个回调来实现全局写操作的异常处理，读操作的异常用 ErrorBoundary 去抓
    public static onUnhanledCallbackError = (scene: Scene, e: any) => {
        console.error(`unhandled callback error: ${scene}`, e);
    };
    public static database: Database;
    public static serviceProtocol: ServiceProtocol;
    private unmounted?: boolean;
    // 用来实现按钮在执行中灰掉
    private executingCallbacks?: Set<PropertyKey>;
    private callbackIds?: Map<PropertyKey, string>;
    // 外部状态
    private subscriptions: Map<string, Future> = new Map();
    // 父组件传入的 props
    constructor(public props?: Record<string, any>) {}

    // 批量编辑，父子表单等类型的界面需要有可编辑的前端状态，放在本地的内存 database 里
    // onMount 的时候从 remoteService 把数据复制到内存 database 里进行编辑
    // onUnmount 的时候清理本地的内存 database
    // @internal
    public async onMount(scene: Scene) {}
    // @internal
    public async onUnmount(scene: Scene) {}
    // react 的钩子不能写在 render 里，必须写在这里
    public setupHooks(): any {}
    // 当外部状态获取完毕之后，会调用 render
    // @internal
    public abstract render(hooks: ReturnType<this['setupHooks']>): React.ReactElement;

    // 声明一份对外部状态的依赖，async 计算过程中的所有读到的表（含RPC服务端读的表）都会被收集到依赖关系里
    // 不同于 vue 和 mobx 的细粒度状态订阅，这里实现的订阅是表级别的，而不是行级别的
    // 也就是一张表中的任意新增删除修改，都会触发所有订阅者的刷新
    protected subscribe<T>(compute: (scene: Scene) => Promise<T>): T {
        return new Future(compute, this) as any;
    }

    // 外部状态发生了变化，触发重渲染
    public notifyChange: () => void;

    private async mount(op: Operation) {
        await this.onMount(enableChangeNotification(newScene(op)));
        // afterMounted
        for (const [k, v] of Object.entries(this)) {
            if (v && v instanceof Future) {
                this.subscriptions.set(k, v);
            }
        }
        await this.refreshSubscriptions(op);
    }

    private async refreshSubscriptions(op: Operation) {
        const promises = new Map<string, Promise<any>>();
        // 并发计算
        for (const [k, future] of this.subscriptions.entries()) {
            promises.set(k, future.get(ensureReadonly(newScene(op))));
        }
        let dirty = false;
        for (const [k, promise] of promises.entries()) {
            const v = await promise;
            if (Reflect.get(this, k) !== v) {
                Reflect.set(this, k, v);
                dirty = true;
            }
        }
        if (dirty) {
            runInOperation(op, this.notifyChange.bind(this));
        }
    }

    private unmount() {
        this.unmounted = true;
        for (const future of this.subscriptions.values()) {
            future.dispose();
        }
        this.subscriptions.clear();
        this.onUnmount(enableChangeNotification(newScene(`unMount ${this.constructor.name}`)));
    }

    protected callback<M extends keyof this>(methodName: M): OmitOneArg<this[M]>;
    protected callback<M extends keyof this>(methodName: M, boundArg1: any): OmitTwoArg<this[M]>;
    protected callback<M extends keyof this>(
        methodName: M,
        boundArg1: any,
        boundArg2: any,
    ): OmitThreeArg<this[M]>;
    protected callback<M extends keyof this>(methodName: M, ...boundArgs: any[]): any {
        const cb = Reflect.get(this, methodName).bind(this);
        return (...args: any[]) => {
            const scene = enableChangeNotification(
                newScene(`callback ${this.constructor.name}.${methodName}`),
            );
            if (!this.executingCallbacks) {
                this.executingCallbacks = new Set();
            }
            this.executingCallbacks.add(methodName);
            const callbackId = this.getCallbackId(methodName);
            scene.notifyChange(callbackId);
            return (async () => {
                try {
                    return await cb(scene, ...boundArgs, ...args);
                } catch (e) {
                    Widget.onUnhanledCallbackError(scene, e);
                    return undefined;
                } finally {
                    this.executingCallbacks!.delete(methodName);
                    scene.notifyChange(callbackId);
                }
            })();
        };
    }

    protected isExecuting<M extends keyof this>(methodName: M) {
        return this.subscribe(async (scene) => {
            for (const subscriber of scene.subscribers) {
                subscriber.subscribe(this.getCallbackId(methodName));
            }
            return this.executingCallbacks && this.executingCallbacks.has(methodName);
        });
    }

    private getCallbackId(methodName: PropertyKey) {
        if (!this.callbackIds) {
            this.callbackIds = new Map();
        }
        let callbackId = this.callbackIds.get(methodName);
        if (!callbackId) {
            this.callbackIds.set(methodName, callbackId = `cb-${nextCallbackId()}`);
        }
        return callbackId;
    }

    // 以下是 react 的黑魔法，看不懂是正常的
    // 实际交给 react 执行的组件是下面这个函数，它屏蔽了异步 I/O，使得 this.render 只需要处理同步的渲染
    // @internal
    public static reactComponent(widgetClass: WidgetClass, props?: Record<string, any>) {
        // 我们没有把状态存在 react 的体系内，而是完全外置的状态
        // 并不打算支持 react concurrent，也绝对会有 tearing 的问题，don't care
        // 目标就是业务代码中完全没有 useState 和 useContext，全部用 scene 获取的状态代替
        // 外部状态改变的时候，触发 forceRender，重新渲染一遍 UI
        const [isForceRender, forceRender] = React.useState(0);
        // 创建 widget，仅会在首次渲染时执行一次
        const [{ widget, initialRenderOp }, _] = React.useState(() => {
            const widget: Widget = new widgetClass(props as any);
            widget.notifyChange = () => {
                if (!widget.unmounted) {
                    forceRender((count) => count + 1);
                }
            };
            return { widget, initialRenderOp: currentOperation() };
        });
        const [isReady, setReady] = React.useState<false | true | Promise<void>>(false);
        React.useEffect(() => {
            // mount 之后触发外部状态的获取
            const promise = widget.mount(initialRenderOp);
            setReady(promise);
            promise
                .then(() => {
                    // 如果数据获取成功则开始真正渲染
                    if (!widget.unmounted) {
                        runInOperation(initialRenderOp, () => {
                            setReady(true);
                        });
                    }
                })
                .catch((exception: any) => {
                    // 否则把异常设置到 state 里，下面 throw isReady 的时候抛给父组件
                    runInOperation(initialRenderOp, () => {
                        setReady(exception);
                    });
                });
            // 此处返回的回调会在 unmount 的时候调用
            return () => {
                widget.unmount();
            };
        }, []); // [] 表示该 Effect 仅执行一次，也就是 mount/unmount
        // 无论是否要渲染，setupHooks 都必须执行，react 要求 hooks 数量永远不变
        const hooks = widget.setupHooks();
        // react 组件处于 false => 初始化中 => true 三种状态之一
        if (isReady === true) {
            if (isForceRender) {
                // isReady 了之后，后续的重渲染都是因为外部状态改变而触发的，所以要刷一下
                widget.refreshSubscriptions(currentOperation());
                // 刷新是异步的，刷新完成了之后会再次重渲染 react 组件重新走到这里
                // refreshSubscriptions 内部会判重，不会死循环
            }
            return widget.render(hooks);
        } else if (isReady === false) {
            // 第一次不能直接 throw promise，否则 react 会把所有 state 给扔了，只能渲染个空白出去
            return <></>;
        } else {
            // 把 loading 或者 loadFailed 往父组件抛，被 <Suspense> 或者 <ErrorBoundary> 给抓住
            throw isReady;
        }
    }
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
        const scene = enableChangeNotification(newScene(traceOp));
        return (async () => {
            try {
                return await cb(scene, ...boundArgs, ...args);
            } catch (e) {
                Widget.onUnhanledCallbackError(scene, e);
                return undefined;
            }
        })();
    };
}

export type WidgetClass<T extends Widget = any> = Function & {
    new (scene: Scene, props?: Record<string, any>): T;
};

function newScene(op: string | Operation) {
    return new Scene({
        database: Widget.database,
        serviceProtocol: Widget.serviceProtocol,
        operation: typeof op === 'string' ? newOperation(op) : op,
    });
}

export function renderRootWidget(
    widgetClass: WidgetClass,
    options: { database: Database; serviceProtocol: ServiceProtocol },
) {
    Widget.database = options.database;
    Widget.serviceProtocol = options.serviceProtocol;
    enableDependencyTracking();
    const elem = document.getElementById('RootWidget');
    if (!elem) {
        console.error('missing element #RootWidget');
        return;
    }
    const operation = newOperation(`initial render ${window.location.href}`);
    runInOperation(operation, () => {
        ReactDOM.render(
            <Suspense fallback={<></>}>{renderWidget(widgetClass as any)}</Suspense>,
            elem,
        );
    });
}

export function renderWidget<T extends Widget>(widgetClass: WidgetClass<T>, props?: T['props']) {
    const Component = Widget.reactComponent.bind(undefined, widgetClass);
    return <Component {...props} />;
}

type OmitOneArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type OmitTwoArg<F> = F extends (x1: any, x2: any, ...args: infer P) => infer R
    ? (...args: P) => R
    : never;
type OmitThreeArg<F> = F extends (x1: any, x2: any, x3: any, ...args: infer P) => infer R
    ? (...args: P) => R
    : never;

let counter = 1;
function nextCallbackId() {
    return counter++;
}
