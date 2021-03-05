const { InMemDatabase, ServerlessClient, handleBatchCall, handleCall, Scene } = require('@stableinf/io');
const { Product } = require('./server/Sell/Private/Product');
const { XszkPromotion } = require('./server/Sell/Private/XszkPromotion');

SERVERLESS.sceneConf = {
    database: new InMemDatabase(),
    serviceProtocol: new ServerlessClient(SERVERLESS.functions),
};

SERVERLESS.insertTestData = async function () {
    const scene = new Scene({ ...SERVERLESS.sceneConf, operation: {} });
    await scene.insert(Product, { name: 'apple' });
};

SERVERLESS.functions.handleBatchCall = handleBatchCall.bind(undefined, SERVERLESS.sceneConf);
SERVERLESS.functions.loadProduct = handleCall.bind(undefined, SERVERLESS.sceneConf, Product.loadProduct);
SERVERLESS.functions.listActiveXszkPromotions = handleCall.bind(undefined, SERVERLESS.sceneConf, XszkPromotion.listActiveXszkPromotions);