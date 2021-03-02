const http = require('http');
const path = require('path');

const project = process.argv[2];
if (!project) {
  console.error("must specify project to start");
  process.exit(1);
}

async function main() {
  const projectDir = path.dirname(require.resolve(`${project}/package.json`));
  const models = require(path.join(
    projectDir,
    "server",
    "models.json"
  ));
  const services = new Map();
  for (const model of models) {
    for (const service of model.services || []) {
      const serviceClass = require(`${project}/server/${model.qualifiedName}`)[path.basename(model.qualifiedName)];
      services.set(service, serviceClass);
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
      const { service, args } = JSON.parse(reqBody) || {};
      const serviceClass = services.get(service);
      if (!serviceClass) {
        console.error("can not find handler", reqBody);
        resp.end(JSON.stringify({ error: "handler not found" }));
        return;
      }
      const operation = {};
      try {
        const result = await handle(
          operation,
          Reflect.get(serviceClass, service),
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
