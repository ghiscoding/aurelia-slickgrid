const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// config helpers:
const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];

// primary config:
const title = 'Aurelia Navigation Skeleton';
const outDevDir = path.resolve(__dirname, 'dist');
const outProdDir = path.resolve(__dirname, 'docs');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '';
const platform = {
  hmr: false,
  open: true,
  port: 9000,
  host: 'localhost',
  output: 'dist-demo'
};

module.exports = ({ production } = {}, { server, hmr, port, host } = {}) => ({
  resolve: {
    extensions: ['.ts', '.js'],
    // mainFields: ['browser', 'module', 'main'],
    modules: [srcDir, 'node_modules'],
    // Enforce single aurelia-binding, to avoid v1/v2 duplication due to
    // out-of-date dependencies on 3rd party aurelia plugins
    alias: {
      'aurelia-binding': path.resolve(__dirname, 'node_modules/aurelia-binding'),
      'jquery': path.join(__dirname, 'node_modules/jquery/dist/jquery'),
      moment$: 'moment/moment.js'
    },
    fallback: {
      child_process: false,
      crypto: false,
      http: false,
      https: false,
      os: false,
      path: false,
      stream: false,
      util: false,
      zlib: false,
      fs: false,
      tls: false,
      net: false,
    },
  },
  entry: {
    app: ['aurelia-bootstrapper'],
    vendor: ['jquery']
  },
  mode: production ? 'production' : 'development',
  output: {
    path: production ? outProdDir : outDevDir,
    publicPath: baseUrl,
    filename: '[name].[contenthash].bundle.js',
    sourceMapFilename: '[name].[contenthash].bundle.js.map',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  performance: { hints: false },
  devServer: {
    contentBase: production ? outProdDir : outDevDir,
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true,
    hot: hmr || platform.hmr,
    port: port || platform.port,
    host: host || platform.host,
    open: platform.open,
  },
  devtool: production ? false : 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader']
      },
      { test: /\.(sass|scss)$/, use: ['style-loader', 'css-loader', 'sass-loader'], issuer: /\.[tj]s$/i },
      { test: /\.(sass|scss)$/, use: ['css-loader', 'sass-loader'], issuer: /\.html?$/i },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.ts?$/, use: 'ts-loader', exclude: nodeModulesDir, },
      // exposes jQuery globally as $ and as jQuery:
      // { test: require.resolve('jquery'), loader: 'expose-loader?$!expose-loader?jQuery' },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', type: 'asset/resource', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', type: 'asset/resource', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', type: 'asset/resource', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader', type: 'asset/resource', },
      // {
      //   test: /environment\.json$/i, use: [
      //     { loader: "app-settings-loader", options: { env: production ? 'production' : 'development' } },
      //   ]
      // }
    ]
  },
  plugins: [
    new AureliaPlugin({
      dist: 'es2015',
      aureliaApp: 'main',
      // aureliaConfig: ['basic'],
      // includeAll: 'src'
    }),
    new ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    new ModuleDependenciesPlugin({
      'aurelia-testing': ['./compile-spy', './view-spy']
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      favicon: `${srcDir}/favicon.ico`,
      metadata: {
        // available in index.ejs //
        title, server, baseUrl
      }
    }),
    // ref: https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({ // updated to match the naming conventions for the js files
      filename: production ? '[name].[contenthash].bundle.css' : '[name].[hash].bundle.css',
      chunkFilename: production ? '[name].[contenthash].chunk.css' : '[name].[hash].chunk.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${srcDir}/favicon.ico`, to: 'favicon.ico' },
        { from: `${srcDir}/assets`, to: 'assets' }
      ]
    }),

    // Note that the usage of following plugin cleans the webpack output directory before build.
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ]
});
