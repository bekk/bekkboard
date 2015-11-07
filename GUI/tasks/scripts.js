module.exports = function (minify) {

  return function scripts () {

    var buffer     = require('vinyl-buffer'),
        browserify = require('browserify'),
        gulp       = require('gulp'),
        gulpif     = require('gulp-if'),
        source     = require('vinyl-source-stream'),
        uglify     = require('gulp-uglify'),
        watchify   = require('watchify');

    var c = require("./config");

    var watch = process.env.GULP_IS_WATCH;

    var bundler = browserify(c.PATH_JS_ENTRY, {
      debug: !minify, // source maps
      cache: {},
      packageCache: {},
      fullPaths: watch
    });

    if (watch) {
      bundler = watchify(bundler);
    }

    bundler
      .transform('brfs')
      .on('update', rebundle);

    return rebundle();

    function rebundle () {
      var stream = bundler.bundle();
      return gulpif(minify, stream, stream.on('error', c.notifyError('Browserify')))
        .pipe(source(c.TARGET_FILE_JS))
        .pipe(buffer())
        .pipe(gulpif(minify, uglify().on('error', function () { console.log(arguments); })))
        .pipe(gulp.dest(c.target(c.TARGET_FOLDER_JS)))
        .pipe(gulpif(watch, c.notify("Browserify", 'reloaded')));
    }
  };
};

module.exports.deps = ['lint'];
