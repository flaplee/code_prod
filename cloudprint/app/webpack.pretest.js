const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const tinypngCompress = require("webpack-tinypng-compress");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
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

/* const uglifyPlugin = new UglifyJsPlugin({
  cache: true,
  parallel: true, // 开启并行压缩，充分利用cpu
  sourceMap: false,
  extractComments: false, // 移除注释
  uglifyOptions: {
    compress: {
      unused: true,
      warnings: false,
      drop_debugger: true
    },
    output: {
      comments: false
    }
  }
}); */
const compressionPlugin = new CompressionPlugin();

module.exports = {
  devtool: 'false',
  context: path.join(__dirname, 'src'),
  entry: {
    vendor: ['react','react-dom','react-router-dom'], //在此处配置
    bundle :__dirname + "/src/index.js"               //已多次提及的唯一入口文件
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: "./",
    filename: '[name].js',
    chunkFilename : "[id].[name].bundle.chunk.js"
  },
  /* externals: {
    'react': 'React'
  }, */
  plugins: [
    stylesheetsPlugin,
    new CleanWebpackPlugin([settings.distPath], {
        verbose: true
    }),
    new HtmlWebpackPlugin({
      template: srcPathExtend("index.html"),
      PUBLIC_URL: 'http://eapp-pretest.deli/cloudprint/app/build/',
      JSSDK_URL: 'http://static-pretest.deli/h5/sdk/delicloud.min.js?v=202',
      inject: true
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
    //uglifyPlugin,
    compressionPlugin
  ],
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')],
    extensions: ['.js', '.json','.scss', '.css']
  },
  optimization:{
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }/*,{
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }],
      } , {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: stylesheetsLoaders
        })
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader"
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
      }, */
      ,
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: stylesheetsLoaders
        })
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
      },
      /*{
        test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },*/
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
    ]
  },
  watch: false,
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false
  }
};
