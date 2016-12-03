'use strict';
var webpack = require('webpack');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const env = process.env.NODE_ENV;
let exportObj = {};

if (env === 'production') {
  exportObj = {
    entry: './src/index.js',
    output: {
      filename: 'data-aggregator-ext-es5.min.js',
      path: './dist'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['latest']
          },
          exclude: [/node_modules/]
        }
      ]
    },
    resolve: {
      extensions: ['', '.js']
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  };
} else if (env === 'development') {
  exportObj = {
    entry: './src/index.js',
    output: {
      filename: 'data-aggregator-ext-es5.js',
      path: './dist'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['latest']
          },
          exclude: [/node_modules/]
        }
      ]
    },
    resolve: {
      extensions: ['', '.js']
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  };
}

module.exports = exportObj;
