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

// 展示界面，其数据来自两部分
// 父组件传递过来的 props
// 从 I/O 获得的外部状态，保存在 futures 里
export abstract class Widget {
  public static database: Database;
  public static remoteService: RemoteService;
  public unmounted?: boolean;
  // 外部状态
  public futures: Map<string, Future> = new Map();
  // 父组件传入的 props
  constructor(public props?: Record<string, any>) {}

  // 如果 Widget 需要有一条对应的数据在本地数据库里，在这里做数据同步
  // 每次访问 I/O 刷新外部状态之前会调用一次
  // 组件被卸载之后会调用一次（一般是删掉对应的记录）
  public syncData: (scene: Scene) => Promise<void> | undefined;
  // react 的钩子不能写在 render 里，比如写在这里
  public setupHooks(): any {}
  // 当外部状态获取完毕之后，会调用 render
  public abstract render(
    hooks: ReturnType<this["setupHooks"]>
  ): React.ReactElement;

  // 声明一份对外部状态的依赖
  protected future<T>(compute: (scene: Scene) => Promise<T>): T {
    return new Future(compute) as any;
  }

  // 外部状态发生了变化，触发重渲染
  public notifyChange() {}

  public unmount() {
    this.unmounted = true;
    for (const future of this.futures.values()) {
      future.dispose();
    }
    this.futures.clear();
    if (this.syncData) {
      this.syncData(
        new Scene({
          database: Widget.database,
          remoteService: Widget.remoteService,
          operation: newOperation("unmount component"),
        })
      );
    }
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
      // afterMounted
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
      return () => {
        widget.unmount();
      };
    });
    const hooks = widget.setupHooks();
    if (isReady === true) {
      return widget.render(hooks);
    }
    return <></>;
  }
  return <Wrapper />;
}

async function computeFutures(widget: Widget) {
  if (widget.syncData) {
    await widget.syncData(
      new Scene({
        remoteService: Widget.remoteService,
        database: Widget.database,
        operation: newOperation("sync scene"),
      })
    );
  }
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
