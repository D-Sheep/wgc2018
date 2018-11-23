const SampleGrid = {
	isActive: false,
	$grid: $('.sample-grid'),
	$fullHdMarker: $('.sample-full-hd-marker'),
	$cols: $('.sample-grid .column'),

	vr: {
		isActive: false,
		$element: $('.sample-vr')
	},

	show() {
		SampleGrid.isActive = true;
		SampleGrid.$grid.css({display: 'block'});
		SampleGrid.$fullHdMarker.css({display: 'block'});
	},

	hide() {
		SampleGrid.isActive = false;
		SampleGrid.$grid.css({display: 'none'});
		SampleGrid.$fullHdMarker.css({display: 'none'});
	},

	showVr() {
		SampleGrid.vr.isActive = true;
		SampleGrid.vr.$element.css({display: 'block'});
	},

	hideVr() {
		SampleGrid.vr.isActive = false;
		SampleGrid.vr.$element.css({display: 'none'});
	},

	setVrHeight() {
		SampleGrid.vr.$element.height(w.$document.height());
	},

	resizeHandler() {
		SampleGrid.setVrHeight();
	},

	initHandler() {
		$(document).keyup((e) => {
			// "g"
			if (e.keyCode === 71) {
				if (SampleGrid.isActive) {
					SampleGrid.hide();
				} else {
					SampleGrid.show();
				}
			}
			// "v"
			/*if ((e.keyCode === 86)) {
				// disabled, now is useless
				return;

				if (SampleGrid.vr.isActive) {
					SampleGrid.hideVr();
				} else {
					SampleGrid.showVr();
				}
			}*/
		});

		if (SampleGrid.isActive) {
			SampleGrid.show();
		}

		if (SampleGrid.vr.isActive) {
			SampleGrid.showVr();
		}

		SampleGrid.setVrHeight();
	}
};
w.autoHandle(SampleGrid);
