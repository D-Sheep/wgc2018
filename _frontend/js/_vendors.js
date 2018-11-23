/**
 * Copying directories and files from /_frontend/node_modules do /assets/dist/vendor
 *
 * Good for copying a whole 'dist' directory or a package
 * Especially if it needs a lot of files, images, fonts etc.
 *
 * It's basically bower :)
 *
 * Examples of what to define:
 *
 * Copying an individual file
 *
 * 'semantic-ui/dist/semantic.min.css': 'semantic-ui',
 * 'semantic-ui/dist/semantic.min.js': 'semantic-ui',
 *
 * Copying a directory recursively
 *
 * 'semantic-ui/dist/themes/default/**': 'semantic-ui/themes/default',
 * 'bootstrap/dist/**': 'bootstrap',
 * 'font-awesome/css/**': 'font-awesome/css',
 * 'font-awesome/fonts/**': 'font-awesome/fonts',
 *
 */

module.exports = {

	map: {
		//tinymce
		'tinymce/skins/**' : 'tinymce/skins',
		//filemanager
		'jquery-ui-dist/jquery-ui.css' : 'jquery-ui-dist',
		'jquery-ui-dist/images/**' : 'jquery-ui-dist/images'
	},

	afterCopyCallback() {
		// If you need to modify the copied files, here's the place to do so
	}

};
