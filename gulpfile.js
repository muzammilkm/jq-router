// including plugins
var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  jshint = require("gulp-jshint"),
  rename = require("gulp-rename"),
  concat = require("gulp-concat");

// task
gulp.task("jsLint", function() {
  return gulp
    .src("./src/*.js") // path to your files
    .pipe(jshint())
    .pipe(jshint.reporter()); // Dump results
});

// task
gulp.task("minify-js", function() {
  return gulp
    .src(["./src/**/*.js"])
    .pipe(concat("jq-router.js"))
    .pipe(gulp.dest("dist"))
    .pipe(gulp.dest("docs/scripts"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("dist"));
});


gulp.task("default", gulp.series("jsLint", "minify-js"));
