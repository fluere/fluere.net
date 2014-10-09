/*jslint node: true */

/**
 * Plugins
 */
var gulp = require('gulp')
  , $ = require('gulp-load-plugins')()
  , path = require('path')
  , server = require('tiny-lr')()
  , stylish = require('jshint-stylish');

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
    '!htdocs/js/all.min.js',
    '!htdocs/js/vendor/**/*.js'
  ],
  watch: {
    styles: [
      'htdocs/**/*.scss'
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
  gulp
    .src(paths.htmlhint)
    .pipe($.plumber())
    .pipe($.htmlhint('.htmlhintrc'))
    .pipe($.htmlhint.reporter())
    .pipe($.livereload(server));
});

/**
 * Compile sass and pleeease.
 */
gulp.task('styles', function() {
  gulp
    .src(paths.styles)
    .pipe($.plumber())
    .pipe($.rename(function(data) {
      data.dirname = path.join(data.dirname, '..', 'css');
      data.basename += '.min';
    }))
    .pipe($.rubySass(options.styles.rubySass))
    .pipe($.pleeease(options.styles.pleeease))
    .pipe(gulp.dest('htdocs/'))
    .pipe($.livereload(server));
});

/**
 * Compile sass, pleeease and csslint.
 */
gulp.task('csslint', function() {
  gulp
    .src(paths.csslint)
    .pipe($.csslint('.csslintrc'));
});

/**
 * Concatenate and minify scripts.
 */
gulp.task('scripts', function() {
  gulp
    .src(paths.scripts)
    .pipe($.plumber())
    .pipe($.concat('all.min.js'))
    .pipe($.uglify(options.scripts.uglify))
    .pipe(gulp.dest('htdocs/js'))
    .pipe($.livereload(server));
});

/**
 * jshint
 */
gulp.task('jshint', function() {
  gulp
    .src(paths.jshint)
    .pipe($.plumber())
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter(stylish))
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
  gulp.watch(paths.watch.styles, ['styles']);
  gulp.watch(paths.csslint, ['csslint']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.jshint, ['jshint']);
});

/**
 * Default task.
 */
gulp.task('default', ['watch']);

/**
 * Task dependencies.
 */
gulp.task('all', ['htmlhint', 'styles', 'csslint', 'scripts', 'jshint']);