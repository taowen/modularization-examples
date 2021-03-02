import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    Database,
    HttpRemoteService,
    Operation,
    RemoteService,
    Scene,
} from '@autonomy/entity-archetype';
import { enableDependencyTracking, Future } from './Future';
import * as tracing from 'scheduler/tracing';

// 展示界面，其数据来自两部分
// 父组件传递过来的 props
// 从 I/O 获得的外部状态，保存在 futures 里
export abstract class Widget {
    public static database: Database;
    public static remoteService: RemoteService;
    public unmounted?: boolean;
    // 外部状态
    public subscriptions: Map<string, Future> = new Map();
    // 父组件传入的 props
    constructor(public props?: Record<string, any>) {}

    // 批量编辑，父子表单等类型的界面需要有可编辑的前端状态，放在本地的内存 database 里
    // onMount 的时候从 remoteService 把数据复制到内存 database 里进行编辑
    // onUnmount 的时候清理本地的内存 database 释放内存
    public onMount: (scene: Scene) => Promise<void> | undefined;
    public onUnmount: (scene: Scene) => Promise<void> | undefined;
    // react 的钩子不能写在 render 里，必须写在这里
    public setupHooks(): any {}
    // 当外部状态获取完毕之后，会调用 render
    public abstract render(hooks: ReturnType<this['setupHooks']>): React.ReactElement;

    // 声明一份对外部状态的依赖
    protected subscribe<T>(compute: (scene: Scene) => Promise<T>): T {
        return new Future(compute) as any;
    }

    // 外部状态发生了变化，触发重渲染
    public notifyChange() {}

    public async mount() {
        if (this.onMount) {
            await this.onMount(
                new Scene({
                    remoteService: Widget.remoteService,
                    database: Widget.database,
                    operation: newOperation('sync scene'),
                }),
            );
        }
        // afterMounted
        for (const [k, v] of Object.entries(this)) {
            if (v && v instanceof Future) {
                this.subscriptions.set(k, v);
            }
        }
        await this.refreshSubscriptions();
    }

    private async refreshSubscriptions() {
        const promises = new Map<string, Promise<any>>();
        // 并发计算
        for (const [k, future] of this.subscriptions.entries()) {
            promises.set(k, this.computeFuture(future));
        }
        for (const [k, promise] of promises.entries()) {
            Reflect.set(this, k, await promise);
        }
    }

    private async computeFuture(future: Future) {
        const scene = new Scene({
            remoteService: Widget.remoteService,
            database: Widget.database,
            operation: currentOperation(),
        });
        return await future.get(scene);
    }

    public unmount() {
        this.unmounted = true;
        for (const future of this.subscriptions.values()) {
            future.dispose();
        }
        this.subscriptions.clear();
        if (this.onUnmount) {
            this.onUnmount(
                new Scene({
                    database: Widget.database,
                    remoteService: Widget.remoteService,
                    operation: newOperation('unmount component'),
                }),
            );
        }
    }
}

export type WidgetClass<T extends Widget = any> = Function & {
    new (scene: Scene, props?: Record<string, any>): T;
};

function newOperation(traceOp: string): Operation {
    return {
        traceId: '123',
        traceOp,
        baggage: {},
        props: {},
    };
}

function currentOperation(): Operation {
    const interactions = tracing.unstable_getCurrent();
    if (!interactions) {
        throw new Error('missing operation');
    }
    for (const interaction of interactions) {
        const maybeOp = interaction.name as any;
        if (maybeOp && maybeOp.traceId) {
            return maybeOp;
        }
    }
    throw new Error('missing operation');
}

function runInOperation<T>(op: Operation, action: () => T): T {
    return tracing.unstable_trace(op as any, 0, () => {
        return action();
    });
}

export function renderRootWidget(
    widgetClass: WidgetClass,
    options: { project: string; database: Database; remoteService: RemoteService },
) {
    HttpRemoteService.project = options.project;
    Widget.database = options.database;
    Widget.remoteService = options.remoteService;
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
        const [widget, _] = React.useState(() => new widgetClass(props as any));
        const [isReady, setReady] = React.useState(false);
        const initialRenderOp = currentOperation();
        React.useEffect(() => {
            const promise = runInOperation(initialRenderOp, () => {
                return widget.mount();
            });
            promise
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
            return widget.render(hooks);
        }
        return <></>;
    }
    return <Wrapper />;
}
