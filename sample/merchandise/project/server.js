const {
  InMemDatabase,
  Scene,
  HttpXClient,
} = require("@autonomy/io");
const { Product } = require("./server/Sell/Private/Product");

exports.start = async (options) => {
  const serviceProtocol = new HttpXClient();
  const database = new InMemDatabase();
  await insertTestData(serviceProtocol, database);
  return { ...options, database, serviceProtocol };
};

async function insertTestData(serviceProtocol, database) {
  const scene = new Scene({
    database,
    serviceProtocol,
    operation: {},
  });
  await database.insert(scene, Product, { name: "apple" });
}
