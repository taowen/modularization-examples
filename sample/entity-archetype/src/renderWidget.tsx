import { Widget } from "./Widget";
import * as React from 'react';
import { awaitRpc } from "./use";

export function renderWidget<T extends new (props: P)=> Widget, P>(widgetClass: T, props?: P) {
    const widget = new widgetClass(props as any);
    const promise = awaitRpc(widget);
    function Wrapper() {
        React.useEffect(() => {
            return () => {
                widget.unmounted = true;
            }
        })
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
        })
        return <></>;
    }
    return <Wrapper />
}