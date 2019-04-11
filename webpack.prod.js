const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    // 打包多出口文件
    // 生成 a.bundle.[hash].js  b.bundle.[hash].js
    filename: './js/[name].[chunkhash:8].js',
    publicPath: './'
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({
      // verbose Write logs to console.
      verbose: false, //开启在控制台输出信息
      // dry Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].min.css',
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: false,
          drop_console: true
        }
      }
    })
  ],
  module: {
    rules: []
  }
});

if(process.env.npm_config_report){//打包后模块大小分析//npm run build --report
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfigProd.plugins.push(new BundleAnalyzerPlugin())
}
