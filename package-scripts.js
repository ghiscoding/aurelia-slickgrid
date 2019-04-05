const { series, crossEnv, concurrent, rimraf } = require('nps-utils')
const WEB_UI_PORT = 9000;

module.exports = {
  scripts: {
    default: 'nps webpack',
    test: {
      default: 'nps test.jest',
      jest: {
        default: 'jest',
        accept: 'jest -u',
        coverage: series(
          rimraf('test/coverage-jest'),
          'jest --coverage'
        ),
        watch: 'jest --watch',
      },
      lint: {
        default: 'eslint src',
        fix: 'eslint --fix'
      },
      all: concurrent({
        jest: 'nps test.jest',
        lint: 'nps test.lint'
      })
    },
    build: 'nps webpack.build',
    webpack: {
      default: 'nps webpack.server',
      build: {
        before: rimraf('/'),
        default: 'nps webpack.build.production',
        development: {
          default: series(
            'nps webpack.build.before',
            'webpack --progress -d'
          ),
          extractCss: series(
            'nps webpack.build.before',
            'webpack --progress -d --env.extractCss'
          ),
          serve: series.nps(
            'webpack.build.development',
            'serve'
          ),
        },
        production: {
          inlineCss: series(
            'nps webpack.build.before',
            crossEnv('NODE_ENV=production webpack --progress -p --env.production')
          ),
          default: series(
            'nps webpack.build.before',
            crossEnv('NODE_ENV=production webpack --progress -p --env.production --env.extractCss')
          ),
          serve: series.nps(
            'webpack.build.production',
            'serve'
          ),
        }
      },
      server: {
        default: `webpack-dev-server -d --port=${WEB_UI_PORT} --devtool '#source-map' --inline --env.server`,
        extractCss: `webpack-dev-server -d --port=${WEB_UI_PORT} --devtool '#source-map' --inline --env.server --env.extractCss`,
        hmr: `webpack-dev-server -d --port=${WEB_UI_PORT} --devtool '#source-map' --inline --hot --env.server`
      },
    },
    serve: 'http-server --cors',
  },
}
