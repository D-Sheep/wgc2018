/**************************************************************************************/
// WEBPAGE ENVIRONMENT OBJECT
/**************************************************************************************/

const W_DEFAULT_DEBOUNCE_TIME = 300;
const W_DEFAULT_KEYBOARD_PARAM = -1;
const W_DEFAULT_THROTTLE_TIME = 300;

class WebPage {
	constructor() {
		this.callbacks = LazyProps.create({
			immediate: this._immediateCallbackQueueFactory,
			init: () => new CallbackQueue(),
			scroll: () => LazyProps.create({
				general: this._scrollCallbackQueueFactory,
				start: this._scrollCallbackQueueFactory,
				active: this._scrollCallbackQueueFactory,
				throttled: this._scrollCallbackQueueFactory,
				end: this._scrollCallbackQueueFactory
			}, this),
			resize: () => LazyProps.create({
				general: this._resizeCallbackQueueFactory,
				width: () => LazyProps.create({
					start: this._resizeCallbackQueueFactory,
					active: this._resizeCallbackQueueFactory,
					throttled: this._resizeCallbackQueueFactory,
					end: this._resizeCallbackQueueFactory
				}, this),
				height: () => LazyProps.create({
					start: this._resizeCallbackQueueFactory,
					active: this._resizeCallbackQueueFactory,
					throttled: this._resizeCallbackQueueFactory,
					end: this._resizeCallbackQueueFactory
				}, this),
				start: this._resizeCallbackQueueFactory,
				active: this._resizeCallbackQueueFactory,
				throttled: this._resizeCallbackQueueFactory,
				end: this._resizeCallbackQueueFactory
			}, this),
			layout: () => new CallbackQueue(),
			layoutGroup: () => new CallbackQueue(),
			visibility: () => new CallbackQueue(),
			nearView: this._nearViewCallbackQueueFactory,
			keyboard: this._keyUpCallbackQueueFactory
		}, this);

		this.handlerNames = {
			IMMEDIATE: 'immediateHandler',
			INIT: 'initHandler',
			RESIZE: 'resizeHandler',
			RESIZE_START: 'resizeStartHandler',
			RESIZE_ACTIVE: 'resizeActiveHandler',
			RESIZE_THROTTLED: 'resizeThrottledHandler',
			RESIZE_END: 'resizeEndHandler',
			RESIZE_WIDTH_START: 'resizeWidthStartHandler',
			RESIZE_WIDTH_ACTIVE: 'resizeWidthActiveHandler',
			RESIZE_WIDTH_THROTTLED: 'resizeWidthThrottledHandler',
			RESIZE_WIDTH_END: 'resizeWidthEndHandler',
			RESIZE_HEIGHT_START: 'resizeHeightStartHandler',
			RESIZE_HEIGHT_ACTIVE: 'resizeHeightActiveHandler',
			RESIZE_HEIGHT_THROTTLED: 'resizeHeightThrottledHandler',
			RESIZE_HEIGHT_END: 'resizeHeightEndHandler',
			LAYOUT: 'layoutHandler',
			LAYOUT_GROUP: 'layoutGroupHandler',
			SCROLL: 'scrollHandler',
			SCROLL_START: 'scrollStartHandler',
			SCROLL_ACTIVE: 'scrollActiveHandler',
			SCROLL_THROTTLED: 'scrollThrottledHandler',
			SCROLL_END: 'scrollEndHandler',
			VISIBILITY: 'visibilityHandler',
			NEAR_VIEW: 'nearViewHandler',
			KEYBOARD: /keyboard(?:\[(\d+)(?:,(\d+))*])?Handler/ //i.e. keyboardHandler, keyboard[27]Handler, keyboard[39,40]Handler
		};
		this._autoHandled = new Map();
		this._canUseIntersectionObservers = typeof IntersectionObserver !== 'undefined';
		this._intersectionObserver = null;
		this._nearViewHandlers = new Map();
		this.isInitialized = false;
		this.canHandleVisibilityChange = typeof document.hidden !== 'undefined' && !!document.addEventListener;
		this.$html = $('html');
		this.$body = $('body');
		this.$document = $(document);
		this.$window = $(window);

		this.top = this.topLast = this.$window.scrollTop();
		this.width = this.widthLast = this.$window.outerWidth(true);
		this.height = this.heightLast = this.$window.outerHeight();
		this.scrollDirection = 0;
		this.layout = null;
		this.breakpoints = [
			{from: 0, to: 460, layout: 'tiny', layoutGroup: 'phone'},
			{from: 461, to: 600, layout: 'phone', layoutGroup: 'phone'},
			{from: 601, to: 900, layout: 'tablet-portrait', layoutGroup: 'tablet'},
			{from: 901, to: 1200, layout: 'tablet-landscape', layoutGroup: 'tablet'},
			{from: 1201, to: 1500, layout: 'desktop', layoutGroup: 'desktop'},
			{from: 1501, to: 1800, layout: 'desktop-medium', layoutGroup: 'desktop'},
			{from: 1801, to: 99999, layout: 'desktop-large', layoutGroup: 'desktop'}
		];
		this.layouts = this.breakpoints.map((b) => b.layout);
		this.isRetina = (
			window.matchMedia && (
				window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches
				|| window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches
			)
		) || (
			window.devicePixelRatio && window.devicePixelRatio > 1.3
		);
		this.isStatic = null;
		this.isWindowFocused = true;
		this._flags = {
			scrolling: false,
			resizingWidth: false,
			resizingHeight: false,
			isScrollBound: false,
			isResizeBound: false,
			isKeyUpBound: false
		};
		this._debounce = {
			scrollTimeoutId: -1,
			resizeTimeoutId: -1,
			resizeWidthTimeoutId: -1,
			resizeHeightTimeoutId: -1
		};
		this._throttle = {
			scrollTimestamp: 0,
			resizeWidthTimestamp: 0,
			resizeHeightTimestamp: 0,
			resizeTimestamp: 0
		};
		this.device = {
			mobile: bowser.mobile || bowser.tablet,
			tablet: bowser.tablet,
			phone: bowser.mobile,
			ios: bowser.ios,
			os: null,
			osversion: bowser.osversion
		};
		this.browser = {
			name: (() => {
				switch (true) {
					case bowser.chrome: return "chrome";
					case bowser.safari: return "safari";
					case bowser.opera: return "opera";
					case bowser.mozilla: return "mozilla";
					case bowser.firefox: return "firefox";
					case bowser.msie: return "ms msie";
					case bowser.msedge: return "ms msedge";
					default: return null;
				}
			})(),
			version: parseInt(bowser.version, 10),
			webkit: bowser.webkit,
			gecko: bowser.gecko
		};

		//Use like this: if (w.isLayout.smallerThan('desktop')) { ... }
		this.isLayout = {
			smallerThan: (compare, layout = this.layout) => this.layouts.indexOf(layout) < this.layouts.indexOf(compare),
			smallerOrEqual: (compare, layout = this.layout) => this.layouts.indexOf(layout) <= this.layouts.indexOf(compare),
			biggerThan: (compare, layout = this.layout) => this.layouts.indexOf(layout) > this.layouts.indexOf(compare),
			biggerOrEqual: (compare, layout = this.layout) => this.layouts.indexOf(layout) >= this.layouts.indexOf(compare)
		};

		this.$html.toggleClass('mobileos-android', !!bowser.android);
		this.$html.toggleClass('mobileos-ios', !!bowser.ios);
		this.$html.toggleClass('mobileos-wp', !!bowser.windowsphone);

		this.$html.addClass(this.browser.name);
		this.$html.addClass(`v${this.browser.version}`);
		this.$html.addClass(this.device.mobile ? "mobileDevice" : 'non-mobileDevice');
		this.$html.addClass(this.canHandleVisibilityChange ? 'visibilityChange' : 'non-visibilityChange');
	}

	//========================================================

	//Initialize the webpage. Don't call this yourself! Should be called only once at the end of the document
	init() {
		//Handle visibility change
		if (this.canHandleVisibilityChange) {
			this.isWindowFocused = !document.hidden;
			document.addEventListener('visibilitychange', this._visibilityHandler.bind(this));
		}

		//Ready to go!
		this._getLayout();
		this._debounce.isDisabled = false;
		this.isInitialized = true;
		this.callbacks.init.fire();
	}

	//Automatically find handlers in an object and register them
	autoHandle(object, priority) {
		const data = {
			owner: object,
			handlers: new Map()
		};
		Object.keys(this.handlerNames).forEach((key) => { //Iterate over handler name keys
			const name = this.handlerNames[key];
			if (name instanceof RegExp) { //Handler name is a RegExp
				Object.keys(object).forEach((objKey) => {
					const match = name.exec(objKey);
					if (!match) { //This handler's name doesn't match the RegExp
						return;
					}
					let handlerParams = match.slice(1).filter((p) => p !== undefined); //Extract all RegExp capture groups
					switch (name) {
						case this.handlerNames.KEYBOARD:
							if (handlerParams.length === 0) {
								handlerParams = [W_DEFAULT_KEYBOARD_PARAM]; //When no keyCode parameter is given, register a general keyboard handler
							}
							data.handlers.set( //Register a handler for each parameter
								objKey,
								handlerParams.reduce((res, param) =>
									res.concat(this.callbacks.keyboard.add(object[objKey].bind(object), priority, +param)), [])
							);
							break;
						default: break;
					}
				});
			} else { //Handler name is a simple string
				if (typeof object[name] !== 'function') { //The object doesn't implement this handler
					return;
				}
				switch (name) {
					case this.handlerNames.NEAR_VIEW: //Handle nearView differently
						let el = object.$element || object.$el; //Get the related element for this object
						if (el instanceof jQuery) {
							el = el.get(0);
						}
						data.handlers.set(name, this.callbacks.nearView.add(object[name].bind(object), priority, el)); //Register the handler
						break;

					default:
						data.handlers.set(name, this._getCallbackQueueForHandlerName(name).add(object[name].bind(object), priority)); //Register the handler
						break;
				}
			}
		});
		this._autoHandled.set(object, data); //Save related data for possible future deactivation
	}

	//Unregister all handlers of an object previously registered with autoHandle()
	stopHandling(object) {
		const data = this._autoHandled.get(object); //Find all active handlers
		if (!data) {
			return;
		}
		data.handlers.forEach((handler, name) => { //Iterate over all the active handler names
			const cbQueue = this._getCallbackQueueForHandlerName(name);
			if (Array.isArray(handler)) { //Array of handlers, most likely with a RegExp name
				handler.forEach((h) => {
					cbQueue.remove(h);
				});
			} else {
				cbQueue.remove(handler);
			}
		});
		this._autoHandled.delete(object); //Forget this object
	}

	//Toggle fullscreen
	toggleFullscreen(set) {
		const doc = window.document;
		const docEl = doc.documentElement;
		const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
		const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
		const isFullscreen = !!(doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);

		if (typeof set === 'undefined') { //Argument omitted, toggle fullscreen state
			set = !isFullscreen;
		}

		if (set && !isFullscreen) {
			requestFullScreen.call(docEl);
		} else if (!set && isFullscreen) {
			cancelFullScreen.call(doc);
		}
	}

	getScrollbarWidth() {
		return window.innerWidth - document.documentElement.clientWidth;
	}

	//========================================================

	_resizeHandler() {
		this.width = this.$window.outerWidth(true);
		this.height = this.$window.outerHeight();

		const now = Date.now();

		//Resize in any direction start
		if (!this._flags.resizingWidth && !this._flags.resizingHeight) {
			this._throttle.resizeTimestamp = now;
			this.callbacks.resize.general.fire(this.handlerNames.RESIZE_START);
			this.callbacks.resize.start.fire();
		}

		if (this.widthLast !== this.width) {
			//Resize width start
			if (!this._flags.resizingWidth) {
				this._flags.resizingWidth = true;
				this._throttle.resizeWidthTimestamp = now;
				this.callbacks.resize.general.fire(this.handlerNames.RESIZE_WIDTH_START);
				this.callbacks.resize.width.start.fire();
			}

			//While resizing width
			this.callbacks.resize.general.fire(this.handlerNames.RESIZE_WIDTH_ACTIVE);
			this.callbacks.resize.width.active.fire();

			//Throttled width resizing
			if (now - this._throttle.resizeWidthTimestamp > W_DEFAULT_THROTTLE_TIME) {
				this._throttle.resizeWidthTimestamp = now;
				this.callbacks.resize.general.fire(this.handlerNames.RESIZE_WIDTH_THROTTLED);
				this.callbacks.resize.width.throttled.fire();
			}

			//Resize width end
			clearTimeout(this._debounce.resizeWidthTimeoutId);
			this._debounce.resizeWidthTimeoutId = setTimeout(() => {
				this._getLayout();
				this._flags.resizingWidth = false;
				this.callbacks.resize.general.fire(this.handlerNames.RESIZE_WIDTH_END);
				this.callbacks.resize.width.end.fire();
			}, W_DEFAULT_DEBOUNCE_TIME);
		}

		if (this.heightLast !== this.height) {
			//Resize height start
			if (!this._flags.resizingHeight) {
				this._flags.resizingHeight = true;
				this._throttle.resizeHeightTimestamp = now;
				this.callbacks.resize.general.fire(this.handlerNames.RESIZE_HEIGHT_START);
				this.callbacks.resize.height.start.fire();
			}

			//While resizing height
			this.callbacks.resize.general.fire(this.handlerNames.RESIZE_HEIGHT_ACTIVE);
			this.callbacks.resize.height.active.fire();

			//Throttled height resizing
			if (now - this._throttle.resizeHeightTimestamp > W_DEFAULT_THROTTLE_TIME) {
				this._throttle.resizeHeightTimestamp = now;
				this.callbacks.resize.general.fire(this.handlerNames.RESIZE_HEIGHT_THROTTLED);
				this.callbacks.resize.height.throttled.fire();
			}

			//Resize height end
			clearTimeout(this._debounce.resizeHeightTimeoutId);
			this._debounce.resizeHeightTimeoutId = setTimeout(() => {
				this._getLayout();
				this._flags.resizingHeight = false;
				this.callbacks.resize.general.fire(this.handlerNames.RESIZE_HEIGHT_END);
				this.callbacks.resize.height.end.fire();
			}, W_DEFAULT_DEBOUNCE_TIME);
		}

		//While resizing in any direction
		this.callbacks.resize.general.fire(this.handlerNames.RESIZE_ACTIVE);
		this.callbacks.resize.active.fire();

		//Throttled resizing
		if (now - this._throttle.resizeTimestamp > W_DEFAULT_THROTTLE_TIME) {
			this._throttle.resizeTimestamp = now;
			this.callbacks.resize.general.fire(this.handlerNames.RESIZE_THROTTLED);
			this.callbacks.resize.throttled.fire();
		}

		//Resize in any direction end
		clearTimeout(this._debounce.resizeTimeoutId);
		this._debounce.resizeTimeoutId = setTimeout(() => {
			this._getLayout();
			this.callbacks.resize.general.fire(this.handlerNames.RESIZE_END);
			this.callbacks.resize.end.fire();
		}, W_DEFAULT_DEBOUNCE_TIME);

		this.widthLast = this.width; //Update last value
		this.heightLast = this.height;
	}

	_scrollHandler() {
		this.top = this.$window.scrollTop();
		this.scrollDirection = Helpers.sign(this.top - this.topLast);

		const now = Date.now();

		//Scroll start
		if (!this._flags.scrolling) {
			this._flags.scrolling = true;
			this._throttle.scrollTimestamp = now;
			this.callbacks.resize.general.fire(this.handlerNames.SCROLL_START);
			this.callbacks.scroll.start.fire();
		}

		//While scrolling
		this.callbacks.resize.general.fire(this.handlerNames.SCROLL_ACTIVE);
		this.callbacks.scroll.active.fire();

		//Throttled scrolling
		if (now - this._throttle.scrollTimestamp > W_DEFAULT_THROTTLE_TIME) {
			this._throttle.scrollTimestamp = now;
			this.callbacks.scroll.general.fire(this.handlerNames.SCROLL_THROTTLED);
			this.callbacks.scroll.throttled.fire();
		}

		//Scroll end
		clearTimeout(this._debounce.scrollTimeoutId);
		this._debounce.scrollTimeoutId = setTimeout(() => {
			this._flags.scrolling = false;
			this.callbacks.scroll.general.fire(this.handlerNames.SCROLL_END);
			this.callbacks.scroll.end.fire();
		}, W_DEFAULT_DEBOUNCE_TIME);

		this.topLast = this.top; //Update last value
	}

	_keyUpHandler(e) {
		this.callbacks.keyboard.fire(e);
	}

	_visibilityHandler() {
		this.callbacks.visibility.fire(this.isWindowFocused = !document.hidden);
	}

	_getLayout() {
		const oldLayout = this.layout;
		const oldLayoutGroup = this.layoutGroup;
		const currentBreakpoint = this.breakpoints.find((b) => window.matchMedia(`(min-width: ${b.from}px) and (max-width: ${b.to}px)`).matches);

		if (currentBreakpoint) {
			this.layout = currentBreakpoint.layout;
			this.layoutGroup = currentBreakpoint.layoutGroup;
		}
		if (oldLayout !== this.layout && this.layout !== null) { //Layout changed
			this.callbacks.layout.fire(this.layout, oldLayout);
		}
		if (oldLayoutGroup !== this.layoutGroup && this.layoutGroup !== null) { //Layout group changed
			this.callbacks.layoutGroup.fire(this.layoutGroup, oldLayoutGroup);
		}
	}

	_immediateCallbackQueueFactory() {
		return new CallbackQueue().onBeforeAdd((handler) => {
			handler(); //Call the handler immediately and discard it
			return false;
		});
	}

	_scrollCallbackQueueFactory() {
		const q = new CallbackQueue();
		if (!this._flags.isScrollBound) {
			q.onAfterAdd(() => {
				if (!this._flags.isScrollBound) {
					this._flags.isScrollBound = true;
					this.$window.scroll(this._scrollHandler.bind(this));
				}
			});
		}
		return q;
	}

	_resizeCallbackQueueFactory() {
		const q = new CallbackQueue();
		if (!this._flags.isResizeBound) {
			q.onAfterAdd(() => {
				if (!this._flags.isResizeBound) {
					this._flags.isResizeBound = true;
					this.$window.resize(this._resizeHandler.bind(this));
				}
			});
		}
		return q;
	}

	_keyUpCallbackQueueFactory() {
		const q = new CallbackQueue();
		q.addTransformer((handler, priority, keyCode) => (e) => { //Return a function that calls the handler only on correct keyCode
			if (keyCode === e.keyCode || keyCode === W_DEFAULT_KEYBOARD_PARAM) {
				handler(e);
			}
		});
		if (!this._flags.isKeyUpBound) {
			q.onAfterAdd(() => {
				if (!this._flags.isKeyUpBound) {
					this._flags.isKeyUpBound = true;
					this.$document.keyup(this._keyUpHandler.bind(this));
				}
			});
		}
		return q;
	}

	_nearViewCallbackQueueFactory() {
		return new PriorityQueue()
			.addTransformer((handler, priority, el) => this._createIntersectionObserver(handler, el))
			.onAfterRemove(this._destroyIntersectionObserver.bind(this));
	}

	_createIntersectionObserver(handler, el) {
		if (this._canUseIntersectionObservers) { //Use native IntersectionObserver class
			if (this._intersectionObserver === null) { //If not already initialized
				this._intersectionObserver = new IntersectionObserver((entries) => { //Create a new observer
					entries.forEach((entry) => {
						if (entry.isIntersecting) { //If the target element is coming into the viewport area
							this._nearViewHandlers.get(entry.target)(); //Find the related handler and call it
						}
					});
				}, {
					rootMargin: "50% 0px 50% 0px", //Half of the viewport height above and below
					threshold: 0
				});
			}
			this._nearViewHandlers.set(el, handler); //Store the related handler for this target element
			this._intersectionObserver.observe(el); //Start observing intersection changes
			return el;
		}

		//IntersectionObserver fallback - should work almost identically
		const base = this;

		const fallback = (function intersectionFallback() {
			const height = $(el).outerHeight();
			const {top} = $(el).offset();
			const currentState = base.top >= top - base.height * 1.5 && base.top <= top + height + base.height / 2;
			if (currentState && !this.lastState) {
				handler();
			}
			this.lastState = currentState;
		}).bind({lastState: false});

		this.$window.scroll(fallback);
		this.$window.resize(fallback);
		if (this.isInitialized) {
			fallback();
		} else {
			this.callbacks.init.add(fallback);
		}
		return fallback;
	}

	_destroyIntersectionObserver(obj) {
		if (this._canUseIntersectionObservers) {
			this._intersectionObserver.unobserve(obj);
			this._nearViewHandlers.delete(obj);
		} else {
			this.$window.off('scroll', obj);
			this.$window.off('resize', obj);
			this.callbacks.init.remove(obj);
		}
	}

	_getCallbackQueueForHandlerName(name) {
		switch (name) {
			case this.handlerNames.IMMEDIATE: return this.callbacks.immediate;
			case this.handlerNames.INIT: return this.callbacks.init;
			case this.handlerNames.SCROLL: return this.callbacks.scroll.general;
			case this.handlerNames.SCROLL_START: return this.callbacks.scroll.start;
			case this.handlerNames.SCROLL_ACTIVE: return this.callbacks.scroll.active;
			case this.handlerNames.SCROLL_THROTTLED: return this.callbacks.scroll.throttled;
			case this.handlerNames.SCROLL_END: return this.callbacks.scroll.end;
			case this.handlerNames.RESIZE: return this.callbacks.resize.general;
			case this.handlerNames.RESIZE_START: return this.callbacks.resize.start;
			case this.handlerNames.RESIZE_ACTIVE: return this.callbacks.resize.active;
			case this.handlerNames.RESIZE_THROTTLED: return this.callbacks.resize.throttled;
			case this.handlerNames.RESIZE_END: return this.callbacks.resize.end;
			case this.handlerNames.RESIZE_WIDTH_START: return this.callbacks.resize.width.start;
			case this.handlerNames.RESIZE_WIDTH_ACTIVE: return this.callbacks.resize.width.active;
			case this.handlerNames.RESIZE_WIDTH_THROTTLED: return this.callbacks.resize.width.throttled;
			case this.handlerNames.RESIZE_WIDTH_END: return this.callbacks.resize.width.end;
			case this.handlerNames.RESIZE_HEIGHT_START: return this.callbacks.resize.height.start;
			case this.handlerNames.RESIZE_HEIGHT_ACTIVE: return this.callbacks.resize.height.active;
			case this.handlerNames.RESIZE_HEIGHT_THROTTLED: return this.callbacks.resize.height.throttled;
			case this.handlerNames.RESIZE_HEIGHT_END: return this.callbacks.resize.height.end;
			case this.handlerNames.LAYOUT: return this.callbacks.layout;
			case this.handlerNames.LAYOUT_GROUP: return this.callbacks.layoutGroup;
			case this.handlerNames.VISIBILITY: return this.callbacks.visibility;
			case this.handlerNames.NEAR_VIEW: return this.callbacks.nearView;
			case this.handlerNames.KEYBOARD: return this.callbacks.keyboard;
			default: break;
		}
		if (this.handlerNames.KEYBOARD.test(name)) {
			return this.callbacks.keyboard;
		}
		return undefined;
	}
}

window.w = new WebPage();
