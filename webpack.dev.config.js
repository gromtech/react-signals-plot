const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname);
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const env = process.env.WEBPACK_ENV || 'dev';

const appName = 'index';
const host = '0.0.0.0';
const port = '8000';

const plugins = [];
let outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = `${appName}.min.js`;
} else {
  outputFile = `${appName}.js`;
}

const config = {
  entry: './example/src/index.js',
  output: {
    path: path.resolve(__dirname, 'example/dist'),
    filename: outputFile
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};

if (env === 'dev') {
  new WebpackDevServer(webpack(config), {
    contentBase: './example/dist',
    hot: true,
    debug: true
  }).listen(port, host, (err) => {
    if (err) {
      console.log(err);
    }
  });
  console.log('-------------------------');
  console.log(`Local web server runs at http://${host}:${port}`);
  console.log('-------------------------');
}

module.exports = config;
