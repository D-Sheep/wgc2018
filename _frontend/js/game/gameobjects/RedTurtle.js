class RedTurtle extends WalkingEnemy {
    constructor(texture, data) {
        super(texture, data);

        this.bottomCenterAnchor();
        this.speed = RED_TURTLE_SPEED;
    }
}