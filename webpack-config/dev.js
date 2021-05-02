const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve('./', 'public/main.ts'),
    output: {
        path: path.resolve('./', 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve('./', 'public'),
        historyApiFallback: true,
        inline: true,
        // host: 'localhost',
        host: '0.0.0.0',
        disableHostCheck: true,
        proxy: {
        },
    },
    module: {
        rules: [{
            test: /(.ts)$/,
            use: {
                loader: 'ts-loader'
            }
        }, {
            test: /(.js)$/,
            use: [{
                loader: 'babel-loader',
            }]
        }, {
            test: /(.js)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/,
            options: {
                configFile: './.eslintrc.js'
            }
        }]
    }
};