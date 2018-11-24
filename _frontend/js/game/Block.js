class Block extends PIXI.Sprite {
    constructor(x, y, width, height) {
        super(PIXI.Texture.EMPTY);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}