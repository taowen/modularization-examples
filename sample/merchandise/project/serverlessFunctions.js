require('./backend')

const { handleCall, handleBatchCall, InMemDatabase, ServerlessClient, Scene, newOperation } = require('@stableinf/io');
SERVERLESS.functions.handleBatchCall = handleBatchCall.bind(undefined, SERVERLESS);
SERVERLESS.sceneConf = {
    database: new InMemDatabase(),
    serviceProtocol: new ServerlessClient(SERVERLESS),
};
if (SERVERLESS.insertTestData) {
    const scene = new Scene({...SERVERLESS.sceneConf, operation: newOperation('initTestData')});
    scene.execute(undefined, SERVERLESS.insertTestData);
}
require('@motherboard/Sell/Private/Product');
require('@motherboard/Sell/Private/UnpublishProducts');
require('@motherboard/Sell/Private/XszkPromotion');
SERVERLESS.functions.loadProduct = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.loadProduct);
SERVERLESS.functions.publishedProducts = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.publishedProducts);
SERVERLESS.functions.batchLoadProducts = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.batchLoadProducts);
SERVERLESS.functions.draftProductCountOfCategory = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.draftProductCountOfCategory);
SERVERLESS.functions.unpublishProducts = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.unpublishProducts);
SERVERLESS.functions.listActiveXszkPromotions = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/XszkPromotion').XszkPromotion.listActiveXszkPromotions);