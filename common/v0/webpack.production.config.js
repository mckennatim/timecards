var path = require('path');
var webpack = require('webpack');

module.exports={
	entry: "./src/app.js",
	output: {
		path: path.join(__dirname, "jobs"),
		filename: 'bundle.js'
	},
  module: {
    rules: [
      { test: /\.js$/, 
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader" 
        }]
      },
      { test: /\.html$/, loader: "html-loader" }
    ],
  },
	devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]      	
}