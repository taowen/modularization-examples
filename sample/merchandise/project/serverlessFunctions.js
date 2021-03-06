require('./backend')
const { handleCall, handleBatchCall } = require('@stableinf/io');
SERVERLESS.functions.handleBatchCall = handleBatchCall.bind(undefined, SERVERLESS);
require('@motherboard/Sell/Private/Product');
require('@motherboard/Sell/Private/UnpublishProducts');
require('@motherboard/Sell/Private/XszkPromotion');
SERVERLESS.functions.loadProduct = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.loadProduct);
SERVERLESS.functions.publishedProducts = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.publishedProducts);
SERVERLESS.functions.batchLoadProducts = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.batchLoadProducts);
SERVERLESS.functions.draftProductCountOfCategory = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.draftProductCountOfCategory);
SERVERLESS.functions.unpublishProducts = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/Product').Product.unpublishProducts);
SERVERLESS.functions.listActiveXszkPromotions = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Sell/Private/XszkPromotion').XszkPromotion.listActiveXszkPromotions);