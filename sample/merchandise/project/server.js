const {
  InMemDatabase,
  Scene,
  HttpRemoteService,
} = require("@autonomy/entity-archetype");
const { Product } = require("./server/Sell/Public/Product");

exports.start = async () => {
  const remoteService = new HttpRemoteService();
  const database = new InMemDatabase();
  await insertTestData(remoteService, database);
  return async (operation, handler, args) => {
    const scene = new Scene({
      database,
      remoteService,
      operation,
    });
    return await handler(scene, ...(args || []));
  };
};

async function insertTestData(remoteService, database) {
  const scene = new Scene({
    database,
    remoteService,
    operation: {},
  });
  await database.insert(scene, Product, { name: "apple" });
}
