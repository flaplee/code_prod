const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const tinypngCompress = require("webpack-tinypng-compress");

const stylesheetsLoaders = [{
  loader: 'css-loader',
  options: {
    modules: true,
    localIdentName: '[path]-[local]-[hash:base64:3]',
    sourceMap: true
  }
}
];

const stylesheetsPlugin = new ExtractTextPlugin('[hash].css');
const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
  }
});

const settings = {
  distPath: path.join(__dirname, "dist"),
  srcPath: path.join(__dirname, "src")
};

// the path(s) that should be cleaned
let pathsToClean = [
  'dist',
  'build'
]

function srcPathExtend(subpath) {
  return path.join(settings.srcPath, subpath)
}

const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } });
const compressionPlugin = new CompressionPlugin();

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, '/'),
  entry: './index',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath : "/",
    filename: '[hash].js',
    chunkFilename : "[id].[hash].bundle.chunk.js"
  },
  externals: {
    'react': 'React'
  },
  plugins: [
    stylesheetsPlugin,
    new CleanWebpackPlugin([settings.distPath], {
        verbose: true
    }),
    new HtmlWebpackPlugin({
        template: srcPathExtend("index.html")
    }),
    new CleanWebpackPlugin(pathsToClean, {
      root: __dirname,
      verbose: true,
      dry: false,           
      watch: false,
      exclude: [ 'files', 'to', 'ignore' ],
      allowExternal: false,
      beforeEmit: false
    }),
    definePlugin,
    uglifyPlugin,
    compressionPlugin
  ],
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }],
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: stylesheetsLoaders
        })
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...stylesheetsLoaders, {
            loader: 'sass-loader'
          }]
        })
      }, {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...stylesheetsLoaders, {
            loader: 'sass-loader',
            options: {
              indentedSyntax: 'sass',
            }
          }]
        })
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...stylesheetsLoaders, {
            loader: 'less-loader'
          }]
        })
      }
    ]
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false
  }
};
