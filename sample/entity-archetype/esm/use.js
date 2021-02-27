// default to call current project server
export function use(project) {
    project = project || window.PROJECT;
    return new Proxy({}, {
        get(target, propertyKey, receiver) {
            return rpcMethod.bind(undefined, project, propertyKey);
        },
    });
}
// @internal
export async function withRpc(createObject) {
    const obj = createObject();
    for (const [k, v] of Object.entries(obj)) {
        if (v && v['then']) {
            Reflect.set(obj, k, await v);
        }
    }
    return obj;
}
async function rpcMethod(project, command, args) {
    const result = await fetch("/call", {
        method: "POST",
        body: JSON.stringify({
            project,
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
//# sourceMappingURL=use.js.map