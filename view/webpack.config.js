const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry: './src/app.js', // 入口文件
    output: {
        filename: 'app.js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    plugins: [
        new cleanWebpackPlugin(['dist/*.*']),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                    plugins: [
                        ["import", {
                            "libraryDirectory": "es",
                            "libraryName": "antd",
                            "style": "css"
                        }],
                        ["@babel/plugin-proposal-class-properties"]
                    ]
                },
            }]
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    devServer: {
        publicPath: '/dist',
        port: 7000, // 端口
        // open: true, // 自动打开浏览器
        hot: true, // 开启热更新
        historyApiFallback: true,
    }
}