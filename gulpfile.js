/**
 * npm install gulpjs/gulp-cli -g
 * npm install gulpjs/gulp.git#4.0 --save-dev
 */
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    inject       = require('gulp-inject'),
    browserSync  = require('browser-sync'),
    svg          = require('gulp-svgmin'),
    svgstore     = require('gulp-svgstore'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify       = require('gulp-uglify'),
    path         = require('path');
    ghPages      = require('gulp-gh-pages');
    babel        = require('gulp-babel');

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

gulp.task('javascript', function() {
  return gulp.src('./build/index.html')
    .pipe(inject(
      gulp.src('./source/js/**/*.js')
        .pipe(babel())
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('./build/assets/js')), {
          ignorePath: '/build',
          relative:   true
        }
    ))
    .pipe(gulp.dest('./build'));
});

gulp.task('svg', function() {
  return gulp.src('./build/index.html')
    .pipe(inject(gulp.src('./source/images/**/*.svg')
      .pipe(svg(function(file) {
        return {
          plugins: [{
            cleanupIDs: {
              prefix: path.basename(file.relative, path.extname(file.relative)) + '-',
              minify: true
            }
          }]
        };
      }))
      .pipe(svgstore({
        inlineSvg: true,
      })), {
        transform: function(path, file) {
          return file.contents.toString();
        }
      }
    ))
    .pipe(gulp.dest('./build'));
});

gulp.task('images', function() {
  return gulp.src('./source/images/**/*.+(png|jpeg|jpg|gif|mp4|ico|svg)')
    .pipe(gulp.dest('./build/assets/images'));
});

gulp.task('index', gulp.series(
  function() {
    return gulp.src('./source/index.html')
      .pipe(gulp.dest('./build'));
  },
  'sass',
  'javascript',
  'svg'
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
    gulp.watch('./source/js/**/*.js', gulp.series('javascript', browserSync.reload));
    gulp.watch('./source/svg/**/*.svg', gulp.series('svg', browserSync.reload));
    gulp.watch('./source/images/**/*.+(png|jpeg|jpg|gif|mp4|ico)', gulp.series('images', browserSync.reload));
  })
);

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});
