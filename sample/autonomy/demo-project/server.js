const {
  InMemDatabase,
  HttpXClient,
} = require("@autonomy/io");

exports.start = async (options) => {
  const serviceProtocol = new HttpXClient();
  const database = new InMemDatabase();
  return { ...options, database, serviceProtocol };
};