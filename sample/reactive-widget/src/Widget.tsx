import * as React from "react";
import * as ReactDOM from "react-dom";
import { Scene } from '@autonomy/entity-archetype';

// 展示界面
export abstract class Widget {
  public unmounted?: boolean;
  constructor(
    public readonly scene: Scene,
    public props?: Record<string, any>
  ) {}
  public abstract render(): React.ReactElement;

  protected renderWidget<T extends Widget>(
    widgetClass: WidgetClass<T>,
    props?: T["props"]
  ) {
    return renderWidget(this.scene, widgetClass, props);
  }
}

export type WidgetClass<T extends Widget = any> = Function & {
  new (scene: Scene, props?: Record<string, any>): T;
};

export function renderRootWidget(scene: Scene, widgetClass: WidgetClass) {
  const elem = document.getElementById("RootWidget");
  if (!elem) {
    console.error("missing element #RootWidget");
    return;
  }
  ReactDOM.render(renderWidget(scene, widgetClass as any), elem);
}

export function renderWidget<T extends Widget>(
  scene: Scene,
  widgetClass: WidgetClass<T>,
  props?: T["props"]
) {
  const widget = new widgetClass(scene, props as any);
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
