const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'


module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isProd ? false : 'cheap-eval-source-map',
  entry: {
    bundle: './src/index.js',
    vendor: ['react', 'react-dom']
  },
  watch: true,
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?modules', 'postcss-loader'],
        }),
      }, {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader'],
        }),
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?modules', 'less-loader', 'postcss-loader'],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, './src'),
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, './src'),
        use: ['awesome-typescript-loader'],
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css|less|scss)$'),
      threshold: 10240, //只处理比这个值大的资源。按字节计算
      minRatio: 0.8 //只有压缩率比这个值小的资源才会被处理
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV:  JSON.stringify("production")}
    }),
    new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
    new ExtractTextPlugin({ filename: '[name].[hash].css', allChunks: false }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: './index.html',
      title: 'webpack demo',
      minify: true,
      inject: true,
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
      }
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      cacheGroups: {
        vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10,
            enforce: true
        },
        styles: {
            test: /\.(scss|sass|less|css)$/,
            chunks: 'all',
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
            enforce: true
        },
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          sourceMap: false,
          compress: {
            warnings: false,
            drop_debugger: isProd,
            drop_console: isProd
          },
          mangle: true,
          output: {
            comments: false,
          },
        }
      })
    ]
  }
}