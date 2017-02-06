const webpack = require('webpack');

const libraryName = 'graphjs';

module.exports = {
  entry: './src/index.js',
  output: {
    path: './lib',
    filename: libraryName + '.bundle.js',
    libraryTarget: 'umd',
    library: libraryName,
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      }
    })
  ]
};
