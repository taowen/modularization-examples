import * as React from "react";
import * as ReactDOM from "react-dom";

// 展示界面
export abstract class Widget {
  public unmounted?: boolean;
  constructor(public props?: Record<string, any>) {}
  public abstract render(): React.ReactElement;
}

export type WidgetClass = Function & {
  new (props?: Record<string, any>): Widget;
};

export function renderRootWidget(widgetClass: WidgetClass) {
  const elem = document.getElementById("RootWidget");
  if (!elem) {
    console.error("missing element #RootWidget");
    return;
  }
  ReactDOM.render(renderWidget(widgetClass as any), elem);
}

export function renderWidget<T extends new (props: P) => Widget, P>(
  widgetClass: T,
  props?: P
) {
  const widget = new widgetClass(props as any);
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
    return <></>;
  }
  return <Wrapper />;
}

async function awaitRpc(obj: object) {
  for (const [k, v] of Object.entries(obj)) {
    if (v && v["then"]) {
      Reflect.set(obj, k, await v);
    }
  }
}
