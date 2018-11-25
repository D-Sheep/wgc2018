class Manhole extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.centerAnchor();
		this.gotoAndStop(0);
	}
}

Manhole.isAnimated = true;