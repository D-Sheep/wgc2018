const PLAYER_MAX_HSPEED = 350;
const PLAYER_JUMP_VSPEED = -20;
const PLAYER_GRAVITY = 1;

class Player extends PIXI.Sprite {
    constructor(...args) {
        super(...args);

        this.vSpeed = 0;
        this.isInAir = false;
        this.anchor.y = 1;
        this.anchor.x = 0.5;
        this.stats = {};

        const tickerHandler = () => {
            if (controls.isPressed(KEY_LEFT)) {
                this.x -= application.ticker.deltaTime / application.ticker.FPS * PLAYER_MAX_HSPEED;
            }

            if (controls.isPressed(KEY_RIGHT)) {
                this.x += application.ticker.deltaTime / application.ticker.FPS * PLAYER_MAX_HSPEED;
            }

            if (this.isInAir) {
                this.vSpeed += PLAYER_GRAVITY;
                this.y += this.vSpeed;

                if (this.y >= ROOM_HEIGHT) {
                    this.isInAir = false;
                    this.vSpeed = 0;
                    this.y = ROOM_HEIGHT;
                }
            }
        };

        application.ticker.add(tickerHandler);

        controls.on('keydown', KEY_UP, () => {
            if (!this.isInAir) {
                this.jump();
            }
        });

        collisionManager.on(this, AirConditioning, (object) => {
            console.log('hit', object);
            object.isCollisionEnabled = false;
        });
    }

    jump() {
        this.vSpeed = PLAYER_JUMP_VSPEED;
        this.isInAir = true;
    }
}