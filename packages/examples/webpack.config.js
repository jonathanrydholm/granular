/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = (production, entry) => ({
    context: __dirname,
    target: 'node',
    externalsPresets: { node: true },
    mode: production ? 'production' : 'development',
    entry,
    performance: {
        hints: false,
    },
    watch: !production,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
        new NodemonPlugin({
            script: './dist/bundle.js',
            watch: path.resolve('./dist'),
            env: process.env,
        }),
    ],
});
