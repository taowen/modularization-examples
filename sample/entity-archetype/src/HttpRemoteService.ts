import { RemoteService, Scene } from "./Scene";

export class HttpRemoteService implements RemoteService {
  public static project: string;
  public useGateway(scene: Scene, project?: string) {
    return new Proxy(
      {},
      {
        get: (target: object, propertyKey: string, receiver?: any) => {
          project = project || HttpRemoteService.project;
          return callViaHttp.bind(undefined, project!, propertyKey);
        },
      }
    ) as any;
  }
}

async function callViaHttp(project: string, command: string, ...args: any[]) {
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
