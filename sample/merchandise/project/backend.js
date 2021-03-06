const { InMemDatabase, ServerlessClient, Scene } = require('@stableinf/io');
const { Product } = require('@motherboard/Sell/Private/Product');

SERVERLESS.sceneConf = {
    database: new InMemDatabase(),
    serviceProtocol: new ServerlessClient(SERVERLESS),
};

SERVERLESS.insertTestData = async function () {
    const scene = new Scene({ ...SERVERLESS.sceneConf, operation: {} });
    await scene.insert(Product, { name: 'apple' });
};
