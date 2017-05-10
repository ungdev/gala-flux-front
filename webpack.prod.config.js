const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.ejs',
    filename: 'index.html',
    favicon: './src/assets/images/flux_logos/flux_favico.ico',
    inject: 'body',
    hash: true,
});
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve('dist'),
        filename: 'app.js',
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                include: /flexboxgrid/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?sourceMap!sass-loader?sourceMap'
                })
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(ico|svg|png|wav)$/,
                loader: 'file-loader?name=assets/[name].[ext]'
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
                FLUX_API_URI: JSON.stringify(process.env.FLUX_API_URI),
                TRAVIS_REPO_SLUG: JSON.stringify(process.env.TRAVIS_REPO_SLUG),
                TRAVIS_BRANCH: JSON.stringify(process.env.TRAVIS_BRANCH),
                TRAVIS_COMMIT: JSON.stringify(process.env.TRAVIS_COMMIT),
                DOKKU_APP_NAME: JSON.stringify(process.env.DOKKU_APP_NAME),
            }
        }),
        new UglifyJSPlugin({
            minimize: true,
            compress: {
                warnings: true
            }
        }),
        HtmlWebpackPluginConfig,
        new ExtractTextPlugin({
            filename: 'public/style.css',
            allChunks: true
        })
    ],
    resolve: {
        modules: [
            path.resolve('src'),
            path.resolve('node_modules')
        ]
    },
};
