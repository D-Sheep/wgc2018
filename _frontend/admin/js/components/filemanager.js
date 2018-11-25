const FileManager = {

	$modal: null,

	init: function (triggerPath) {

		this.$modal = $('#filemanager_modal').modal({
			onHidden: function () {
				$(this).empty();
			}
		});

		$(triggerPath).click((e) => {
			e.preventDefault();
			this.popModal($(e.target))
		});
	},

	popModal: function ($el) {

		let $filemanagerEl = $('<iframe>', {
			css: {
				width: '100%',
				height: '80vh'
			},
			src: filemanagerPopupUrl + '/' + $el.data('input-id')
		});

		this.$modal.append($filemanagerEl);
		this.$modal
				.modal('show').height('80%');
	},

	//override default fuction, function to update the file selected by elfinder
	processSelectedFile: function (filePath, requestingField) {
		$('#' + requestingField).val(filePath).trigger('change');
		$('#' + requestingField + '_img').prop('src', baseUrl + '/' + filePath);
		this.$modal.modal('hide')
	}
};

FileManager.init('.filemanager__trigger');
