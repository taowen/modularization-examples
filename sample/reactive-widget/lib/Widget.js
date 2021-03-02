"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWidget = exports.renderRootWidget = exports.Widget = void 0;
const React = require("react");
const ReactDOM = require("react-dom");
const react_1 = require("react");
const entity_archetype_1 = require("@autonomy/entity-archetype");
const Future_1 = require("./Future");
const Operation_1 = require("./Operation");
// 展示界面，其数据来自两部分
// 父组件传递过来的 props
// 从 I/O 获得的外部状态，保存在 futures 里
class Widget {
    // 父组件传入的 props
    constructor(props) {
        this.props = props;
        // 外部状态
        this.subscriptions = new Map();
    }
    // 批量编辑，父子表单等类型的界面需要有可编辑的前端状态，放在本地的内存 database 里
    // onMount 的时候从 remoteService 把数据复制到内存 database 里进行编辑
    // onUnmount 的时候清理本地的内存 database
    // @internal
    async onMount(scene) { }
    // @internal
    async onUnmount(scene) { }
    // react 的钩子不能写在 render 里，必须写在这里
    setupHooks() { }
    // 声明一份对外部状态的依赖，async 计算过程中的所有读到的表（含RPC服务端读的表）都会被收集到依赖关系里
    // 不同于 vue 和 mobx 的细粒度状态订阅，这里实现的订阅是表级别的，而不是行级别的
    // 也就是一张表中的任意新增删除修改，都会触发所有订阅者的刷新
    subscribe(compute) {
        return new Future_1.Future(compute, this);
    }
    async mount(op) {
        await this.onMount(Future_1.enableChangeNotification(newScene(op)));
        // afterMounted
        for (const [k, v] of Object.entries(this)) {
            if (v && v instanceof Future_1.Future) {
                this.subscriptions.set(k, v);
            }
        }
        await this.refreshSubscriptions(op);
    }
    async refreshSubscriptions(op) {
        const promises = new Map();
        // 并发计算
        for (const [k, future] of this.subscriptions.entries()) {
            promises.set(k, future.get(Future_1.ensureReadonly(newScene(op))));
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
            Operation_1.runInOperation(op, this.notifyChange.bind(this));
        }
    }
    unmount() {
        this.unmounted = true;
        for (const future of this.subscriptions.values()) {
            future.dispose();
        }
        this.subscriptions.clear();
        this.onUnmount(Future_1.enableChangeNotification(newScene(`unMount ${this.constructor.name}`)));
    }
    callback(methodName, ...boundArgs) {
        const method = Reflect.get(this, methodName);
        return (...args) => {
            const scene = Future_1.enableChangeNotification(newScene(`callback ${this.constructor.name}.${methodName}`));
            return method(scene, ...boundArgs, ...args);
        };
    }
    // 以下是 react 的黑魔法，看不懂是正常的
    // 实际交给 react 执行的组件是下面这个函数，它屏蔽了异步 I/O，使得 this.render 只需要处理同步的渲染
    // @internal
    static reactComponent(widgetClass, props) {
        // 我们没有把状态存在 react 的体系内，而是完全外置的状态
        // 并不打算支持 react concurrent，也绝对会有 tearing 的问题，don't care
        // 目标就是业务代码中完全没有 useState 和 useContext，全部用 scene 获取的状态代替
        // 外部状态改变的时候，触发 forceRender，重新渲染一遍 UI
        const [isForceRender, forceRender] = React.useState(0);
        // 创建 widget，仅会在首次渲染时执行一次
        const [{ widget, initialRenderOp }, _] = React.useState(() => {
            const widget = new widgetClass(props);
            widget.notifyChange = () => {
                if (!widget.unmounted) {
                    forceRender((count) => count + 1);
                }
            };
            return { widget, initialRenderOp: Operation_1.currentOperation() };
        });
        const [isReady, setReady] = React.useState(false);
        React.useEffect(() => {
            // mount 之后触发外部状态的获取
            const promise = widget.mount(initialRenderOp);
            setReady(promise);
            promise
                .then(() => {
                // 如果数据获取成功则开始真正渲染
                if (!widget.unmounted) {
                    Operation_1.runInOperation(initialRenderOp, () => {
                        setReady(true);
                    });
                }
            })
                .catch((exception) => {
                // 否则把异常设置到 state 里，下面 throw isReady 的时候抛给父组件
                Operation_1.runInOperation(initialRenderOp, () => {
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
                widget.refreshSubscriptions(Operation_1.currentOperation());
                // 刷新是异步的，刷新完成了之后会再次重渲染 react 组件重新走到这里
                // refreshSubscriptions 内部会判重，不会死循环
            }
            return widget.render(hooks);
        }
        else if (isReady === false) {
            // 第一次不能直接 throw promise，否则 react 会把所有 state 给扔了，只能渲染个空白出去
            return React.createElement(React.Fragment, null);
        }
        else {
            // 把 loading 或者 loadFailed 往父组件抛，被 <Suspense> 或者 <ErrorBoundary> 给抓住
            throw isReady;
        }
    }
}
exports.Widget = Widget;
function newScene(op) {
    return new entity_archetype_1.Scene({
        database: Widget.database,
        serviceProtocol: Widget.serviceProtocol,
        operation: typeof op === 'string' ? Operation_1.newOperation(op) : op,
    });
}
function renderRootWidget(widgetClass, options) {
    Widget.database = options.database;
    Widget.serviceProtocol = options.serviceProtocol;
    Future_1.enableDependencyTracking();
    const elem = document.getElementById('RootWidget');
    if (!elem) {
        console.error('missing element #RootWidget');
        return;
    }
    const operation = Operation_1.newOperation(`initial render ${window.location.href}`);
    Operation_1.runInOperation(operation, () => {
        ReactDOM.render(React.createElement(react_1.Suspense, { fallback: React.createElement(React.Fragment, null) }, renderWidget(widgetClass)), elem);
    });
}
exports.renderRootWidget = renderRootWidget;
function renderWidget(widgetClass, props) {
    const Component = Widget.reactComponent.bind(undefined, widgetClass);
    return React.createElement(Component, Object.assign({}, props));
}
exports.renderWidget = renderWidget;
//# sourceMappingURL=Widget.js.map