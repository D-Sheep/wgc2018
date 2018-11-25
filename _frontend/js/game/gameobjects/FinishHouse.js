class FinishHouse extends GameObject {
	constructor(texture, data) {
		super(texture, data);

		this.anchor.x = 0.5;
		this.anchor.y = 622 / this.height;

		this.gotoAndStop(Helpers.rnd(0, 6));
	}
}

FinishHouse.isAnimated = true;