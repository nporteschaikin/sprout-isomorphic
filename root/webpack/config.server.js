var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var path = require('path');

var env = process.env.NODE_ENV || 'development';
var isDevelopment = 'development' === env;

/**
 * Create entry point, with HMR polling
 * in development.
 */

var entry = ['./src/server.js'];
if (isDevelopment) {
  entry.unshift('webpack/hot/poll?1000');
}

/**
 * Create plugins, with HMR in
 * development.
 */

var plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"' + env + '"' })
]
if (isDevelopment) {
  plugins.unshift(new webpack.HotModuleReplacementPlugin())
}

/**
 * Export configuration.
 */

module.exports = {
  entry: entry,
  target: 'node',
  node: { __dirname: false, __filename: false, },
  externals: [
    nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })
  ],
  output: { filename: 'server.js', path: path.resolve(__dirname, './../build') },
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
