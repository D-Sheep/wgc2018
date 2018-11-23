const vars = require('./vars');
const gulp = require('gulp');
const plumber = require('gulp-plumber');

const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

// svg icon font
gulp.task('svg-icons', () => {
	return gulp.src([vars.SOURCE_PATH + 'svg_icons/*.svg'])
		.pipe(plumber())
		.pipe(iconfontCss({
			fontName: 'svgicons',
			path: vars.SOURCE_PATH + 'gulp/_svg-icons_template.scss.mustache',
			targetPath: vars.SVGICONS_TARGETPATH,
			fontPath: '../svg_icons/'
		}))
		.pipe(iconfont({
			fontName: 'svgicons',
			prependUnicode: true,
			formats: [
				'ttf', 'eot', 'woff', 'svg', 'woff2' // https://github.com/nfroidure/gulp-iconfont/issues/64 - disable 'woff2' if causing problems
			],
			normalize: true,
			fontHeight: 1001,
			timestamp: Math.round(Date.now())
		}))
		.pipe(gulp.dest(vars.BUILD_PATH + '/front/svg_icons'));
});
