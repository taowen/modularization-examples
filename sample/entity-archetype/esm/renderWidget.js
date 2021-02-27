import * as React from 'react';
import { withRpc } from "./use";
export function renderWidget(widgetClass, props) {
    const widgetPromise = withRpc(() => new widgetClass(props));
    function Wrapper() {
        const [widget, setWidget] = React.useState();
        if (!widget) {
            widgetPromise.then((widget) => {
                setWidget(widget);
            }).catch((reason) => {
                console.error('failure', reason);
            });
            return React.createElement(React.Fragment, null);
        }
        return widget.render();
    }
    return React.createElement(Wrapper, null);
}
//# sourceMappingURL=renderWidget.js.map