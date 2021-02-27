type Await<T> = T extends Promise<infer U> ? U : T;

type MethodsOf<T> = {
  [P in keyof T]: T[P] extends (...a: any) => any ? P : never;
}[keyof T];

// default to call current project server
export function use<T>(
  project?: string
): {
  [P in MethodsOf<T>]: (...a: Parameters<T[P]>) => Await<ReturnType<T[P]>>;
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

// @internal
export async function awaitRpc(obj: object) {
  for (const [k, v] of Object.entries(obj)) {
    if (v && v["then"]) {
      Reflect.set(obj, k, await v);
    }
  }
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
