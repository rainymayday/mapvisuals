var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./",
       index: "index.html"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch(["*.html","js/*.js","css/*.css","data/*.csv","data/*.json","data/*.geojson"], ['bs-reload']);
});
