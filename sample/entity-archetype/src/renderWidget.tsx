import { Widget } from "./Widget";
import * as React from 'react';
import { withRpc } from "./use";

export function renderWidget<T extends new (props?: P)=> Widget, P>(widgetClass: T, props?: P) {
    const widgetPromise = withRpc(() => new widgetClass(props));
    function Wrapper() {
        const [widget, setWidget] = React.useState<Widget>();
        if (!widget) {
            widgetPromise.then((widget) => {
                setWidget(widget);
            }).catch((reason) => {
                console.error('failure', reason);
            })
            return <></>;
        }
        return widget.render();
    }
    return <Wrapper />
}