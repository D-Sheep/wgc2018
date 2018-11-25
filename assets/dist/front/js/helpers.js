const Helpers = {
	//Choose a random number from an interval, including both ends
	rnd(from, to, except) {
		let rnd;
		do {
			rnd = Math.floor(Math.random() * (to - from + 1)) + from;
		} while (typeof except !== 'undefined' && except === rnd);
		return rnd;
	},

	//Shuffles an array in-place
	shuffle(array) {
		let counter = array.length;
		while (counter > 0) {
			const index = Math.floor(Math.random() * counter--);
			const temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}
		return array;
	},

	//Choose a random element from array `items`
	choose: (items) => (items.length ? items[Math.floor(Math.random() * items.length)] : null),

	//Returns -1 or 1 randomly, optionally multiplied by `x`
	randomSign: (x = 1) => x * (Math.random() < 0.5 ? 1 : -1),

	//Returns -1 if `x` is positive, 1 otherwise
	negativeSign: (x) => (x > 0 ? -1 : 1),

	//Returns the fractional part of a number
	frac: (x) => x - Math.floor(x),

	//Calculates horizontal length of vector (distance, angle)
	distX: (distance, angle) => Math.cos(angle) * distance,

	//Calculates vertical length of vector (distance, angle)
	distY: (distance, angle) => -Math.sin(angle) * distance,

	//Returns the sign of a number (-1, 0 or 1)
	sign: (x) => ((+x === 0 || Number.isNaN(+x)) ? Number(x) : (x > 0 ? 1 : -1)),

	//Calculates correct modulo even for negative numbers
	mod: (n, mod) => ((n % mod) + mod) % mod,

	//Works like Array.reduce but iterates `num` times
	reduceNumber: (num, fn, val) => (num ? fn(Helpers.reduceNumber(--num, fn, val), num) : val),

	//Returns a parameter value from current url
	getURLParameter: (name) => decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null,

	//Pads `number` with zeroes to a minimum length `len`
	getZeroInt: (num, len = 2) => Helpers.reduceNumber(Math.max(0, len - (`${num}`).length), (s) => `0${s}`, `${num}`),

	// apply many functions to one arguments (https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937)
	pipe: (...fns) => (x) => fns.reduce((v, f) => f(v), x),

	displayAchievement(message) {
		const toast = swal.mixin({
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: 4000
		});

		toast({
			type: 'success',
			title: message
		})
	}
};
;;const PRIORITYQUEUE_DEFAULT_PRIORITY = 0;

class PriorityQueue {
	constructor(comparator) {
		this._comparator = comparator || ((a, b) => a - b); //Sort ascending by default
		this._priorities = []; //List of used priorities, always sorted
		this._queues = {}; //Priority-keyed arrays of queued items
		this._callbacks = {
			onBeforeTransform: [], //Called before (and if) transforming items to be added
			onBeforeAdd: [], //Called before adding (transformed) item (addition can be aborted by returning false)
			onAfterAdd: [], //Called after successfully adding an item
			onBeforeRemove: [], //Called before removing item (removal can be aborted by returning false)
			onAfterRemove: [], //Called after successfully removing an item
		};
		this._flags = {
			dirty: false
		};
		this._cachedQueues = []; //An array of all concatenated queues is kept here (result of .getAll())
		this._privateCallbacks = {
			onBeforeAdd: []
		};
		this._transformers = null; //This will be a CallbackQueue holding all input transformers
		this.length = 0; //Total length of the queue (number of items queued)
	}

	//Add an item
	add(object, priority, ...args) {
		if (typeof priority === 'function') {
			priority = priority();
		}
		if (typeof priority !== 'number') {
			priority = PRIORITYQUEUE_DEFAULT_PRIORITY;
		}
		if (this._transformers !== null) {
			if (this._callbacks.onBeforeTransform.every((cb) => cb(object, priority, ...args) !== false)) { //Transformation can be aborted
				object = this._transformers.getAll().reduce((obj, transformer) => transformer(obj, priority, ...args), object); //Apply all transformers sequentially
			}
		}
		this._privateCallbacks.onBeforeAdd.forEach((cb) => cb(object, priority, ...args));
		if (this._callbacks.onBeforeAdd.every((cb) => cb(object, priority, ...args) !== false)) { //Addition can be aborted
			this._getQueue(priority, true).push(object);
			this.length++;
			this._callbacks.onAfterAdd.forEach((cb) => cb(object, priority, ...args));
			this._flags.dirty = true;
			return object; //Return the new (transformed) item
		}
		return undefined;
	}

	//Remove an item
	remove(object) {
		if (this._callbacks.onBeforeRemove.every((cb) => cb(object) !== false)) { //Removal can be aborted
			this.length = this._priorities.reduce((sum, priority) =>
				sum + this._setQueue(priority, this._getQueue(priority).filter((obj) => obj !== object)).length, 0);
			this._callbacks.onAfterRemove.forEach((cb) => cb(object));
		}
		return this;
	}

	//Set a different priority for a queued item
	setPriority(object, priority) {
		this.remove(object).add(object, priority);
		this._flags.dirty = true;
		return this;
	}

	//Set a new priority for all items with some old priority
	reassignPriority(oldPriority, newPriority) {
		if (this._priorities.indexOf(oldPriority) !== -1) { //If such old priority exists
			if (this._priorities.indexOf(newPriority) === -1) { //No queue with such new priority yet
				this._priorities.push(newPriority); //Add new priority to the list
				this._priorities.sort(this._comparator); //Sort the priorities
				this._setQueue(newPriority, this._getQueue(oldPriority));
			} else { //Both priorities in use, concatenate the two queues
				this._setQueue(newPriority, this._getQueue(newPriority).concat(this._getQueue(oldPriority)));
			}
			this._priorities.splice(this._priorities.indexOf(oldPriority), 1); //Remove old priority, list is still sorted
		}
		return this;
	}

	//Get all queued items in an array, possibly filtered by a priority
	getAll(priority) {
		if (typeof priority === 'number') {
			return this._getQueue(priority);
		}
		if (this._flags.dirty) {
			this._cachedQueues = this._priorities.reduce((res, p) => res.concat(this._getQueue(p)), []); //Concatenate all partial queues into one
			this._flags.dirty = false;
		}
		return this._cachedQueues;
	}

	getHighestPriority() {
		return this._priorities.length ? this._priorities[0] : PRIORITYQUEUE_DEFAULT_PRIORITY;
	}

	getLowestPriority() {
		return this._priorities.length ? this._priorities[this._priorities.length - 1] : PRIORITYQUEUE_DEFAULT_PRIORITY;
	}

	//Add a callback to be fired before transforming new items
	onBeforeTransform(callback) {
		this._callbacks.onBeforeTransform.push(callback);
		return this;
	}

	//Add a callback to be fired before adding new (already transformed) items
	onBeforeAdd(callback) {
		this._callbacks.onBeforeAdd.push(callback);
		return this;
	}

	//Add a callback to be fired after successfully adding a new item
	onAfterAdd(callback) {
		this._callbacks.onAfterAdd.push(callback);
		return this;
	}

	//Add a callback to be fired before removing an item
	onBeforeRemove(callback) {
		this._callbacks.onBeforeRemove.push(callback);
		return this;
	}

	//Add a callback to be fired after successfully removing an item
	onAfterRemove(callback) {
		this._callbacks.onAfterRemove.push(callback);
		return this;
	}

	//Add a transformer function to modify any new items being added
	addTransformer(transformer, priority) {
		if (this._transformers === null) {
			this._transformers = new CallbackQueue();
		}
		this._transformers.add(transformer, priority);
		return this;
	}

	//========================================================

	//Get or create a new partial queue for a certain priority
	_getQueue(priority, createNew = false) {
		if (this._priorities.indexOf(priority) === -1) { //No queue with such priority yet
			if (!createNew) {
				return [];
			}
			this._priorities.push(priority); //Add the priority to the list
			this._priorities.sort(this._comparator); //Sort the list
			this._setQueue(priority, []); //The new queue is empty
		}
		return this._queues[priority];
	}

	//Assign a partial queue to a certain priority
	_setQueue(priority, queue) {
		this._flags.dirty = true;
		this._queues[priority] = queue;
		return queue;
	}
}
;;class CallbackQueue extends PriorityQueue {
	constructor(comparator) {
		super(comparator);
		this._privateCallbacks.onBeforeAdd.push(CallbackQueue._typeCheck);
	}

	fire(...args) {
		if (this.length) {
			this.getAll().forEach((callback) => callback(...args));
		}
		return this;
	}

	static _typeCheck(object) {
		if (typeof object !== 'function') {
			throw new TypeError('Only functions can be added to CallbackQueue.');
		}
	}
}
;;/* Create a lazy-evaluation wrapper around an object. The properties will be evaluated on their first usage.
 *
 * i.e. `lazy = LazyProps.create({ prop() { return new X(); } });`
 * `lazy.prop` will be an instance of X only after `lazy.prop` has been referenced somewhere. Until that,
 * `lazy` will be an empty object.
 */
const LazyProps = {
	create(obj, thisArg) {
		const res = {};
		Object.keys(obj)
			.filter((key) => Object.prototype.hasOwnProperty.call(obj, key))
			.forEach((key) => {
				Object.defineProperty(res, key, {
					configurable: true,
					enumerable: true,
					get() {
						Object.defineProperty(this, key, { //Define the property with a value of `undefined`
							configurable: true,
							enumerable: true,
							writable: true
						});
						const value = obj[key].call(thisArg); //Call a function that will return the value to be used
						Object.defineProperty(this, key, { //Overwrite the getter with the actual value
							configurable: true,
							enumerable: true,
							writable: true,
							value
						});
						return value;
					},
					set(value) {
						Object.defineProperty(this, key, { //Overwrite getter and setter and store the value
							configurable: true,
							enumerable: true,
							writable: true,
							value
						});
						return value;
					}
				});
			});
		return res;
	}
};
;;/**************************************************************************************/
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlbHBlcnMuanMiLCJQcmlvcml0eVF1ZXVlLmpzIiwiQ2FsbGJhY2tRdWV1ZS5qcyIsIkxhenlQcm9wcy5qcyIsIldlYlBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSGVscGVycyA9IHtcblx0Ly9DaG9vc2UgYSByYW5kb20gbnVtYmVyIGZyb20gYW4gaW50ZXJ2YWwsIGluY2x1ZGluZyBib3RoIGVuZHNcblx0cm5kKGZyb20sIHRvLCBleGNlcHQpIHtcblx0XHRsZXQgcm5kO1xuXHRcdGRvIHtcblx0XHRcdHJuZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20gKyAxKSkgKyBmcm9tO1xuXHRcdH0gd2hpbGUgKHR5cGVvZiBleGNlcHQgIT09ICd1bmRlZmluZWQnICYmIGV4Y2VwdCA9PT0gcm5kKTtcblx0XHRyZXR1cm4gcm5kO1xuXHR9LFxuXG5cdC8vU2h1ZmZsZXMgYW4gYXJyYXkgaW4tcGxhY2Vcblx0c2h1ZmZsZShhcnJheSkge1xuXHRcdGxldCBjb3VudGVyID0gYXJyYXkubGVuZ3RoO1xuXHRcdHdoaWxlIChjb3VudGVyID4gMCkge1xuXHRcdFx0Y29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb3VudGVyLS0pO1xuXHRcdFx0Y29uc3QgdGVtcCA9IGFycmF5W2NvdW50ZXJdO1xuXHRcdFx0YXJyYXlbY291bnRlcl0gPSBhcnJheVtpbmRleF07XG5cdFx0XHRhcnJheVtpbmRleF0gPSB0ZW1wO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJyYXk7XG5cdH0sXG5cblx0Ly9DaG9vc2UgYSByYW5kb20gZWxlbWVudCBmcm9tIGFycmF5IGBpdGVtc2Bcblx0Y2hvb3NlOiAoaXRlbXMpID0+IChpdGVtcy5sZW5ndGggPyBpdGVtc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpdGVtcy5sZW5ndGgpXSA6IG51bGwpLFxuXG5cdC8vUmV0dXJucyAtMSBvciAxIHJhbmRvbWx5LCBvcHRpb25hbGx5IG11bHRpcGxpZWQgYnkgYHhgXG5cdHJhbmRvbVNpZ246ICh4ID0gMSkgPT4geCAqIChNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IC0xKSxcblxuXHQvL1JldHVybnMgLTEgaWYgYHhgIGlzIHBvc2l0aXZlLCAxIG90aGVyd2lzZVxuXHRuZWdhdGl2ZVNpZ246ICh4KSA9PiAoeCA+IDAgPyAtMSA6IDEpLFxuXG5cdC8vUmV0dXJucyB0aGUgZnJhY3Rpb25hbCBwYXJ0IG9mIGEgbnVtYmVyXG5cdGZyYWM6ICh4KSA9PiB4IC0gTWF0aC5mbG9vcih4KSxcblxuXHQvL0NhbGN1bGF0ZXMgaG9yaXpvbnRhbCBsZW5ndGggb2YgdmVjdG9yIChkaXN0YW5jZSwgYW5nbGUpXG5cdGRpc3RYOiAoZGlzdGFuY2UsIGFuZ2xlKSA9PiBNYXRoLmNvcyhhbmdsZSkgKiBkaXN0YW5jZSxcblxuXHQvL0NhbGN1bGF0ZXMgdmVydGljYWwgbGVuZ3RoIG9mIHZlY3RvciAoZGlzdGFuY2UsIGFuZ2xlKVxuXHRkaXN0WTogKGRpc3RhbmNlLCBhbmdsZSkgPT4gLU1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlLFxuXG5cdC8vUmV0dXJucyB0aGUgc2lnbiBvZiBhIG51bWJlciAoLTEsIDAgb3IgMSlcblx0c2lnbjogKHgpID0+ICgoK3ggPT09IDAgfHwgTnVtYmVyLmlzTmFOKCt4KSkgPyBOdW1iZXIoeCkgOiAoeCA+IDAgPyAxIDogLTEpKSxcblxuXHQvL0NhbGN1bGF0ZXMgY29ycmVjdCBtb2R1bG8gZXZlbiBmb3IgbmVnYXRpdmUgbnVtYmVyc1xuXHRtb2Q6IChuLCBtb2QpID0+ICgobiAlIG1vZCkgKyBtb2QpICUgbW9kLFxuXG5cdC8vV29ya3MgbGlrZSBBcnJheS5yZWR1Y2UgYnV0IGl0ZXJhdGVzIGBudW1gIHRpbWVzXG5cdHJlZHVjZU51bWJlcjogKG51bSwgZm4sIHZhbCkgPT4gKG51bSA/IGZuKEhlbHBlcnMucmVkdWNlTnVtYmVyKC0tbnVtLCBmbiwgdmFsKSwgbnVtKSA6IHZhbCksXG5cblx0Ly9SZXR1cm5zIGEgcGFyYW1ldGVyIHZhbHVlIGZyb20gY3VycmVudCB1cmxcblx0Z2V0VVJMUGFyYW1ldGVyOiAobmFtZSkgPT4gZGVjb2RlVVJJQ29tcG9uZW50KChuZXcgUmVnRXhwKGBbP3wmXSR7bmFtZX09KFteJjtdKz8pKCZ8I3w7fCQpYCkuZXhlYyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSB8fCBbbnVsbCwgJyddKVsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKSB8fCBudWxsLFxuXG5cdC8vUGFkcyBgbnVtYmVyYCB3aXRoIHplcm9lcyB0byBhIG1pbmltdW0gbGVuZ3RoIGBsZW5gXG5cdGdldFplcm9JbnQ6IChudW0sIGxlbiA9IDIpID0+IEhlbHBlcnMucmVkdWNlTnVtYmVyKE1hdGgubWF4KDAsIGxlbiAtIChgJHtudW19YCkubGVuZ3RoKSwgKHMpID0+IGAwJHtzfWAsIGAke251bX1gKSxcblxuXHQvLyBhcHBseSBtYW55IGZ1bmN0aW9ucyB0byBvbmUgYXJndW1lbnRzIChodHRwczovL21lZGl1bS5jb20vZnJvbnQtZW5kLWhhY2tpbmcvcGlwZS1hbmQtY29tcG9zZS1pbi1qYXZhc2NyaXB0LTViMDQwMDRhYzkzNylcblx0cGlwZTogKC4uLmZucykgPT4gKHgpID0+IGZucy5yZWR1Y2UoKHYsIGYpID0+IGYodiksIHgpLFxuXG5cdGRpc3BsYXlBY2hpZXZlbWVudChtZXNzYWdlKSB7XG5cdFx0Y29uc3QgdG9hc3QgPSBzd2FsLm1peGluKHtcblx0XHRcdHRvYXN0OiB0cnVlLFxuXHRcdFx0cG9zaXRpb246ICdib3R0b20tZW5kJyxcblx0XHRcdHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcblx0XHRcdHRpbWVyOiA0MDAwXG5cdFx0fSk7XG5cblx0XHR0b2FzdCh7XG5cdFx0XHR0eXBlOiAnc3VjY2VzcycsXG5cdFx0XHR0aXRsZTogbWVzc2FnZVxuXHRcdH0pXG5cdH1cbn07XG4iLCJjb25zdCBQUklPUklUWVFVRVVFX0RFRkFVTFRfUFJJT1JJVFkgPSAwO1xuXG5jbGFzcyBQcmlvcml0eVF1ZXVlIHtcblx0Y29uc3RydWN0b3IoY29tcGFyYXRvcikge1xuXHRcdHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8ICgoYSwgYikgPT4gYSAtIGIpOyAvL1NvcnQgYXNjZW5kaW5nIGJ5IGRlZmF1bHRcblx0XHR0aGlzLl9wcmlvcml0aWVzID0gW107IC8vTGlzdCBvZiB1c2VkIHByaW9yaXRpZXMsIGFsd2F5cyBzb3J0ZWRcblx0XHR0aGlzLl9xdWV1ZXMgPSB7fTsgLy9Qcmlvcml0eS1rZXllZCBhcnJheXMgb2YgcXVldWVkIGl0ZW1zXG5cdFx0dGhpcy5fY2FsbGJhY2tzID0ge1xuXHRcdFx0b25CZWZvcmVUcmFuc2Zvcm06IFtdLCAvL0NhbGxlZCBiZWZvcmUgKGFuZCBpZikgdHJhbnNmb3JtaW5nIGl0ZW1zIHRvIGJlIGFkZGVkXG5cdFx0XHRvbkJlZm9yZUFkZDogW10sIC8vQ2FsbGVkIGJlZm9yZSBhZGRpbmcgKHRyYW5zZm9ybWVkKSBpdGVtIChhZGRpdGlvbiBjYW4gYmUgYWJvcnRlZCBieSByZXR1cm5pbmcgZmFsc2UpXG5cdFx0XHRvbkFmdGVyQWRkOiBbXSwgLy9DYWxsZWQgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IGFkZGluZyBhbiBpdGVtXG5cdFx0XHRvbkJlZm9yZVJlbW92ZTogW10sIC8vQ2FsbGVkIGJlZm9yZSByZW1vdmluZyBpdGVtIChyZW1vdmFsIGNhbiBiZSBhYm9ydGVkIGJ5IHJldHVybmluZyBmYWxzZSlcblx0XHRcdG9uQWZ0ZXJSZW1vdmU6IFtdLCAvL0NhbGxlZCBhZnRlciBzdWNjZXNzZnVsbHkgcmVtb3ZpbmcgYW4gaXRlbVxuXHRcdH07XG5cdFx0dGhpcy5fZmxhZ3MgPSB7XG5cdFx0XHRkaXJ0eTogZmFsc2Vcblx0XHR9O1xuXHRcdHRoaXMuX2NhY2hlZFF1ZXVlcyA9IFtdOyAvL0FuIGFycmF5IG9mIGFsbCBjb25jYXRlbmF0ZWQgcXVldWVzIGlzIGtlcHQgaGVyZSAocmVzdWx0IG9mIC5nZXRBbGwoKSlcblx0XHR0aGlzLl9wcml2YXRlQ2FsbGJhY2tzID0ge1xuXHRcdFx0b25CZWZvcmVBZGQ6IFtdXG5cdFx0fTtcblx0XHR0aGlzLl90cmFuc2Zvcm1lcnMgPSBudWxsOyAvL1RoaXMgd2lsbCBiZSBhIENhbGxiYWNrUXVldWUgaG9sZGluZyBhbGwgaW5wdXQgdHJhbnNmb3JtZXJzXG5cdFx0dGhpcy5sZW5ndGggPSAwOyAvL1RvdGFsIGxlbmd0aCBvZiB0aGUgcXVldWUgKG51bWJlciBvZiBpdGVtcyBxdWV1ZWQpXG5cdH1cblxuXHQvL0FkZCBhbiBpdGVtXG5cdGFkZChvYmplY3QsIHByaW9yaXR5LCAuLi5hcmdzKSB7XG5cdFx0aWYgKHR5cGVvZiBwcmlvcml0eSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cHJpb3JpdHkgPSBwcmlvcml0eSgpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHByaW9yaXR5ICE9PSAnbnVtYmVyJykge1xuXHRcdFx0cHJpb3JpdHkgPSBQUklPUklUWVFVRVVFX0RFRkFVTFRfUFJJT1JJVFk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLl90cmFuc2Zvcm1lcnMgIT09IG51bGwpIHtcblx0XHRcdGlmICh0aGlzLl9jYWxsYmFja3Mub25CZWZvcmVUcmFuc2Zvcm0uZXZlcnkoKGNiKSA9PiBjYihvYmplY3QsIHByaW9yaXR5LCAuLi5hcmdzKSAhPT0gZmFsc2UpKSB7IC8vVHJhbnNmb3JtYXRpb24gY2FuIGJlIGFib3J0ZWRcblx0XHRcdFx0b2JqZWN0ID0gdGhpcy5fdHJhbnNmb3JtZXJzLmdldEFsbCgpLnJlZHVjZSgob2JqLCB0cmFuc2Zvcm1lcikgPT4gdHJhbnNmb3JtZXIob2JqLCBwcmlvcml0eSwgLi4uYXJncyksIG9iamVjdCk7IC8vQXBwbHkgYWxsIHRyYW5zZm9ybWVycyBzZXF1ZW50aWFsbHlcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5fcHJpdmF0ZUNhbGxiYWNrcy5vbkJlZm9yZUFkZC5mb3JFYWNoKChjYikgPT4gY2Iob2JqZWN0LCBwcmlvcml0eSwgLi4uYXJncykpO1xuXHRcdGlmICh0aGlzLl9jYWxsYmFja3Mub25CZWZvcmVBZGQuZXZlcnkoKGNiKSA9PiBjYihvYmplY3QsIHByaW9yaXR5LCAuLi5hcmdzKSAhPT0gZmFsc2UpKSB7IC8vQWRkaXRpb24gY2FuIGJlIGFib3J0ZWRcblx0XHRcdHRoaXMuX2dldFF1ZXVlKHByaW9yaXR5LCB0cnVlKS5wdXNoKG9iamVjdCk7XG5cdFx0XHR0aGlzLmxlbmd0aCsrO1xuXHRcdFx0dGhpcy5fY2FsbGJhY2tzLm9uQWZ0ZXJBZGQuZm9yRWFjaCgoY2IpID0+IGNiKG9iamVjdCwgcHJpb3JpdHksIC4uLmFyZ3MpKTtcblx0XHRcdHRoaXMuX2ZsYWdzLmRpcnR5ID0gdHJ1ZTtcblx0XHRcdHJldHVybiBvYmplY3Q7IC8vUmV0dXJuIHRoZSBuZXcgKHRyYW5zZm9ybWVkKSBpdGVtXG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHQvL1JlbW92ZSBhbiBpdGVtXG5cdHJlbW92ZShvYmplY3QpIHtcblx0XHRpZiAodGhpcy5fY2FsbGJhY2tzLm9uQmVmb3JlUmVtb3ZlLmV2ZXJ5KChjYikgPT4gY2Iob2JqZWN0KSAhPT0gZmFsc2UpKSB7IC8vUmVtb3ZhbCBjYW4gYmUgYWJvcnRlZFxuXHRcdFx0dGhpcy5sZW5ndGggPSB0aGlzLl9wcmlvcml0aWVzLnJlZHVjZSgoc3VtLCBwcmlvcml0eSkgPT5cblx0XHRcdFx0c3VtICsgdGhpcy5fc2V0UXVldWUocHJpb3JpdHksIHRoaXMuX2dldFF1ZXVlKHByaW9yaXR5KS5maWx0ZXIoKG9iaikgPT4gb2JqICE9PSBvYmplY3QpKS5sZW5ndGgsIDApO1xuXHRcdFx0dGhpcy5fY2FsbGJhY2tzLm9uQWZ0ZXJSZW1vdmUuZm9yRWFjaCgoY2IpID0+IGNiKG9iamVjdCkpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vU2V0IGEgZGlmZmVyZW50IHByaW9yaXR5IGZvciBhIHF1ZXVlZCBpdGVtXG5cdHNldFByaW9yaXR5KG9iamVjdCwgcHJpb3JpdHkpIHtcblx0XHR0aGlzLnJlbW92ZShvYmplY3QpLmFkZChvYmplY3QsIHByaW9yaXR5KTtcblx0XHR0aGlzLl9mbGFncy5kaXJ0eSA9IHRydWU7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvL1NldCBhIG5ldyBwcmlvcml0eSBmb3IgYWxsIGl0ZW1zIHdpdGggc29tZSBvbGQgcHJpb3JpdHlcblx0cmVhc3NpZ25Qcmlvcml0eShvbGRQcmlvcml0eSwgbmV3UHJpb3JpdHkpIHtcblx0XHRpZiAodGhpcy5fcHJpb3JpdGllcy5pbmRleE9mKG9sZFByaW9yaXR5KSAhPT0gLTEpIHsgLy9JZiBzdWNoIG9sZCBwcmlvcml0eSBleGlzdHNcblx0XHRcdGlmICh0aGlzLl9wcmlvcml0aWVzLmluZGV4T2YobmV3UHJpb3JpdHkpID09PSAtMSkgeyAvL05vIHF1ZXVlIHdpdGggc3VjaCBuZXcgcHJpb3JpdHkgeWV0XG5cdFx0XHRcdHRoaXMuX3ByaW9yaXRpZXMucHVzaChuZXdQcmlvcml0eSk7IC8vQWRkIG5ldyBwcmlvcml0eSB0byB0aGUgbGlzdFxuXHRcdFx0XHR0aGlzLl9wcmlvcml0aWVzLnNvcnQodGhpcy5fY29tcGFyYXRvcik7IC8vU29ydCB0aGUgcHJpb3JpdGllc1xuXHRcdFx0XHR0aGlzLl9zZXRRdWV1ZShuZXdQcmlvcml0eSwgdGhpcy5fZ2V0UXVldWUob2xkUHJpb3JpdHkpKTtcblx0XHRcdH0gZWxzZSB7IC8vQm90aCBwcmlvcml0aWVzIGluIHVzZSwgY29uY2F0ZW5hdGUgdGhlIHR3byBxdWV1ZXNcblx0XHRcdFx0dGhpcy5fc2V0UXVldWUobmV3UHJpb3JpdHksIHRoaXMuX2dldFF1ZXVlKG5ld1ByaW9yaXR5KS5jb25jYXQodGhpcy5fZ2V0UXVldWUob2xkUHJpb3JpdHkpKSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcmlvcml0aWVzLnNwbGljZSh0aGlzLl9wcmlvcml0aWVzLmluZGV4T2Yob2xkUHJpb3JpdHkpLCAxKTsgLy9SZW1vdmUgb2xkIHByaW9yaXR5LCBsaXN0IGlzIHN0aWxsIHNvcnRlZFxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vR2V0IGFsbCBxdWV1ZWQgaXRlbXMgaW4gYW4gYXJyYXksIHBvc3NpYmx5IGZpbHRlcmVkIGJ5IGEgcHJpb3JpdHlcblx0Z2V0QWxsKHByaW9yaXR5KSB7XG5cdFx0aWYgKHR5cGVvZiBwcmlvcml0eSA9PT0gJ251bWJlcicpIHtcblx0XHRcdHJldHVybiB0aGlzLl9nZXRRdWV1ZShwcmlvcml0eSk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLl9mbGFncy5kaXJ0eSkge1xuXHRcdFx0dGhpcy5fY2FjaGVkUXVldWVzID0gdGhpcy5fcHJpb3JpdGllcy5yZWR1Y2UoKHJlcywgcCkgPT4gcmVzLmNvbmNhdCh0aGlzLl9nZXRRdWV1ZShwKSksIFtdKTsgLy9Db25jYXRlbmF0ZSBhbGwgcGFydGlhbCBxdWV1ZXMgaW50byBvbmVcblx0XHRcdHRoaXMuX2ZsYWdzLmRpcnR5ID0gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9jYWNoZWRRdWV1ZXM7XG5cdH1cblxuXHRnZXRIaWdoZXN0UHJpb3JpdHkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3ByaW9yaXRpZXMubGVuZ3RoID8gdGhpcy5fcHJpb3JpdGllc1swXSA6IFBSSU9SSVRZUVVFVUVfREVGQVVMVF9QUklPUklUWTtcblx0fVxuXG5cdGdldExvd2VzdFByaW9yaXR5KCkge1xuXHRcdHJldHVybiB0aGlzLl9wcmlvcml0aWVzLmxlbmd0aCA/IHRoaXMuX3ByaW9yaXRpZXNbdGhpcy5fcHJpb3JpdGllcy5sZW5ndGggLSAxXSA6IFBSSU9SSVRZUVVFVUVfREVGQVVMVF9QUklPUklUWTtcblx0fVxuXG5cdC8vQWRkIGEgY2FsbGJhY2sgdG8gYmUgZmlyZWQgYmVmb3JlIHRyYW5zZm9ybWluZyBuZXcgaXRlbXNcblx0b25CZWZvcmVUcmFuc2Zvcm0oY2FsbGJhY2spIHtcblx0XHR0aGlzLl9jYWxsYmFja3Mub25CZWZvcmVUcmFuc2Zvcm0ucHVzaChjYWxsYmFjayk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvL0FkZCBhIGNhbGxiYWNrIHRvIGJlIGZpcmVkIGJlZm9yZSBhZGRpbmcgbmV3IChhbHJlYWR5IHRyYW5zZm9ybWVkKSBpdGVtc1xuXHRvbkJlZm9yZUFkZChjYWxsYmFjaykge1xuXHRcdHRoaXMuX2NhbGxiYWNrcy5vbkJlZm9yZUFkZC5wdXNoKGNhbGxiYWNrKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vQWRkIGEgY2FsbGJhY2sgdG8gYmUgZmlyZWQgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IGFkZGluZyBhIG5ldyBpdGVtXG5cdG9uQWZ0ZXJBZGQoY2FsbGJhY2spIHtcblx0XHR0aGlzLl9jYWxsYmFja3Mub25BZnRlckFkZC5wdXNoKGNhbGxiYWNrKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vQWRkIGEgY2FsbGJhY2sgdG8gYmUgZmlyZWQgYmVmb3JlIHJlbW92aW5nIGFuIGl0ZW1cblx0b25CZWZvcmVSZW1vdmUoY2FsbGJhY2spIHtcblx0XHR0aGlzLl9jYWxsYmFja3Mub25CZWZvcmVSZW1vdmUucHVzaChjYWxsYmFjayk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvL0FkZCBhIGNhbGxiYWNrIHRvIGJlIGZpcmVkIGFmdGVyIHN1Y2Nlc3NmdWxseSByZW1vdmluZyBhbiBpdGVtXG5cdG9uQWZ0ZXJSZW1vdmUoY2FsbGJhY2spIHtcblx0XHR0aGlzLl9jYWxsYmFja3Mub25BZnRlclJlbW92ZS5wdXNoKGNhbGxiYWNrKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vQWRkIGEgdHJhbnNmb3JtZXIgZnVuY3Rpb24gdG8gbW9kaWZ5IGFueSBuZXcgaXRlbXMgYmVpbmcgYWRkZWRcblx0YWRkVHJhbnNmb3JtZXIodHJhbnNmb3JtZXIsIHByaW9yaXR5KSB7XG5cdFx0aWYgKHRoaXMuX3RyYW5zZm9ybWVycyA9PT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fdHJhbnNmb3JtZXJzID0gbmV3IENhbGxiYWNrUXVldWUoKTtcblx0XHR9XG5cdFx0dGhpcy5fdHJhbnNmb3JtZXJzLmFkZCh0cmFuc2Zvcm1lciwgcHJpb3JpdHkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8vR2V0IG9yIGNyZWF0ZSBhIG5ldyBwYXJ0aWFsIHF1ZXVlIGZvciBhIGNlcnRhaW4gcHJpb3JpdHlcblx0X2dldFF1ZXVlKHByaW9yaXR5LCBjcmVhdGVOZXcgPSBmYWxzZSkge1xuXHRcdGlmICh0aGlzLl9wcmlvcml0aWVzLmluZGV4T2YocHJpb3JpdHkpID09PSAtMSkgeyAvL05vIHF1ZXVlIHdpdGggc3VjaCBwcmlvcml0eSB5ZXRcblx0XHRcdGlmICghY3JlYXRlTmV3KSB7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3ByaW9yaXRpZXMucHVzaChwcmlvcml0eSk7IC8vQWRkIHRoZSBwcmlvcml0eSB0byB0aGUgbGlzdFxuXHRcdFx0dGhpcy5fcHJpb3JpdGllcy5zb3J0KHRoaXMuX2NvbXBhcmF0b3IpOyAvL1NvcnQgdGhlIGxpc3Rcblx0XHRcdHRoaXMuX3NldFF1ZXVlKHByaW9yaXR5LCBbXSk7IC8vVGhlIG5ldyBxdWV1ZSBpcyBlbXB0eVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fcXVldWVzW3ByaW9yaXR5XTtcblx0fVxuXG5cdC8vQXNzaWduIGEgcGFydGlhbCBxdWV1ZSB0byBhIGNlcnRhaW4gcHJpb3JpdHlcblx0X3NldFF1ZXVlKHByaW9yaXR5LCBxdWV1ZSkge1xuXHRcdHRoaXMuX2ZsYWdzLmRpcnR5ID0gdHJ1ZTtcblx0XHR0aGlzLl9xdWV1ZXNbcHJpb3JpdHldID0gcXVldWU7XG5cdFx0cmV0dXJuIHF1ZXVlO1xuXHR9XG59XG4iLCJjbGFzcyBDYWxsYmFja1F1ZXVlIGV4dGVuZHMgUHJpb3JpdHlRdWV1ZSB7XG5cdGNvbnN0cnVjdG9yKGNvbXBhcmF0b3IpIHtcblx0XHRzdXBlcihjb21wYXJhdG9yKTtcblx0XHR0aGlzLl9wcml2YXRlQ2FsbGJhY2tzLm9uQmVmb3JlQWRkLnB1c2goQ2FsbGJhY2tRdWV1ZS5fdHlwZUNoZWNrKTtcblx0fVxuXG5cdGZpcmUoLi4uYXJncykge1xuXHRcdGlmICh0aGlzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5nZXRBbGwoKS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soLi4uYXJncykpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHN0YXRpYyBfdHlwZUNoZWNrKG9iamVjdCkge1xuXHRcdGlmICh0eXBlb2Ygb2JqZWN0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPbmx5IGZ1bmN0aW9ucyBjYW4gYmUgYWRkZWQgdG8gQ2FsbGJhY2tRdWV1ZS4nKTtcblx0XHR9XG5cdH1cbn1cbiIsIi8qIENyZWF0ZSBhIGxhenktZXZhbHVhdGlvbiB3cmFwcGVyIGFyb3VuZCBhbiBvYmplY3QuIFRoZSBwcm9wZXJ0aWVzIHdpbGwgYmUgZXZhbHVhdGVkIG9uIHRoZWlyIGZpcnN0IHVzYWdlLlxuICpcbiAqIGkuZS4gYGxhenkgPSBMYXp5UHJvcHMuY3JlYXRlKHsgcHJvcCgpIHsgcmV0dXJuIG5ldyBYKCk7IH0gfSk7YFxuICogYGxhenkucHJvcGAgd2lsbCBiZSBhbiBpbnN0YW5jZSBvZiBYIG9ubHkgYWZ0ZXIgYGxhenkucHJvcGAgaGFzIGJlZW4gcmVmZXJlbmNlZCBzb21ld2hlcmUuIFVudGlsIHRoYXQsXG4gKiBgbGF6eWAgd2lsbCBiZSBhbiBlbXB0eSBvYmplY3QuXG4gKi9cbmNvbnN0IExhenlQcm9wcyA9IHtcblx0Y3JlYXRlKG9iaiwgdGhpc0FyZykge1xuXHRcdGNvbnN0IHJlcyA9IHt9O1xuXHRcdE9iamVjdC5rZXlzKG9iailcblx0XHRcdC5maWx0ZXIoKGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSlcblx0XHRcdC5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcywga2V5LCB7XG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgeyAvL0RlZmluZSB0aGUgcHJvcGVydHkgd2l0aCBhIHZhbHVlIG9mIGB1bmRlZmluZWRgXG5cdFx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBvYmpba2V5XS5jYWxsKHRoaXNBcmcpOyAvL0NhbGwgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcmV0dXJuIHRoZSB2YWx1ZSB0byBiZSB1c2VkXG5cdFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7IC8vT3ZlcndyaXRlIHRoZSBnZXR0ZXIgd2l0aCB0aGUgYWN0dWFsIHZhbHVlXG5cdFx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHZhbHVlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNldCh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgeyAvL092ZXJ3cml0ZSBnZXR0ZXIgYW5kIHNldHRlciBhbmQgc3RvcmUgdGhlIHZhbHVlXG5cdFx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHZhbHVlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0cmV0dXJuIHJlcztcblx0fVxufTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIFdFQlBBR0UgRU5WSVJPTk1FTlQgT0JKRUNUXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFdfREVGQVVMVF9ERUJPVU5DRV9USU1FID0gMzAwO1xuY29uc3QgV19ERUZBVUxUX0tFWUJPQVJEX1BBUkFNID0gLTE7XG5jb25zdCBXX0RFRkFVTFRfVEhST1RUTEVfVElNRSA9IDMwMDtcblxuY2xhc3MgV2ViUGFnZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuY2FsbGJhY2tzID0gTGF6eVByb3BzLmNyZWF0ZSh7XG5cdFx0XHRpbW1lZGlhdGU6IHRoaXMuX2ltbWVkaWF0ZUNhbGxiYWNrUXVldWVGYWN0b3J5LFxuXHRcdFx0aW5pdDogKCkgPT4gbmV3IENhbGxiYWNrUXVldWUoKSxcblx0XHRcdHNjcm9sbDogKCkgPT4gTGF6eVByb3BzLmNyZWF0ZSh7XG5cdFx0XHRcdGdlbmVyYWw6IHRoaXMuX3Njcm9sbENhbGxiYWNrUXVldWVGYWN0b3J5LFxuXHRcdFx0XHRzdGFydDogdGhpcy5fc2Nyb2xsQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdGFjdGl2ZTogdGhpcy5fc2Nyb2xsQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdHRocm90dGxlZDogdGhpcy5fc2Nyb2xsQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdGVuZDogdGhpcy5fc2Nyb2xsQ2FsbGJhY2tRdWV1ZUZhY3Rvcnlcblx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0cmVzaXplOiAoKSA9PiBMYXp5UHJvcHMuY3JlYXRlKHtcblx0XHRcdFx0Z2VuZXJhbDogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdHdpZHRoOiAoKSA9PiBMYXp5UHJvcHMuY3JlYXRlKHtcblx0XHRcdFx0XHRzdGFydDogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdFx0YWN0aXZlOiB0aGlzLl9yZXNpemVDYWxsYmFja1F1ZXVlRmFjdG9yeSxcblx0XHRcdFx0XHR0aHJvdHRsZWQ6IHRoaXMuX3Jlc2l6ZUNhbGxiYWNrUXVldWVGYWN0b3J5LFxuXHRcdFx0XHRcdGVuZDogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3Rvcnlcblx0XHRcdFx0fSwgdGhpcyksXG5cdFx0XHRcdGhlaWdodDogKCkgPT4gTGF6eVByb3BzLmNyZWF0ZSh7XG5cdFx0XHRcdFx0c3RhcnQ6IHRoaXMuX3Jlc2l6ZUNhbGxiYWNrUXVldWVGYWN0b3J5LFxuXHRcdFx0XHRcdGFjdGl2ZTogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdFx0dGhyb3R0bGVkOiB0aGlzLl9yZXNpemVDYWxsYmFja1F1ZXVlRmFjdG9yeSxcblx0XHRcdFx0XHRlbmQ6IHRoaXMuX3Jlc2l6ZUNhbGxiYWNrUXVldWVGYWN0b3J5XG5cdFx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0XHRzdGFydDogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdGFjdGl2ZTogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdHRocm90dGxlZDogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRcdGVuZDogdGhpcy5fcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3Rvcnlcblx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0bGF5b3V0OiAoKSA9PiBuZXcgQ2FsbGJhY2tRdWV1ZSgpLFxuXHRcdFx0bGF5b3V0R3JvdXA6ICgpID0+IG5ldyBDYWxsYmFja1F1ZXVlKCksXG5cdFx0XHR2aXNpYmlsaXR5OiAoKSA9PiBuZXcgQ2FsbGJhY2tRdWV1ZSgpLFxuXHRcdFx0bmVhclZpZXc6IHRoaXMuX25lYXJWaWV3Q2FsbGJhY2tRdWV1ZUZhY3RvcnksXG5cdFx0XHRrZXlib2FyZDogdGhpcy5fa2V5VXBDYWxsYmFja1F1ZXVlRmFjdG9yeVxuXHRcdH0sIHRoaXMpO1xuXG5cdFx0dGhpcy5oYW5kbGVyTmFtZXMgPSB7XG5cdFx0XHRJTU1FRElBVEU6ICdpbW1lZGlhdGVIYW5kbGVyJyxcblx0XHRcdElOSVQ6ICdpbml0SGFuZGxlcicsXG5cdFx0XHRSRVNJWkU6ICdyZXNpemVIYW5kbGVyJyxcblx0XHRcdFJFU0laRV9TVEFSVDogJ3Jlc2l6ZVN0YXJ0SGFuZGxlcicsXG5cdFx0XHRSRVNJWkVfQUNUSVZFOiAncmVzaXplQWN0aXZlSGFuZGxlcicsXG5cdFx0XHRSRVNJWkVfVEhST1RUTEVEOiAncmVzaXplVGhyb3R0bGVkSGFuZGxlcicsXG5cdFx0XHRSRVNJWkVfRU5EOiAncmVzaXplRW5kSGFuZGxlcicsXG5cdFx0XHRSRVNJWkVfV0lEVEhfU1RBUlQ6ICdyZXNpemVXaWR0aFN0YXJ0SGFuZGxlcicsXG5cdFx0XHRSRVNJWkVfV0lEVEhfQUNUSVZFOiAncmVzaXplV2lkdGhBY3RpdmVIYW5kbGVyJyxcblx0XHRcdFJFU0laRV9XSURUSF9USFJPVFRMRUQ6ICdyZXNpemVXaWR0aFRocm90dGxlZEhhbmRsZXInLFxuXHRcdFx0UkVTSVpFX1dJRFRIX0VORDogJ3Jlc2l6ZVdpZHRoRW5kSGFuZGxlcicsXG5cdFx0XHRSRVNJWkVfSEVJR0hUX1NUQVJUOiAncmVzaXplSGVpZ2h0U3RhcnRIYW5kbGVyJyxcblx0XHRcdFJFU0laRV9IRUlHSFRfQUNUSVZFOiAncmVzaXplSGVpZ2h0QWN0aXZlSGFuZGxlcicsXG5cdFx0XHRSRVNJWkVfSEVJR0hUX1RIUk9UVExFRDogJ3Jlc2l6ZUhlaWdodFRocm90dGxlZEhhbmRsZXInLFxuXHRcdFx0UkVTSVpFX0hFSUdIVF9FTkQ6ICdyZXNpemVIZWlnaHRFbmRIYW5kbGVyJyxcblx0XHRcdExBWU9VVDogJ2xheW91dEhhbmRsZXInLFxuXHRcdFx0TEFZT1VUX0dST1VQOiAnbGF5b3V0R3JvdXBIYW5kbGVyJyxcblx0XHRcdFNDUk9MTDogJ3Njcm9sbEhhbmRsZXInLFxuXHRcdFx0U0NST0xMX1NUQVJUOiAnc2Nyb2xsU3RhcnRIYW5kbGVyJyxcblx0XHRcdFNDUk9MTF9BQ1RJVkU6ICdzY3JvbGxBY3RpdmVIYW5kbGVyJyxcblx0XHRcdFNDUk9MTF9USFJPVFRMRUQ6ICdzY3JvbGxUaHJvdHRsZWRIYW5kbGVyJyxcblx0XHRcdFNDUk9MTF9FTkQ6ICdzY3JvbGxFbmRIYW5kbGVyJyxcblx0XHRcdFZJU0lCSUxJVFk6ICd2aXNpYmlsaXR5SGFuZGxlcicsXG5cdFx0XHRORUFSX1ZJRVc6ICduZWFyVmlld0hhbmRsZXInLFxuXHRcdFx0S0VZQk9BUkQ6IC9rZXlib2FyZCg/OlxcWyhcXGQrKSg/OiwoXFxkKykpKl0pP0hhbmRsZXIvIC8vaS5lLiBrZXlib2FyZEhhbmRsZXIsIGtleWJvYXJkWzI3XUhhbmRsZXIsIGtleWJvYXJkWzM5LDQwXUhhbmRsZXJcblx0XHR9O1xuXHRcdHRoaXMuX2F1dG9IYW5kbGVkID0gbmV3IE1hcCgpO1xuXHRcdHRoaXMuX2NhblVzZUludGVyc2VjdGlvbk9ic2VydmVycyA9IHR5cGVvZiBJbnRlcnNlY3Rpb25PYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCc7XG5cdFx0dGhpcy5faW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBudWxsO1xuXHRcdHRoaXMuX25lYXJWaWV3SGFuZGxlcnMgPSBuZXcgTWFwKCk7XG5cdFx0dGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG5cdFx0dGhpcy5jYW5IYW5kbGVWaXNpYmlsaXR5Q2hhbmdlID0gdHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcgJiYgISFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyO1xuXHRcdHRoaXMuJGh0bWwgPSAkKCdodG1sJyk7XG5cdFx0dGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblx0XHR0aGlzLiRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuXHRcdHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcblxuXHRcdHRoaXMudG9wID0gdGhpcy50b3BMYXN0ID0gdGhpcy4kd2luZG93LnNjcm9sbFRvcCgpO1xuXHRcdHRoaXMud2lkdGggPSB0aGlzLndpZHRoTGFzdCA9IHRoaXMuJHdpbmRvdy5vdXRlcldpZHRoKHRydWUpO1xuXHRcdHRoaXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHRMYXN0ID0gdGhpcy4kd2luZG93Lm91dGVySGVpZ2h0KCk7XG5cdFx0dGhpcy5zY3JvbGxEaXJlY3Rpb24gPSAwO1xuXHRcdHRoaXMubGF5b3V0ID0gbnVsbDtcblx0XHR0aGlzLmJyZWFrcG9pbnRzID0gW1xuXHRcdFx0e2Zyb206IDAsIHRvOiA0NjAsIGxheW91dDogJ3RpbnknLCBsYXlvdXRHcm91cDogJ3Bob25lJ30sXG5cdFx0XHR7ZnJvbTogNDYxLCB0bzogNjAwLCBsYXlvdXQ6ICdwaG9uZScsIGxheW91dEdyb3VwOiAncGhvbmUnfSxcblx0XHRcdHtmcm9tOiA2MDEsIHRvOiA5MDAsIGxheW91dDogJ3RhYmxldC1wb3J0cmFpdCcsIGxheW91dEdyb3VwOiAndGFibGV0J30sXG5cdFx0XHR7ZnJvbTogOTAxLCB0bzogMTIwMCwgbGF5b3V0OiAndGFibGV0LWxhbmRzY2FwZScsIGxheW91dEdyb3VwOiAndGFibGV0J30sXG5cdFx0XHR7ZnJvbTogMTIwMSwgdG86IDE1MDAsIGxheW91dDogJ2Rlc2t0b3AnLCBsYXlvdXRHcm91cDogJ2Rlc2t0b3AnfSxcblx0XHRcdHtmcm9tOiAxNTAxLCB0bzogMTgwMCwgbGF5b3V0OiAnZGVza3RvcC1tZWRpdW0nLCBsYXlvdXRHcm91cDogJ2Rlc2t0b3AnfSxcblx0XHRcdHtmcm9tOiAxODAxLCB0bzogOTk5OTksIGxheW91dDogJ2Rlc2t0b3AtbGFyZ2UnLCBsYXlvdXRHcm91cDogJ2Rlc2t0b3AnfVxuXHRcdF07XG5cdFx0dGhpcy5sYXlvdXRzID0gdGhpcy5icmVha3BvaW50cy5tYXAoKGIpID0+IGIubGF5b3V0KTtcblx0XHR0aGlzLmlzUmV0aW5hID0gKFxuXHRcdFx0d2luZG93Lm1hdGNoTWVkaWEgJiYgKFxuXHRcdFx0XHR3aW5kb3cubWF0Y2hNZWRpYSgnb25seSBzY3JlZW4gYW5kIChtaW4tcmVzb2x1dGlvbjogMTI0ZHBpKSwgb25seSBzY3JlZW4gYW5kIChtaW4tcmVzb2x1dGlvbjogMS4zZHBweCksIG9ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDQ4LjhkcGNtKScpLm1hdGNoZXNcblx0XHRcdFx0fHwgd2luZG93Lm1hdGNoTWVkaWEoJ29ubHkgc2NyZWVuIGFuZCAoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjMpLCBvbmx5IHNjcmVlbiBhbmQgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIuNi8yKSwgb25seSBzY3JlZW4gYW5kIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuMyksIG9ubHkgc2NyZWVuIGFuZCAobWluLWRldmljZS1waXhlbC1yYXRpbzogMS4zKScpLm1hdGNoZXNcblx0XHRcdClcblx0XHQpIHx8IChcblx0XHRcdHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMS4zXG5cdFx0KTtcblx0XHR0aGlzLmlzU3RhdGljID0gbnVsbDtcblx0XHR0aGlzLmlzV2luZG93Rm9jdXNlZCA9IHRydWU7XG5cdFx0dGhpcy5fZmxhZ3MgPSB7XG5cdFx0XHRzY3JvbGxpbmc6IGZhbHNlLFxuXHRcdFx0cmVzaXppbmdXaWR0aDogZmFsc2UsXG5cdFx0XHRyZXNpemluZ0hlaWdodDogZmFsc2UsXG5cdFx0XHRpc1Njcm9sbEJvdW5kOiBmYWxzZSxcblx0XHRcdGlzUmVzaXplQm91bmQ6IGZhbHNlLFxuXHRcdFx0aXNLZXlVcEJvdW5kOiBmYWxzZVxuXHRcdH07XG5cdFx0dGhpcy5fZGVib3VuY2UgPSB7XG5cdFx0XHRzY3JvbGxUaW1lb3V0SWQ6IC0xLFxuXHRcdFx0cmVzaXplVGltZW91dElkOiAtMSxcblx0XHRcdHJlc2l6ZVdpZHRoVGltZW91dElkOiAtMSxcblx0XHRcdHJlc2l6ZUhlaWdodFRpbWVvdXRJZDogLTFcblx0XHR9O1xuXHRcdHRoaXMuX3Rocm90dGxlID0ge1xuXHRcdFx0c2Nyb2xsVGltZXN0YW1wOiAwLFxuXHRcdFx0cmVzaXplV2lkdGhUaW1lc3RhbXA6IDAsXG5cdFx0XHRyZXNpemVIZWlnaHRUaW1lc3RhbXA6IDAsXG5cdFx0XHRyZXNpemVUaW1lc3RhbXA6IDBcblx0XHR9O1xuXHRcdHRoaXMuZGV2aWNlID0ge1xuXHRcdFx0bW9iaWxlOiBib3dzZXIubW9iaWxlIHx8IGJvd3Nlci50YWJsZXQsXG5cdFx0XHR0YWJsZXQ6IGJvd3Nlci50YWJsZXQsXG5cdFx0XHRwaG9uZTogYm93c2VyLm1vYmlsZSxcblx0XHRcdGlvczogYm93c2VyLmlvcyxcblx0XHRcdG9zOiBudWxsLFxuXHRcdFx0b3N2ZXJzaW9uOiBib3dzZXIub3N2ZXJzaW9uXG5cdFx0fTtcblx0XHR0aGlzLmJyb3dzZXIgPSB7XG5cdFx0XHRuYW1lOiAoKCkgPT4ge1xuXHRcdFx0XHRzd2l0Y2ggKHRydWUpIHtcblx0XHRcdFx0XHRjYXNlIGJvd3Nlci5jaHJvbWU6IHJldHVybiBcImNocm9tZVwiO1xuXHRcdFx0XHRcdGNhc2UgYm93c2VyLnNhZmFyaTogcmV0dXJuIFwic2FmYXJpXCI7XG5cdFx0XHRcdFx0Y2FzZSBib3dzZXIub3BlcmE6IHJldHVybiBcIm9wZXJhXCI7XG5cdFx0XHRcdFx0Y2FzZSBib3dzZXIubW96aWxsYTogcmV0dXJuIFwibW96aWxsYVwiO1xuXHRcdFx0XHRcdGNhc2UgYm93c2VyLmZpcmVmb3g6IHJldHVybiBcImZpcmVmb3hcIjtcblx0XHRcdFx0XHRjYXNlIGJvd3Nlci5tc2llOiByZXR1cm4gXCJtcyBtc2llXCI7XG5cdFx0XHRcdFx0Y2FzZSBib3dzZXIubXNlZGdlOiByZXR1cm4gXCJtcyBtc2VkZ2VcIjtcblx0XHRcdFx0XHRkZWZhdWx0OiByZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSkoKSxcblx0XHRcdHZlcnNpb246IHBhcnNlSW50KGJvd3Nlci52ZXJzaW9uLCAxMCksXG5cdFx0XHR3ZWJraXQ6IGJvd3Nlci53ZWJraXQsXG5cdFx0XHRnZWNrbzogYm93c2VyLmdlY2tvXG5cdFx0fTtcblxuXHRcdC8vVXNlIGxpa2UgdGhpczogaWYgKHcuaXNMYXlvdXQuc21hbGxlclRoYW4oJ2Rlc2t0b3AnKSkgeyAuLi4gfVxuXHRcdHRoaXMuaXNMYXlvdXQgPSB7XG5cdFx0XHRzbWFsbGVyVGhhbjogKGNvbXBhcmUsIGxheW91dCA9IHRoaXMubGF5b3V0KSA9PiB0aGlzLmxheW91dHMuaW5kZXhPZihsYXlvdXQpIDwgdGhpcy5sYXlvdXRzLmluZGV4T2YoY29tcGFyZSksXG5cdFx0XHRzbWFsbGVyT3JFcXVhbDogKGNvbXBhcmUsIGxheW91dCA9IHRoaXMubGF5b3V0KSA9PiB0aGlzLmxheW91dHMuaW5kZXhPZihsYXlvdXQpIDw9IHRoaXMubGF5b3V0cy5pbmRleE9mKGNvbXBhcmUpLFxuXHRcdFx0YmlnZ2VyVGhhbjogKGNvbXBhcmUsIGxheW91dCA9IHRoaXMubGF5b3V0KSA9PiB0aGlzLmxheW91dHMuaW5kZXhPZihsYXlvdXQpID4gdGhpcy5sYXlvdXRzLmluZGV4T2YoY29tcGFyZSksXG5cdFx0XHRiaWdnZXJPckVxdWFsOiAoY29tcGFyZSwgbGF5b3V0ID0gdGhpcy5sYXlvdXQpID0+IHRoaXMubGF5b3V0cy5pbmRleE9mKGxheW91dCkgPj0gdGhpcy5sYXlvdXRzLmluZGV4T2YoY29tcGFyZSlcblx0XHR9O1xuXG5cdFx0dGhpcy4kaHRtbC50b2dnbGVDbGFzcygnbW9iaWxlb3MtYW5kcm9pZCcsICEhYm93c2VyLmFuZHJvaWQpO1xuXHRcdHRoaXMuJGh0bWwudG9nZ2xlQ2xhc3MoJ21vYmlsZW9zLWlvcycsICEhYm93c2VyLmlvcyk7XG5cdFx0dGhpcy4kaHRtbC50b2dnbGVDbGFzcygnbW9iaWxlb3Mtd3AnLCAhIWJvd3Nlci53aW5kb3dzcGhvbmUpO1xuXG5cdFx0dGhpcy4kaHRtbC5hZGRDbGFzcyh0aGlzLmJyb3dzZXIubmFtZSk7XG5cdFx0dGhpcy4kaHRtbC5hZGRDbGFzcyhgdiR7dGhpcy5icm93c2VyLnZlcnNpb259YCk7XG5cdFx0dGhpcy4kaHRtbC5hZGRDbGFzcyh0aGlzLmRldmljZS5tb2JpbGUgPyBcIm1vYmlsZURldmljZVwiIDogJ25vbi1tb2JpbGVEZXZpY2UnKTtcblx0XHR0aGlzLiRodG1sLmFkZENsYXNzKHRoaXMuY2FuSGFuZGxlVmlzaWJpbGl0eUNoYW5nZSA/ICd2aXNpYmlsaXR5Q2hhbmdlJyA6ICdub24tdmlzaWJpbGl0eUNoYW5nZScpO1xuXHR9XG5cblx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8vSW5pdGlhbGl6ZSB0aGUgd2VicGFnZS4gRG9uJ3QgY2FsbCB0aGlzIHlvdXJzZWxmISBTaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZSBhdCB0aGUgZW5kIG9mIHRoZSBkb2N1bWVudFxuXHRpbml0KCkge1xuXHRcdC8vSGFuZGxlIHZpc2liaWxpdHkgY2hhbmdlXG5cdFx0aWYgKHRoaXMuY2FuSGFuZGxlVmlzaWJpbGl0eUNoYW5nZSkge1xuXHRcdFx0dGhpcy5pc1dpbmRvd0ZvY3VzZWQgPSAhZG9jdW1lbnQuaGlkZGVuO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHRoaXMuX3Zpc2liaWxpdHlIYW5kbGVyLmJpbmQodGhpcykpO1xuXHRcdH1cblxuXHRcdC8vUmVhZHkgdG8gZ28hXG5cdFx0dGhpcy5fZ2V0TGF5b3V0KCk7XG5cdFx0dGhpcy5fZGVib3VuY2UuaXNEaXNhYmxlZCA9IGZhbHNlO1xuXHRcdHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG5cdFx0dGhpcy5jYWxsYmFja3MuaW5pdC5maXJlKCk7XG5cdH1cblxuXHQvL0F1dG9tYXRpY2FsbHkgZmluZCBoYW5kbGVycyBpbiBhbiBvYmplY3QgYW5kIHJlZ2lzdGVyIHRoZW1cblx0YXV0b0hhbmRsZShvYmplY3QsIHByaW9yaXR5KSB7XG5cdFx0Y29uc3QgZGF0YSA9IHtcblx0XHRcdG93bmVyOiBvYmplY3QsXG5cdFx0XHRoYW5kbGVyczogbmV3IE1hcCgpXG5cdFx0fTtcblx0XHRPYmplY3Qua2V5cyh0aGlzLmhhbmRsZXJOYW1lcykuZm9yRWFjaCgoa2V5KSA9PiB7IC8vSXRlcmF0ZSBvdmVyIGhhbmRsZXIgbmFtZSBrZXlzXG5cdFx0XHRjb25zdCBuYW1lID0gdGhpcy5oYW5kbGVyTmFtZXNba2V5XTtcblx0XHRcdGlmIChuYW1lIGluc3RhbmNlb2YgUmVnRXhwKSB7IC8vSGFuZGxlciBuYW1lIGlzIGEgUmVnRXhwXG5cdFx0XHRcdE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaCgob2JqS2V5KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbWF0Y2ggPSBuYW1lLmV4ZWMob2JqS2V5KTtcblx0XHRcdFx0XHRpZiAoIW1hdGNoKSB7IC8vVGhpcyBoYW5kbGVyJ3MgbmFtZSBkb2Vzbid0IG1hdGNoIHRoZSBSZWdFeHBcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGV0IGhhbmRsZXJQYXJhbXMgPSBtYXRjaC5zbGljZSgxKS5maWx0ZXIoKHApID0+IHAgIT09IHVuZGVmaW5lZCk7IC8vRXh0cmFjdCBhbGwgUmVnRXhwIGNhcHR1cmUgZ3JvdXBzXG5cdFx0XHRcdFx0c3dpdGNoIChuYW1lKSB7XG5cdFx0XHRcdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLktFWUJPQVJEOlxuXHRcdFx0XHRcdFx0XHRpZiAoaGFuZGxlclBhcmFtcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVyUGFyYW1zID0gW1dfREVGQVVMVF9LRVlCT0FSRF9QQVJBTV07IC8vV2hlbiBubyBrZXlDb2RlIHBhcmFtZXRlciBpcyBnaXZlbiwgcmVnaXN0ZXIgYSBnZW5lcmFsIGtleWJvYXJkIGhhbmRsZXJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkYXRhLmhhbmRsZXJzLnNldCggLy9SZWdpc3RlciBhIGhhbmRsZXIgZm9yIGVhY2ggcGFyYW1ldGVyXG5cdFx0XHRcdFx0XHRcdFx0b2JqS2V5LFxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZXJQYXJhbXMucmVkdWNlKChyZXMsIHBhcmFtKSA9PlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzLmNvbmNhdCh0aGlzLmNhbGxiYWNrcy5rZXlib2FyZC5hZGQob2JqZWN0W29iaktleV0uYmluZChvYmplY3QpLCBwcmlvcml0eSwgK3BhcmFtKSksIFtdKVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6IGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgeyAvL0hhbmRsZXIgbmFtZSBpcyBhIHNpbXBsZSBzdHJpbmdcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmplY3RbbmFtZV0gIT09ICdmdW5jdGlvbicpIHsgLy9UaGUgb2JqZWN0IGRvZXNuJ3QgaW1wbGVtZW50IHRoaXMgaGFuZGxlclxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRzd2l0Y2ggKG5hbWUpIHtcblx0XHRcdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLk5FQVJfVklFVzogLy9IYW5kbGUgbmVhclZpZXcgZGlmZmVyZW50bHlcblx0XHRcdFx0XHRcdGxldCBlbCA9IG9iamVjdC4kZWxlbWVudCB8fCBvYmplY3QuJGVsOyAvL0dldCB0aGUgcmVsYXRlZCBlbGVtZW50IGZvciB0aGlzIG9iamVjdFxuXHRcdFx0XHRcdFx0aWYgKGVsIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG5cdFx0XHRcdFx0XHRcdGVsID0gZWwuZ2V0KDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGF0YS5oYW5kbGVycy5zZXQobmFtZSwgdGhpcy5jYWxsYmFja3MubmVhclZpZXcuYWRkKG9iamVjdFtuYW1lXS5iaW5kKG9iamVjdCksIHByaW9yaXR5LCBlbCkpOyAvL1JlZ2lzdGVyIHRoZSBoYW5kbGVyXG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRkYXRhLmhhbmRsZXJzLnNldChuYW1lLCB0aGlzLl9nZXRDYWxsYmFja1F1ZXVlRm9ySGFuZGxlck5hbWUobmFtZSkuYWRkKG9iamVjdFtuYW1lXS5iaW5kKG9iamVjdCksIHByaW9yaXR5KSk7IC8vUmVnaXN0ZXIgdGhlIGhhbmRsZXJcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5fYXV0b0hhbmRsZWQuc2V0KG9iamVjdCwgZGF0YSk7IC8vU2F2ZSByZWxhdGVkIGRhdGEgZm9yIHBvc3NpYmxlIGZ1dHVyZSBkZWFjdGl2YXRpb25cblx0fVxuXG5cdC8vVW5yZWdpc3RlciBhbGwgaGFuZGxlcnMgb2YgYW4gb2JqZWN0IHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIGF1dG9IYW5kbGUoKVxuXHRzdG9wSGFuZGxpbmcob2JqZWN0KSB7XG5cdFx0Y29uc3QgZGF0YSA9IHRoaXMuX2F1dG9IYW5kbGVkLmdldChvYmplY3QpOyAvL0ZpbmQgYWxsIGFjdGl2ZSBoYW5kbGVyc1xuXHRcdGlmICghZGF0YSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkYXRhLmhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIsIG5hbWUpID0+IHsgLy9JdGVyYXRlIG92ZXIgYWxsIHRoZSBhY3RpdmUgaGFuZGxlciBuYW1lc1xuXHRcdFx0Y29uc3QgY2JRdWV1ZSA9IHRoaXMuX2dldENhbGxiYWNrUXVldWVGb3JIYW5kbGVyTmFtZShuYW1lKTtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXIpKSB7IC8vQXJyYXkgb2YgaGFuZGxlcnMsIG1vc3QgbGlrZWx5IHdpdGggYSBSZWdFeHAgbmFtZVxuXHRcdFx0XHRoYW5kbGVyLmZvckVhY2goKGgpID0+IHtcblx0XHRcdFx0XHRjYlF1ZXVlLnJlbW92ZShoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjYlF1ZXVlLnJlbW92ZShoYW5kbGVyKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR0aGlzLl9hdXRvSGFuZGxlZC5kZWxldGUob2JqZWN0KTsgLy9Gb3JnZXQgdGhpcyBvYmplY3Rcblx0fVxuXG5cdC8vVG9nZ2xlIGZ1bGxzY3JlZW5cblx0dG9nZ2xlRnVsbHNjcmVlbihzZXQpIHtcblx0XHRjb25zdCBkb2MgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cdFx0Y29uc3QgZG9jRWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuXHRcdGNvbnN0IHJlcXVlc3RGdWxsU2NyZWVuID0gZG9jRWwucmVxdWVzdEZ1bGxzY3JlZW4gfHwgZG9jRWwubW96UmVxdWVzdEZ1bGxTY3JlZW4gfHwgZG9jRWwud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHwgZG9jRWwubXNSZXF1ZXN0RnVsbHNjcmVlbjtcblx0XHRjb25zdCBjYW5jZWxGdWxsU2NyZWVuID0gZG9jLmV4aXRGdWxsc2NyZWVuIHx8IGRvYy5tb3pDYW5jZWxGdWxsU2NyZWVuIHx8IGRvYy53ZWJraXRFeGl0RnVsbHNjcmVlbiB8fCBkb2MubXNFeGl0RnVsbHNjcmVlbjtcblx0XHRjb25zdCBpc0Z1bGxzY3JlZW4gPSAhIShkb2MuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jLm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8IGRvYy53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fCBkb2MubXNGdWxsc2NyZWVuRWxlbWVudCk7XG5cblx0XHRpZiAodHlwZW9mIHNldCA9PT0gJ3VuZGVmaW5lZCcpIHsgLy9Bcmd1bWVudCBvbWl0dGVkLCB0b2dnbGUgZnVsbHNjcmVlbiBzdGF0ZVxuXHRcdFx0c2V0ID0gIWlzRnVsbHNjcmVlbjtcblx0XHR9XG5cblx0XHRpZiAoc2V0ICYmICFpc0Z1bGxzY3JlZW4pIHtcblx0XHRcdHJlcXVlc3RGdWxsU2NyZWVuLmNhbGwoZG9jRWwpO1xuXHRcdH0gZWxzZSBpZiAoIXNldCAmJiBpc0Z1bGxzY3JlZW4pIHtcblx0XHRcdGNhbmNlbEZ1bGxTY3JlZW4uY2FsbChkb2MpO1xuXHRcdH1cblx0fVxuXG5cdGdldFNjcm9sbGJhcldpZHRoKCkge1xuXHRcdHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcblx0fVxuXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRfcmVzaXplSGFuZGxlcigpIHtcblx0XHR0aGlzLndpZHRoID0gdGhpcy4kd2luZG93Lm91dGVyV2lkdGgodHJ1ZSk7XG5cdFx0dGhpcy5oZWlnaHQgPSB0aGlzLiR3aW5kb3cub3V0ZXJIZWlnaHQoKTtcblxuXHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cblx0XHQvL1Jlc2l6ZSBpbiBhbnkgZGlyZWN0aW9uIHN0YXJ0XG5cdFx0aWYgKCF0aGlzLl9mbGFncy5yZXNpemluZ1dpZHRoICYmICF0aGlzLl9mbGFncy5yZXNpemluZ0hlaWdodCkge1xuXHRcdFx0dGhpcy5fdGhyb3R0bGUucmVzaXplVGltZXN0YW1wID0gbm93O1xuXHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLmdlbmVyYWwuZmlyZSh0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfU1RBUlQpO1xuXHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLnN0YXJ0LmZpcmUoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy53aWR0aExhc3QgIT09IHRoaXMud2lkdGgpIHtcblx0XHRcdC8vUmVzaXplIHdpZHRoIHN0YXJ0XG5cdFx0XHRpZiAoIXRoaXMuX2ZsYWdzLnJlc2l6aW5nV2lkdGgpIHtcblx0XHRcdFx0dGhpcy5fZmxhZ3MucmVzaXppbmdXaWR0aCA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX3Rocm90dGxlLnJlc2l6ZVdpZHRoVGltZXN0YW1wID0gbm93O1xuXHRcdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9XSURUSF9TVEFSVCk7XG5cdFx0XHRcdHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS53aWR0aC5zdGFydC5maXJlKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vV2hpbGUgcmVzaXppbmcgd2lkdGhcblx0XHRcdHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5nZW5lcmFsLmZpcmUodGhpcy5oYW5kbGVyTmFtZXMuUkVTSVpFX1dJRFRIX0FDVElWRSk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUud2lkdGguYWN0aXZlLmZpcmUoKTtcblxuXHRcdFx0Ly9UaHJvdHRsZWQgd2lkdGggcmVzaXppbmdcblx0XHRcdGlmIChub3cgLSB0aGlzLl90aHJvdHRsZS5yZXNpemVXaWR0aFRpbWVzdGFtcCA+IFdfREVGQVVMVF9USFJPVFRMRV9USU1FKSB7XG5cdFx0XHRcdHRoaXMuX3Rocm90dGxlLnJlc2l6ZVdpZHRoVGltZXN0YW1wID0gbm93O1xuXHRcdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9XSURUSF9USFJPVFRMRUQpO1xuXHRcdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUud2lkdGgudGhyb3R0bGVkLmZpcmUoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly9SZXNpemUgd2lkdGggZW5kXG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fZGVib3VuY2UucmVzaXplV2lkdGhUaW1lb3V0SWQpO1xuXHRcdFx0dGhpcy5fZGVib3VuY2UucmVzaXplV2lkdGhUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dGhpcy5fZ2V0TGF5b3V0KCk7XG5cdFx0XHRcdHRoaXMuX2ZsYWdzLnJlc2l6aW5nV2lkdGggPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLmdlbmVyYWwuZmlyZSh0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfV0lEVEhfRU5EKTtcblx0XHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLndpZHRoLmVuZC5maXJlKCk7XG5cdFx0XHR9LCBXX0RFRkFVTFRfREVCT1VOQ0VfVElNRSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuaGVpZ2h0TGFzdCAhPT0gdGhpcy5oZWlnaHQpIHtcblx0XHRcdC8vUmVzaXplIGhlaWdodCBzdGFydFxuXHRcdFx0aWYgKCF0aGlzLl9mbGFncy5yZXNpemluZ0hlaWdodCkge1xuXHRcdFx0XHR0aGlzLl9mbGFncy5yZXNpemluZ0hlaWdodCA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX3Rocm90dGxlLnJlc2l6ZUhlaWdodFRpbWVzdGFtcCA9IG5vdztcblx0XHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLmdlbmVyYWwuZmlyZSh0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfSEVJR0hUX1NUQVJUKTtcblx0XHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLmhlaWdodC5zdGFydC5maXJlKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vV2hpbGUgcmVzaXppbmcgaGVpZ2h0XG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9IRUlHSFRfQUNUSVZFKTtcblx0XHRcdHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5oZWlnaHQuYWN0aXZlLmZpcmUoKTtcblxuXHRcdFx0Ly9UaHJvdHRsZWQgaGVpZ2h0IHJlc2l6aW5nXG5cdFx0XHRpZiAobm93IC0gdGhpcy5fdGhyb3R0bGUucmVzaXplSGVpZ2h0VGltZXN0YW1wID4gV19ERUZBVUxUX1RIUk9UVExFX1RJTUUpIHtcblx0XHRcdFx0dGhpcy5fdGhyb3R0bGUucmVzaXplSGVpZ2h0VGltZXN0YW1wID0gbm93O1xuXHRcdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9IRUlHSFRfVEhST1RUTEVEKTtcblx0XHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLmhlaWdodC50aHJvdHRsZWQuZmlyZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvL1Jlc2l6ZSBoZWlnaHQgZW5kXG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fZGVib3VuY2UucmVzaXplSGVpZ2h0VGltZW91dElkKTtcblx0XHRcdHRoaXMuX2RlYm91bmNlLnJlc2l6ZUhlaWdodFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9nZXRMYXlvdXQoKTtcblx0XHRcdFx0dGhpcy5fZmxhZ3MucmVzaXppbmdIZWlnaHQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLmdlbmVyYWwuZmlyZSh0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfSEVJR0hUX0VORCk7XG5cdFx0XHRcdHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5oZWlnaHQuZW5kLmZpcmUoKTtcblx0XHRcdH0sIFdfREVGQVVMVF9ERUJPVU5DRV9USU1FKTtcblx0XHR9XG5cblx0XHQvL1doaWxlIHJlc2l6aW5nIGluIGFueSBkaXJlY3Rpb25cblx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9BQ1RJVkUpO1xuXHRcdHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5hY3RpdmUuZmlyZSgpO1xuXG5cdFx0Ly9UaHJvdHRsZWQgcmVzaXppbmdcblx0XHRpZiAobm93IC0gdGhpcy5fdGhyb3R0bGUucmVzaXplVGltZXN0YW1wID4gV19ERUZBVUxUX1RIUk9UVExFX1RJTUUpIHtcblx0XHRcdHRoaXMuX3Rocm90dGxlLnJlc2l6ZVRpbWVzdGFtcCA9IG5vdztcblx0XHRcdHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5nZW5lcmFsLmZpcmUodGhpcy5oYW5kbGVyTmFtZXMuUkVTSVpFX1RIUk9UVExFRCk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUudGhyb3R0bGVkLmZpcmUoKTtcblx0XHR9XG5cblx0XHQvL1Jlc2l6ZSBpbiBhbnkgZGlyZWN0aW9uIGVuZFxuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9kZWJvdW5jZS5yZXNpemVUaW1lb3V0SWQpO1xuXHRcdHRoaXMuX2RlYm91bmNlLnJlc2l6ZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5fZ2V0TGF5b3V0KCk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9FTkQpO1xuXHRcdFx0dGhpcy5jYWxsYmFja3MucmVzaXplLmVuZC5maXJlKCk7XG5cdFx0fSwgV19ERUZBVUxUX0RFQk9VTkNFX1RJTUUpO1xuXG5cdFx0dGhpcy53aWR0aExhc3QgPSB0aGlzLndpZHRoOyAvL1VwZGF0ZSBsYXN0IHZhbHVlXG5cdFx0dGhpcy5oZWlnaHRMYXN0ID0gdGhpcy5oZWlnaHQ7XG5cdH1cblxuXHRfc2Nyb2xsSGFuZGxlcigpIHtcblx0XHR0aGlzLnRvcCA9IHRoaXMuJHdpbmRvdy5zY3JvbGxUb3AoKTtcblx0XHR0aGlzLnNjcm9sbERpcmVjdGlvbiA9IEhlbHBlcnMuc2lnbih0aGlzLnRvcCAtIHRoaXMudG9wTGFzdCk7XG5cblx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG5cdFx0Ly9TY3JvbGwgc3RhcnRcblx0XHRpZiAoIXRoaXMuX2ZsYWdzLnNjcm9sbGluZykge1xuXHRcdFx0dGhpcy5fZmxhZ3Muc2Nyb2xsaW5nID0gdHJ1ZTtcblx0XHRcdHRoaXMuX3Rocm90dGxlLnNjcm9sbFRpbWVzdGFtcCA9IG5vdztcblx0XHRcdHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5nZW5lcmFsLmZpcmUodGhpcy5oYW5kbGVyTmFtZXMuU0NST0xMX1NUQVJUKTtcblx0XHRcdHRoaXMuY2FsbGJhY2tzLnNjcm9sbC5zdGFydC5maXJlKCk7XG5cdFx0fVxuXG5cdFx0Ly9XaGlsZSBzY3JvbGxpbmdcblx0XHR0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlNDUk9MTF9BQ1RJVkUpO1xuXHRcdHRoaXMuY2FsbGJhY2tzLnNjcm9sbC5hY3RpdmUuZmlyZSgpO1xuXG5cdFx0Ly9UaHJvdHRsZWQgc2Nyb2xsaW5nXG5cdFx0aWYgKG5vdyAtIHRoaXMuX3Rocm90dGxlLnNjcm9sbFRpbWVzdGFtcCA+IFdfREVGQVVMVF9USFJPVFRMRV9USU1FKSB7XG5cdFx0XHR0aGlzLl90aHJvdHRsZS5zY3JvbGxUaW1lc3RhbXAgPSBub3c7XG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5zY3JvbGwuZ2VuZXJhbC5maXJlKHRoaXMuaGFuZGxlck5hbWVzLlNDUk9MTF9USFJPVFRMRUQpO1xuXHRcdFx0dGhpcy5jYWxsYmFja3Muc2Nyb2xsLnRocm90dGxlZC5maXJlKCk7XG5cdFx0fVxuXG5cdFx0Ly9TY3JvbGwgZW5kXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2RlYm91bmNlLnNjcm9sbFRpbWVvdXRJZCk7XG5cdFx0dGhpcy5fZGVib3VuY2Uuc2Nyb2xsVGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0aGlzLl9mbGFncy5zY3JvbGxpbmcgPSBmYWxzZTtcblx0XHRcdHRoaXMuY2FsbGJhY2tzLnNjcm9sbC5nZW5lcmFsLmZpcmUodGhpcy5oYW5kbGVyTmFtZXMuU0NST0xMX0VORCk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5zY3JvbGwuZW5kLmZpcmUoKTtcblx0XHR9LCBXX0RFRkFVTFRfREVCT1VOQ0VfVElNRSk7XG5cblx0XHR0aGlzLnRvcExhc3QgPSB0aGlzLnRvcDsgLy9VcGRhdGUgbGFzdCB2YWx1ZVxuXHR9XG5cblx0X2tleVVwSGFuZGxlcihlKSB7XG5cdFx0dGhpcy5jYWxsYmFja3Mua2V5Ym9hcmQuZmlyZShlKTtcblx0fVxuXG5cdF92aXNpYmlsaXR5SGFuZGxlcigpIHtcblx0XHR0aGlzLmNhbGxiYWNrcy52aXNpYmlsaXR5LmZpcmUodGhpcy5pc1dpbmRvd0ZvY3VzZWQgPSAhZG9jdW1lbnQuaGlkZGVuKTtcblx0fVxuXG5cdF9nZXRMYXlvdXQoKSB7XG5cdFx0Y29uc3Qgb2xkTGF5b3V0ID0gdGhpcy5sYXlvdXQ7XG5cdFx0Y29uc3Qgb2xkTGF5b3V0R3JvdXAgPSB0aGlzLmxheW91dEdyb3VwO1xuXHRcdGNvbnN0IGN1cnJlbnRCcmVha3BvaW50ID0gdGhpcy5icmVha3BvaW50cy5maW5kKChiKSA9PiB3aW5kb3cubWF0Y2hNZWRpYShgKG1pbi13aWR0aDogJHtiLmZyb219cHgpIGFuZCAobWF4LXdpZHRoOiAke2IudG99cHgpYCkubWF0Y2hlcyk7XG5cblx0XHRpZiAoY3VycmVudEJyZWFrcG9pbnQpIHtcblx0XHRcdHRoaXMubGF5b3V0ID0gY3VycmVudEJyZWFrcG9pbnQubGF5b3V0O1xuXHRcdFx0dGhpcy5sYXlvdXRHcm91cCA9IGN1cnJlbnRCcmVha3BvaW50LmxheW91dEdyb3VwO1xuXHRcdH1cblx0XHRpZiAob2xkTGF5b3V0ICE9PSB0aGlzLmxheW91dCAmJiB0aGlzLmxheW91dCAhPT0gbnVsbCkgeyAvL0xheW91dCBjaGFuZ2VkXG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5sYXlvdXQuZmlyZSh0aGlzLmxheW91dCwgb2xkTGF5b3V0KTtcblx0XHR9XG5cdFx0aWYgKG9sZExheW91dEdyb3VwICE9PSB0aGlzLmxheW91dEdyb3VwICYmIHRoaXMubGF5b3V0R3JvdXAgIT09IG51bGwpIHsgLy9MYXlvdXQgZ3JvdXAgY2hhbmdlZFxuXHRcdFx0dGhpcy5jYWxsYmFja3MubGF5b3V0R3JvdXAuZmlyZSh0aGlzLmxheW91dEdyb3VwLCBvbGRMYXlvdXRHcm91cCk7XG5cdFx0fVxuXHR9XG5cblx0X2ltbWVkaWF0ZUNhbGxiYWNrUXVldWVGYWN0b3J5KCkge1xuXHRcdHJldHVybiBuZXcgQ2FsbGJhY2tRdWV1ZSgpLm9uQmVmb3JlQWRkKChoYW5kbGVyKSA9PiB7XG5cdFx0XHRoYW5kbGVyKCk7IC8vQ2FsbCB0aGUgaGFuZGxlciBpbW1lZGlhdGVseSBhbmQgZGlzY2FyZCBpdFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHR9XG5cblx0X3Njcm9sbENhbGxiYWNrUXVldWVGYWN0b3J5KCkge1xuXHRcdGNvbnN0IHEgPSBuZXcgQ2FsbGJhY2tRdWV1ZSgpO1xuXHRcdGlmICghdGhpcy5fZmxhZ3MuaXNTY3JvbGxCb3VuZCkge1xuXHRcdFx0cS5vbkFmdGVyQWRkKCgpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzLl9mbGFncy5pc1Njcm9sbEJvdW5kKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmxhZ3MuaXNTY3JvbGxCb3VuZCA9IHRydWU7XG5cdFx0XHRcdFx0dGhpcy4kd2luZG93LnNjcm9sbCh0aGlzLl9zY3JvbGxIYW5kbGVyLmJpbmQodGhpcykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHE7XG5cdH1cblxuXHRfcmVzaXplQ2FsbGJhY2tRdWV1ZUZhY3RvcnkoKSB7XG5cdFx0Y29uc3QgcSA9IG5ldyBDYWxsYmFja1F1ZXVlKCk7XG5cdFx0aWYgKCF0aGlzLl9mbGFncy5pc1Jlc2l6ZUJvdW5kKSB7XG5cdFx0XHRxLm9uQWZ0ZXJBZGQoKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXMuX2ZsYWdzLmlzUmVzaXplQm91bmQpIHtcblx0XHRcdFx0XHR0aGlzLl9mbGFncy5pc1Jlc2l6ZUJvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLiR3aW5kb3cucmVzaXplKHRoaXMuX3Jlc2l6ZUhhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcTtcblx0fVxuXG5cdF9rZXlVcENhbGxiYWNrUXVldWVGYWN0b3J5KCkge1xuXHRcdGNvbnN0IHEgPSBuZXcgQ2FsbGJhY2tRdWV1ZSgpO1xuXHRcdHEuYWRkVHJhbnNmb3JtZXIoKGhhbmRsZXIsIHByaW9yaXR5LCBrZXlDb2RlKSA9PiAoZSkgPT4geyAvL1JldHVybiBhIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIGhhbmRsZXIgb25seSBvbiBjb3JyZWN0IGtleUNvZGVcblx0XHRcdGlmIChrZXlDb2RlID09PSBlLmtleUNvZGUgfHwga2V5Q29kZSA9PT0gV19ERUZBVUxUX0tFWUJPQVJEX1BBUkFNKSB7XG5cdFx0XHRcdGhhbmRsZXIoZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0aWYgKCF0aGlzLl9mbGFncy5pc0tleVVwQm91bmQpIHtcblx0XHRcdHEub25BZnRlckFkZCgoKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpcy5fZmxhZ3MuaXNLZXlVcEJvdW5kKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmxhZ3MuaXNLZXlVcEJvdW5kID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLiRkb2N1bWVudC5rZXl1cCh0aGlzLl9rZXlVcEhhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcTtcblx0fVxuXG5cdF9uZWFyVmlld0NhbGxiYWNrUXVldWVGYWN0b3J5KCkge1xuXHRcdHJldHVybiBuZXcgUHJpb3JpdHlRdWV1ZSgpXG5cdFx0XHQuYWRkVHJhbnNmb3JtZXIoKGhhbmRsZXIsIHByaW9yaXR5LCBlbCkgPT4gdGhpcy5fY3JlYXRlSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoaGFuZGxlciwgZWwpKVxuXHRcdFx0Lm9uQWZ0ZXJSZW1vdmUodGhpcy5fZGVzdHJveUludGVyc2VjdGlvbk9ic2VydmVyLmJpbmQodGhpcykpO1xuXHR9XG5cblx0X2NyZWF0ZUludGVyc2VjdGlvbk9ic2VydmVyKGhhbmRsZXIsIGVsKSB7XG5cdFx0aWYgKHRoaXMuX2NhblVzZUludGVyc2VjdGlvbk9ic2VydmVycykgeyAvL1VzZSBuYXRpdmUgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgY2xhc3Ncblx0XHRcdGlmICh0aGlzLl9pbnRlcnNlY3Rpb25PYnNlcnZlciA9PT0gbnVsbCkgeyAvL0lmIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkXG5cdFx0XHRcdHRoaXMuX2ludGVyc2VjdGlvbk9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzKSA9PiB7IC8vQ3JlYXRlIGEgbmV3IG9ic2VydmVyXG5cdFx0XHRcdFx0ZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7IC8vSWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbWluZyBpbnRvIHRoZSB2aWV3cG9ydCBhcmVhXG5cdFx0XHRcdFx0XHRcdHRoaXMuX25lYXJWaWV3SGFuZGxlcnMuZ2V0KGVudHJ5LnRhcmdldCkoKTsgLy9GaW5kIHRoZSByZWxhdGVkIGhhbmRsZXIgYW5kIGNhbGwgaXRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHJvb3RNYXJnaW46IFwiNTAlIDBweCA1MCUgMHB4XCIsIC8vSGFsZiBvZiB0aGUgdmlld3BvcnQgaGVpZ2h0IGFib3ZlIGFuZCBiZWxvd1xuXHRcdFx0XHRcdHRocmVzaG9sZDogMFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX25lYXJWaWV3SGFuZGxlcnMuc2V0KGVsLCBoYW5kbGVyKTsgLy9TdG9yZSB0aGUgcmVsYXRlZCBoYW5kbGVyIGZvciB0aGlzIHRhcmdldCBlbGVtZW50XG5cdFx0XHR0aGlzLl9pbnRlcnNlY3Rpb25PYnNlcnZlci5vYnNlcnZlKGVsKTsgLy9TdGFydCBvYnNlcnZpbmcgaW50ZXJzZWN0aW9uIGNoYW5nZXNcblx0XHRcdHJldHVybiBlbDtcblx0XHR9XG5cblx0XHQvL0ludGVyc2VjdGlvbk9ic2VydmVyIGZhbGxiYWNrIC0gc2hvdWxkIHdvcmsgYWxtb3N0IGlkZW50aWNhbGx5XG5cdFx0Y29uc3QgYmFzZSA9IHRoaXM7XG5cblx0XHRjb25zdCBmYWxsYmFjayA9IChmdW5jdGlvbiBpbnRlcnNlY3Rpb25GYWxsYmFjaygpIHtcblx0XHRcdGNvbnN0IGhlaWdodCA9ICQoZWwpLm91dGVySGVpZ2h0KCk7XG5cdFx0XHRjb25zdCB7dG9wfSA9ICQoZWwpLm9mZnNldCgpO1xuXHRcdFx0Y29uc3QgY3VycmVudFN0YXRlID0gYmFzZS50b3AgPj0gdG9wIC0gYmFzZS5oZWlnaHQgKiAxLjUgJiYgYmFzZS50b3AgPD0gdG9wICsgaGVpZ2h0ICsgYmFzZS5oZWlnaHQgLyAyO1xuXHRcdFx0aWYgKGN1cnJlbnRTdGF0ZSAmJiAhdGhpcy5sYXN0U3RhdGUpIHtcblx0XHRcdFx0aGFuZGxlcigpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5sYXN0U3RhdGUgPSBjdXJyZW50U3RhdGU7XG5cdFx0fSkuYmluZCh7bGFzdFN0YXRlOiBmYWxzZX0pO1xuXG5cdFx0dGhpcy4kd2luZG93LnNjcm9sbChmYWxsYmFjayk7XG5cdFx0dGhpcy4kd2luZG93LnJlc2l6ZShmYWxsYmFjayk7XG5cdFx0aWYgKHRoaXMuaXNJbml0aWFsaXplZCkge1xuXHRcdFx0ZmFsbGJhY2soKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5jYWxsYmFja3MuaW5pdC5hZGQoZmFsbGJhY2spO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsbGJhY2s7XG5cdH1cblxuXHRfZGVzdHJveUludGVyc2VjdGlvbk9ic2VydmVyKG9iaikge1xuXHRcdGlmICh0aGlzLl9jYW5Vc2VJbnRlcnNlY3Rpb25PYnNlcnZlcnMpIHtcblx0XHRcdHRoaXMuX2ludGVyc2VjdGlvbk9ic2VydmVyLnVub2JzZXJ2ZShvYmopO1xuXHRcdFx0dGhpcy5fbmVhclZpZXdIYW5kbGVycy5kZWxldGUob2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy4kd2luZG93Lm9mZignc2Nyb2xsJywgb2JqKTtcblx0XHRcdHRoaXMuJHdpbmRvdy5vZmYoJ3Jlc2l6ZScsIG9iaik7XG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5pbml0LnJlbW92ZShvYmopO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRDYWxsYmFja1F1ZXVlRm9ySGFuZGxlck5hbWUobmFtZSkge1xuXHRcdHN3aXRjaCAobmFtZSkge1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5JTU1FRElBVEU6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5pbW1lZGlhdGU7XG5cdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLklOSVQ6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5pbml0O1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5TQ1JPTEw6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5zY3JvbGwuZ2VuZXJhbDtcblx0XHRcdGNhc2UgdGhpcy5oYW5kbGVyTmFtZXMuU0NST0xMX1NUQVJUOiByZXR1cm4gdGhpcy5jYWxsYmFja3Muc2Nyb2xsLnN0YXJ0O1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5TQ1JPTExfQUNUSVZFOiByZXR1cm4gdGhpcy5jYWxsYmFja3Muc2Nyb2xsLmFjdGl2ZTtcblx0XHRcdGNhc2UgdGhpcy5oYW5kbGVyTmFtZXMuU0NST0xMX1RIUk9UVExFRDogcmV0dXJuIHRoaXMuY2FsbGJhY2tzLnNjcm9sbC50aHJvdHRsZWQ7XG5cdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLlNDUk9MTF9FTkQ6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5zY3JvbGwuZW5kO1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkU6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5yZXNpemUuZ2VuZXJhbDtcblx0XHRcdGNhc2UgdGhpcy5oYW5kbGVyTmFtZXMuUkVTSVpFX1NUQVJUOiByZXR1cm4gdGhpcy5jYWxsYmFja3MucmVzaXplLnN0YXJ0O1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfQUNUSVZFOiByZXR1cm4gdGhpcy5jYWxsYmFja3MucmVzaXplLmFjdGl2ZTtcblx0XHRcdGNhc2UgdGhpcy5oYW5kbGVyTmFtZXMuUkVTSVpFX1RIUk9UVExFRDogcmV0dXJuIHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS50aHJvdHRsZWQ7XG5cdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9FTkQ6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5yZXNpemUuZW5kO1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfV0lEVEhfU1RBUlQ6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5yZXNpemUud2lkdGguc3RhcnQ7XG5cdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9XSURUSF9BQ1RJVkU6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5yZXNpemUud2lkdGguYWN0aXZlO1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfV0lEVEhfVEhST1RUTEVEOiByZXR1cm4gdGhpcy5jYWxsYmFja3MucmVzaXplLndpZHRoLnRocm90dGxlZDtcblx0XHRcdGNhc2UgdGhpcy5oYW5kbGVyTmFtZXMuUkVTSVpFX1dJRFRIX0VORDogcmV0dXJuIHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS53aWR0aC5lbmQ7XG5cdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLlJFU0laRV9IRUlHSFRfU1RBUlQ6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5yZXNpemUuaGVpZ2h0LnN0YXJ0O1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfSEVJR0hUX0FDVElWRTogcmV0dXJuIHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5oZWlnaHQuYWN0aXZlO1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfSEVJR0hUX1RIUk9UVExFRDogcmV0dXJuIHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5oZWlnaHQudGhyb3R0bGVkO1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5SRVNJWkVfSEVJR0hUX0VORDogcmV0dXJuIHRoaXMuY2FsbGJhY2tzLnJlc2l6ZS5oZWlnaHQuZW5kO1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5MQVlPVVQ6IHJldHVybiB0aGlzLmNhbGxiYWNrcy5sYXlvdXQ7XG5cdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLkxBWU9VVF9HUk9VUDogcmV0dXJuIHRoaXMuY2FsbGJhY2tzLmxheW91dEdyb3VwO1xuXHRcdFx0Y2FzZSB0aGlzLmhhbmRsZXJOYW1lcy5WSVNJQklMSVRZOiByZXR1cm4gdGhpcy5jYWxsYmFja3MudmlzaWJpbGl0eTtcblx0XHRcdGNhc2UgdGhpcy5oYW5kbGVyTmFtZXMuTkVBUl9WSUVXOiByZXR1cm4gdGhpcy5jYWxsYmFja3MubmVhclZpZXc7XG5cdFx0XHRjYXNlIHRoaXMuaGFuZGxlck5hbWVzLktFWUJPQVJEOiByZXR1cm4gdGhpcy5jYWxsYmFja3Mua2V5Ym9hcmQ7XG5cdFx0XHRkZWZhdWx0OiBicmVhaztcblx0XHR9XG5cdFx0aWYgKHRoaXMuaGFuZGxlck5hbWVzLktFWUJPQVJELnRlc3QobmFtZSkpIHtcblx0XHRcdHJldHVybiB0aGlzLmNhbGxiYWNrcy5rZXlib2FyZDtcblx0XHR9XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufVxuXG53aW5kb3cudyA9IG5ldyBXZWJQYWdlKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
