/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

var gulp = require('gulp-help')(require('gulp'));
var buffer = require('vinyl-buffer');
var coveralls = require('gulp-coveralls');
var fs = require('fs');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('jshint-stylish');

gulp.task('jshint', 'Lint code semantics with JSHint.', function () {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('jscs', 'Lint code style with JSCS.', function () {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jscs());
});

gulp.task('lint', 'Lint code semantics and style.', ['jshint', 'jscs']);

gulp.task('test', 'Run tests.', function () {
  return gulp.src('test/**/*.js')
    .pipe(mocha({
      timeout: 6000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    }));
});

gulp.task('instrument', 'Instrument code using jscoverage.', function () {
  return gulp.src('lib/**/*.js')
    .pipe(instrument())
    .pipe(gulp.dest('lib-cov'));
});

gulp.task(
  'watch',
  'Watch for code changes and run linters and tests',
  ['jshint', 'jscs', 'test'],
  function () {
    gulp.watch(['lib/**/*.js', 'test/**/*.js'], ['jshint', 'jscs', 'test']);
  });

gulp.task('default', [process.env.NODE_ENV === 'production' ? 'dist' : 'watch']);
