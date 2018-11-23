class FocusedElementObserver {
	constructor(elements, offset = 0) {
		this._selector = null;
		if (typeof elements === 'string') {
			this._$elements = $(elements); //Transform selector string to jQuery object
			this._selector = elements;
		} else {
			this._$elements = elements;
		}
		this._offset = offset;
		this._breakpoints = [];
		this._$lastActiveElement = undefined;
		this._callbacks = {
			onActiveChanged: []
		};
		this.update();

		w.autoHandle(this);
	}

	update() {
		this._breakpoints = [];
		if (this._selector !== null) {
			this._$elements = $(this._selector);
		}

		let previousHistogram = null;
		this._$elements.each((idx, el) => {
			const currentHistogram = new FocusedElementObserver.VisibilityHistogram($(el), this._offset);
			//Calculate scroll breakpoints at which the sections should be active
			this._breakpoints.unshift({ //Reversed order - descending!
				offset: idx > 0 ? previousHistogram.getIntersectionPoint(currentHistogram) : 0,
				element: $(el)
			});
			previousHistogram = currentHistogram;
		});
	}

	setFocusPointOffset(offset) {
		this._offset = offset;
		this.update();
	}

	onChange(cb) {
		this._callbacks.onActiveChanged.push(cb); //Register a callback
	}

	getFocusedElement() {
		return this._$lastActiveElement;
	}

	scrollActiveHandler() {
		if (this._breakpoints.length > 0) {
			const $element = this._breakpoints.find((b) => b.offset <= w.top).element; //Searching in descending order
			if ($element !== this._$lastActiveElement) {
				const $oldElement = this._$lastActiveElement;
				this._$lastActiveElement = $element;
				this._callbacks.onActiveChanged.forEach((cb) => cb($element, $oldElement, this._$elements)); //Fire all callbacks
			}
		}
	}
}

FocusedElementObserver.VisibilityHistogram = class {
	constructor(element, offset) {
		const elementHeight = element.outerHeight();

		this.offset = element.offset().top - w.height - offset;
		this.risingEdge = new FocusedElementObserver.VisibilityHistogram.AxbLine(1 / elementHeight, 0);
		this.fallingEdge = new FocusedElementObserver.VisibilityHistogram.AxbLine(-1 / elementHeight, 0).moveX(elementHeight + w.height);
	}

	getIntersectionPoint(other) {
		return this.fallingEdge.intersectX(other.risingEdge.moveX(other.offset - this.offset)) + this.offset;
	}
};

FocusedElementObserver.VisibilityHistogram.AxbLine = class {
	constructor(a, b) { //Using the formula y = ax + b
		this.a = a;
		this.b = b;
	}

	moveX(offset) { //Move the line along the x-axis
		return new FocusedElementObserver.VisibilityHistogram.AxbLine(this.a, this.b - offset * this.a);
	}

	intersectX(other) { //X-coordinate of the intersection
		return (other.b - this.b) / (this.a - other.a);
	}
};
