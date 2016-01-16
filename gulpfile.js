const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

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
