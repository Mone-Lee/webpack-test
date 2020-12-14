const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    'large-number-webpack-build': './src/index.js',
    'large-number-webpack-build.min': './src/index.js'
  },
  output: {
    filename: '[name].js',
    library: 'largeNumberWebpackBuild',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ]
  }
}