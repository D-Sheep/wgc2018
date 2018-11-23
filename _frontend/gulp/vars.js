const gulp = require('gulp');
const notify = require('gulp-notify'); // needed for swallowSassError
const browserSync = require('browser-sync').create();
const nodePath = require('path');

// use default setting or custom from got ignored '_env.json'
let envConfig = require('../_env-default.json');
try {
	envConfig = require('../_env.json');
} catch (e) {

}

let includePaths = [
	'node_modules/bourbon/app/assets/stylesheets',
	'node_modules/support-for/sass',
	'node_modules/normalize-scss/sass',
	'node_modules/foundation-sites/scss',
	'node_modules/semantic-ui',
	'node_modules/jquery/dist/',
	'node_modules/jquery-tablesort/'
];

//object with regulated packages, key = package name, value = task to be added if version changed
let REGULATED_PACKAGES = {
	'semantic-ui': 'build-semantic'
};

// dont use `fat arrow` function, callback get own `this`
function swallowSassError(error) {
	console.log('--------ERROR-SASS--------');
	notify({title: error.relativePath}).write('[' + error.line + ':' + error.column + '] ' + error.messageOriginal);

	this.emit('end');
}

const getSimpleFilePath = (path) => {
	return path.split(nodePath.sep).slice(-2).join(nodePath.sep);
};

module.exports = {
	SOURCE_PATH: '',
	BUILD_PATH: '../assets/dist',
	SVGICONS_TARGETPATH: '_generated/svg-icons.scss',
	REGULATED_PACKAGES,
	REGULATED_PACKAGES_FILENAME: 'regulated-packages.json',
	includePaths: includePaths,
	browserSync: browserSync,
	envConfig: envConfig,
	getSimpleFilePath: getSimpleFilePath,
	swallowSassError: swallowSassError,
	webPageTestAPIKey: 'A.798dc9aa2ea404d14349ee9776bd615c', //API is limited to 200 tests per key per day
	facebookAccessToken: '1569440559977628|7Yi0hMiVx_7CdngTibTWEKl23GA' //Bistro FB app access token, see https://developers.facebook.com/tools/accesstoken/
};
