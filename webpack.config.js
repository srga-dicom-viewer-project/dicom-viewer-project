const path = require('path')
const webpack = require('webpack');

// https://kitware.github.io/vtk-js/docs/intro_vtk_as_es6_dependency.html#Webpack-config
const vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core
    .rules
// Optional if you want to load *.css and *.module.css files
const cssRules = require('vtk.js/Utilities/config/dependency.js').webpack.css
    .rules


// Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const entry = path.join(__dirname, './client/index.js')
const sourcePath = path.join(__dirname, './client/src')
const outputPath = path.resolve(__dirname, './client/build')

module.exports = {
    entry,
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ].concat(vtkRules),
    },
    plugins: [
        // Show build progress
        new webpack.ProgressPlugin(),
        // Clear dist between builds
        new CleanWebpackPlugin(),
        new Dotenv({
            path: '.env'
        }),
        // Generate `index.html` with injected build assets
        new HtmlWebpackPlugin({
            template: "./client/index.html",
            filename: "./index.html"
        })
    ],
    // Fix: https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
    // For issue in cornerstone-wado-image-loader
    resolve: {
        fallback: {
            fs: false
        }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: false,
        hot: true,
        open: true,
        port: 8091,
        historyApiFallback: true
    }
}