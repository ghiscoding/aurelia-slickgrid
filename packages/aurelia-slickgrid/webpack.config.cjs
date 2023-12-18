/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');

const cssLoader = 'css-loader';


const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['autoprefixer']
    }
  }
};

module.exports = function (env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';
  return {
    target: 'node',
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : 'inline-source-map',
    entry: {
      entry: './index.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist/esm'),
      filename: 'index.mjs',
      library: { type: 'module' },
      chunkFormat: 'module',
    },
    experiments: {
      outputModule: true
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['../../node_modules'],
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
        { test: /\.ts$/i, use: [{ loader: 'ts-loader', options: { allowTsInNodeModules: false, configFile: './tsconfig.json' } }, '@aurelia/webpack-loader'], exclude: /node_modules/ },
        {
          test: /\.html$/i,
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
    externalsPresets: { node: production },
    externals: [
      // Skip npm dependencies in plugin build.
      production && nodeExternals({ additionalModuleDirs: ['../../node_modules'] })
    ].filter(p => p),
    plugins: [
      // !production && new HtmlWebpackPlugin({ template: 'index.html', favicon: 'favicon.ico' }),
      // new Dotenv({
      //   path: `./.env${production ? '' : '.' + (process.env.NODE_ENV || 'development')}`,
      // }),
      analyze && new BundleAnalyzerPlugin()
    ].filter(p => p)
  }
}

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
