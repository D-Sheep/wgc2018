class PromiseMax extends TimelineMax {
	constructor(...args) {
		super(...args);

		this._resolve = null;
		this._reject = null;
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	resolve(value, position) {
		return this.add(() => {
			this._resolve(value);
		}, position);
	}

	reject(value, position) {
		return this.add(() => {
			this._reject(value);
		}, position);
	}

	then(...args) {
		this._promise.then(...args);
	}

	catch(...args) {
		this._promise.catch(...args);
	}

	finally(...args) {
		this._promise.finally(...args);
	}
}
