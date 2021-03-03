"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRemoteService = void 0;
class HttpRemoteService {
    useService(scene, project) {
        return new Proxy({}, {
            get: (target, propertyKey, receiver) => {
                project = project || HttpRemoteService.project;
                return callViaHttp.bind(undefined, project, propertyKey);
            },
        });
    }
}
exports.HttpRemoteService = HttpRemoteService;
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