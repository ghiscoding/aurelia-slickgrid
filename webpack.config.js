/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const nodeExternals = require('webpack-node-externals');

const baseUrl = '';
const outDevDir = path.resolve(__dirname, 'dist');
const outProdDir = path.resolve(__dirname, 'website');
const srcDir = path.resolve(__dirname, 'src');
const title = 'Aurelia-Slickgrid Skeleton';

const cssLoader = 'css-loader';
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['autoprefixer']
    }
  }
};

module.exports = ({ production, node } = {}, { server } = {}, { analyze } = {}) => {
  // console.log('webpack', analyze, production, server, node);
  // const production = server.production || false;
  // const production = env.production || process.env.NODE_ENV === 'production';
  return {
    target: node ? 'node' : 'web',
    mode: production ? 'production' : 'development',
    // devtool: production ? 'source-map' : 'inline-source-map',
    devtool: production ? false : 'eval-cheap-module-source-map',
    entry: {
      // Build only plugin in production mode,
      // build dev-app in non-production mode
      entry: node ? './src/aurelia-slickgrid/index.ts' : './src/main.ts'
    },
    output: {
      path: production ? outProdDir : outDevDir,
      // filename: production ? 'index.js' : '[name].bundle.js',
      // library: production ? { type: 'commonjs' } : undefined
      publicPath: baseUrl,
      filename: '[name].[contenthash].bundle.js',
      sourceMapFilename: '[name].[contenthash].bundle.js.map',
      chunkFilename: '[name].[contenthash].chunk.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: production ? {
        // add your production aliases here
      } : {
        ...getAureliaDevAliases()
        // add your development aliases here
      }
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000
    },
    module: {
      rules: [
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset' },
        { test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, type: 'asset' },
        {
          test: /\.css$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [cssLoader, postcssLoader]
        },
        {
          test: /\.css$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: ['style-loader', cssLoader, postcssLoader]
        },
        {
          test: /\.css$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [cssLoader, postcssLoader]
        },
        { test: /\.(sass|scss)$/, use: ['style-loader', 'css-loader', 'sass-loader'], issuer: /\.[tj]s$/i },
        { test: /\.(sass|scss)$/, use: ['css-loader', 'sass-loader'], issuer: /\.html?$/i },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        {
          test: /[/\\](?:src|dev-app)[/\\].+\.html$/i,
          use: {
            loader: '@aurelia/webpack-loader',
            options: {
              // The other possible Shadow DOM mode is 'closed'.
              // If you turn on "closed" mode, there will be difficulty to perform e2e
              // tests (such as Playwright). Because shadowRoot is not accessible through
              // standard DOM APIs in "closed" mode.
              // defaultShadowOptions: { mode: 'open' }
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    performance: {
      hints: false
    },
    externalsPresets: node && { node: production },
    externals: [
      // Skip npm dependencies in plugin build.
      node && nodeExternals()
    ].filter(p => p),
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        favicon: `${srcDir}/favicon.ico`,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: node ? `${srcDir}/assets/i18n` : `${srcDir}/assets`,
            to: node ? 'i18n' : 'assets'
          }
        ]
      }),
      analyze && new BundleAnalyzerPlugin(),
      // Note that the usage of following plugin cleans the webpack output directory before build.
      new CleanWebpackPlugin(),
    ].filter(p => p)
  }
};

function getAureliaDevAliases() {
  return [
    'aurelia',
    'fetch-client',
    'kernel',
    'metadata',
    'platform',
    'platform-browser',
    'route-recognizer',
    'router',
    'router-lite',
    'runtime',
    'runtime-html',
    'testing',
    'state',
    'ui-virtualization'
  ].reduce((map, pkg) => {
    const name = pkg === 'aurelia' ? pkg : `@aurelia/${pkg}`;
    try {
      const packageLocation = require.resolve(name);
      map[name] = path.resolve(packageLocation, `../../esm/index.dev.mjs`);
    } catch {/**/ }
    return map;
  });
}
