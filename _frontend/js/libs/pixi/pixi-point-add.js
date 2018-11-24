Object.assign(PIXI.Point.prototype, {
	add(other) {
		return new PIXI.Point(this.x + other.x, this.y + other.y);
	}
});

Object.assign(PIXI.ObservablePoint.prototype, {
	add(other) {
		return new PIXI.ObservablePoint(this.x + other.x, this.y + other.y);
	}
});
