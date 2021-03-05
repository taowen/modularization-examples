const {
  InMemDatabase,
  HttpXClient,
} = require("@stableinf/io");

exports.start = async (options) => {
  const serviceProtocol = new HttpXClient();
  const database = new InMemDatabase();
  return { ...options, database, serviceProtocol };
};