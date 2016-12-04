'use strict';
var webpack = require('webpack');
var BabiliPlugin = require('babili-webpack-plugin');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const env = process.env.NODE_ENV;
let exportObj = {};

if (env === 'production') {
  exportObj = {
    entry: './src/index.js',
    output: {
      filename: 'data-aggregator.min.js',
      path: './dist'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }]
    },
    eslint: {
      configFile: './.eslintrc.json',
      failOnError: true
    },
    resolve: {
      extensions: ['', '.js']
    },
    devtool: 'source-map',
    plugins: [
      new BabiliPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  };
} else if (env === 'development') {
  exportObj = {
    entry: './src/index.js',
    output: {
      filename: 'data-aggregator.js',
      path: './dist'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }]
    },
    eslint: {
      configFile: './.eslintrc.json',
      failOnError: true
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
