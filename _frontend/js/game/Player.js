class Player extends PIXI.extras.AnimatedSprite {
	constructor(textures) {
		super(textures);

		this.textureStorage = {
			moving: textures,
			static: [assetStorage.getTexture('Player-static')]
		};

		this.vSpeed = 0;
		this.isInAir = false;
		this.animationSpeed = 0.1;
		this.isInvincible = false;
		this.sounds = {
			walk: assetStorage.getSound('walk'),
			jump: assetStorage.getSound('jump'),
			land: assetStorage.getSound('land'),
			metalhead: assetStorage.getSound('metalhead'),
			pickup: assetStorage.getSound('pickup'),
			fix: assetStorage.getSound('fix'),
			fckmylife: assetStorage.getSound('fckmylife'),
			turtle: assetStorage.getSound('turtle'),
		};
		this.sounds.walk.loop = true;

		this.anchor.y = 1;
		this.anchor.x = 0.5;
		this.lastX = this.x;
		this.play();
		this.stats = {};
		this.isPlayerOnLedge = false;
		this.summary = {
			money: BASE_MONEY,
			injury: BASE_INJURY,
			hunger: BASE_HUNGER
		};

		const tickerHandler = () => {
			const ledges = application.getLedges();
			this.isPlayerOnLedge = ledges.some((ledge) => {
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

			if (!this.isPlayerOnLedge && this.y < GROUND_HEIGHT && !this.wouldClipAtPosition(this.x, this.y + 1)) {
				this.isInAir = true;
			}

			if (this.isInAir) {
				this.vSpeed += PLAYER_GRAVITY;

				if (this.vSpeed > 0 && this.y + this.vSpeed >= GROUND_HEIGHT) {
					this.stopFalling();
					this.y = GROUND_HEIGHT;
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
			this.lastX = this.x;

			const xMotion = application.ticker.deltaTime / application.ticker.FPS * PLAYER_MAX_HSPEED;
			const keyLeft = controls.isPressed(KEY_LEFT);
			const keyRight = controls.isPressed(KEY_RIGHT);


			if (keyLeft) {
				if (!this.wouldClipAtPosition(this.x - xMotion, this.y)) {
					this.x -= xMotion;
					this.scale.x = -1;
				}
			}

			if (keyRight) {
				if (!this.wouldClipAtPosition(this.x + xMotion, this.y)) {
					this.x += xMotion;
					this.scale.x = 1;
				}
			}

			this.x = Math.min(Math.max(0, this.x), application.worldWidth);

			if (this.lastX !== this.x) {
				const isStartingMovement = this.textures === this.textureStorage.static;

				if (isStartingMovement) {
					this.textures = this.textureStorage.moving;
					this.gotoAndPlay(0);
					this.animationSpeed = 0.1;
					this.sounds.walk.play();
				}
			} else {
				if (!this.sounds.walk.paused) {
					this.sounds.walk.currentTime = 0;
					this.sounds.walk.pause();
				}
				this.textures = this.textureStorage.static;
			}

			this.sounds.walk.muted = this.isInAir;
		};

		application.ticker.add(tickerHandler);

		controls.on('keydown', KEY_UP, () => {
			if (!this.isInAir) {
				this.jump();
			}
		});

		controls.on('keydown', KEY_DOWN, () => {
			if (this.isPlayerOnLedge && !this.wouldClipAtPosition(this.x, this.y + 1)) {
				this.y += 1;
				this.isInAir = true;
			}
		});

		collisionManager.on(this, Finish, (object) => {
			object.isCollisionEnabled = false;
			window.controls.disableControls();
			application.disableMushroomMode();
			this.sounds.fix.currentTime = 0;
			this.sounds.fix.play();

			const tl = new TimelineMax();
			tl
				.to(this, 0.5, {alpha: 0})
				.add(() => {
					window.eventHub.$emit('levelFinished');
				}, '+=1.5');
		});

		collisionManager.on(this, AirConditioning, (object) => {
			const newInjuryStat = GameApp.vue.$store.state.player.stats.injury + 5 >= MAX_INJURY ?
				MAX_INJURY :
				GameApp.vue.$store.state.player.stats.injury + 5;

			GameApp.vue.$store.commit('updatePlayerStat', {
				stat: 'injury',
				value: newInjuryStat
			});
			this.summary.injury += 5;
			object.isCollisionEnabled = false;
			setTimeout(() => {
				object.isCollisionEnabled = true;
			}, 300);
			this.sounds.metalhead.currentTime = 0;
			this.sounds.metalhead.play();
		});

		collisionManager.on(this, Coins, (object) => {
			GameApp.vue.$store.commit('updatePlayerState', {
				state: 'money',
				value: GameApp.vue.$store.state.player.states.money + 5
			});
			this.summary.money += 5;
			object.destroy();

			this.sounds.pickup.currentTime = 0;
			this.sounds.pickup.play();
		});

		collisionManager.on(this, RedMushroom, (object) => {
			application.enableMushroomMode();
			object.destroy();
		});

		collisionManager.on(this, RedTurtle, (object) => {
			if (this.isInvincible) {
				return;
			}

			const newInjuryStat = GameApp.vue.$store.state.player.stats.injury + 5 >= MAX_INJURY ?
				MAX_INJURY :
				GameApp.vue.$store.state.player.stats.injury + 5;

			GameApp.vue.$store.commit('updatePlayerStat', {
				stat: 'injury',
				value: newInjuryStat
			});
			this.summary.injury += 5;
			this.isInvincible = true;
			this.injuryJump();
			setTimeout(() => {
				this.isInvincible = false;
			}, PLAYER_INVINCIBILITY_DURATION);
		});
	}

	injuryJump() {
		this.sounds.fckmylife.currentTime = 0;
		this.sounds.fckmylife.volume = 0.7;
		this.sounds.fckmylife.play();
		this.vSpeed = PLAYER_INJURY_JUMP_VSPEED;
		this.isInAir = true;
	}

	jump() {
		this.vSpeed = PLAYER_JUMP_VSPEED;
		this.isInAir = true;
		this.sounds.jump.currentTime = 0;
		this.sounds.jump.play();
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
		if (this.vSpeed > 0) {
			this.sounds.land.currentTime = 0;
			this.sounds.land.play();
		}
		this.vSpeed = 0;
	}
}