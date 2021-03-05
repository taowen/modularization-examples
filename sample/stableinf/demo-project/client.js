const {
  HttpXClient,
  InMemDatabase,
} = require("@stableinf/io");
const { renderRootWidget } = require("@stableinf/io-react");
const { HomePage } = require("./client/Home/Ui/HomePage");

HttpXClient.project = "@stableinf/demo-project";
renderRootWidget(HomePage, {
  serviceProtocol: new HttpXClient(),
  database: new InMemDatabase(),
});
