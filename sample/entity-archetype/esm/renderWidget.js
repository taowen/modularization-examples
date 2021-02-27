import * as React from 'react';
import { awaitRpc } from "./use";
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
        promise.then(() => {
            if (!widget.unmounted) {
                setReady(true);
            }
        }).catch((reason) => {
            console.error('failure', reason);
        });
        return React.createElement(React.Fragment, null);
    }
    return React.createElement(Wrapper, null);
}
//# sourceMappingURL=renderWidget.js.map