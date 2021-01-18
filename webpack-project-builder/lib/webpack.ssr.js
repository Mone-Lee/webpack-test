const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

const projectRoot = process.cwd();

const setMPA = () => {
	const entry = {};
	const htmlWebpackPlugins = [];
	const htmlWebpackExternalsPlugins = [];

	const entryFiles = glob.sync(path.join(projectRoot, './src/*/index-server.js'));
	Object.keys(entryFiles).map((index) => {
		const entryFile = entryFiles[index];
		const match = entryFile.match(/src\/(.*)\/index-server\.js/);
		const pageName = match && match[1];

		if (pageName) {
			entry[pageName] = entryFile;
			htmlWebpackPlugins.push(
				new HtmlWebpackPlugin({
					inlineSource: '.css$',
					template: path.join(projectRoot, `src/${pageName}/index.html`),
					filename: `${pageName}.html`,
					chunks: ['vendors', pageName],
					inject: true,
					minify: {
						html5: true,
						collapseWhitespace: true,
						preserveLineBreaks: false,
						minifyCSS: true,
						minifyJS: true,
						removeComments: false
					}
				})
			);

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
		}
	});

	return {
		entry,
		htmlWebpackPlugins,
		htmlWebpackExternalsPlugins
	}
}

const { entry, htmlWebpackPlugins, htmlWebpackExternalsPlugins } = setMPA();

module.exports = {
	entry: entry,
	output: {
			path: path.join(projectRoot, 'dist'),
			filename: '[name]-server.js',
			libraryTarget: 'umd'
	},
	mode: 'none',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					'babel-loader'
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
				test: /.(png|jpg|gif|jpeg|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8].[ext]'
						}
					}
				]
			},
			{
				test: /.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8][ext]'
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
		new OptimizeCSSAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano')
		}),
		new CleanWebpackPlugin(),
	]
	.concat(htmlWebpackPlugins)
	.concat(htmlWebpackExternalsPlugins)
};