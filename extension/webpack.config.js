"use strict";

module.exports = {
  devtool: "source-map",
  entry: {
    contentScripts: "./src/contentScripts.js",
    popup: "./src/popup.js",
    background: "./src/background.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
