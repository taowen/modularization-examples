const path = require('path');
const { HttpXServer } = require('@stableinf/cloud-mem');

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
  new HttpXServer(await start({ services })).listen(3000);
  console.log(`${project} server started @3000`);
}

main();
