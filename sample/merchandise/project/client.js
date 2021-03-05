const {
  HttpXClient,
  InMemDatabase,
} = require("@stableinf/io");
const { renderRootWidget } = require("@stableinf/rx-react");
const { HomePage } = require("./client/Home/Ui/HomePage");

HttpXClient.project = "@merchandise/project";
renderRootWidget(HomePage, {
  serviceProtocol: new HttpXClient(),
  database: new InMemDatabase(),
});