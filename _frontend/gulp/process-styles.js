const vars = require('./vars');
const gulp = require('gulp');
const copy = require('gulp-copy');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const preprocess = require('gulp-preprocess');
const watch = require('gulp-watch');
const nodePath = require('path');

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const processSass = (admin = false, changedFile = {}) => {

	if (typeof changedFile.path !== 'undefined') {
		changedFile = vars.getSimpleFilePath(changedFile.path);
	} else {
		changedFile = null;
	}

	let coreFiles = !admin ? 'sass/**/build_**.**' : 'admin/sass/**/build_**.**',
		sectionsFiles = !admin ? 'sass/sections/**.**' : 'admin/sass/sections/**.**',
		componentsFiles = 'sass/components/**.**',
		buildDestFolder = !admin ? '/front/css' : '/admin/css';

	if (changedFile !== null) {
		console.log('changed file:', changedFile);

		const file = changedFile.split(nodePath.sep);

		if (file[0] === 'core') {
			console.log('core file changed - rebuild all');
		} else {
			// common files like `parts.css` or `common.css`
			coreFiles = !admin ? 'sass/' + file[0] + '/build_**.**' : 'admin/sass/' + file[0] + '/build_**.**';

			// expecting files to bechanged:
			// #1 - `./sass/sections/blog.scss` => generate `blog.css`
			// #2 - `./sass/sections/blog/blog-carousel.scss` => generate `blog.css`
			// --> it means that `sections/parts.scss` and `sections/common.scss` are forbidden
			if (file[0] === 'sections') {
				sectionsFiles = !admin ? 'sass/sections/' + file[1] : 'admin/sass/sections/' + file[1];
			} else if (file[0] === 'components') {
				componentsFiles = 'sass/components/' + file[1];
			} else {
				sectionsFiles = !admin ? 'sass/sections/' + file[0] + '.scss' : 'admin/sass/sections/' + file[0] + '.scss';
			}
		}
	}

	const sassFiles = [
		vars.SOURCE_PATH + coreFiles,
		vars.SOURCE_PATH + componentsFiles,
		vars.SOURCE_PATH + sectionsFiles
	];

	const isProduction = process.env.NODE_ENV === 'production';

	return gulp.src(sassFiles)
		.pipe(plumber())
		.pipe(gulpIf(!isProduction, sourcemaps.init()))
		.pipe(sass({includePaths: vars.includePaths}))
		.on('error', vars.swallowSassError)
		.pipe(autoprefixer({
			browsers: ['last 5 versions', 'ie >= 11'],
			cascade: false
		}))
		.pipe(preprocess({context: {TIMESTAMP: Date.now()}}))
		.pipe(gulpIf(isProduction, cleanCSS({rebase: false}))) //{compatibility: 'ie8'}
		.pipe(rename((path) => {
			path.dirname = '';
			path.basename = path.basename.replace('build_', '');
		}))
		.pipe(gulpIf(!isProduction, sourcemaps.write()))
		.pipe(gulp.dest(vars.BUILD_PATH + buildDestFolder))
		.pipe(vars.browserSync.stream());
};

// tasks
gulp.task('sass', () => processSass(false));

gulp.task('sass-admin', () => processSass(true));

// watchers
gulp.task('watch-sass', () => watch(vars.SOURCE_PATH + 'sass/**/*.scss', (event) => processSass(false, event)));

gulp.task('watch-sass-admin', () => watch(vars.SOURCE_PATH + 'admin/sass/**/*.scss', ['sass-admin']));
