import { WidgetClass } from "./Widget";
import * as ReactDOM from 'react-dom';
import { renderWidget } from "./renderWidget";

export function renderRootWidget(widgetClass: WidgetClass) {
    const elem = document.getElementById('RootWidget');
    if (!elem) {
        console.error('missing element #RootWidget');
        return;
    }
    ReactDOM.render(renderWidget(widgetClass as any), elem);
}