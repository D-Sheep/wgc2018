class Controls {
	constructor() {
		this.isDisabled = false;
		this.keyMap = new Set();
		this.callbacks = {
			keyup: new Map(),
			keydown: new Map()
		};

		document.addEventListener("keydown", (e) => {
			if (this.isDisabled) {
				return;
			}

			if (!this.isPressed(e.keyCode) && this.callbacks.keydown.has(e.keyCode)) {
				this.callbacks.keydown.get(e.keyCode).forEach((cb) => cb());
			}
			this.keyMap.add(e.keyCode);
		});

		document.addEventListener("keyup", (e) => {
			if (this.isDisabled) {
				return;
			}

			this.keyMap.delete(e.keyCode);
			if (this.callbacks.keyup.has(e.keyCode)) {
				this.callbacks.keyup.get(e.keyCode).forEach((cb) => cb());
			}
		});
	}

	isPressed(keyCode) {
		return this.keyMap.has(keyCode);
	}

	on(eventType, keyCode, callback) {
		if (!this.callbacks[eventType].has(keyCode)) {
			this.callbacks[eventType].set(keyCode, []);
		}
		this.callbacks[eventType].get(keyCode).push(callback);
	}

	disableControls() {
		this.isDisabled = true;
		this.keyMap.clear();
	}
}