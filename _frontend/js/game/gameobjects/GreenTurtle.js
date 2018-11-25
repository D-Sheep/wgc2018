class GreenTurtle extends WalkingEnemy {
	constructor(texture, data) {
		super(texture, data);

		this.bottomCenterAnchor();
		this.speed = GREEN_TURTLE_SPEED;
		this.animationSpeed = 0.1;
		this.play();
	}
}

GreenTurtle.isAnimated = true;