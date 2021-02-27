// default to call current project server
export function use(project) {
    return new Proxy({}, {
        get(target, propertyKey, receiver) {
            project = project || window.PROJECT;
            return rpcMethod.bind(undefined, project, propertyKey);
        },
    });
}
// @internal
export async function awaitRpc(obj) {
    for (const [k, v] of Object.entries(obj)) {
        if (v && v["then"]) {
            Reflect.set(obj, k, await v);
        }
    }
}
async function rpcMethod(project, command, args) {
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
//# sourceMappingURL=use.js.map