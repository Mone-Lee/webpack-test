const path = require('path');
const glob = require('glob');
const { merge } = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const projectRoot = process.cwd();

const setMAPProd = () => {
  const entry = {};
  const htmlWebpackExternalsPlugins = [];

  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index-server.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index-server\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;

    return htmlWebpackExternalsPlugins.push(
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'react',
            entry: 'https://now8.gtimg.com/now/lib/16.2.0/react.min.js',
            global: 'React',
          },
          {
            module: 'react-dom',
            entry: 'https://now8.gtimg.com/now/lib/16.2.0/react-dom.min.js',
            global: 'ReactDOM',
          },
        ],
        files: `${pageName}.html`,
      }),
    );
  });

  return {
    htmlWebpackExternalsPlugins,
  };
};

const { htmlWebpackExternalsPlugins } = setMAPProd();

const ssrConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'ignore-loader',
      },
      {
        test: /\.less$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
  ]
    .concat(htmlWebpackExternalsPlugins),
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, ssrConfig);
