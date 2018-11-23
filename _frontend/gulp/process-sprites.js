const vars = require('./vars');
const gulp = require('gulp');
const buffer = require('vinyl-buffer');
const notifier = require('node-notifier');

const spritesmith = require('gulp.spritesmith');
const imagePngquant = require('imagemin-pngquant');
const imageMin = require('gulp-imagemin');

gulp.task('sprite-common', function () {
	const spriteData = gulp.src(vars.SOURCE_PATH + '/sprites/common/*.png')
		.pipe(spritesmith({
			algorithm: 'left-right',
			algorithmOpts: {sort: false},
			imgName: 'sprite-common@2.png',
			cssName: 'sprite-common@2.scss'
		}));

	spriteData.img
		.pipe(buffer())
		.pipe(imagePngquant({quality: '25-35', speed: 1})())
		.pipe(imageMin())
		.pipe(gulp.dest(vars.BUILD_PATH + '/front/sprites/'))
		.on('end', () => {
			notifier.notify({
				title: 'sprite-common',
				message: 'DONE'
			});
		})
	;

	return spriteData.css
		.pipe(gulp.dest(vars.SOURCE_PATH + '/sass/_generated/'));
});

gulp.task('sprite-common-mobile', function () {
	const spriteData = gulp.src(vars.SOURCE_PATH + '/sprites/common-mobile/*.png')
		.pipe(spritesmith({
			algorithm: 'left-right',
			algorithmOpts: {sort: false},
			imgName: 'sprite-common-mobile@2.png',
			cssName: 'sprite-common-mobile@2.scss'
		}));

	spriteData.img
		.pipe(buffer())
		.pipe(imagePngquant({quality: '25-35', speed: 1})())
		.pipe(imageMin())
		.pipe(gulp.dest(vars.BUILD_PATH + '/front/sprites/'))
		.on('end', () => {
			notifier.notify({
				title: 'sprite-common-mobile',
				message: 'DONE'
			});
		})
	;

	return spriteData.css
		.pipe(gulp.dest(vars.SOURCE_PATH + '/sass/_generated/'));
});
