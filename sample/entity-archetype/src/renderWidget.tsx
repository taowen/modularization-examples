import { Widget } from "./Widget";
import * as React from 'react';

export function renderWidget<T extends new (props?: P)=> Widget, P>(widgetClass: T, props?: P) {
    const widget = new widgetClass(props);
    return widget.render();
}