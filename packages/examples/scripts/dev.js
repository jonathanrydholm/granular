/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

const getEntryPoint = () => {
    switch (process.env.EXAMPLE) {
        case 'watcher': {
            return './src/watcher/index.ts';
        }
        case 'restful': {
            return './src/restful/index.ts';
        }
        case 'startup_order': {
            return './src/startup_order/index.ts';
        }
        case 'graphql': {
            return './src/graphql/index.ts';
        }
        default: {
            return './src/index.ts';
        }
    }
};

const config = webpackConfig(false, getEntryPoint());

webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error(err || stats.toString('errors-only'));
        process.exit(1);
    } else {
        console.log('Webpack build completed successfully');
    }
});
