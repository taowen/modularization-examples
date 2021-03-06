const { InMemDatabase, ServerlessClient } = require('@stableinf/io');

SERVERLESS.sceneConf = {
    database: new InMemDatabase(),
    serviceProtocol: new ServerlessClient(SERVERLESS),
};