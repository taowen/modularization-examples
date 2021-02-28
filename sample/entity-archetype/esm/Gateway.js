// rpc 接口声明，把实现委托给 ActiveRecord 和 Command
export class Gateway {
}
// default to call current project server
export function use(project) {
    return new Proxy({}, {
        get(target, propertyKey, receiver) {
            project = project || window.PROJECT;
            return rpcMethod.bind(undefined, project, propertyKey);
        },
    });
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
//# sourceMappingURL=Gateway.js.map