Object.assign(PIXI.Rectangle.prototype, {
	intersects: function(other) {
		return this.x < other.x + other.width &&
			this.y < other.y + other.height &&
			this.x + this.width > other.x &&
			this.y + this.height > other.y;
	}
});
