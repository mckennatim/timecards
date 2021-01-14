var path = require('path');
module.exports={
  entry: "./src/app.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, 
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