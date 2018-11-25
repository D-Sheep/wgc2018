class Camera {
	constructor() {
		this.offset = 0;
		this.speed = 0;
		this.maxCenterPlayerOffset = VIEW_WIDTH / 2 * 4 / 5;

		application.ticker.add(() => {
			if (player) {
				const center = this.getCenterOffset();
				this.speed = (player.x - center) / this.maxCenterPlayerOffset * PLAYER_MAX_HSPEED / 10;

				this.centerAt(center + this.speed);

				application.world.x = -this.offset;
			}
		});
	}

	centerAt(x) {
		this.offset = Math.min(Math.max(0, x - VIEW_WIDTH / 2), application.worldWidth - VIEW_WIDTH);
		application.floor.x = this.offset;
	}

	getCenterOffset() {
		return this.offset + VIEW_WIDTH / 2;
	}
}