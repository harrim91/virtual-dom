const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'app/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js',
  },
  target: 'web',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'env',
            ],
            plugins: [
              [
                'transform-react-jsx',
                { pragma: 'virtualDOMElement' },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
