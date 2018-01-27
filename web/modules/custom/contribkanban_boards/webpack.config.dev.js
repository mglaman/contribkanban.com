const path = require('path');
const webpack = require('webpack');

module.exports = [
  {
    entry: './lib/index.js',
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'js'),
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') } }),
    ],
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
