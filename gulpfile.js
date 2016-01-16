'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');

gulp.task('test', () => {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', gutil.log);
});

gulp.task('daemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js'
  })
  .on('restart', function() {
    console.log('restarted!');
  })
});

gulp.task('default', ['daemon']);
