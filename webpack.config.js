const webpack = require('webpack');

const libraryName = 'imgraphjs';

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/lib',
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
