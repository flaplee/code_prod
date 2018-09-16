const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: '../src/index.html' });

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'true'))
});

const stylesheetsLoaders = [
  { loader: 'style-loader' },
  { loader: 'sass-loader'},
  { loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[path]-[local]-[hash:base64:3]',
      sourceMap: true
    }
  }
];

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './index',
  output: {
    publicPath: '/',
    filename: '[hash].js',
    path: path.join(__dirname, 'dist')
  },
  devtool: 'source-map',
  plugins: [htmlWebpackPlugin, definePlugin],
  resolve: {
    modules: ['node_modules', path.join(__dirname, './')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        test: /\.css$/,
        use: stylesheetsLoaders
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
            {
                loader: "file-loader",
                options: {
                    outputPath: "assets/"
                }
            }
        ]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      }, {
        test: /\.sass$/,
        use: [...stylesheetsLoaders, {
          loader: 'sass-loader',
          options: {
            indentedSyntax: 'sass',
            sourceMap: true
          }
        }]
      }
    ]
  },
  devServer: {
    host: '192.168.2.103',
    port: '3000',
    historyApiFallback: true,
    compress: true,
    proxy: {
      '/a/**': {
        target: 'http://mp.delicloud.xin',//http://192.168.0.202:9201
        secure: false,
        changeOrigin: true
      },
      '/app/**': {
        target: 'http://mp.delicloud.xin',// http://192.168.0.202:9201
        secure: false,
        changeOrigin: true
      },
      '/v1.0/**': {
        target: 'http://convert.delicloud.xin',// http://192.168.0.202:9203
        secure: false,
        changeOrigin: true
      },
      '/h5/**': {
        target: 'http://convert.delicloud.xin',// http://192.168.0.202:9203
        secure: false,
        changeOrigin: true
      },
      '/converter/**': {
        target: 'http://convert.delicloud.xin',// http://192.168.0.202:9203
        secure: false,
        changeOrigin: true
      }
    }
  }
};
