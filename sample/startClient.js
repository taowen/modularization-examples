const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectDir = path.dirname(require.resolve(`${process.env.PROJECT}/package.json`));

module.exports = {
    context: projectDir,
    entry: './entry.js',
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(projectDir, 'index.html'),
        }),
    ]
}