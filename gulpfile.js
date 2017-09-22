var gulp = require('gulp')
var browserify = require('browserify')
var stylus = require('gulp-stylus')
var plumber = require('gulp-plumber')
var concat = require('gulp-concat')
var babel = require('gulp-babel')
var livereload = require('gulp-livereload')
var nib = require('nib')
var babelify = require('babelify')
var source = require('vinyl-source-stream')

gulp.task('browserify', function() {
  browserify(['react/main.js', './utils.js', './redux/index.js'])
    .transform(babelify, {presets: ["es2015", "react"]})
    .transform(require('browserify-css'), {
      poll : true
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('public/js/'))
})

gulp.task('stylus', function() {
  gulp.src('./style.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: nib(),
      compress: true
    }))
    .pipe(gulp.dest('public/css/'))
})

gulp.task('antd-css', function() {
  gulp.src('./node_modules/antd/dist/antd.css')
    .pipe(gulp.dest('public/css/'))
})

gulp.task('default', ['browserify', 'stylus', 'antd-css'])

gulp.task('watch', function() {
  livereload.listen(12564)
  gulp.watch(['react/**/*.*', 'redux/**/*.*', 'firebase-api/**/*.*', 'utils.js'], ['default'])
  gulp.watch('style.styl', ['stylus'])
})
