class Player extends PIXI.Sprite {
    constructor(...args) {
        super(...args);

        this.vSpeed = 0;
        this.isInAir = false;
        this.anchor.y = 1;
        this.anchor.x = 0.5;
        this.stats = {};

        const tickerHandler = () => {
            const ledges = application.getLedges();
            const isPlayerOnLedge = ledges.some((ledge) => {
                if (
                    this.vSpeed >= 0
                    && ledge.x <= this.x
                    && ledge.x + ledge.length > this.x
                    && ledge.y >= this.y
                    && ledge.y <= this.y + this.vSpeed
                ) {
                    this.stopFalling();
                    this.y = ledge.y;
                    return true;
                }

                return false;
            });

            if (!isPlayerOnLedge && this.y < VIEW_HEIGHT && !this.wouldClipAtPosition(this.x, this.y + 1)) {
                this.isInAir = true;
            }

            if (this.isInAir) {
                this.vSpeed += PLAYER_GRAVITY;

                if (this.vSpeed > 0 && this.y + this.vSpeed >= VIEW_HEIGHT) {
                    this.stopFalling();
                    this.y = VIEW_HEIGHT;
                }

                const blockAboveBelow = this.wouldClipAtPosition(this.x, this.y + this.vSpeed);

                if (blockAboveBelow) {
                    if (this.vSpeed > 0) {
                        this.stopFalling();
                        this.y = blockAboveBelow.y;
                    } else if (this.vSpeed < 0) {
                        this.vSpeed = 0;
                        this.y = blockAboveBelow.y + blockAboveBelow.height + this.height;
                    }
                }
            }

            this.y += this.vSpeed;

            const xMotion = application.ticker.deltaTime / application.ticker.FPS * PLAYER_MAX_HSPEED;

            if (controls.isPressed(KEY_LEFT)) {
                if (!this.wouldClipAtPosition(this.x - xMotion, this.y)) {
                    this.x -= xMotion;
                    this.scale.x = -1;
                }
            }

            if (controls.isPressed(KEY_RIGHT)) {
                if (!this.wouldClipAtPosition(this.x + xMotion, this.y)) {
                    this.x += xMotion;
                    this.scale.x = 1;
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

        collisionManager.on(this, Coins, (object) => {
            GameApp.vue.$store.commit('updatePlayerState', {
                state: 'money',
                value: GameApp.vue.$store.state.player.states.money + 3
            });
            object.destroy();
        });
    }

    jump() {
        this.vSpeed = PLAYER_JUMP_VSPEED;
        this.isInAir = true;
    }

    wouldClipAtPosition(x, y) {
        const currentPosition = new PIXI.Point(this.position.x, this.position.y);
        this.position = new PIXI.Point(x, y);

        const bounds = this.getBounds();
        const block = application.getBlocks().find((block) => bounds.intersects(block.getBounds()));

        this.position = currentPosition;
        return block;
    }

    stopFalling() {
        this.isInAir = false;
        this.vSpeed = 0;
    }
}