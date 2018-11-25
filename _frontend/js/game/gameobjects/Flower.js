class Flower extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.anchor.set(0.5, 136 / 156);
		this.gotoAndStop(0);
	}
}

Manhole.isAnimated = true;