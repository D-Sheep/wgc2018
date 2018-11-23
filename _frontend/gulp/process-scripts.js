const vars = require('./vars');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const preprocess = require('gulp-preprocess');
const watch = require('gulp-watch');
const mergeStream = require('merge-stream');
const path = require('path');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');

// js
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');

let isPathInCollection = (path, collection) => {
	return collection.some((checkPath) => {
		return vars.getSimpleFilePath(checkPath) === path;
	});
};

// global function to run from every JS task
const processJavascript = (processLibs, admin = false, changedFile = {}) => {

	if (typeof changedFile.path !== 'undefined') {
		changedFile = vars.getSimpleFilePath(changedFile.path);
	} else {
		changedFile = null;
	}

	const pathToConcat = !admin ? '../js/_concat.js' : '../admin/js/_concat.js';
	const buildDestPath = !admin ? '/front/js' : '/admin/js';

	delete require.cache[require.resolve(pathToConcat)];

	const files = require(pathToConcat);
	const isProduction = process.env.NODE_ENV === 'production';

	if (changedFile !== null) {
		console.log('changed file:', changedFile);
	}

	const stream = mergeStream();

	for (const collectionName in files) {
		const collection = files[collectionName];

		if (collectionName.indexOf('libs') === -1) {
			// Don't lint or minify libs

			if (changedFile !== null && !isPathInCollection(changedFile, collection)) {
				continue;
			}

			// es6
			stream.add(
				gulp.src(collection)
					.pipe(plumber())
					.pipe(eslint())
					.pipe(eslint.result((results) => {
						const errorCount = results.errorCount + results.warningCount;

						if (!errorCount) {
							return;
						}

						const title = 'ES LINT';
						const message = `${path.basename(results.filePath)} (${errorCount} errors)`;
						const errors = results.messages.map((m) => {
							const color = m.severity === 2 ? 'red' : 'yellow';
							const position = `${m.line}:${m.column}`;
							const rule = colors['gray'](`(${m.ruleId})`);
							return `[${colors.blue(position)}] ${colors[color](m.message)} ${rule}`;
						});

						notifier.notify({title, message});
						fancyLog(colors.cyan(title), [message].concat(errors).join('\n'));
					}))
					.pipe(preprocess())
					.pipe(gulpIf(!isProduction, sourcemaps.init()))
					.pipe(concat(collectionName + '.js', {newLine: ';;'}))
					.pipe(gulpIf(isProduction, uglify()))
					.pipe(gulpIf(!isProduction, sourcemaps.write()))
					.pipe(gulp.dest(vars.BUILD_PATH + buildDestPath))
					.pipe(vars.browserSync.stream())
			);

			// es5 fallback
			if (vars.envConfig.BUILD_ES5_ON_DEVELOPMENT || isProduction) {
				stream.add(
					gulp.src(collection)
						.pipe(plumber())
						.pipe(preprocess())
						.pipe(gulpIf(!isProduction, sourcemaps.init()))
						.pipe(concat(collectionName + '.js', {newLine: ';;'}))
						.pipe(babel())
						.pipe(gulpIf(isProduction, uglify()))
						.pipe(gulpIf(!isProduction, sourcemaps.write()))
						.pipe(gulp.dest(vars.BUILD_PATH + buildDestPath + '/es5'))
						.pipe(vars.browserSync.stream())
				);
			}

		} else if (processLibs) {
			// Just concat libs
			stream.add(
				gulp.src(collection)
					.pipe(concat(collectionName + '.js', {newLine: ';;'}))
					.pipe(gulpIf(isProduction, uglify()))
					.pipe(gulp.dest(vars.BUILD_PATH + buildDestPath))
					.pipe(vars.browserSync.stream())
			);
		}
	}

	return stream;
};

gulp.task('js-nolibs-admin', () => processJavascript(false, true));

gulp.task('js', () => processJavascript(true, false));

gulp.task('js-admin', () => processJavascript(true, true));

// watchers
gulp.task('watch-js', () => mergeStream(
	watch(vars.SOURCE_PATH + 'js/**/*.js', (event) => processJavascript(false, false, event)),
	watch(vars.SOURCE_PATH + 'js/_concat.js', ['js'])
));
gulp.task('watch-js-admin', () => mergeStream(
	watch(vars.SOURCE_PATH + 'admin/js/_concat.js', ['js-admin']),
	watch(vars.SOURCE_PATH + 'admin/js/**/*.js', ['js-nolibs-admin'])
));
