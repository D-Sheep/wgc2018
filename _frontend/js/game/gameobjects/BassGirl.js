class BassGirl extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
		this.animationSpeed = 0.05;
		this.play();
	}
}

BassGirl.isAnimated = true;