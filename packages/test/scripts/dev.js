/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

const config = webpackConfig(false);

webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error(err || stats.toString('errors-only'));
        process.exit(1);
    } else {
        console.log('Webpack build completed successfully');
    }
});
