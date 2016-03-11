'use strict';

var path = require('path');
var webpack = require('webpack');

var envifyPlugin = new webpack.DefinePlugin({
  'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
});
var dedupePlugin = new webpack.optimize.DedupePlugin();
var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    properties: true,
    sequences: true,
    dead_code: true,
    conditionals: true,
    comparisons: true,
    evaluate: true,
    booleans: true,
    unused: true,
    loops: true,
    hoist_funs: true,
    cascade: true,
    if_return: true,
    join_vars: true,
    drop_debugger: true,
    unsafe: true,
    hoist_vars: true,
    negate_iife: true
  },
  sourceMap: false,
  mangle: {
    toplevel: true,
    sort: true,
    eval: true,
    properties: true
  },
  output: {
    space_colon: false,
    comments: false
  }
});
var plugins = [];
if (process.env.NODE_ENV === 'production') {
  plugins = [envifyPlugin, dedupePlugin, uglifyPlugin];
}

module.exports = {
  entry: {
    bundle: './src/index.jsx'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  output: {
    publicPath: 'build',
    path: 'build',
    filename: '[name].js'
  },
  plugins: plugins,
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    loaders: [
      {
        loader: 'transform/cacheable?brfs'
      },
      {
        test: /\.yml/,
        loader: 'yaml-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.resolve('./src'),
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
