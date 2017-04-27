const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body'
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
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
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
    ]
};
