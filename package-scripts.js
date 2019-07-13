const { series, crossEnv, concurrent, rimraf } = require('nps-utils')
const WEB_UI_PORT = 9000;

module.exports = {
  scripts: {
    default: 'nps webpack',
    test: {
      default: 'nps test.jest',
      jest: {
        default: 'jest --config test/jest.config.js',
        accept: 'jest --config test/jest.config.js -u',
        coverage: 'jest --config test/jest.config.js --coverage',
        watch: 'jest --config test/jest.config.js --watch',
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
    e2e: {
      default: concurrent({
        webpack: `webpack-dev-server -d --port=${WEB_UI_PORT}`,
        cypress: 'nps e2e.whenReady',
      }) + ' --kill-others --success first',
      ci: concurrent({
        webpack: `webpack-dev-server -d --port=${WEB_UI_PORT}`,
        cypress: 'nps e2e.whenReady.ci',
      }) + ' --kill-others --success first',
      cypress: {
        default: 'cypress open',
        ci: `node test/cypress-mochawesome.js`,
      },
      whenReady: {
        default: series(
          `wait-on --timeout 120000 http-get://localhost:${WEB_UI_PORT}/index.html`,
          'nps e2e.cypress'
        ),
        ci: series(
          `wait-on --timeout 120000 http-get://localhost:${WEB_UI_PORT}/index.html`,
          'nps e2e.cypress.ci'
        ),
      },
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
