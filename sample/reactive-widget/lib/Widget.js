"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWidget = exports.renderRootWidget = exports.Widget = void 0;
const React = require("react");
const ReactDOM = require("react-dom");
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
    async onMount(scene) { }
    async onUnmount(scene) { }
    // react 的钩子不能写在 render 里，必须写在这里
    setupHooks() { }
    // 声明一份对外部状态的依赖
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
            Operation_1.runInOperation(op, this.notifyChange.bind(this));
        }
    }
    async computeFuture(future, op) {
        const scene = newScene(op);
        return await future.get(scene);
    }
    unmount() {
        this.unmounted = true;
        for (const future of this.subscriptions.values()) {
            future.dispose();
        }
        this.subscriptions.clear();
        this.onUnmount(Future_1.enableChangeNotification(newScene(`unMount ${this.constructor.name}`)));
    }
    callback(methodName) {
        return ((...args) => {
            const scene = Future_1.enableChangeNotification(newScene(`callback ${this.constructor.name}.${methodName}`));
            return Reflect.get(this, methodName)(scene, ...args);
        });
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
    entity_archetype_1.HttpServiceProtocol.project = options.project;
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
        ReactDOM.render(renderWidget(widgetClass), elem);
    });
}
exports.renderRootWidget = renderRootWidget;
function renderWidget(widgetClass, props) {
    function Wrapper() {
        const setRenderCount = React.useState(0)[1];
        const [widget, _] = React.useState(() => {
            const widget = new widgetClass(props);
            widget.notifyChange = () => {
                !widget.unmounted && setRenderCount((count) => count + 1);
            };
            return widget;
        });
        const [isReady, setReady] = React.useState(false);
        const initialRenderOp = Operation_1.currentOperation();
        React.useEffect(() => {
            widget
                .mount(initialRenderOp)
                .then(() => {
                if (!widget.unmounted) {
                    Operation_1.runInOperation(initialRenderOp, () => {
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
            widget.refreshSubscriptions(Operation_1.currentOperation());
            return widget.render(hooks);
        }
        return React.createElement(React.Fragment, null);
    }
    return React.createElement(Wrapper, null);
}
exports.renderWidget = renderWidget;
//# sourceMappingURL=Widget.js.map