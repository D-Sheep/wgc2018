const vars = require('./vars');
const gulp = require('gulp');
const watch = require('gulp-watch');
const mergeStream = require('merge-stream');

gulp.task('watch', () => {
	const config = vars.envConfig;

	const stream = mergeStream(
		watch(vars.SOURCE_PATH + '/sprites/common/*.png', ['sprite-common']),
		watch(vars.SOURCE_PATH + '/sprites/common-mobile/*.png', ['sprite-common-mobile']),
		watch(vars.SOURCE_PATH + '/svg_icons/*.svg', ['svg-icons'])
	);

	vars.browserSync.init({
		proxy: config.PROXY || 'localhost',
		open: (config.PROXY_OPEN === 'true') || false,
		ghostMode: {
			clicks: config.browsersync.clicks,
			forms: config.browsersync.forms,
			scroll: config.browsersync.scroll
		}
	});

	return stream;
});
