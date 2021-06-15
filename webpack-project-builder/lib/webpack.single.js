const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const projectRoot = process.cwd();

const singleDevConfig = {
  mode: 'development',
	entry: path.resolve(projectRoot, 'src/main.js'),
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: 'dist.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ],
      },
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				exclude: /node_modules/, //排除 node_modules 文件夹
			},
    ],
  },
  plugins: [
		new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(projectRoot, 'src/index.html'),
			inject: 'body'
		})
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  devtool: 'source-map',
};

module.exports = merge(baseConfig, singleDevConfig);