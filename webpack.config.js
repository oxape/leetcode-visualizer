const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProMode = process.env.NODE_ENV === 'production'

module.exports = {
    mode: isProMode ? 'production' : 'development',
    entry: {
        index: path.resolve(__dirname, 'js/index.js'),
        3: path.resolve(__dirname, 'js/3.js'),
        hello: path.resolve(__dirname, 'js/hello.js'),
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].[fullhash].js',
        clean: true,
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'index.html Development',
            filename: "index.html",
            template: path.resolve(__dirname, 'index.html'),
            chunks:['index']
        }),
        new HtmlWebpackPlugin({
            title: '3.html Development',
            filename: "pages/3.html",
            template: path.resolve(__dirname, 'pages/3.html'),
            chunks:['3']
        }),
        new HtmlWebpackPlugin({
            title: 'hello.html Development',
            filename: "pages/hello.html",
            template: path.resolve(__dirname, 'pages/hello.html'),
            chunks:['hello']
        }),
    ],
    devServer: {
        port: 3000,
        hot: true,
        static: path.resolve(__dirname, 'public')
    },
};
