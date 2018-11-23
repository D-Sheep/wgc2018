const vars = require('./vars');
const {map, afterCopyCallback} = require('../js/_vendors.js');
const gulp = require('gulp');
const mergeStream = require('merge-stream');

gulp.task('vendors', () => {
	const stream = mergeStream();

	for (let nodeFolder in map) {
		if (map.hasOwnProperty(nodeFolder) === false) {
			continue;
		}

		let source = './node_modules/' + nodeFolder;
		let destination = vars.BUILD_PATH + '/vendor/' + map[nodeFolder];
		stream.add(
			gulp
				.src(source)
				.pipe(gulp.dest(destination))
		);
	}

	stream.on('end', afterCopyCallback);
	return stream;
});
