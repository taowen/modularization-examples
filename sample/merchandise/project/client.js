const {
  HttpRemoteService,
  InMemDatabase,
} = require("@autonomy/entity-archetype");
const { renderRootWidget } = require("@autonomy/reactive-widget");
const { HomePage } = require("./client/Home/Ui/HomePage");

renderRootWidget(HomePage, {
  project: "@merchandise/project",
  remoteService: new HttpRemoteService(),
  database: new InMemDatabase(),
});
