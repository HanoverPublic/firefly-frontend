'use strict';


exports = module.exports = init;

function init(cfg) {
  var rtn = {
    config: require(process.env.firefly_config)
  }

  var gulp = cfg.gulp;
  var concat = require("gulp-concat");
  var size = require('gulp-size');
  var jshint = require('gulp-jshint');
  var jade = require('gulp-jade');
  var del = require('del');
  var tmp = 'tmp';
  var insert = require('gulp-insert');
  var templateCache = require('gulp-angular-templatecache');
  var livereload = require("gulp-livereload");

  rtn.vendorjs = function(files) {
    return function() {
      return gulp.src(files)
        //.pipe(uglify())
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(cfg.dest + '/scripts'))
    }
  };

  rtn.images = function() {
    return function() {
      return gulp.src(cfg.src + 'images/**/*')
        .pipe(gulp.dest(cfg.dest + '/images'))
        .pipe(size());
    }
  };

  rtn.styles = function() {
    return function() {
      gulp.src(cfg.src + 'styles/**/*')
        .pipe(concat("main.css"))
        .pipe(gulp.dest(cfg.dest + '/styles'));
    }
  };

  rtn.scripts = function() {
    return function() {
      return gulp.src(cfg.src + 'scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(size())
        .pipe(gulp.dest(cfg.dest + '/scripts'));
    }
  }


  rtn.jade = function() {
    return function() {
      return gulp.src(cfg.src + '/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(tmp));
    }
  };

  rtn.partials = function() {
    return function() {
      return gulp.src(tmp + '/partials/*.html')
        .pipe(templateCache('templates.js', {
          module: 'signage'
        }))
        .pipe(insert.prepend("'use strict'; \n"))
        .pipe(gulp.dest(cfg.dest + '/scripts'));
    }
  }

  rtn.watch = function() {
    return function() {
      var server = livereload();
      livereload.listen();

      // watch for changes

      gulp.watch([
        cfg.dest + '/**/*.html',
        cfg.dest + '/styles/*.css',
        cfg.dest + '/partials/*.html',
        cfg.dest + '/scripts/*.js',
      ]).on('change', function(file) {
        livereload();
        //server.changed(file.path);
      });


      gulp.watch(cfg.src + '**/styles/**/*.css', rtn.styles());
      gulp.watch(cfg.src + '**/scripts/**/*.js', rtn.scripts());
      gulp.watch(cfg.src + '**/images/**/*', rtn.images());
      gulp.watch(cfg.src + '**/*.jade', rtn.partials());
      gulp.watch(cfg.src + '/*.jade', rtn.partials());

    }

  }

  rtn.clean = function() {
    return function(cb) {
      del([
        cfg.dest + "/partials/*",
        cfg.dest + "/scripts/*",
        cfg.dest + "/styles/*"
      ], {
        force: true
      }, cb);
    }
  }


  return rtn;

}



/*

var util = require('util');
var Orchestrator = require('orchestrator');
var gutil = require('gulp-util');
var deprecated = require('deprecated');
var vfs = require('vinyl-fs');

function Gulp() {
  Orchestrator.call(this);
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.task = Gulp.prototype.add;
Gulp.prototype.run = function() {
  // run() is deprecated as of 3.5 and will be removed in 4.0
  // use task dependencies instead

  // impose our opinion of "default" tasks onto orchestrator
  var tasks = arguments.length ? arguments : ['default'];

  this.start.apply(this, tasks);
};

Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
Gulp.prototype.watch = function(glob, opt, fn) {
  if (typeof opt === 'function' || Array.isArray(opt)) {
    fn = opt;
    opt = null;
  }

  // array of tasks given
  if (Array.isArray(fn)) {
    return vfs.watch(glob, opt, function() {
      this.start.apply(this, fn);
    }.bind(this));
  }

  return vfs.watch(glob, opt, fn);
};

// let people use this class from our instance
Gulp.prototype.Gulp = Gulp;

// deprecations
deprecated.field('gulp.env has been deprecated. ' +
  'Use your own CLI parser instead. ' +
  'We recommend using yargs or minimist.',
  console.warn,
  Gulp.prototype,
  'env',
  gutil.env
);

Gulp.prototype.run = deprecated.method('gulp.run() has been deprecated. ' +
  'Use task dependencies or gulp.watch task triggering instead.',
  console.warn,
  Gulp.prototype.run
);

var inst = new Gulp();
module.exports = inst;

*/


//module.exports = rtn;
