const http = require('http');
const path = require('path');

const project = process.argv[2];
if (!project) {
  console.error("must specify project to start");
  process.exit(1);
}

async function main() {
  const projectDir = path.dirname(require.resolve(`${project}/package.json`));
  const { gateways: gatewayClasses } = require(path.join(
    projectDir,
    "server",
    "gateways.js"
  ));
  const commands = new Map();
  for (const gatewayClass of gatewayClasses) {
    const gateway = new gatewayClass();
    for (const command of Object.getOwnPropertyNames(gatewayClass.prototype)) {
      if (command === "constructor") {
        continue;
      }
      commands.set(command, gateway);
    }
    for (const command of Object.keys(gateway)) {
      commands.set(command, gateway);
    }
  }
  const { start } = require(path.join(projectDir, "server.js"));
  const handle = await start();
  const server = http.createServer((req, resp) => {
    let reqBody = "";
    req.on("data", (chunk) => {
      reqBody += chunk;
    });
    req.on("end", async () => {
      const { command, args } = JSON.parse(reqBody) || {};
      const gateway = commands.get(command);
      if (!gateway) {
        console.error("can not find handler", reqBody);
        resp.end(JSON.stringify({ error: "handler not found" }));
        return;
      }
      const operation = {};
      try {
        const result = await handle(
          operation,
          Reflect.get(gateway, command),
          args
        );
        resp.end(JSON.stringify({ data: result }));
      } catch (e) {
        console.error(`failed to handle: ${reqBody}\n`, e);
        resp.end(JSON.stringify({ error: new String(e) }));
      }
    });
  });
  server.listen(3000);
  console.log(`${project} server started @3000`);
}

main();
