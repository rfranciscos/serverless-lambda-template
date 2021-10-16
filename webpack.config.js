const path = require('path')
const slsw = require('serverless-webpack')
const isLocal = slsw.lib.webpack.isLocal
const nodeExternals = require('webpack-node-externals')

/**
 * Resolve tsconfig.json paths to Webpack aliases
 * @param  {string} tsconfigPath           - Path to tsconfig
 * @param  {string} webpackConfigBasePath  - Path from tsconfig to Webpack config to create absolute aliases
 * @return {object}                        - Webpack alias config
 */
function resolveTsconfigPathsToAlias({
                                       tsconfigPath = './tsconfig.paths.json',
                                       webpackConfigBasePath = __dirname,
                                     } = {}) {
  const {paths} = require(tsconfigPath).compilerOptions;
  const aliases = {};

  Object.keys(paths).forEach((item) => {
    const key = item.replace('/*', '');
    aliases[key] = path.resolve(webpackConfigBasePath, paths[item][0].replace('/*', '').replace('*', ''));
  });

  return aliases;
}

module.exports = {
  mode: isLocal ? 'development' : 'production',
  devtool: isLocal ? 'source-map' : false,
  entry: slsw.lib.entries,
  target: 'node',
  resolve: {
    extensions: ['.mjs', '.ts', '.js'],
    alias: resolveTsconfigPathsToAlias({
      tsconfigPath: './tsconfig.paths.json',
      webpackConfigBasePath: './',
    }),
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  }
}
