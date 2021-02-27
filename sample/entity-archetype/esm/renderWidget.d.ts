/// <reference types="react" />
import { Widget } from "./Widget";
export declare function renderWidget<T extends new (props: P) => Widget, P>(widgetClass: T, props?: P): JSX.Element;
