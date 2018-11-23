const vars = require('./vars');
const gulp = require('gulp');
const del = require('del');

function processClean(admin = false) {
	let toDelete = [
		vars.BUILD_PATH + "/front",
		'./sass/_generated/**/*.*'
	];

	if (admin) {
		toDelete = [
			vars.BUILD_PATH + "/admin"
		];
	}

	return del(toDelete, {
		force: true
	});
}

gulp.task('clean', () => processClean(false));

gulp.task('clean-admin', () => processClean(true));
