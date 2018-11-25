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


debug(true);

// common config for fb share-popup
$('.js-fbshare').on('click', (e) => {
	e.preventDefault();
	const popUp = window.open($(e.currentTarget).attr('href'), 'Social Share', 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=500,height=400');
	popUp.focus();
});

if (typeof Vue !== 'undefined') {
	window.eventHub = new Vue();
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkZWJ1ZyA9ICgoKSA9PiB7XG5cdC8vRG9uJ3QgdXNlIGRvdCBub3RhdGlvbiBiZWNhdXNlIG9mIElFMTBcblx0Y29uc3QgY29uc29sZU5hbWUgPSAnY29uc29sZSc7XG5cdGNvbnN0IGNvbnNvbGVGdW5jdGlvbnMgPSBbJ2xvZycsICdlcnJvcicsICd3YXJuJywgJ2luZm8nXTtcblx0Y29uc3Qgb3JpZ2luYWxDb25zb2xlRnVuY3Rpb25zID0ge307XG5cdGNvbnNvbGVGdW5jdGlvbnMuZm9yRWFjaCgoZm4pID0+IHtcblx0XHRvcmlnaW5hbENvbnNvbGVGdW5jdGlvbnNbZm5dID0gd2luZG93W2NvbnNvbGVOYW1lXVtmbl07XG5cdH0pO1xuXG5cdHJldHVybiAoZW5hYmxlZCkgPT4ge1xuXHRcdGlmIChlbmFibGVkKSB7XG5cdFx0XHR3aW5kb3cuY2wgPSAoeCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyh4KTtcblx0XHRcdFx0cmV0dXJuIHg7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc29sZUZ1bmN0aW9ucy5mb3JFYWNoKChmbikgPT4ge1xuXHRcdFx0XHR3aW5kb3dbY29uc29sZU5hbWVdW2ZuXSA9IG9yaWdpbmFsQ29uc29sZUZ1bmN0aW9uc1tmbl07XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZUZ1bmN0aW9ucy5mb3JFYWNoKChmbikgPT4ge1xuXHRcdFx0XHR3aW5kb3dbY29uc29sZU5hbWVdW2ZuXSA9ICgpID0+IHVuZGVmaW5lZDtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pKCk7XG5cblxuZGVidWcodHJ1ZSk7XG5cbi8vIGNvbW1vbiBjb25maWcgZm9yIGZiIHNoYXJlLXBvcHVwXG4kKCcuanMtZmJzaGFyZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0Y29uc3QgcG9wVXAgPSB3aW5kb3cub3BlbigkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpLCAnU29jaWFsIFNoYXJlJywgJ21lbnViYXI9bm8sbG9jYXRpb249bm8scmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9bm8sd2lkdGg9NTAwLGhlaWdodD00MDAnKTtcblx0cG9wVXAuZm9jdXMoKTtcbn0pO1xuXG5pZiAodHlwZW9mIFZ1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0d2luZG93LmV2ZW50SHViID0gbmV3IFZ1ZSgpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
