/* eslint-disable */

/**
 * This file contains the webpack config for all environments.
 * Use NODE_ENV to set the environment either to 'production', 'development'
 * or 'testing' to get the right webpack config.
 *
 * This file should be written in ES5.
 */

var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
var JestpackPlugin = require('jestpack/Plugin');
var fs = require('fs');
var StatsWebpackPlugin = require('stats-webpack-plugin');

/**
 * Given a glob pattern returns the matched paths as an entry point object for Webpack.
 * @param {string} globPattern A glob pattern to match tests.
 * @return {object} Key value pairs, keyed on filepath.
 */
 function getEntryPoints(globPattern) {
   var testFiles = glob.sync(globPattern);
   var entryPoints = {};
   testFiles.forEach(function(file) {
     entryPoints[file.replace(/\.js$/, '')] = './' + file;
   });
   return entryPoints;
 }

var entryPoints = getEntryPoints('src/**/__tests__/*');
entryPoints.setup = './test-setup';



var config = {
  devtool: 'source-map',
  entry: entryPoints,
  output: {
    path: '__bundled_tests__',
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new JestpackPlugin(),
    new StatsWebpackPlugin('stats.json')
  ],
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {optional: 'runtime'},
      include: path.join(__dirname, 'src')
    }]
  }
};

module.exports = config;
