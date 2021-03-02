const {
  HttpXClient,
  InMemDatabase,
} = require("@autonomy/entity-archetype");
const { renderRootWidget } = require("@autonomy/reactive-widget");
const { HomePage } = require("./client/Home/Ui/HomePage");

HttpXClient.project = "@merchandise/project";
renderRootWidget(HomePage, {
  serviceProtocol: new HttpXClient(),
  database: new InMemDatabase(),
});
