import * as React from "react";
import * as ReactDOM from "react-dom";
// 展示界面
export class Widget {
    constructor(props) {
        this.props = props;
    }
}
export function renderRootWidget(widgetClass) {
    const elem = document.getElementById("RootWidget");
    if (!elem) {
        console.error("missing element #RootWidget");
        return;
    }
    ReactDOM.render(renderWidget(widgetClass), elem);
}
export function renderWidget(widgetClass, props) {
    const widget = new widgetClass(props);
    const promise = awaitRpc(widget);
    function Wrapper() {
        React.useEffect(() => {
            return () => {
                widget.unmounted = true;
            };
        });
        const rendered = widget.render();
        const [isReady, setReady] = React.useState(false);
        if (isReady) {
            return rendered;
        }
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
async function awaitRpc(obj) {
    for (const [k, v] of Object.entries(obj)) {
        if (v && v["then"]) {
            Reflect.set(obj, k, await v);
        }
    }
}
//# sourceMappingURL=Widget.js.map