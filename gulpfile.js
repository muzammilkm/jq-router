// including plugins
var gulp = require('gulp'), 
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename");
 
// task
gulp.task('minify-js', function () {
	gulp.src('./src/*.js')
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('docs/scripts'));

    gulp.src('./src/*.js') // path to your files
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});
