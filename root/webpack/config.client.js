var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

var env = process.env.NODE_ENV || 'development';
var isProduction = 'production' === env;

var plugins = [
  new ExtractTextPlugin('[name].css', { allChunks: true }),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"' + env + '"' })
]
if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}))
}

module.exports = {
  entry: ['./src/client.js'],
  target: 'web',
  node: { __dirname: false, __filename: false },
  output: {
    path: path.resolve(__dirname, './../build/static'),
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: [ "babel?presets[]=es2015&presets[]=react" ], exclude: /node_modules/ },
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    modulesDirectories: [ 'src', 'node_modules', 'static' ],
  },
}
