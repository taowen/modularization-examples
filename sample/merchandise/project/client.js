const {
  HttpServiceProtocol,
  InMemDatabase,
} = require("@autonomy/entity-archetype");
const { renderRootWidget } = require("@autonomy/reactive-widget");
const { HomePage } = require("./client/Home/Ui/HomePage");

renderRootWidget(HomePage, {
  project: "@merchandise/project",
  serviceProtocol: new HttpServiceProtocol(),
  database: new InMemDatabase(),
});
