'use strict';
var path = require('path');

module.exports = {
  entry: './src/index.jsx',
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  output: {
    publicPath: 'build',
    path: 'build',
    filename: 'bundle.js'
  },
  module: {
    postLoaders: [
      {
        loader: 'transform?brfs'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'envify-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.resolve('./src'),
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.json/,
        loader: 'json-loader'
      }
    ]
  }
};
