// 用 esbuild 代替 ts-node
const pirates = require('pirates');
const esbuild = require('esbuild');

pirates.addHook(
    (code, filePath) => {
        const result = esbuild.transformSync(code, {
            loader: filePath.endsWith('.tsx') ? 'tsx' : 'ts',
            format: 'cjs',
        });
        if (result.warnings && result.warnings.length) {
            console.error(result.warnings);
            return '';
        }
        return result.code;
    },
    { exts: ['.ts', '.tsx'], ignoreNodeModules: false },
);

const { Scene, InMemDatabase, HttpXClient, newOperation } = require('@stableinf/io');
const { enableChangeNotification } = require('./Future');

function should(behavior, func) {
    return async function() {
        const scene = enableChangeNotification(new Scene({
            database: new InMemDatabase(),
            serviceProtocol: new HttpXClient(),
            operation: newOperation('test'),
        }));
        return scene.execute(this, func);
    };
}

const assert = require('assert');

should.eq = (expected, actual, message) => {
    assert.strictEqual(actual, expected, message)
}

module.exports = should;