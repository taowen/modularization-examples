const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectDir = path.dirname(require.resolve(`${process.env.PROJECT}/package.json`));

module.exports = {
    context: projectDir,
    entry: './client.js',
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(projectDir, 'index.html'),
        }),
    ],
    devServer: {
        proxy: {
            '/call': `http://127.0.0.1:3000`,
        },
    },
};
