"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServiceProtocol = void 0;
class HttpServiceProtocol {
    useServices(scene, project) {
        return new Proxy({}, {
            get: (target, propertyKey, receiver) => {
                project = project || HttpServiceProtocol.project;
                return callViaHttp.bind(undefined, project, propertyKey);
            },
        });
    }
}
exports.HttpServiceProtocol = HttpServiceProtocol;
async function callViaHttp(project, service, ...args) {
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
//# sourceMappingURL=HttpServiceProtocol.js.map