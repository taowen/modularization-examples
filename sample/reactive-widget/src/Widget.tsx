import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    Database,
    HttpXClient,
    Operation,
    ServiceProtocol,
    Scene,
} from '@autonomy/entity-archetype';
import { enableChangeNotification, enableDependencyTracking, Future } from './Future';
import { currentOperation, newOperation, runInOperation } from './Operation';

// 展示界面，其数据来自两部分
// 父组件传递过来的 props
// 从 I/O 获得的外部状态，保存在 futures 里
export abstract class Widget {
    public static database: Database;
    public static serviceProtocol: ServiceProtocol;
    public unmounted?: boolean;
    // 外部状态
    public subscriptions: Map<string, Future> = new Map();
    // 父组件传入的 props
    constructor(public props?: Record<string, any>) {}

    // 批量编辑，父子表单等类型的界面需要有可编辑的前端状态，放在本地的内存 database 里
    // onMount 的时候从 remoteService 把数据复制到内存 database 里进行编辑
    // onUnmount 的时候清理本地的内存 database
    public async onMount(scene: Scene) {}
    public async onUnmount(scene: Scene) {}
    // react 的钩子不能写在 render 里，必须写在这里
    public setupHooks(): any {}
    // 当外部状态获取完毕之后，会调用 render
    public abstract render(hooks: ReturnType<this['setupHooks']>): React.ReactElement;

    // 声明一份对外部状态的依赖
    protected subscribe<T>(compute: (scene: Scene) => Promise<T>): T {
        return new Future(compute, this) as any;
    }

    // 外部状态发生了变化，触发重渲染
    public notifyChange: () => void;

    public async mount(op: Operation) {
        await this.onMount(enableChangeNotification(newScene(op)));
        // afterMounted
        for (const [k, v] of Object.entries(this)) {
            if (v && v instanceof Future) {
                this.subscriptions.set(k, v);
            }
        }
        await this.refreshSubscriptions(op);
    }

    public async refreshSubscriptions(op: Operation) {
        const promises = new Map<string, Promise<any>>();
        // 并发计算
        for (const [k, future] of this.subscriptions.entries()) {
            promises.set(k, this.computeFuture(future, op));
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

    private async computeFuture(future: Future, op: Operation) {
        const scene = newScene(op);
        return await future.get(scene);
    }

    public unmount() {
        this.unmounted = true;
        for (const future of this.subscriptions.values()) {
            future.dispose();
        }
        this.subscriptions.clear();
        this.onUnmount(enableChangeNotification(newScene(`unMount ${this.constructor.name}`)));
    }

    protected callback<M extends keyof this>(methodName: M): OmitFirstArg<this[M]> {
        return ((...args: any[]) => {
            const scene = enableChangeNotification(
                newScene(`callback ${this.constructor.name}.${methodName}`),
            );
            return Reflect.get(this, methodName)(scene, ...args);
        }) as any;
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
        ReactDOM.render(renderWidget(widgetClass as any), elem);
    });
}

export function renderWidget<T extends Widget>(widgetClass: WidgetClass<T>, props?: T['props']) {
    function Wrapper() {
        const setRenderCount = React.useState(0)[1];
        const [widget, _] = React.useState(() => {
            const widget = new widgetClass(props as any);
            widget.notifyChange = () => {
                !widget.unmounted && setRenderCount((count) => count + 1);
            };
            return widget;
        });
        const [isReady, setReady] = React.useState(false);
        const initialRenderOp = currentOperation();
        React.useEffect(() => {
            widget
                .mount(initialRenderOp)
                .then(() => {
                    if (!widget.unmounted) {
                        runInOperation(initialRenderOp, () => {
                            setReady(true);
                        });
                    }
                })
                .catch((reason) => {
                    console.error('failure', reason);
                });
            return () => {
                widget.unmount();
            };
        }, []);
        const hooks = widget.setupHooks();
        if (isReady === true) {
            widget.refreshSubscriptions(currentOperation());
            return widget.render(hooks);
        }
        return <></>;
    }
    return <Wrapper />;
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
