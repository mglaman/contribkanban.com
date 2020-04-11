"use strict";

module.exports = {
  entry: {
    contentScripts: "./src/contentScripts.js",
    popup: "./src/popup.js",
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
