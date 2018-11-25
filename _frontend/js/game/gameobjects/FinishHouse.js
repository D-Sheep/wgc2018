class FinishHouse extends GameObject {
	constructor(texture, data) {
		super(texture, data);

		this.gotoAndStop(Helpers.rnd(0, 6));
		this.anchor.x = 0.5;
		this.anchor.y = 622 / this.height;
	}
}

FinishHouse.isAnimated = true;