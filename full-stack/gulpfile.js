// Include gulp
var gulp = require('gulp');

gulp.task('copyYAML', function() {
  return gulp.src('server/apiYaml/**/*.yaml', {base: '.'})
    .pipe(gulp.dest('dist/'));
});
