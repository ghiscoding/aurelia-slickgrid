let gulp = require('gulp');
let runSequence = require('run-sequence');
let to5 = require('gulp-babel');
let paths = require('../paths');
let sass = require('gulp-sass');
let compilerOptions = require('../babel-options');
let assign = Object.assign || require('object.assign');

gulp.task('build-html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'es2015'))
    .pipe(gulp.dest(paths.output + 'commonjs'))
    .pipe(gulp.dest(paths.output + 'amd'))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-css', function() {
  return gulp.src(paths.css)
    .pipe(gulp.dest(paths.output + 'es2015'))
    .pipe(gulp.dest(paths.output + 'commonjs'))
    .pipe(gulp.dest(paths.output + 'amd'))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-scss', function() {
  return gulp.src(paths.scss)
    .pipe(gulp.dest(paths.output + 'styles/sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.output + 'styles/css'));
});

gulp.task('build-scss-root', function() {
  return gulp.src(paths.scssRoot)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.output + 'es2015'))
    .pipe(gulp.dest(paths.output + 'commonjs'))
    .pipe(gulp.dest(paths.output + 'amd'))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-es2015', function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.es2015())))
    .pipe(gulp.dest(paths.output + 'es2015'));
});

gulp.task('build-commonjs', function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.commonjs())))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.amd())))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', function() {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-html', 'build-scss', 'build-scss-root', 'build-css', 'build-es2015', 'build-commonjs', 'build-amd', 'build-system'],
    callback
  );
});
