path = require('path');
module.exports = {
  entry: "./lib",
  output: {
    path: path.resolve(__dirname, "js"),
  },
  externals: ["react", "react-dom"],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};