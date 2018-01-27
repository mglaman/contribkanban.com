const path = require('path');

const webpack = require('webpack');
const Minify = require('babel-minify-webpack-plugin');

module.exports = [
  {
    entry: './lib/index.js',
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'js'),
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
      new Minify(),
    ],
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: ['/node_modules/'],
          query: {
            plugins: [
              'external-helpers',
              'transform-class-properties',
              'transform-decorators-legacy',
              'transform-object-rest-spread',
            ],
            presets: [
              'es2015',
              'react',
              [
                'env', {
                  modules: false,
                  targets: {
                    browsers: ['last 2 versions'],
                  },
                },
              ],
            ],
          },
        },
      ],
    },
  },
];
