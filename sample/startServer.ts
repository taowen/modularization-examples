import * as http from "http";
import * as path from "path";
import { GatewayClass } from "@autonomy-design-sample/entity-archetype";

const project = process.argv[2];
if (!project) {
  console.error("must specify project to start");
  process.exit(1);
}

export function main() {
  const projectDir = path.dirname(require.resolve(`${project}/package.json`));
  const { gateways } = require(path.join(projectDir, "server", "gateways.js"));
  const commands = new Map<string, GatewayClass>();
  for (const gatewayClass of gateways) {
    for (const command of Object.getOwnPropertyNames(gatewayClass.prototype)) {
      if (command === "constructor") {
        continue;
      }
      commands.set(command, gatewayClass);
    }
  }
  const server = http.createServer((req, resp) => {
    let reqBody = "";
    req.on("data", (chunk) => {
      reqBody += chunk;
    });
    req.on("end", () => {
      const { command, args } = JSON.parse(reqBody) || {};
      const gatewayClass = commands.get(command);
      if (!gatewayClass) {
        console.error("can not find handler", reqBody);
        return;
      }
      (async () => {
        try {
          const result = await Reflect.get(
            new gatewayClass(),
            command
          )(...args);
          resp.end(JSON.stringify({ data: result }));
        } catch (e) {
          resp.end(JSON.stringify({ error: new String(e) }));
        }
      })();
    });
  });
  server.listen(3000);
  console.log(`${project} server started @3000`);
}

main();
