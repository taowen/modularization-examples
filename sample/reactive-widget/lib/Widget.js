"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWidget = exports.renderRootWidget = exports.Widget = void 0;
const React = require("react");
const ReactDOM = require("react-dom");
const entity_archetype_1 = require("@autonomy/entity-archetype");
const Future_1 = require("./Future");
const tracing = require("scheduler/tracing");
// 展示界面
class Widget {
    constructor(props) {
        this.props = props;
        this.futures = new Map();
    }
    setup() { }
    renderWidget(widgetClass, props) {
        return renderWidget(widgetClass, props);
    }
    future(compute) {
        return new Future_1.Future(compute);
    }
    notifyChange() { }
    unmount() {
        this.unmounted = true;
        for (const future of this.futures.values()) {
            future.dispose();
        }
        this.futures.clear();
    }
}
exports.Widget = Widget;
function newOperation(traceOp) {
    return {
        traceId: "123",
        traceOp,
        baggage: {},
        props: {},
    };
}
function currentOperation() {
    const interactions = tracing.unstable_getCurrent();
    if (!interactions) {
        throw new Error("missing operation");
    }
    for (const interaction of interactions) {
        const maybeOp = interaction.name;
        if (maybeOp && maybeOp.traceId) {
            return maybeOp;
        }
    }
    throw new Error("missing operation");
}
function renderRootWidget(widgetClass, options) {
    entity_archetype_1.HttpRemoteService.project = options.project;
    Widget.database = options.database;
    Widget.remoteService = options.remoteService;
    Future_1.enableDependencyTracking();
    const elem = document.getElementById("RootWidget");
    if (!elem) {
        console.error("missing element #RootWidget");
        return;
    }
    const operation = newOperation(`initial render ${window.location.href}`);
    tracing.unstable_trace(operation, 0, () => {
        ReactDOM.render(renderWidget(widgetClass), elem);
    });
}
exports.renderRootWidget = renderRootWidget;
function renderWidget(widgetClass, props) {
    function Wrapper() {
        const [widget, _] = React.useState(() => new widgetClass(props));
        const [isReady, setReady] = React.useState(false);
        React.useEffect(() => {
            return () => {
                widget.unmount();
            };
        });
        const hooks = widget.setup();
        if (isReady === true) {
            return widget.render(hooks);
        }
        for (const [k, v] of Object.entries(widget)) {
            if (v && v instanceof Future_1.Future) {
                widget.futures.set(k, v);
            }
        }
        const promise = computeFutures(widget);
        promise
            .then(() => {
            if (!widget.unmounted) {
                setReady(true);
            }
        })
            .catch((reason) => {
            console.error("failure", reason);
        });
        return React.createElement(React.Fragment, null);
    }
    return React.createElement(Wrapper, null);
}
exports.renderWidget = renderWidget;
async function computeFutures(widget) {
    const promises = new Map();
    // 并发计算
    for (const [k, future] of widget.futures.entries()) {
        promises.set(k, computeFuture(future));
    }
    for (const [k, promise] of promises.entries()) {
        Reflect.set(widget, k, await promise);
    }
}
async function computeFuture(future) {
    const scene = new entity_archetype_1.Scene({
        remoteService: Widget.remoteService,
        database: Widget.database,
        operation: currentOperation(),
    });
    return await future.get(scene);
}
//# sourceMappingURL=Widget.js.map