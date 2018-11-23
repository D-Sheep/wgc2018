class CallbackQueue extends PriorityQueue {
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
