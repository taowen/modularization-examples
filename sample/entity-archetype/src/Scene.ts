import type { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import type { ConstructorType } from "./ConstructorType";
import type { MethodsOf } from "./MethodsOf";
import type { Gateway } from "./Gateway";

type Await<T> = T extends Promise<infer U> ? U : T;

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

// 提供对各种 ActiveRecord 的增删改查，适配各种类型的关系数据库
export interface Database {
  insert<T extends ActiveRecord>(
    scene: Scene,
    activeRecordClass: ActiveRecordClass<T>,
    props: ConstructorType<T>
  ): Promise<T>;
  update<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
  delete<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
  // 只支持 = 和 AND
  queryByExample<T extends ActiveRecord>(
    scene: Scene,
    activeRecordClass: ActiveRecordClass<T>,
    props: Partial<T>
  ): Promise<T[]>;
  // 执行任意 SQL
  executeSql(
    scene: Scene,
    sql: string,
    sqlVars: Record<string, any>
  ): Promise<any[]>;
}

// 提供 RPC
export interface RemoteService {
  useGateway<T extends Gateway>(
    scene: Scene,
    project?: string
  ): {
    [P in MethodsOf<T>]: (
      ...a: Parameters<OmitFirstArg<T[P]>>
    ) => Await<ReturnType<T[P]>>;
  };
}

export interface Operation {
  // traceId, traceOp, baggage 会 RPC 透传
  traceId: string;
  traceOp: string;
  baggage: Record<string, any>;
  // 当前正在做什么操作，不会跨进程传递
  props: Record<string, any>;
}

// 同时每个异步执行流程会创建一个独立的 scene，例如 handle 一个 http 请求，处理一次鼠标点击
export class Scene {
  public readonly operation: Operation;
  public readonly database: Database;
  public readonly remoteService: RemoteService;
  constructor(options: {
    database: Database;
    remoteService: RemoteService;
    operation: Partial<Operation>;
  }) {
    this.database = options.database;
    this.remoteService = options.remoteService;
    this.operation = {
      traceId: "",
      traceOp: "",
      baggage: {},
      props: {},
      ...options.operation,
    };
  }
  public useGateway: OmitFirstArg<RemoteService["useGateway"]> = (project) => {
    return this.remoteService.useGateway(this, project);
  };
  public insert: OmitFirstArg<Database["insert"]> = (
    activeRecordClass,
    props
  ) => {
    return this.database.insert(this, activeRecordClass, props);
  };
  public update: OmitFirstArg<Database["update"]> = (activeRecord) => {
    return this.database.update(this, activeRecord);
  };
  public delete: OmitFirstArg<Database["delete"]> = (activeRecord) => {
    return this.database.delete(this, activeRecord);
  };
  public executeSql: OmitFirstArg<Database["executeSql"]> = (sql, sqlVars) => {
    return this.database.executeSql(this, sql, sqlVars);
  };
  public query<T extends ActiveRecord>(
    activeRecordClass: ActiveRecordClass<T>,
    props: Partial<T>
  ): Promise<T[]>;
  public query<T extends ActiveRecord, P>(
    sqlView: (scene: Scene, sqlVars: P) => Promise<T[]>,
    sqlVars: P
  ): Promise<T[]>;
  public query<T extends ActiveRecord>(
    sqlView: (scene: Scene, sqlVars: {}) => Promise<T[]>
  ): Promise<T[]>;
  public query(arg1: any, arg2?: any) {
    if (arg1.IS_ACTIVE_RECORD) {
      return this.database.queryByExample(this, arg1, arg2);
    }
    return arg1(this, arg2);
  }
  public toJSON() {
    return undefined;
  }
}

// 前端浏览器等场景里没有数据库
export const DUMMY_DATABASE: Database = {
  insert: () => {
    throw new Error("unsupported");
  },
  update: () => {
    throw new Error("unsupported");
  },
  delete: () => {
    throw new Error("unsupported");
  },
  queryByExample: () => {
    throw new Error("unsupported");
  },
  executeSql: () => {
    throw new Error("unsupported");
  },
};
