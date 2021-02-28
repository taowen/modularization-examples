import { MethodsOf } from "./MethodsOf";

// rpc 接口声明，把实现委托给 ActiveRecord 和 Command
export class Gateway {
}

export type GatewayClass = Function & { new (): Gateway }; 

type Await<T> = T extends Promise<infer U> ? U : T;

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

// default to call current project server
export function use<T>(
  project?: string
): {
  [P in MethodsOf<T>]: (...a: Parameters<OmitFirstArg<T[P]>>) => Await<ReturnType<T[P]>>;
} {
  return new Proxy(
    {},
    {
      get(target: object, propertyKey: string, receiver?: any): any {
        project = project || (window as any).PROJECT;
        return rpcMethod.bind(undefined, project!, propertyKey);
      },
    }
  ) as any;
}

async function rpcMethod(project: string, command: string, args: any[]) {
  const result = await fetch("/call", {
    method: "POST",
    headers: {
      "X-Project": project,
    },
    body: JSON.stringify({
      command,
      args,
    }),
  });
  const resultJson = await result.json();
  if (resultJson.error) {
    throw resultJson.error;
  }
  return resultJson.data;
}
