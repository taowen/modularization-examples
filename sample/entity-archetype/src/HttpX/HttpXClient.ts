import { Scene, ServiceProtocol } from "../Scene";

export class HttpXClient implements ServiceProtocol {
  public static project: string;
  public useServices(scene: Scene, project?: string) {
    return new Proxy(
      {},
      {
        get: (target: object, propertyKey: string, receiver?: any) => {
          project = project || HttpXClient.project;
          return callViaHttp.bind(undefined, project!, propertyKey);
        },
      }
    ) as any;
  }
}

async function callViaHttp(project: string, service: string, ...args: any[]) {
  const result = await fetch("/call", {
    method: "POST",
    headers: {
      "X-Project": project,
    },
    body: JSON.stringify({
      service,
      args,
    }),
  });
  const resultJson = await result.json();
  if (resultJson.error) {
    throw resultJson.error;
  }
  return resultJson.data;
}
