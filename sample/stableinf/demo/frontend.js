const { HttpXClient, InMemDatabase, Scene } = require('@stableinf/io');
const { renderRootWidget } = require('@stableinf/rx-react');
const { HomePage } = require('@motherboard/Home/Ui/HomePage');

Scene.currentProject = '@stableinf/demo-project';
renderRootWidget(HomePage, {
    serviceProtocol: new HttpXClient(),
    database: new InMemDatabase(),
});
