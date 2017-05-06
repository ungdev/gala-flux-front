const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.ejs',
    filename: 'index.html',
    inject: 'body',
    favicon: './src/assets/images/flux_logos/flux_favico.ico',
    hash: true,
});
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    devtool: 'eval-source-map',
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
    // sassLoader: {
    //     includePaths: [ 'src/styles' ]
    // },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development"),
                FLUX_API_URI: JSON.stringify(process.env.FLUX_API_URI)
            }
        }),
        HtmlWebpackPluginConfig,
        new ExtractTextPlugin({
            filename: 'public/style.css',
            allChunks: true
        })
    ]
};
