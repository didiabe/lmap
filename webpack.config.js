var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
	entry: {
		main: './src/main.js'
	},
	output: {
		path: './',
		filename: 'assets/bundle.js'
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'leaflet': 'L',
		'esri-leaflet': 'L.esri',
		'antd': 'antd',
		'leaflet-draw': 'L.draw'
	},
	devServer: {
		inline: true,
		port: 2222
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react']
			}
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style', 'css?modules')
		}, {
			test: /\.(png|jpg)$/,
			loader: 'url-loader?limit=8192&name=images/[name].[ext]'
		}]
	},
	plugins: [
		new ExtractTextPlugin('assets/' + 'style.css')
		/*new uglifyJsPlugin({
			compress: {
				warnings: false
			}
		})*/
	]
}