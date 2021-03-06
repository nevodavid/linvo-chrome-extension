const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = {
  entry: {
    app: [customPath, path.join(__dirname, '../chrome_extension/chrome/extension/app')],
    background: [customPath, path.join(__dirname, '../chrome_extension/chrome/extension/background')],
    inject: [customPath, path.join(__dirname, '../chrome_extension/chrome/extension/inject')],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({})],
  },
  output: {
    path: path.join(__dirname, '../build/chrome_extension/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.ts', '.tsx']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['react-optimize']
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer]
          }
        }
      ]
    }, {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  }
};
