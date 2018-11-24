class GreenTurtle extends WalkingEnemy {
    constructor(texture, data) {
        super(texture, data);

        this.anchor.y = 1;
        this.anchor.x = 0.5;
        this.speed = GREEN_TURTLE_SPEED;
    }
}