const { Product } = require('@motherboard/Sell/Private/Product');

SERVERLESS.insertTestData = async function (scene) {
    await scene.insert(Product, { name: 'apple' });
};
