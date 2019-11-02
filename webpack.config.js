path = require('path');
module.exports = {
  entry: "./web/libraries/contribkanban-app/lib",
  output: {
    path: path.resolve(__dirname, "web/libraries/contribkanban-app/js"),
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", {
                targets: {
                  browsers: ["last 2 versions"]
                },
              }],
              "@babel/preset-react"
            ]
          },
        }
      }
    ]
  }
};
