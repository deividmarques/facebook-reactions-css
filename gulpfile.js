/**
 * npm install gulpjs/gulp-cli -g
 * npm install gulpjs/gulp.git#4.0 --save-dev
 */
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    inject       = require('gulp-inject'),
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    ghPages      = require('gulp-gh-pages');

gulp.task('sass', function() {
  return gulp.src('./build/index.html')
    .pipe(inject(
      gulp.src('./source/sass/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(browserSync.stream())
        .pipe(gulp.dest('./build/assets/css')), {
          ignorePath: '/build',
          relative: true
        }
    ))
    .pipe(gulp.dest('./build'));
});


gulp.task('images', function() {
  return gulp.src('./source/images/**/*.+(png|jpeg|jpg|gif|mp4|ico|svg)')
    .pipe(gulp.dest('./build/assets/images'));
});

gulp.task('readme', gulp.series(
  function() {
    return gulp.src('./source/README.md')
      .pipe(gulp.dest('./build'));
  }
));

gulp.task('index', gulp.series(
  function() {
    return gulp.src(['./source/index.html'])
      .pipe(gulp.dest('./build'));
  },
  'readme',
  'sass'
));

gulp.task('reset', function() {
  return require('del')('./build');
});


gulp.task('default', gulp.series(
  'reset',
  'index',
  'images',
  function() {
    browserSync({
      server: {
        baseDir: './build',
        notify: false
      }
    });

    gulp.watch('./source/index.html', gulp.series('index', browserSync.reload));
    gulp.watch('./source/sass/**/*.+(scss|sass)', gulp.series('sass'));
    gulp.watch('./source/images/**/*.+(png|jpeg|jpg|gif|mp4|ico)', gulp.series('images', browserSync.reload));
  })
);

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});
