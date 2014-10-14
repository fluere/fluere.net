/*jslint node: true */

/**
 * Plugins
 */
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    server = require('tiny-lr')(),
    stylish = require('jshint-stylish');

/**
 * Paths
 */
var paths = {
  htmlhint: [
    'htdocs/_sample/**/*.html'
  ],
  styles: [
    'htdocs/**/*.scss'
  ],
  csslint: [
    'htdocs/**/*.css',
    '!htdocs/**/vendor/**/*.css'
  ],
  scripts: [
    'htdocs/js/_util.js',
    'htdocs/js/_common.js',
    'htdocs/js/_soundtracks.js'
  ],
  jshint: [
    'gulpfile.js',
    'htdocs/**/*.js',
    '!htdocs/**/*.min.js',
    '!htdocs/**/vendor/**/*.js'
  ],
  reload: [
    'htdocs/**/*.*',
    '!htdocs/**/_*.*',
  ]
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
    rubySass: {
      loadPath: 'htdocs/_sass/',
      style: 'expanded',
      'sourcemap=none': true
    },
    pleeease: {
      autoprefixer: {
        'browsers': ['last 2 versions', 'ie >= 8', 'ios >= 6', 'android >= 2.3']
      },
      filters: false,
      rem: ['10px'],
      opacity: false,
      minifier: true
    }
  }
};

/**
 * htmlhint
 */
gulp.task('htmlhint', function() {
  return gulp
    .src(paths.htmlhint)
    .pipe($.plumber())
    .pipe($.cached('htmlhint'))
    .pipe($.htmlhint('.htmlhintrc'))
    .pipe($.htmlhint.reporter());
});

/**
 * Compile sass and pleeease.
 */
gulp.task('styles', function() {
  return gulp
    .src(paths.styles)
    .pipe($.plumber())
    .pipe($.rename(function(data) {
      data.dirname = path.join(data.dirname, '..', 'css');
      data.basename += '.min';
    }))
    .pipe($.rubySass(options.styles.rubySass))
    .pipe($.pleeease(options.styles.pleeease))
    .pipe(gulp.dest('htdocs'));
});

/**
 * csslint
 */
gulp.task('csslint', ['styles'], function() {
  return gulp
    .src(paths.csslint)
    .pipe($.cached('csslint'))
    .pipe($.csslint('.csslintrc'));
});

/**
 * Concatenate and minify scripts.
 */
gulp.task('scripts', function() {
  return gulp
    .src(paths.scripts)
    .pipe($.plumber())
    .pipe($.concat('all.min.js'))
    .pipe($.uglify(options.scripts.uglify))
    .pipe(gulp.dest('htdocs/js'));
});

/**
 * jshint
 */
gulp.task('jshint', function() {
  return gulp
    .src(paths.jshint)
    .pipe($.plumber())
    .pipe($.cached('jshint'))
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter(stylish));
});

/**
 * Reload browser.
 */
gulp.task('reload', function() {
  return gulp
    .src(paths.reload)
    .pipe($.cached('reload'))
    .pipe($.livereload(server));
});

/**
 * Live reload.
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
  gulp.watch(paths.htmlhint, ['htmlhint']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.csslint, ['csslint']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.jshint, ['jshint']);
  gulp.watch(paths.reload, ['reload']);
});

/**
 * Default task.
 */
gulp.task('default', ['watch']);

/**
 * Task dependencies.
 */
gulp.task('all', ['htmlhint', 'styles', 'csslint', 'scripts', 'jshint', 'reload']);