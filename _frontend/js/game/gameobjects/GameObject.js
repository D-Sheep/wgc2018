class GameObject extends PIXI.extras.AnimatedSprite {
	constructor(textures, data) {
		super(textures);

		this.isCollisionEnabled = true;
	}

	bottomCenterAnchor() {
		this.anchor.set(0.5, 1);
	}

	centerAnchor() {
		this.anchor.set(0.5, 0.5);
	}
}

GameObject.isAnimated = false;