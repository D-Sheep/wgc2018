Object.assign(PIXI.Point.prototype, {
	distance: function(other) {
		const x = this.x - other.x;
		const y = this.y - other.y;
		return Math.sqrt(x * x + y * y);
	}
});

Object.assign(PIXI.ObservablePoint.prototype, {
	distance: function(other) {
		const x = this.x - other.x;
		const y = this.y - other.y;
		return Math.sqrt(x * x + y * y);
	}
});
