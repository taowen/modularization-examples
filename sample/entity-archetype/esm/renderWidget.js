import * as React from 'react';
import { withRpc } from "./use";
export function renderWidget(widgetClass, props) {
    function Wrapper() {
        const widgetPromise = withRpc(() => new widgetClass(props));
        const [widget, setWidget] = React.useState();
        widgetPromise.then((widget) => {
            setWidget(widget);
        }).catch((reason) => {
            console.error('failure', reason);
        });
        if (!widget) {
            return React.createElement(React.Fragment, null);
        }
        return widget.render();
    }
    return React.createElement(Wrapper, null);
}
//# sourceMappingURL=renderWidget.js.map