const {
  HttpXClient,
  InMemDatabase,
} = require("@autonomy/io");
const { renderRootWidget } = require("@autonomy/io-react");
const { HomePage } = require("./client/Home/Ui/HomePage");

HttpXClient.project = "@merchandise/project";
renderRootWidget(HomePage, {
  serviceProtocol: new HttpXClient(),
  database: new InMemDatabase(),
});
