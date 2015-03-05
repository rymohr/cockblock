var gulp = require("gulp");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var project = require("./package.json");

gulp.task("build", function() {
  gulp.src("./cockblock.js")
    .pipe(replace("VERSION", project.version))
    .pipe(gulp.dest("dist"))
    .pipe(rename("cockblock.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task("lint", function() {
  gulp.src(["./cockblock.js"])
    .pipe(jshint())
    .pipe(jshint.reporter());
});

gulp.task("default", function() {
  gulp.run("lint", "build");
});
