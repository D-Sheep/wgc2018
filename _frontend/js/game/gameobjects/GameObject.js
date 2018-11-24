class GameObject extends PIXI.extras.AnimatedSprite {
    constructor(textures, data) {
        super(textures);

        this.isCollisionEnabled = true;
    }
}

GameObject.isAnimated = false;