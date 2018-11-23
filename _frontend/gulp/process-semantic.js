const gulp  = require('gulp'),
	watch = require('../node_modules/semantic-ui/tasks/watch'),
	build = require('../node_modules/semantic-ui/tasks/build');
// import task with a custom task name
gulp.task('watch-semantic', watch);
gulp.task('build-semantic', build);
