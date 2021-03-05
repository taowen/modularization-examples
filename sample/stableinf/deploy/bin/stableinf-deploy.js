// 用 esbuild 代替 ts-node
const pirates = require('pirates');
const esbuild = require('esbuild');

pirates.addHook(
    (code, filePath) => {
        const result = esbuild.transformSync(code, {
            loader: 'ts',
            format: 'cjs',
        });
        if (result.warnings && result.warnings.length) {
            console.error(result.warnings);
            return '';
        }
        return result.code;
    },
    { exts: ['.ts'], ignoreNodeModules: false },
);

// 启动 typescript 写的代码
require('../src/stableinf-deploy');
