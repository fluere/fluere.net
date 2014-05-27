/*jslint node: true */

/**
 * Plugins
 */
var gulp = require('gulp')
  , path = require('path')
  , rename = require('gulp-rename')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , less = require('gulp-less')
  , prefix = require('gulp-autoprefixer')
  , csslint = require('gulp-csslint')
  , htmlhint = require('gulp-htmlhint')
  , livereload = require('gulp-livereload')
  , plumber = require('gulp-plumber')
  , lr = require('tiny-lr')
  , server = lr();

/**
 * Paths
 */
var paths = {
  scripts: [
    'htdocs/js/_util.js',
    'htdocs/js/_common.js',
    'htdocs/js/_soundtracks.js'
  ],
  jshint: [
    'gulpfile.js',
    'htdocs/**/*.js',
    '!htdocs/js/all.min.js',
    '!htdocs/js/vendor/**/*.js'
  ],
  styles: [
    'htdocs/**/*.less',
    '!htdocs/**/_*.less'
  ],
  htmlhint: [
    'htdocs/_sample/**/*.html'
  ],
  watch: {
    styles: [
      'htdocs/**/*.less'
    ]
  }
};

/**
 * Options
 */
var options = {
  scripts: {
    uglify: {
      preserveComments: 'some',
      outSourceMap: true
    }
  },
  styles: {
    less: {
      paths: ['htdocs/_less/utility/'],
      compress: true
    },
    prefix: ['> 1%', 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 4']
  }
};

/**
 * Concatenate and minify scripts.
 */
gulp.task('scripts', function() {
  gulp
    .src(paths.scripts)
    .pipe(plumber())
    .pipe(concat('all.min.js'))
    .pipe(uglify(options.scripts.uglify))
    .pipe(gulp.dest('htdocs/js'))
    .pipe(livereload(server));
});

/**
 * jshint
 */
gulp.task('jshint', function() {
  gulp
    .src(paths.jshint)
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(livereload(server));
});

/**
 * Compile less and csslint.
 */
gulp.task('styles', function() {
  gulp
    .src(paths.styles)
    .pipe(plumber())
    .pipe(less(options.styles.less))
    .pipe(prefix(options.styles.prefix))
    .pipe(rename(function(data) {
      data.dirname = path.join(data.dirname, '..', 'css');
      data.basename += '.min';
    }))
    .pipe(gulp.dest('htdocs/'))
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter())
    .pipe(livereload(server));
});

/**
 * htmlhint
 */
gulp.task('htmlhint', function() {
  gulp
    .src(paths.htmlhint)
    .pipe(plumber())
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    .pipe(livereload(server));
});

/**
 * Task dependencies.
 */
gulp.task('all', ['scripts', 'jshint', 'styles', 'htmlhint']);

/**
 * Live Reload.
 */
gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }
  });
});

/**
 * Watch.
 */
gulp.task('watch', ['lr-server'], function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.jshint, ['jshint']);
  gulp.watch(paths.watch.styles, ['styles']);
  gulp.watch(paths.htmlhint, ['htmlhint']);
});

/**
 * Default task.
 */
gulp.task('default', ['watch']);