const path = require('path');
const glob = require('glob');
const { merge } = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const projectRoot = process.cwd();

const setMAPProd = () => {
  const entry = {};
  const htmlWebpackExternalsPlugins = [];

  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
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

const prodConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer({
                    browsers: ['last 2 version', '>1%', 'ios 7'],
                  }),
                ],
              },
            },
          },
          'less-loader',
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
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

module.exports = merge(baseConfig, prodConfig);
