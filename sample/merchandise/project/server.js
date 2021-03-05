const { HttpXClient, InMemDatabase, Scene } = require('@stableinf/io');
const { Product } = require('./server/Sell/Private/Product');

SERVERLESS.configureMemCloud = async function () {
    const serviceProtocol = new HttpXClient();
    const database = new InMemDatabase();
    await insertTestData(
        new Scene({
            serviceProtocol,
            database,
            operation: {},
        }),
    );
    return { serviceProtocol, database };
};

async function insertTestData(scene) {
    await scene.insert(Product, { name: 'apple' });
}
