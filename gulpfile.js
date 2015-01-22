var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var karma = require('gulp-karma');
var livereload = require('gulp-livereload');

var testFiles = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/modulejs/dist/modulejs.min.js',
    'fixtures/sample_script.js',
    'src/helpers.js',
    'spec/helpers_spec.js',
];

var distJsFiles = [
    'src/helpers.js'
];

// include modulejs in development

var developmentJsFiles = [
    'bower_components/modulejs/dist/modulejs.min.js',
    'src/helpers.js'
];


gulp.task('default', function(){
  gulp.start('lint');
  gulp.start('test');
  gulp.start('compress');
  gulp.start('copy');
});

gulp.task('lint', function() {
  gulp.src(distJsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots', 'coverage']
    }));
});

gulp.task('compress', function() {
  gulp.src(distJsFiles)
    .pipe(uglify({outSourceMap: false}))
    .pipe(concat("abs_helpers_modulejs.min.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('copy', function() {
  gulp.src(distJsFiles)
    .pipe(concat("abs_helpers_modulejs.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
    var server = livereload();
    gulp.watch(['src/*.js', '*.html'], function(files) {
      server.changed(files.path); // livereload notification
    });
    gulp.src(testFiles)
        .pipe(karma({
          configFile: 'karma.conf.js',
          action: 'watch'
        }));
});






