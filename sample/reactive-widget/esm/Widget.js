import * as React from "react";
import * as ReactDOM from "react-dom";
import { HttpRemoteService, Scene, } from "@autonomy/entity-archetype";
import { enableDependencyTracking, Future } from "./Future";
import * as tracing from "scheduler/tracing";
// 展示界面
export class Widget {
    constructor(props) {
        this.props = props;
        this.futures = new Map();
    }
    setup() { }
    renderWidget(widgetClass, props) {
        return renderWidget(widgetClass, props);
    }
    future(compute) {
        return new Future(compute);
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
export function renderRootWidget(widgetClass, options) {
    HttpRemoteService.project = options.project;
    Widget.database = options.database;
    Widget.remoteService = options.remoteService;
    enableDependencyTracking();
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
export function renderWidget(widgetClass, props) {
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
            if (v && v instanceof Future) {
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
    const scene = new Scene({
        remoteService: Widget.remoteService,
        database: Widget.database,
        operation: currentOperation(),
    });
    return await future.get(scene);
}
//# sourceMappingURL=Widget.js.map