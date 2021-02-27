import * as http from 'http';
import * as path from 'path';
import { GatewayClass } from '@autonomy-design-sample/entity-archetype';

const project = process.argv[2];
if (!project) {
    console.error('must specify project to start');
    process.exit(1);
}

export function main(){
    const projectDir = path.dirname(require.resolve(`${project}/package.json`));
    const { gateways } = require(path.join(projectDir, 'server', 'gateways.js'));
    const rpcMethods = new Map<string, GatewayClass>();
    for (const gatewayClass of gateways) {
        for (const rpcMethod of Object.getOwnPropertyNames(gatewayClass.prototype)) {
            if (rpcMethod === 'constructor') {
                continue;
            }
            rpcMethods.set(rpcMethod, gatewayClass);
        }
    }
    const server = http.createServer((req, resp) => {
        resp.end('hello');
    });
    server.listen(8080);
    console.log('@8080');
}

main();