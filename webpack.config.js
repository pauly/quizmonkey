'use strict'

const path = require('path')
const webpack = require('webpack')

const InlinePlugin = require('html-webpack-inline-source-plugin');
const inlinePlugin = new InlinePlugin()
const HtmlPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlPlugin({
  title: process.env.npm_package_name,
  inlineSource: '.(js|css)$',
  template: 'src/assets/index.html'
})

const envifyPlugin = new webpack.DefinePlugin({
  'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
})
const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
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
})
let plugins = [
  envifyPlugin,
  htmlPlugin,
  inlinePlugin
]
if (process.env.NODE_ENV === 'production') {
  plugins.push(uglifyPlugin)
}

module.exports = {
  entry: {
    bundle: './src/index.jsx'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js'
  },
  plugins: plugins,
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    loaders: [
      /* {
        loader: 'transform/cacheable?brfs'
      }, */
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
        loader: 'babel-loader',
        include: path.resolve('./src'),
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
