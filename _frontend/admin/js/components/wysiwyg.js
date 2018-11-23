tinyMCE.baseURL = baseUrl + '/assets/dist/vendor/tinymce';

tinymce.init({
	selector: '.tinymce--simple',
	menubar: false,
	plugins: 'link code fullscreen paste nonbreaking',
	entity_encoding: 'raw',
	relative_urls: false,
	remove_script_host: false,
	toolbar: [
		'undo redo | bold italic | link | nonbreaking removeformat code fullscreen',
	],
	paste_as_text: true
});
