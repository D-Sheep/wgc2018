class EpicSaxGuy extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
		this.animationSpeed = 0.05;
		this.play();
	}
}

EpicSaxGuy.isAnimated = true;