/*
	You can use:

	Scroll.to(100);
	Scroll.to(100, 50);
	Scroll.to(100, 50, function() { });
	Scroll.to(100, function() { });
	Scroll.to(function() { }); //Target
	Scroll.to(function() { }, function() { }); //Target and callback
	Scroll.to(function() { }, function() { }, null); //Target and offset
	Scroll.to(function() { }, function() { }, function() { }); //Target, offset, callback
	Scroll.to(2000, 'center');
	Scroll.to('=2000');
	Scroll.to('~.contact');
	Scroll.to($element, 'center');
	Scroll.to(htmlElement, 'center');
 */

const Scroll = {
	vars() {
		this.navHeight = 0;
	},

	get(target, offset) {
		({target, offset} = this._extractArguments(target, offset, null));

		if (typeof target === 'string') {
			({string: target, offset} = this._extractMetaChars(target, offset));

			//Try to make it a number
			const numeric = parseInt(target, 10);
			if (!Number.isNaN(numeric)) {
				target = numeric;
			} else {
				target = $(target);
			}
		}

		if (typeof target === 'number') {
			switch (offset) {
				case 'top': offset = 0; break;
				case 'fit': case 'center': offset = (w.height - this.navHeight) / 2 - this.navHeight; break;
				case 'bottom': offset = w.height - this.navHeight; break;
				default: throw new Error(`Unknown scroll offset: ${offset}`);
			}
		} else if (!(target instanceof jQuery)) { //If target is a HTMLElement
			target = $(target);
		}

		//target is now either a number or jQuery element

		if (target instanceof jQuery) {
			if (!target.length) { //No such element found, can't scroll
				return false;
			}
			if (offset === 'fit') { //Resolve 'fit' offset
				offset = target.outerHeight() > w.height - this.navHeight ? 'top' : 'center';
			}
			switch (offset) {
				case 'top': offset = 0; break;
				case 'center': offset = (w.height - this.navHeight - target.outerHeight()) / 2; break;
				case 'bottom': offset = w.height - this.navHeight - target.outerHeight(); break;
				default: throw new Error(`Unknown scroll offset: ${offset}`);
			}
			target = target.offset().top;
		}

		//target is now definitely a number

		offset = Math.max(0, Math.min(Math.ceil(target - (offset + this.navHeight)), $(document).height() - w.height));

		return {
			offset,
			duration: Math.max(1, Math.min(2, Math.abs(w.top - offset) / 1000))
		};
	},

	to(target, offset, callback) {
		({target, offset, callback} = this._extractArguments(target, offset, callback));

		let duration;
		({offset, duration} = this.get(target, offset));

		// autoKill doesn't work on iOS
		if (w.device.ios || typeof TweenLite === 'undefined') {
			$("html, body").animate({scrollTop: offset}, duration * 1000, 'swing', callback);
		} else {
			TweenLite.to(window, duration, {
				scrollTo: {
					y: offset,
					autoKill: true,
					onAutoKill: () => { callback(false); }
				},
				ease: Power3.easeInOut,
				onComplete: () => { callback(true); }
			});
		}

		return {
			offset,
			duration
		};
	},

	resizeEndHandler() {
		this.vars();
	},

	initHandler() {
		this.vars();

		w.$document.on('click', '.jQscrollTo, [data-scrollto]', (e) => {
			e.preventDefault();

			const $trigger = $(e.target);
			const offset = $trigger.data('offset');

			// only ID into href, put custom selectors into data-scrollto
			const target = String($trigger.data('scrollto') !== undefined ? $trigger.data('scrollto') : $trigger.attr('href'));

			Scroll.to(target, offset);
		});
	},

	_extractMetaChars(str, offset) {
		const metaChars = [
			{char: '^', offset: 'top'},
			{char: '=', offset: 'center'},
			{char: '~', offset: 'fit'},
			{char: '_', offset: 'bottom'}
		];

		// decode shorthand offsets
		metaChars.some((mapping) => {
			if (str.charAt(0) === mapping.char) {
				({offset} = mapping);
				str = str.substr(1);
				return true;
			}
			return false;
		});

		return {
			offset: offset !== undefined ? offset : 'top',
			string: str
		};
	},

	_extractArguments(target, offset, callback) {
		if (typeof target === 'function') {
			target = target();
		}

		if (typeof offset === 'function') { //Second argument is a function
			if (typeof callback === 'undefined') { //Treat second argument as callback (no third argument)
				callback = offset;
				offset = undefined;
			} else { //Treat second argument as offset function
				offset = offset();
			}
		}

		if (typeof offset === 'undefined') { //Offset argument omitted
			offset = 0;
		}

		if (typeof callback !== 'function') { //Callback argument omitted
			callback = () => {};
		}

		if (Array.isArray(target) && target.length > 0) {
			[target] = target;
		}

		return {target, offset, callback};
	}
};

w.autoHandle(Scroll);
