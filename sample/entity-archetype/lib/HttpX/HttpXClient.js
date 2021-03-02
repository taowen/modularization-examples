"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpXClient = void 0;
class HttpXClient {
    useServices(scene, project) {
        return new Proxy({}, {
            get: (target, propertyKey, receiver) => {
                project = project || HttpXClient.project;
                return callViaHttp.bind(undefined, scene, project, propertyKey);
            },
        });
    }
}
exports.HttpXClient = HttpXClient;
async function callViaHttp(scene, project, service, ...args) {
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
    for (const table of resultJson.subscribed) {
        for (const subscriber of scene.subscribers) {
            subscriber.subscribe(table);
        }
    }
    for (const table of resultJson.changed) {
        scene.notifyChange(table);
    }
    return resultJson.data;
}
//# sourceMappingURL=HttpXClient.js.map