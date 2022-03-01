const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProMode = process.env.NODE_ENV === 'production'

module.exports = {
    mode: isProMode ? 'production' : 'development',
    entry: {
        3: path.resolve(__dirname, 'js/3.js'),
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'pages/[name].[fullhash].js',
        clean: true,
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            filename: "3.html",
            template: path.resolve(__dirname, 'pages/3.html'),
        }),
    ],
    devServer: {
        port: 3000,
        hot: true,
        static: path.resolve(__dirname, 'public')
    },
};
