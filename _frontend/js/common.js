const debug = (() => {
	//Don't use dot notation because of IE10
	const consoleName = 'console';
	const consoleFunctions = ['log', 'error', 'warn', 'info'];
	const originalConsoleFunctions = {};
	consoleFunctions.forEach((fn) => {
		originalConsoleFunctions[fn] = window[consoleName][fn];
	});

	return (enabled) => {
		if (enabled) {
			window.cl = (x) => {
				console.log(x);
				return x;
			};
			consoleFunctions.forEach((fn) => {
				window[consoleName][fn] = originalConsoleFunctions[fn];
			});
		} else {
			consoleFunctions.forEach((fn) => {
				window[consoleName][fn] = () => undefined;
			});
		}
	};
})();

// @if NODE_ENV = 'production'
debug(false);
// @endif

// @if NODE_ENV = 'devel'
debug(true);
// @endif

// common config for fb share-popup
$('.js-fbshare').on('click', (e) => {
	e.preventDefault();
	const popUp = window.open($(e.currentTarget).attr('href'), 'Social Share', 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=500,height=400');
	popUp.focus();
});

if (typeof Vue !== 'undefined') {
	window.eventHub = new Vue();
}
