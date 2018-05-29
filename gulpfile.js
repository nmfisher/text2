var gulp = require('gulp');
var ngBuild = require('gulp-ng-build');
var exec = require('gulp-exec');
var run = require('gulp-run');
const shell = require('gulp-shell')
 
gulp.task('default', function() {
     shell(['ng build'])
});

/*gulp.task('express', 
, function(){
   console.log('build done with success'); 
});
 
gulp.task('html', function(){
  return gulp.src('client/templates/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build/html'))
});

gulp.task('css', function(){
  return gulp.src('client/templates/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
}); */

          
