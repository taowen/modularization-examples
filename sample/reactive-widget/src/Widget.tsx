import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Suspense } from 'react';
import { Database, Operation, ServiceProtocol, Scene } from '@autonomy/entity-archetype';
import { enableChangeNotification, enableDependencyTracking, Future } from './Future';
import { currentOperation, newOperation, runInOperation } from './Operation';

// 展示界面，其数据来自两部分
// 父组件传递过来的 props
// 从 I/O 获得的外部状态，保存在 futures 里
export abstract class Widget {
    public static database: Database;
    public static serviceProtocol: ServiceProtocol;
    private unmounted?: boolean;
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

    // 声明一份对外部状态的依赖
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
            promises.set(k, future.get(newScene(op)));
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
        return (...args: any[]) => {
            const scene = enableChangeNotification(
                newScene(`callback ${this.constructor.name}.${methodName}`),
            );
            return Reflect.get(this, methodName)(scene, ...boundArgs, ...args);
        };
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
        if (isReady === true) {
            if (isForceRender) {
                widget.refreshSubscriptions(currentOperation());
            }
            return widget.render(hooks);
        } else if (isReady === false) {
            return <></>;
        } else {
            throw isReady;
        }
    }
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
    return <Component {...props}/>;
}

type OmitOneArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type OmitTwoArg<F> = F extends (x1: any, x2: any, ...args: infer P) => infer R
    ? (...args: P) => R
    : never;
type OmitThreeArg<F> = F extends (x1: any, x2: any, x3: any, ...args: infer P) => infer R
    ? (...args: P) => R
    : never;
