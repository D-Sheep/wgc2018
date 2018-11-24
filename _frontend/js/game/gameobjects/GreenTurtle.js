class GreenTurtle extends WalkingEnemy {
    constructor(texture, data) {
        super(texture, data);

        this.bottomCenterAnchor();
        this.speed = GREEN_TURTLE_SPEED;
    }
}