const DeleteResource = {

	requests: [],

	init(classSelector) {
		this.bind(classSelector);
	},

	bind(classSelector) {
		$(classSelector).click((e) => {
			e.preventDefault();
			let $item = $(e.currentTarget);

			swal($.extend({}, swalDefaults, {
					type: 'question',
					title: 'Opravdu chcete smazat '+ $item.data('name') +'?',
					confirmButtonClass: 'ui green button',
					showCancelButton: true,
					confirmButtonText: 'Ano, smazat',
					cancelButtonText: 'Nechci!',
				})
			)
			.then((result) => {
				if (result.value) {
					this.delete($item);
				}
			});
		});
	},

	delete($item) {

		let url = $item.attr('href');

		if (url in this.requests) {
			//request already pending
			return false;
		}

		this.requests[url] = $.ajax({
			url: url,
			method: 'POST',
			headers: {
				'X-CSRF-TOKEN': csrfToken
			},
			data: {
				'_method': 'DELETE',
			},
			beforeSend: () => {
				$item.addClass('disabled');
			}
		})
		.done((data) => {
			swal($.extend({}, swalDefaults, {
				type: 'success',
				title: 'Smazáno',
			}));
			$item.closest('tr').remove();
		})
		.fail((error) => {
			swal($.extend({}, swalDefaults, {
				type: 'error',
				title: 'Chyba ' + error.status + ': ',
				text: error.responseJSON.message,
			}));
			console.log(error);
			$item.removeClass('disabled');
		})
		.always(() => {
			delete this.requests[url];
		});
	}

};

DeleteResource.init('.delete-item');
