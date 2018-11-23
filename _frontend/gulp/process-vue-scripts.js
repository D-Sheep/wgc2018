const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const vueify = require('vueify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const gulpif = require('gulp-if');
const watch = require('gulp-watch');
const mergeStream = require('merge-stream');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const walkSync = (dir, flat, filelist) => {

	let files = fs.readdirSync(dir);

	filelist = filelist || [];

	files.forEach((file) => {
		if (flat) {
			return filelist.push(path.join(dir + file));
		}

		if (fs.statSync(dir + file).isDirectory()) {
			filelist = walkSync(path.join(dir + file + '/'), flat, filelist);
		} else {
			filelist.push(path.join(dir + file));
		}
	});

	return filelist;
};

const getAppName = (input) => {
	return input.substring(input.lastIndexOf('/') + 1);
};

const swallowError = (error) => {
	notify({title: error.file}).write(`${error.name} [${error.line}: ${error.column}] ${error.message}`);
	return this.emit('end');
};

const buildVueApp = (namespace, watchDir, isProduction) => {
	let appName = watchDir + '/index.js';

	if (!fs.existsSync(appName)) {
		return false;
	}

	console.log('[Building]: ' + appName);

	let appNamespaceDir = '../assets/vue/' + namespace;

	if (!fs.existsSync(appNamespaceDir)) {
		fs.mkdirSync(appNamespaceDir);
	}

	return new Promise((resolve, reject) => {
		browserify(appName, {standalone: getAppName(watchDir)})
			.on('error', (error) => {
				swallowError(error);
				reject();
			})
			.external(['vue'])
			.transform(vueify)
			.transform(babelify, {presets: ['es2015']})
			.bundle()
			.pipe(source(getAppName(watchDir) + '.js'))
			.pipe(gulpif(isProduction, streamify(uglify())))
			.pipe(gulp.dest(appNamespaceDir)
				.on('end', () => {
					console.log('[Finished]: ' + appName);
					resolve();
				})
			);
	})
		.catch((error) => {
			console.error(error);
		});
};

// env
const isProduction = process.env.NODE_ENV === 'production';

gulp.task('vue-js', () => {
	if (!fs.existsSync('../assets/vue')) {
		fs.mkdirSync('../assets/vue');
	}

	//splice to remove .DS_Store
	_.each(fs.readdirSync('vue/apps/'), (namespace) => {
		_.each(walkSync('vue/apps/' + namespace + '/', true), (vueAppDir) => {
			return buildVueApp(namespace, vueAppDir, isProduction);
		});
	});
});

gulp.task('watch-vue-js', () => mergeStream(
	watch('vue/**/*', () => {
		_.each(fs.readdirSync('vue/apps/'), (namespace) => {
			_.each(walkSync('vue/apps/' + namespace + '/', true), (vueAppDir) => {
				return buildVueApp(namespace, vueAppDir, isProduction);
			});
		});
	})
));
