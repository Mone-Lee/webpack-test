const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, 'src')
}

const smp = new SpeedMeasurePlugin();

const setMAP = () => {
	const entry = {};
	const htmlWebpackPlugins = [];
	const htmlWebpackExternalsPlugins = [];

	const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
	Object.keys(entryFiles).map((index) => {
		const entryFile = entryFiles[index];
		let match = entryFile.match(/src\/(.*)\/index\.js/);
		let pageName = match && match[1];
		entry[pageName] = entryFile;

		htmlWebpackPlugins.push(
			new HtmlWebpackPlugin({
				template: path.join(__dirname, `src/${pageName}/index.html`),
				filename: `${pageName}.html`,
				chunks: ['common', pageName],
				inject: true,   // 把chunk自动注入html中
				minify: {
					html5: true,
					collapseWhitespace: true,
					preserveLineBreaks: false,
					minifyCSS: true,
					minifyJS: true,
					removeComments: false
				}
			})
		)

		htmlWebpackExternalsPlugins.push(
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
				files: `${pageName}.html`
			})
		)
	})

	return {
		entry,
		htmlWebpackPlugins,
		htmlWebpackExternalsPlugins
	}
}

const { entry, htmlWebpackPlugins, htmlWebpackExternalsPlugins } = setMAP();

module.exports = {
	entry: entry,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name]_[chunkhash:8].js'
	},
	mode: 'none',
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve('src'),
				use: [
					'babel-loader?cacheDirectory=true',
					// 'eslint-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
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
									require('autoprefixer')({
										browsers: ['last 2 version', '>1%', 'ios 7']
									})
								]
							}
						}
					},
					'less-loader',
				]
			},
			{
				test: /\.(png|jpg|gif|jpeg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8].[ext]'
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.90],
								speed: 4
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75
							}
						}
					},
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name]_[contenthash:8].css'
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano')
		}),
		new CleanWebpackPlugin(),
		// new HTMLInlineCSSWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin(),
		// new BundleAnalyzerPlugin(),
		new HardSourceWebpackPlugin(),
		new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
	]
	.concat(htmlWebpackPlugins)
	.concat(htmlWebpackExternalsPlugins),
	// optimization: {
	// 	splitChunks: {
	// 		minSize: 0,
	// 		cacheGroups: {
	// 			commons: {
	// 				name: 'common',
	// 				chunks: 'all',
	// 				minChunks: 2
	// 			}
	// 		}
	// 	}
	// },
	resolve: {
		extensions: ['.js'],
		mainFields: ['main']
	},
	devtool: 'inline-source-map'
}