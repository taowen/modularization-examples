const {
  InMemDatabase,
  Scene,
  HttpServiceProtocol,
} = require("@autonomy/entity-archetype");
const { Product } = require("./server/Sell/Private/Product");

exports.start = async () => {
  const serviceProtocol = new HttpServiceProtocol();
  const database = new InMemDatabase();
  await insertTestData(serviceProtocol, database);
  return async (operation, handler, args) => {
    const scene = new Scene({
      database,
      serviceProtocol,
      operation,
    });
    return await handler(scene, ...(args || []));
  };
};

async function insertTestData(serviceProtocol, database) {
  const scene = new Scene({
    database,
    serviceProtocol,
    operation: {},
  });
  await database.insert(scene, Product, { name: "apple" });
}
