//////////////////////////////////////////////////
// load gulp
//////////////////////////////////////////////////

var gulp = require('gulp');

//////////////////////////////////////////////////
// load other gulp stuffs
//////////////////////////////////////////////////

var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var karmaServer = require('karma').Server;
var mocha = require('gulp-mocha');
var minifyCSS = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

//////////////////////////////////////////////////
// paths
//////////////////////////////////////////////////

var filePaths = {
  sass: ['client/sass/**/*.scss']
};

var dirPaths = {
  css: 'client/assets/css/'
};

//////////////////////////////////////////////////
// default task
//////////////////////////////////////////////////

gulp.task('default', ['watch', 'start']);
gulp.task('test', ['mocha', 'karma']);
gulp.task('lint', ['jshint', 'eslint']);

//////////////////////////////////////////////////
// styles task
//////////////////////////////////////////////////

gulp.task('styles', function() {
  gulp.src(filePaths.sass)
    .pipe(sass({
      outputStyle: 'expanded'
    })
    .on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(dirPaths.css))
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dirPaths.css));
});

//////////////////////////////////////////////////
// watcher task
//////////////////////////////////////////////////

gulp.task('watch', function() {
  gulp.watch(filePaths.sass, ['styles']);
});

//////////////////////////////////////////////////
// Server test task (mocha)
//////////////////////////////////////////////////

gulp.task('mocha', function () {
  return gulp.src('specs/server/**/*.test.server.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

//////////////////////////////////////////////////
// Client test task (karma)
//////////////////////////////////////////////////

gulp.task('karma', function (done) {
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

//////////////////////////////////////////////////
// start the server task
//////////////////////////////////////////////////

gulp.task('start', function () {
  nodemon({ script: 'server/server.js',
            ext: 'html js',
            ignore: ['ignored.js']
            //tasks: ['lint']
          })
    .on('restart', function () {
      console.log('restarted!');
    });
});

gulp.task('jshint', function() {
  return gulp.src(['./client/app/**/*.js', './server/**/*.js', './specs/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('eslint', function () {
  return gulp.src(['./client/app/**/*.js', './server/**/*.js', './specs/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});
