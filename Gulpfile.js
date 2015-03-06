var gulp = require("gulp");
var header = require("gulp-header");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var transform = require("vinyl-transform");
var browserify = require("browserify");
var pkg = require("./package.json");

var banner = [
"// cockblock.js v<%= pkg.version %>",
"// Copyright (c) 2015 Ryan Mohr",
"// Released under the MIT license",
""].join("\n");

gulp.task("build", function() {
  var browserified = transform(function(filename) {
    var b = browserify().require(filename);
    return b.bundle();
  });

  gulp.src("./index.js")
    .pipe(browserified)
    .pipe(rename("cockblock.js"))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest("dist"))
    .pipe(rename("cockblock.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task("lint", function() {
  gulp.src(["./index.js"])
    .pipe(jshint())
    .pipe(jshint.reporter());
});

gulp.task("default", function() {
  gulp.run("lint", "build");
});
