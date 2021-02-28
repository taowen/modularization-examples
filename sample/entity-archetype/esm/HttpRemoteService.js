export class HttpRemoteService {
    useGateway(scene, project) {
        return new Proxy({}, {
            get: (target, propertyKey, receiver) => {
                project = project || scene.operation.props.project;
                return callViaHttp.bind(undefined, project, propertyKey);
            },
        });
    }
}
async function callViaHttp(project, command, ...args) {
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
//# sourceMappingURL=HttpRemoteService.js.map