import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Database,
  HttpRemoteService,
  Operation,
  RemoteService,
  Scene,
} from "@autonomy/entity-archetype";
import { enableDependencyTracking, Future } from "./Future";
import * as tracing from "scheduler/tracing";

// 展示界面
export abstract class Widget {
  public static database: Database;
  public static remoteService: RemoteService;
  public futures: Map<string, Future> = new Map();
  public unmounted?: boolean;
  constructor(public props?: Record<string, any>) {}
  public setup(): any {}
  public abstract render(hooks: ReturnType<this['setup']>): React.ReactElement;

  protected renderWidget<T extends Widget>(
    widgetClass: WidgetClass<T>,
    props?: T["props"]
  ) {
    return renderWidget(widgetClass, props);
  }

  protected future<T>(compute: (scene: Scene) => Promise<T>): T {
    return new Future(compute) as any;
  }

  public notifyChange() {}

  public unmount() {
    this.unmounted = true;
    for (const future of this.futures.values()) {
      future.dispose();
    }
    this.futures.clear();
  }
}

export type WidgetClass<T extends Widget = any> = Function & {
  new (scene: Scene, props?: Record<string, any>): T;
};

function newOperation(traceOp: string): Operation {
  return {
    traceId: "123",
    traceOp,
    baggage: {},
    props: {},
  };
}

function currentOperation(): Operation {
  const interactions = tracing.unstable_getCurrent();
  if (!interactions) {
    throw new Error("missing operation");
  }
  for (const interaction of interactions) {
    const maybeOp = interaction.name as any;
    if (maybeOp && maybeOp.traceId) {
      return maybeOp;
    }
  }
  throw new Error("missing operation");
}

export function renderRootWidget(
  widgetClass: WidgetClass,
  options: { project: string; database: Database; remoteService: RemoteService }
) {
  HttpRemoteService.project = options.project;
  Widget.database = options.database;
  Widget.remoteService = options.remoteService;
  enableDependencyTracking();
  const elem = document.getElementById("RootWidget");
  if (!elem) {
    console.error("missing element #RootWidget");
    return;
  }
  const operation = newOperation(`initial render ${window.location.href}`);
  tracing.unstable_trace(operation as any, 0, () => {
    ReactDOM.render(renderWidget(widgetClass as any), elem);
  });
}

export function renderWidget<T extends Widget>(
  widgetClass: WidgetClass<T>,
  props?: T["props"]
) {
  function Wrapper() {
    const [widget, _] = React.useState(() => new widgetClass(props as any));
    const [isReady, setReady] = React.useState(false);
    React.useEffect(() => {
      return () => {
        widget.unmount();
      };
    });
    const hooks = widget.setup();
    if (isReady === true) {
      return widget.render(hooks);
    }
    for (const [k, v] of Object.entries(widget)) {
      if (v && v instanceof Future) {
        widget.futures.set(k, v);
      }
    }
    const promise = computeFutures(widget);
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

async function computeFutures(widget: Widget) {
  const promises = new Map<string, Promise<any>>();
  // 并发计算
  for (const [k, future] of widget.futures.entries()) {
    promises.set(k, computeFuture(future));
  }
  for (const [k, promise] of promises.entries()) {
    Reflect.set(widget, k, await promise);
  }
}

async function computeFuture(future: Future) {
  const scene = new Scene({
    remoteService: Widget.remoteService,
    database: Widget.database,
    operation: currentOperation(),
  });
  return await future.get(scene);
}
