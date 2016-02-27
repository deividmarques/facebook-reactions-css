var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass') // Gets all files ending with .sass in app/sass and children dirs
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
})


gulp.task('watch', function(){
  gulp.watch('app/sass/**/*.sass', ['sass']); 
  // Other watchers
})