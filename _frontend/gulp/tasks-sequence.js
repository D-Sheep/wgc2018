const gulp = require('gulp');
const runSequence = require('run-sequence');
const regulations = require('./regulations');

let sequence = [
	'clean',
	[
		'sprite-common',
		'sprite-common-mobile',
		'svg-icons',
		'vendors'
	], [
		'sass',
		'js',
		'vue-js'
	]
];

gulp.task('default', (callback) => {
	runSequence(
		'devel',
		[
			'watch-sass',
			'watch-js',
			'watch-vue-js',
			'watch'
		],
		callback
	);
});

const runTaskSequence = (env, callback) => {
	process.env.NODE_ENV = env;

	regulations.checkForChanges(sequence, (modifiedSequence) => {
		modifiedSequence.push(callback);
		runSequence(...modifiedSequence);
	});
};

gulp.task('devel', (callback) => runTaskSequence('devel', callback));

gulp.task('prod', (callback) => runTaskSequence('production', callback));

//------------------//
// ADMIN GULP TASKS //
//------------------//

let sequenceAdmin = [
	'clean-admin',
	[
		'sass-admin',
		'js-admin'
	]
];

gulp.task('default-admin', (callback) => {
	runSequence(
		[
			'devel',
			'devel-admin'
		], [
			'watch-sass',
			'watch-sass-admin',
			'watch-js',
			'watch-js-admin',
			'watch'
		],
		callback
	);
});

const runTaskSequenceAdmin = (env, callback) => {
	process.env.NODE_ENV = env;

	regulations.checkForChanges(sequenceAdmin, (modifiedSequence) => {
		modifiedSequence.push(callback);
		runSequence(...modifiedSequence);
	});
};

gulp.task('devel-admin', (callback) => runTaskSequenceAdmin('devel', callback));

gulp.task('prod-admin', (callback) => runTaskSequenceAdmin('production', callback));
