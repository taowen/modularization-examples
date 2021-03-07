require('./backend')
const { handleCall, handleBatchCall } = require('@stableinf/io');
SERVERLESS.functions.handleBatchCall = handleBatchCall.bind(undefined, SERVERLESS);
require('@motherboard/Home/Private/Counter');
require('@motherboard/Home/Private/GreetingWordsGateway');
require('@motherboard/Home/Private/TaskGateway');
SERVERLESS.functions.queryCounters = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Home/Private/Counter').Counter.queryCounters);
SERVERLESS.functions.insertCounter = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Home/Private/Counter').Counter.insertCounter);
SERVERLESS.functions.incrementCounter = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Home/Private/Counter').Counter.incrementCounter);
SERVERLESS.functions.decrementCounter = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Home/Private/Counter').Counter.decrementCounter);
SERVERLESS.functions.getGreetingWords = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Home/Private/GreetingWordsGateway').GreetingWordsGateway.getGreetingWords);
SERVERLESS.functions.wasteSomeResource = handleCall.bind(undefined, SERVERLESS, require('@motherboard/Home/Private/TaskGateway').TaskGateway.wasteSomeResource);