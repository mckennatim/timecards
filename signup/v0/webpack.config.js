var path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
  entry: "./src/app.js",
  plugins: [
    new CleanWebpackPlugin(['dist/*.js*']),
    new HtmlWebpackPlugin({
      hash: false,
      template: './src/index.html',
      filename: 'index.html',
      title: 'mydogfood'
    })
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.jsx?$/, 
        exclude: /node_modules/,
        use: [
          "babel-loader",
          "eslint-loader"
        ]
      },
      { test: /\.html$/, loader: "html-loader" },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }      
    ],
  },
  devtool: "source-map",      
}