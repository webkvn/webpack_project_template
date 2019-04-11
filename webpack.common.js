const path = require('path');
const webpack = require('webpack');
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PurifyCssWebpack = require("purifycss-webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'

var entries = getEntry('./src/pages/**/*.js');

let getHtmlConfig = function(name, chunks) {
  return {
    template: `./src/${name}/index.html`,
    filename: `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    hash: true, //开启hash  ?[hash]
    chunks: chunks,
    minify: process.env.NODE_ENV === "development" ? false : {
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //折叠空白区域 也就是压缩代码
      removeAttributeQuotes: true, //去除属性引用
    },
  };
};

module.exports = {
  entry: entries,
  module: {
    rules: [{
        test: /\.(css|scss|sass)$/,
        use: [
          devMode ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: './'
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   'window.jQuery': 'jquery',
    // }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "./src/assets"),
      to: path.resolve(__dirname, "./dist/assets"),
      ignore: ['.*']
    }]),
    new PurifyCssWebpack({
      paths: glob.sync(path.join(__dirname, "./src/pages/*/*.html"))
    })
  ]
};

function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;
  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '\/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  return entries;
}

var htmlArray = [];
Object.keys(entries).forEach(function(element) {
  htmlArray.push({
    _html: element,
    title: '',
    chunks: [element]
  })
})

htmlArray.forEach((element) => {
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})
