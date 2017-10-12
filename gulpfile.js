// including plugins
var gulp = require('gulp'), 
	uglify = require("gulp-uglify"),
	jshint = require("gulp-jshint"),
	rename = require("gulp-rename");

gulp.task('default', function(){
	gulp
		.start('jsLint')
		.start('minify-js');
});

// task
gulp.task('jsLint', function () {
    gulp.src('./src/*.js') // path to your files
    .pipe(jshint())
    .pipe(jshint.reporter()); // Dump results
});
 
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
