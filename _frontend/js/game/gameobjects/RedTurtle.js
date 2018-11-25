class RedTurtle extends WalkingEnemy {
	constructor(texture, data) {
		super(texture, data);

		this.bottomCenterAnchor();
		this.speed = RED_TURTLE_SPEED;
		this.animationSpeed = 0.1;
		this.play();
	}
}

RedTurtle.isAnimated = true;