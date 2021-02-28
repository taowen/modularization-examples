const {
  Scene,
  DUMMY_DATABASE,
  HttpRemoteService,
} = require("@autonomy/entity-archetype");
const { renderRootWidget } = require("@autonomy/reactive-widget");
const { HomePage } = require("./client/Home/Ui/HomePage");

const scene = new Scene({
  database: DUMMY_DATABASE,
  remoteService: new HttpRemoteService(),
  operation: {
    traceOp: `initial render ${window.location.href}`,
    props: {
      project: "@merchandise/project",
    },
  },
});
renderRootWidget(scene, HomePage);
