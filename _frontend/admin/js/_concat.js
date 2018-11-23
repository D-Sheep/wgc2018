/**
 * Každý klíč se vybuildí (a zminifikuje) do souboru /assets/dist/js/{key}.js
 */

module.exports = {

	"head": [],
	"libs-admin": [
		"./node_modules/tinymce/tinymce.js",
		"./node_modules/tinymce/themes/modern/theme.js",

		//tinyMce simple plugins
		"./node_modules/tinymce/plugins/link/plugin.js",
		"./node_modules/tinymce/plugins/code/plugin.js",
		"./node_modules/tinymce/plugins/fullscreen/plugin.js",
		"./node_modules/tinymce/plugins/paste/plugin.js",
		"./node_modules/tinymce/plugins/nonbreaking/plugin.js",

		"./js/libs/tinymce/cs.js",

		//filemanager
		'../assets/admin/elfinder/js/standalonepopup.min.js',

		//sweet alerts 2
		"./node_modules/sweetalert2/dist/sweetalert2.js"
	],

	"libs-filemanager": [
		"./node_modules/jquery/dist/jquery.min.js",
		"./node_modules/jquery-ui-dist/jquery-ui.min.js"
	],
	"admin": [
		"./admin/js/components/wysiwyg.js",
		"./admin/js/components/filemanager.js",
		"./admin/js/components/dashboard.js",
		"./admin/js/components/DeleteResource.js",
		"./admin/js/common.js",
	],
	"custom-semantic": [
		"./node_modules/jquery-tablesort/jquery.tablesort.js",
		"./admin/js/components/dashboard.js"
	],
	"homepage": []
};
