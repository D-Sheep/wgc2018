class GameObject extends PIXI.extras.AnimatedSprite {
	constructor(textures, data) {
		super(textures);

		this.isCollisionEnabled = true;
	}

	bottomCenterAnchor() {
		this.anchor.set(0.5, 1);
	}

	centerAnchor() {
		this.anchor.set(0.5, 0.5);
	}
}

GameObject.isAnimated = false;;;class WalkingEnemy extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.direction = Helpers.choose([1, -1]);
		this.speed = 40;
		this.limitLeft = data.limit[0];
		this.limitRight = data.limit[1];

		application.ticker.add(() => {
			if (this.x < this.limitLeft) {
				this.direction = 1;
			}

			if (this.x > this.limitRight) {
				this.direction = -1;
			}

			this.scale.x = this.direction;

			this.x += this.direction * application.ticker.deltaTime / application.ticker.FPS * this.speed;
		});
	}
};;class AirConditioning extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.anchor.y = 1;

		this.acfan = new PIXI.Sprite(assetStorage.getTexture('AirConditioningFan'));
		this.acfan.anchor.set(0.5, 0.5);
		this.acfan.position.set(82, -78);
		this.acgrill = new PIXI.Sprite(assetStorage.getTexture('AirConditioningGrill'));
		this.acgrill.anchor.set(0.5, 0.5);
		this.acgrill.position.set(84, -80);

		this.addChild(this.acfan);
		this.addChild(this.acgrill);

		application.ticker.add(() => {
			this.acfan.rotation += .5;
		});
	}
}

/*AirConditioning.isAnimated = true;*/;;class GreenTurtle extends WalkingEnemy {
	constructor(texture, data) {
		super(texture, data);

		this.bottomCenterAnchor();
		this.speed = GREEN_TURTLE_SPEED;
		this.animationSpeed = 0.1;
		this.play();
	}
}

GreenTurtle.isAnimated = true;;;class RedTurtle extends WalkingEnemy {
	constructor(texture, data) {
		super(texture, data);

		this.bottomCenterAnchor();
		this.speed = RED_TURTLE_SPEED;
		this.animationSpeed = 0.1;
		this.play();
	}
}

RedTurtle.isAnimated = true;;;class Coin extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.centerAnchor();
	}
};;class Coins extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.centerAnchor();
	}
};;class FinishHouse extends GameObject {
	constructor(texture, data) {
		super(texture, data);

		this.gotoAndStop(Helpers.rnd(0, 6));
		this.anchor.x = 0.5;
		this.anchor.y = 622 / this.height;
	}
}

FinishHouse.isAnimated = true;;;class Finish extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.visible = false;
		this.width = 200;
		this.height = 300;
		this.bottomCenterAnchor();
	}
};;class RedMushroom extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
	}
};;class GreenMushroom extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
	}
};;class Poop extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
	}
};;class Manhole extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.centerAnchor();
		this.gotoAndStop(0);
	}
}

Manhole.isAnimated = true;;;class Dumpster extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.anchor.y = 1;
	}
};;class Trashbags extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.anchor.y = 1;
	}
};;class Wall extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.anchor.y = 1;
	}
};;class SmallTree extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
	}
};;class TallTree extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
	}
};;class CityBuildingWide extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.anchor.y = 1;
	}
};;class CityBuildingNarrow extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.anchor.y = 1;
	}
};;class EpicSaxGuy extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
		this.animationSpeed = 0.05;
		this.play();
	}
}

EpicSaxGuy.isAnimated = true;;;class BassGirl extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.bottomCenterAnchor();
		this.animationSpeed = 0.05;
		this.play();
	}
}

BassGirl.isAnimated = true;;;const LEVEL_STRINGIFY_VERSION = 1;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ACTION_BUTTON = KEY_ENTER;
const VIEW_WIDTH = 1920;
const VIEW_HEIGHT = 1080;
const GROUND_HEIGHT = VIEW_HEIGHT - 128;
const STATS_BAR_HEIGHT = 20;
const STATS_BAR_WIDTH = 200;
const STATS_ROW_HEIGHT = 60;

const GREEN_TURTLE_SPEED = 80;
const RED_TURTLE_SPEED = 80;
const PLAYER_MAX_HSPEED = 450;
const PLAYER_JUMP_VSPEED = -25;
const PLAYER_GRAVITY = 1;
const PLAYER_INVINCIBILITY_DURATION = 3000;
const PLAYER_INJURY_JUMP_VSPEED = -10;

//routes
const ROUTES = [
	'index',
	'stage',
	'lobby',
	'shop',
	'gym'
];

const BASE_ITEMS = [
	'plushie',
	'chair',
	'table',
	'fan',
	'fridge',
	'hat'
];

//player stats
const BASE_MONEY = 0;
const BASE_INJURY = 0;
const BASE_HUNGER = 0;
const BASE_STRENGTH = 0;
const BASE_ENERGY = 100;

//player states
const BASE_HAPPINESS = 0;

//general
const MAX_TRAININGS = 3;
const BASE_GYM_FEE = 18;
const MAX_STRENGTH = 100;
const MAX_INJURY = 100;
const MAX_TRAINED = 100;
const MAX_HUNGER = 100;

const MUSHROOM_MODE_TIMEOUT = 1000 * 10; // 10 seconds
;;class Application extends PIXI.Application {
	constructor(...args) {
		super(...args);

		this.sky = new PIXI.Graphics();
		this.sky.beginFill(0xc4e1ea, 1);
		this.sky.drawRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
		this.sky.endFill();
		this.stage.addChild(this.sky);

		this.mushroomMode = false;
		this.mushroomSound = assetStorage.getSound('vymaz');

		this.background = new PIXI.Container();
		this.background.name = 'background';
		this.stage.addChild(this.background);

		this.clouds = new PIXI.extras.TilingSprite(assetStorage.getTexture('Clouds'), 1920, 233);
		this.clouds.y = 200;
		this.stage.addChild(this.clouds);

		this.floor = new PIXI.Sprite(assetStorage.getTexture('Floor'));
		this.floor.anchor.y = 1;
		this.floor.position.set(0, VIEW_HEIGHT);
		this.stage.addChild(this.floor);

		this.hud = new PIXI.Container();
		this.hud.name = 'hud';
		this.world = new PIXI.Container();
		this.world.name = 'world';

		this.stage.addChild(this.world);
		this.stage.addChild(this.hud);

		this.mapSections = [];
		this.worldWidth = 0;
		this.ledges = [];
		this.blocks = [];

		this.backgroundMusicTracks = [
			assetStorage.getSound('band_s2'),
			assetStorage.getSound('band_s2b'),
			assetStorage.getSound('band_s2bd'),
			assetStorage.getSound('band_sb'),
			assetStorage.getSound('band_sbd'),
			assetStorage.getSound('band_sd')
		];

		this.backgroundMusic = Helpers.choose(this.backgroundMusicTracks);
		this.backgroundMusic.loop = true;
		this.backgroundMusic.currentTime = 0;
		this.backgroundMusic.play();

		const screenCenter = new PIXI.Point(VIEW_WIDTH / 2, VIEW_HEIGHT / 2);

		this.rgbSplitFilter = new PIXI.filters.RGBSplitFilter(
			new PIXI.Point(0, 0),
			new PIXI.Point(0, 0),
			new PIXI.Point(0, 0)
		);
		this.shockwaveFilter = new PIXI.filters.ShockwaveFilter(screenCenter, {
			amplitude: 0,
			wavelength: 600,
			radius: -1,
			speed: 400
		});
		this.zoomBlurFilter = new PIXI.filters.ZoomBlurFilter(0, screenCenter, 0, -1);

		this.stage.filterArea = new PIXI.Rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
		this.stage.filters = [];

		let shockwaveTime = 0;

		this.ticker.add(() => {
			this.clouds.tilePosition.x -= 0.5;

			shockwaveTime += application.ticker.elapsedMS / 1e3;
			shockwaveTime %= 4;
			this.shockwaveFilter.time = shockwaveTime;
		});

		this.hungerInterval = setInterval(() => {
			GameApp.vue.$store.commit('updatePlayerStat', {
				stat: 'hunger',
				value: Math.min(MAX_HUNGER, GameApp.vue.$store.state.player.stats.hunger + 0.6)
			});
		}, 1000);
	}

	enableMushroomMode() {
		if (this.mushroomMode) {
			return;
		}

		this.stage.filters = [
			this.zoomBlurFilter,
			this.rgbSplitFilter,
			this.shockwaveFilter
		];

		this.mushroomSound.volume = 0;
		this.mushroomSound.currentTime = 0;
		this.mushroomSound.play();

		TweenMax.to(this.mushroomSound, 1, {volume: 1});
		TweenMax.to(this.rgbSplitFilter.red, 1, {x: -5, y: -10});
		TweenMax.to(this.rgbSplitFilter.green, 1, {x: 5, y: 10});
		TweenMax.to(this.shockwaveFilter, 1, {amplitude: 30});
		TweenMax.to(this.zoomBlurFilter, 1, {strength: 0.1});
		this.mushroomMode = true;

		setTimeout(() => {
			this.disableMushroomMode();
		}, MUSHROOM_MODE_TIMEOUT)
	}

	disableMushroomMode() {
		if (!this.mushroomMode) {
			return;
		}

		TweenMax.to(this.mushroomSound, 1, {volume: 0});
		TweenMax.to(this.rgbSplitFilter.red, 1, {x: 0, y: 0});
		TweenMax.to(this.rgbSplitFilter.green, 1, {x: 0, y: 0});
		TweenMax.to(this.shockwaveFilter, 1, {amplitude: 0});
		TweenMax.to(this.zoomBlurFilter, 1, {
			strength: 0, onComplete: () => {
				this.stage.filters = [];
				this.mushroomSound.pause();
			}
		});
		this.mushroomMode = false;
	}

	addMapSection(section) {
		this.mapSections.push(section);
		this.world.addChild(section);
		section.x = this.worldWidth;
		section.ledges.forEach((ledge) => {
			ledge.x += this.worldWidth;
			this.ledges.push(ledge);
		});
		section.blocks.forEach((block) => {
			this.blocks.push(block);
		});

		this.worldWidth += section.sectionWidth;
	}

	getGameObjects() {
		return this.mapSections.reduce((res, section) => res.concat(section.children), []);
	}

	getLedges() {
		return this.ledges;
	}

	getBlocks() {
		return this.blocks;
	}
};;class AssetStorage {
	constructor() {
		this._textureStorage = new Map();
		this._soundStorage = new Map();
	}

	//======================================================

	loadTextures() {
		return new Promise((resolve) => {
			const loader = new PIXI.loaders.Loader();

			loader.add('Floor', 'assets/img/Floor.png');
			loader.add('Clouds', 'assets/img/Clouds.png');
			loader.add('animated:GreenTurtle:0', 'assets/img/GreenTurtle0.png');
			loader.add('animated:GreenTurtle:1', 'assets/img/GreenTurtle1.png');
			loader.add('animated:RedTurtle:0', 'assets/img/RedTurtle0.png');
			loader.add('animated:RedTurtle:1', 'assets/img/RedTurtle1.png');
			loader.add('Coins', 'assets/img/Coins.png');
			loader.add('animated:Player:0', 'assets/img/Player0.png');
			loader.add('animated:Player:1', 'assets/img/Player1.png');
			loader.add('animated:Player:2', 'assets/img/Player2.png');
			loader.add('animated:Player:3', 'assets/img/Player3.png');
			loader.add('Player-static', 'assets/img/Player-static.png');
			loader.add('RedMushroom', 'assets/img/RedMushroom.png');
			loader.add('GreenMushroom', 'assets/img/GreenMushroom.png');
			loader.add('SmallTree', 'assets/img/SmallTree.png');
			loader.add('TallTree', 'assets/img/TallTree.png');
			loader.add('Poop', 'assets/img/Poop.png');
			loader.add('Flower', 'assets/img/Flower.png');
			loader.add('Dumpster', 'assets/img/Dumpster.png');
			loader.add('Trashbags', 'assets/img/Trashbags.png');
			loader.add('Wall', 'assets/img/Wall.png');
			loader.add('CityBuildingWide', 'assets/img/CityBuildingWide.png');
			loader.add('CityBuildingNarrow', 'assets/img/CityBuildingNarrow.png');
			loader.add('animated:FinishHouse:0', 'assets/img/FinishHouse0.png');
			loader.add('animated:FinishHouse:1', 'assets/img/FinishHouse1.png');
			loader.add('animated:FinishHouse:2', 'assets/img/FinishHouse2.png');
			loader.add('animated:FinishHouse:3', 'assets/img/FinishHouse3.png');
			loader.add('animated:FinishHouse:4', 'assets/img/FinishHouse4.png');
			loader.add('animated:FinishHouse:5', 'assets/img/FinishHouse5.png');
			loader.add('animated:FinishHouse:6', 'assets/img/FinishHouse6.png');
			loader.add('animated:Manhole:0', 'assets/img/Manhole0.png');
			loader.add('animated:Manhole:1', 'assets/img/Manhole1.png');
			loader.add('animated:EpicSaxGuy:0', 'assets/img/EpicSaxGuy0.png');
			loader.add('animated:EpicSaxGuy:1', 'assets/img/EpicSaxGuy1.png');
			loader.add('animated:EpicSaxGuy:2', 'assets/img/EpicSaxGuy2.png');
			loader.add('animated:EpicSaxGuy:3', 'assets/img/EpicSaxGuy3.png');
			loader.add('animated:EpicSaxGuy:4', 'assets/img/EpicSaxGuy4.png');
			loader.add('animated:EpicSaxGuy:5', 'assets/img/EpicSaxGuy5.png');
			loader.add('AirConditioning', 'assets/img/AirConditionig.png');
			loader.add('AirConditioningFan', 'assets/img/AirConditionigFan.png');
			loader.add('AirConditioningGrill', 'assets/img/AirConditionigGrill.png');
			loader.add('animated:BassGirl:0', 'assets/img/BassGirl0.png');
			loader.add('animated:BassGirl:1', 'assets/img/BassGirl1.png');
			loader.add('animated:BassGirl:2', 'assets/img/BassGirl2.png');
			loader.add('animated:BassGirl:3', 'assets/img/BassGirl3.png');

			//lobby
			loader.add('LobbyWall', 'assets/img/lobby/LobbyWall.png');
			loader.add('Bed', 'assets/img/furniture/bed.png');
			loader.add('Table', 'assets/img/furniture/table.png');
			loader.add('Chair', 'assets/img/furniture/chair.png');
			loader.add('Fridge', 'assets/img/furniture/fridge.png');
			loader.add('Fan', 'assets/img/furniture/fan.png');
			loader.add('Lamp', 'assets/img/furniture/lamp.png');
			loader.add('Plushie', 'assets/img/furniture/plushie.png');
			loader.add('Hat', 'assets/img/furniture/hat.png');
			loader.add('Telescope', 'assets/img/furniture/telescope.png');
			loader.add('Picture', 'assets/img/furniture/picture.png');
			loader.add('Radio', 'assets/img/furniture/radio.png');
			loader.add('Tape', 'assets/img/furniture/tape.png');

			loader
				.load((ldr, resources) => {
					Object.keys(resources).forEach((res) => {
						this._textureStorage.set(res, resources[res].texture);

						const animatedMatches = res.match(/animated:([-\w\/]+):(\d+)/);

						if (animatedMatches) {
							let animatedSprites = null;
							if (!this._textureStorage.has('animated:' + animatedMatches[1])) {
								animatedSprites = [];
								this._textureStorage.set('animated:' + animatedMatches[1], animatedSprites);
							} else {
								animatedSprites = this._textureStorage.get('animated:' + animatedMatches[1]);
							}

							animatedSprites[animatedMatches[2]] = resources[res].texture;
						}
					});
					loader.destroy();
					resolve();
				})
			;
		});
	}

	loadSounds() {
		return new Promise((resolve) => {
			const loader = new PIXI.loaders.Loader();

			loader.add('city', 'assets/sound/city.mp3');
			loader.add('eat', 'assets/sound/eat.mp3');
			loader.add('fix', 'assets/sound/fix.mp3');
			loader.add('jump', 'assets/sound/jump.mp3');
			loader.add('land', 'assets/sound/land.mp3');
			loader.add('pickup', 'assets/sound/pickup.mp3');
			loader.add('ring', 'assets/sound/ring.mp3');
			loader.add('vymaz', 'assets/sound/vymaz.mp3');
			loader.add('walk', 'assets/sound/walk.mp3');
			loader.add('warp', 'assets/sound/warp.mp3');
			loader.add('metalhead', 'assets/sound/metalhead.mp3');
			loader.add('band_s2', 'assets/sound/band_s2.mp3');
			loader.add('band_s2b', 'assets/sound/band_s2b.mp3');
			loader.add('band_s2bd', 'assets/sound/band_s2bd.mp3');
			loader.add('band_sbd', 'assets/sound/band_sbd.mp3');
			loader.add('band_sb', 'assets/sound/band_sb.mp3');
			loader.add('band_sd', 'assets/sound/band_sd.mp3');
			loader.add('turtle', 'assets/sound/turtle.mp3');
			loader.add('fckmylife', 'assets/sound/fckmylife.mp3');
			loader.add('radio', 'assets/sound/radio.mp3');

			loader
				.load((ldr, resources) => {
					Object.keys(resources).forEach((res) => {
						this._soundStorage.set(res, resources[res].data);
					});
					loader.destroy();
					resolve();
				})
			;
		});
	}

	getTexture(assetName) {
		if (!this._textureStorage.has(assetName)) {
			return PIXI.Texture.WHITE;
		}
		return this._textureStorage.get(assetName);
	}

	getAnimatedTexture(assetName) {
		return this._textureStorage.get('animated:' + assetName);
	}

	getSound(soundName) {
		return this._soundStorage.get(soundName);
	}
}
;;class Controls {
	constructor() {
		this.isDisabled = false;
		this.keyMap = new Set();
		this.callbacks = {
			keyup: new Map(),
			keydown: new Map()
		};

		document.addEventListener("keydown", (e) => {
			if (this.isDisabled) {
				return;
			}

			if (!this.isPressed(e.keyCode) && this.callbacks.keydown.has(e.keyCode)) {
				this.callbacks.keydown.get(e.keyCode).forEach((cb) => cb());
			}
			this.keyMap.add(e.keyCode);
		});

		document.addEventListener("keyup", (e) => {
			if (this.isDisabled) {
				return;
			}

			this.keyMap.delete(e.keyCode);
			if (this.callbacks.keyup.has(e.keyCode)) {
				this.callbacks.keyup.get(e.keyCode).forEach((cb) => cb());
			}
		});
	}

	isPressed(keyCode) {
		return this.keyMap.has(keyCode);
	}

	on(eventType, keyCode, callback) {
		if (!this.callbacks[eventType].has(keyCode)) {
			this.callbacks[eventType].set(keyCode, []);
		}
		this.callbacks[eventType].get(keyCode).push(callback);
	}

	disableControls() {
		this.isDisabled = true;
		this.keyMap.clear();
	}
};;class Ledge extends PIXI.Point {
	constructor(x, y, length) {
		super(x, y);
		this.length = length;
	}
};;class Block extends PIXI.Sprite {
	constructor(x, y, width, height) {
		super(PIXI.Texture.EMPTY);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
};;class Player extends PIXI.extras.AnimatedSprite {
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
};;class Camera {
	constructor() {
		this.offset = 0;
		this.speed = 0;
		this.maxCenterPlayerOffset = VIEW_WIDTH / 2 * 4 / 5;

		application.ticker.add(() => {
			if (player) {
				const center = this.getCenterOffset();
				this.speed = (player.x - center) / this.maxCenterPlayerOffset * PLAYER_MAX_HSPEED / 10;

				this.centerAt(center + this.speed);

				application.world.x = -this.offset;
			}
		});
	}

	centerAt(x) {
		this.offset = Math.min(Math.max(0, x - VIEW_WIDTH / 2), application.worldWidth - VIEW_WIDTH);
	}

	getCenterOffset() {
		return this.offset + VIEW_WIDTH / 2;
	}
};;class CollisionManager {
	constructor() {
		this.callbacks = [];

		application.ticker.add(() => {
			const gameObjects = this.getCollidableObjects();

			this.callbacks.forEach((cb) => {
				const bounds = cb.object.getBounds();

				gameObjects
					.filter((gameObject) => gameObject instanceof cb.otherClass)
					.forEach((gameObject) => {
						const otherBounds = gameObject.getBounds();

						if (!bounds.intersects(otherBounds)) {
							return;
						}

						cb.handler(gameObject);
					});
			});
		});
	}

	on(object, otherClass, handler) {
		this.callbacks.push({object, otherClass, handler});
	}

	get(object, otherClass) {
		const bounds = object.getBounds();

		return this
			.getCollidableObjects()
			.filter((gameObject) => gameObject instanceof otherClass)
			.find((gameObject) => bounds.intersects(gameObject.getBounds()));
	}

	getCollidableObjects() {
		return application.getGameObjects().filter((gameObject) => gameObject.isCollisionEnabled);
	}

};;class MapSection extends PIXI.Container {
	constructor() {
		super();

		this.name = '';
		this.sectionWidth = 0;
		this.ledges = [];
		this.blocks = [];
	}

	useSection(name) {
		this.name = name;
		const section = mapSectionStorage.get(name);
		this.sectionWidth = section.width;
		section.objects.forEach((objectData) => {
			const object = GameObjectFactory.create(objectData.type, objectData);
			object.position.set(...this.flipY(objectData.position));
			this.addChild(object);
		});
		section.ledges.forEach((ledgeData) => {
			const ledge = new Ledge(...this.flipY(ledgeData.position), ledgeData.length);
			this.ledges.push(ledge);
		});
		section.blocks.forEach((blockData) => {
			const block = new Block(blockData.position[0], GROUND_HEIGHT - blockData.position[1] - blockData.size[1], ...blockData.size);
			this.blocks.push(block);
			this.addChild(block);
		});
	}

	flipY(position) {
		return [position[0], GROUND_HEIGHT - position[1]];
	}
};;class MapSectionStorage {
	constructor() {
		this._storage = new Map();
	}

	//======================================================

	loadMapSections() {
		return new Promise((resolve) => {
			const loader = new PIXI.loaders.Loader();

			loader.add('start', 'assets/map_sections/start.json');
			loader.add('musicband', 'assets/map_sections/musicband.json');
			loader.add('city01', 'assets/map_sections/city01.json');
			loader.add('city02', 'assets/map_sections/city02.json');
			loader.add('city03', 'assets/map_sections/city03.json');
			loader.add('city04', 'assets/map_sections/city04.json');
			loader.add('city05', 'assets/map_sections/city05.json');
			loader.add('finish', 'assets/map_sections/finish.json');

			loader
				.load((ldr, resources) => {
					Object.keys(resources).forEach((res) => {
						this._storage.set(res, resources[res].data);
					});
					loader.destroy();
					resolve();
				});
		});
	}

	get(assetName) {
		return this._storage.get(assetName);
	}
};;class GameObjectFactory {
	static create(type, data) {
		const objectClass = GameObjectFactory.classList[type];
		const textures = objectClass.isAnimated ? assetStorage.getAnimatedTexture(type) : [assetStorage.getTexture(type)];
		return new objectClass(textures, data);
	}
}

GameObjectFactory.classList = {
	'AirConditioning': AirConditioning,
	'GreenTurtle': GreenTurtle,
	'RedTurtle': RedTurtle,
	'Coin': Coin,
	'Coins': Coins,
	'FinishHouse': FinishHouse,
	'Finish': Finish,
	'RedMushroom': RedMushroom,
	'GreenMushroom': GreenMushroom,
	'Poop': Poop,
	'Manhole': Manhole,
	'SmallTree': SmallTree,
	'TallTree': TallTree,
	'CityBuildingWide': CityBuildingWide,
	'CityBuildingNarrow': CityBuildingNarrow,
	'Dumpster': Dumpster,
	'Trashbags': Trashbags,
	'Wall': Wall,
	'EpicSaxGuy': EpicSaxGuy,
	'BassGirl': BassGirl
};;;class LobbyApplication extends PIXI.Application {
	constructor(...args) {
		super(...args);

		this.background = new PIXI.Container();
		this.background.name = 'LobbyBackground';
		this.stage.addChild(this.background);

		this.bg = new PIXI.Sprite(assetStorage.getTexture('LobbyWall'));
		this.stage.addChild(this.bg);

		this.bed = new PIXI.Sprite(assetStorage.getTexture('Bed'));
		this.bed.x = 1000;
		this.bed.y = 650;
		this.stage.addChild(this.bed);

		this.itemContainer = new PIXI.Container();
		this.itemContainer.name = 'itemcontainer';

		this.stage.addChild(this.itemContainer);

		if (GameApp.vue.$store.state.reposession) {
			GameApp.vue.$store.commit('pendingReposession', false);
			setTimeout(() => {
				this.takeAwayItem(GameApp.vue.$store.state.player.ownedItems[0])
			}, 1000);
		}

		this.radioAudio = assetStorage.getSound('radio');
		this.radioAudio.loop = true;
		this.radioAudio.currentTime = 0;

		this.playRadio();
	}

	displayOwnedItem(spriteName, position) {
		const slug = spriteName.toLowerCase();

		if (GameApp.vue.$store.state.player.ownedItems.indexOf(slug) === -1) {
			return;
		}

		this[slug] = new PIXI.Sprite(assetStorage.getTexture(spriteName));

		this[slug].x = position.x;
		this[slug].y = position.y;

		this.itemContainer.addChild(this[slug]);
	}

	playRadio() {
		if (GameApp.vue.$store.state.player.ownedItems.indexOf('radio') !== -1) {
			this.radioAudio.play();
		}
	}

	stopRadio() {
		this.radioAudio.pause();
	}

	takeAwayItem(spriteName) {
		const slug = spriteName.toLowerCase();

		if (slug === 'will to live') {
			swal({
				text: 'How can you take something that I never had?'
			});
		}

		if (GameApp.vue.$store.state.player.ownedItems.indexOf(slug) === -1) {
			return;
		}

		GameApp.vue.$store.commit('removePlayerItem', slug);

		//init for future use
		const tape = new PIXI.Sprite(assetStorage.getTexture('Tape'));
		tape.anchor.set(0.5, 0.5);

		this[slug].addChild(tape);
		tape.position.set(this[slug].width / 2, this[slug].height / 2);
		tape.scale.set(this[slug].width / tape.width * 1.2);

		TweenMax.fromTo(tape, .3, {alpha: 0}, {alpha: 1});

		this[slug].on('removed', () => {
			window.eventHub.$emit('lobby.itemRemoved');
		});

		setTimeout(() => {
			TweenMax.to(this[slug], .3, {
				alpha: 0, onComplete: () => {
					this.itemContainer.removeChild(this[slug]);

					if (GameApp.vue.$store.state.player.ownedItems.length <= 0) {
						window.eventHub.$emit('gameOver');
					}
					if (GameApp.vue.$store.state.player.ownedItems.indexOf('radio') === -1) {
						this.stopRadio();
					}
				}
			});
		}, 2000);
	}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdhbWVPYmplY3QuanMiLCJXYWxraW5nRW5lbXkuanMiLCJBaXJDb25kaXRpb25pbmcuanMiLCJHcmVlblR1cnRsZS5qcyIsIlJlZFR1cnRsZS5qcyIsIkNvaW4uanMiLCJDb2lucy5qcyIsIkZpbmlzaEhvdXNlLmpzIiwiRmluaXNoLmpzIiwiUmVkTXVzaHJvb20uanMiLCJHcmVlbk11c2hyb29tLmpzIiwiUG9vcC5qcyIsIk1hbmhvbGUuanMiLCJEdW1wc3Rlci5qcyIsIlRyYXNoYmFncy5qcyIsIldhbGwuanMiLCJTbWFsbFRyZWUuanMiLCJUYWxsVHJlZS5qcyIsIkNpdHlCdWlsZGluZ1dpZGUuanMiLCJDaXR5QnVpbGRpbmdOYXJyb3cuanMiLCJFcGljU2F4R3V5LmpzIiwiQmFzc0dpcmwuanMiLCJ2YXJzLmpzIiwiQXBwbGljYXRpb24uanMiLCJBc3NldFN0b3JhZ2UuanMiLCJDb250cm9scy5qcyIsIkxlZGdlLmpzIiwiQmxvY2suanMiLCJQbGF5ZXIuanMiLCJDYW1lcmEuanMiLCJDb2xsaXNpb25NYW5hZ2VyLmpzIiwiTWFwU2VjdGlvbi5qcyIsIk1hcFNlY3Rpb25TdG9yYWdlLmpzIiwiR2FtZU9iamVjdEZhY3RvcnkuanMiLCJMb2JieUFwcGxpY2F0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0NOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0NOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0NOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0NOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0NOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0NoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0MvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdDclBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0N6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0MxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0NqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBHYW1lT2JqZWN0IGV4dGVuZHMgUElYSS5leHRyYXMuQW5pbWF0ZWRTcHJpdGUge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzKTtcblxuXHRcdHRoaXMuaXNDb2xsaXNpb25FbmFibGVkID0gdHJ1ZTtcblx0fVxuXG5cdGJvdHRvbUNlbnRlckFuY2hvcigpIHtcblx0XHR0aGlzLmFuY2hvci5zZXQoMC41LCAxKTtcblx0fVxuXG5cdGNlbnRlckFuY2hvcigpIHtcblx0XHR0aGlzLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuXHR9XG59XG5cbkdhbWVPYmplY3QuaXNBbmltYXRlZCA9IGZhbHNlOyIsImNsYXNzIFdhbGtpbmdFbmVteSBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMuZGlyZWN0aW9uID0gSGVscGVycy5jaG9vc2UoWzEsIC0xXSk7XG5cdFx0dGhpcy5zcGVlZCA9IDQwO1xuXHRcdHRoaXMubGltaXRMZWZ0ID0gZGF0YS5saW1pdFswXTtcblx0XHR0aGlzLmxpbWl0UmlnaHQgPSBkYXRhLmxpbWl0WzFdO1xuXG5cdFx0YXBwbGljYXRpb24udGlja2VyLmFkZCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy54IDwgdGhpcy5saW1pdExlZnQpIHtcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAxO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy54ID4gdGhpcy5saW1pdFJpZ2h0KSB7XG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gLTE7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2NhbGUueCA9IHRoaXMuZGlyZWN0aW9uO1xuXG5cdFx0XHR0aGlzLnggKz0gdGhpcy5kaXJlY3Rpb24gKiBhcHBsaWNhdGlvbi50aWNrZXIuZGVsdGFUaW1lIC8gYXBwbGljYXRpb24udGlja2VyLkZQUyAqIHRoaXMuc3BlZWQ7XG5cdFx0fSk7XG5cdH1cbn0iLCJjbGFzcyBBaXJDb25kaXRpb25pbmcgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcblx0Y29uc3RydWN0b3IodGV4dHVyZXMsIGRhdGEpIHtcblx0XHRzdXBlcih0ZXh0dXJlcywgZGF0YSk7XG5cblx0XHR0aGlzLmFuY2hvci55ID0gMTtcblxuXHRcdHRoaXMuYWNmYW4gPSBuZXcgUElYSS5TcHJpdGUoYXNzZXRTdG9yYWdlLmdldFRleHR1cmUoJ0FpckNvbmRpdGlvbmluZ0ZhbicpKTtcblx0XHR0aGlzLmFjZmFuLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuXHRcdHRoaXMuYWNmYW4ucG9zaXRpb24uc2V0KDgyLCAtNzgpO1xuXHRcdHRoaXMuYWNncmlsbCA9IG5ldyBQSVhJLlNwcml0ZShhc3NldFN0b3JhZ2UuZ2V0VGV4dHVyZSgnQWlyQ29uZGl0aW9uaW5nR3JpbGwnKSk7XG5cdFx0dGhpcy5hY2dyaWxsLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuXHRcdHRoaXMuYWNncmlsbC5wb3NpdGlvbi5zZXQoODQsIC04MCk7XG5cblx0XHR0aGlzLmFkZENoaWxkKHRoaXMuYWNmYW4pO1xuXHRcdHRoaXMuYWRkQ2hpbGQodGhpcy5hY2dyaWxsKTtcblxuXHRcdGFwcGxpY2F0aW9uLnRpY2tlci5hZGQoKCkgPT4ge1xuXHRcdFx0dGhpcy5hY2Zhbi5yb3RhdGlvbiArPSAuNTtcblx0XHR9KTtcblx0fVxufVxuXG4vKkFpckNvbmRpdGlvbmluZy5pc0FuaW1hdGVkID0gdHJ1ZTsqLyIsImNsYXNzIEdyZWVuVHVydGxlIGV4dGVuZHMgV2Fsa2luZ0VuZW15IHtcblx0Y29uc3RydWN0b3IodGV4dHVyZSwgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmUsIGRhdGEpO1xuXG5cdFx0dGhpcy5ib3R0b21DZW50ZXJBbmNob3IoKTtcblx0XHR0aGlzLnNwZWVkID0gR1JFRU5fVFVSVExFX1NQRUVEO1xuXHRcdHRoaXMuYW5pbWF0aW9uU3BlZWQgPSAwLjE7XG5cdFx0dGhpcy5wbGF5KCk7XG5cdH1cbn1cblxuR3JlZW5UdXJ0bGUuaXNBbmltYXRlZCA9IHRydWU7IiwiY2xhc3MgUmVkVHVydGxlIGV4dGVuZHMgV2Fsa2luZ0VuZW15IHtcblx0Y29uc3RydWN0b3IodGV4dHVyZSwgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmUsIGRhdGEpO1xuXG5cdFx0dGhpcy5ib3R0b21DZW50ZXJBbmNob3IoKTtcblx0XHR0aGlzLnNwZWVkID0gUkVEX1RVUlRMRV9TUEVFRDtcblx0XHR0aGlzLmFuaW1hdGlvblNwZWVkID0gMC4xO1xuXHRcdHRoaXMucGxheSgpO1xuXHR9XG59XG5cblJlZFR1cnRsZS5pc0FuaW1hdGVkID0gdHJ1ZTsiLCJjbGFzcyBDb2luIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVzLCBkYXRhKSB7XG5cdFx0c3VwZXIodGV4dHVyZXMsIGRhdGEpO1xuXG5cdFx0dGhpcy5jZW50ZXJBbmNob3IoKTtcblx0fVxufSIsImNsYXNzIENvaW5zIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVzLCBkYXRhKSB7XG5cdFx0c3VwZXIodGV4dHVyZXMsIGRhdGEpO1xuXG5cdFx0dGhpcy5jZW50ZXJBbmNob3IoKTtcblx0fVxufSIsImNsYXNzIEZpbmlzaEhvdXNlIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmUsIGRhdGEpIHtcblx0XHRzdXBlcih0ZXh0dXJlLCBkYXRhKTtcblxuXHRcdHRoaXMuZ290b0FuZFN0b3AoSGVscGVycy5ybmQoMCwgNikpO1xuXHRcdHRoaXMuYW5jaG9yLnggPSAwLjU7XG5cdFx0dGhpcy5hbmNob3IueSA9IDYyMiAvIHRoaXMuaGVpZ2h0O1xuXHR9XG59XG5cbkZpbmlzaEhvdXNlLmlzQW5pbWF0ZWQgPSB0cnVlOyIsImNsYXNzIEZpbmlzaCBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXHRcdHRoaXMud2lkdGggPSAyMDA7XG5cdFx0dGhpcy5oZWlnaHQgPSAzMDA7XG5cdFx0dGhpcy5ib3R0b21DZW50ZXJBbmNob3IoKTtcblx0fVxufSIsImNsYXNzIFJlZE11c2hyb29tIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVzLCBkYXRhKSB7XG5cdFx0c3VwZXIodGV4dHVyZXMsIGRhdGEpO1xuXG5cdFx0dGhpcy5ib3R0b21DZW50ZXJBbmNob3IoKTtcblx0fVxufSIsImNsYXNzIEdyZWVuTXVzaHJvb20gZXh0ZW5kcyBHYW1lT2JqZWN0IHtcblx0Y29uc3RydWN0b3IodGV4dHVyZXMsIGRhdGEpIHtcblx0XHRzdXBlcih0ZXh0dXJlcywgZGF0YSk7XG5cblx0XHR0aGlzLmJvdHRvbUNlbnRlckFuY2hvcigpO1xuXHR9XG59IiwiY2xhc3MgUG9vcCBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMuYm90dG9tQ2VudGVyQW5jaG9yKCk7XG5cdH1cbn0iLCJjbGFzcyBNYW5ob2xlIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVzLCBkYXRhKSB7XG5cdFx0c3VwZXIodGV4dHVyZXMsIGRhdGEpO1xuXG5cdFx0dGhpcy5jZW50ZXJBbmNob3IoKTtcblx0XHR0aGlzLmdvdG9BbmRTdG9wKDApO1xuXHR9XG59XG5cbk1hbmhvbGUuaXNBbmltYXRlZCA9IHRydWU7IiwiY2xhc3MgRHVtcHN0ZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcblx0Y29uc3RydWN0b3IodGV4dHVyZXMsIGRhdGEpIHtcblx0XHRzdXBlcih0ZXh0dXJlcywgZGF0YSk7XG5cblx0XHR0aGlzLmFuY2hvci55ID0gMTtcblx0fVxufSIsImNsYXNzIFRyYXNoYmFncyBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMuYW5jaG9yLnkgPSAxO1xuXHR9XG59IiwiY2xhc3MgV2FsbCBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMuYW5jaG9yLnkgPSAxO1xuXHR9XG59IiwiY2xhc3MgU21hbGxUcmVlIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVzLCBkYXRhKSB7XG5cdFx0c3VwZXIodGV4dHVyZXMsIGRhdGEpO1xuXG5cdFx0dGhpcy5ib3R0b21DZW50ZXJBbmNob3IoKTtcblx0fVxufSIsImNsYXNzIFRhbGxUcmVlIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVzLCBkYXRhKSB7XG5cdFx0c3VwZXIodGV4dHVyZXMsIGRhdGEpO1xuXG5cdFx0dGhpcy5ib3R0b21DZW50ZXJBbmNob3IoKTtcblx0fVxufSIsImNsYXNzIENpdHlCdWlsZGluZ1dpZGUgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcblx0Y29uc3RydWN0b3IodGV4dHVyZXMsIGRhdGEpIHtcblx0XHRzdXBlcih0ZXh0dXJlcywgZGF0YSk7XG5cblx0XHR0aGlzLmFuY2hvci55ID0gMTtcblx0fVxufSIsImNsYXNzIENpdHlCdWlsZGluZ05hcnJvdyBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMuYW5jaG9yLnkgPSAxO1xuXHR9XG59IiwiY2xhc3MgRXBpY1NheEd1eSBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMuYm90dG9tQ2VudGVyQW5jaG9yKCk7XG5cdFx0dGhpcy5hbmltYXRpb25TcGVlZCA9IDAuMDU7XG5cdFx0dGhpcy5wbGF5KCk7XG5cdH1cbn1cblxuRXBpY1NheEd1eS5pc0FuaW1hdGVkID0gdHJ1ZTsiLCJjbGFzcyBCYXNzR2lybCBleHRlbmRzIEdhbWVPYmplY3Qge1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlcywgZGF0YSkge1xuXHRcdHN1cGVyKHRleHR1cmVzLCBkYXRhKTtcblxuXHRcdHRoaXMuYm90dG9tQ2VudGVyQW5jaG9yKCk7XG5cdFx0dGhpcy5hbmltYXRpb25TcGVlZCA9IDAuMDU7XG5cdFx0dGhpcy5wbGF5KCk7XG5cdH1cbn1cblxuQmFzc0dpcmwuaXNBbmltYXRlZCA9IHRydWU7IiwiY29uc3QgTEVWRUxfU1RSSU5HSUZZX1ZFUlNJT04gPSAxO1xuY29uc3QgS0VZX0xFRlQgPSAzNztcbmNvbnN0IEtFWV9VUCA9IDM4O1xuY29uc3QgS0VZX1JJR0hUID0gMzk7XG5jb25zdCBLRVlfRE9XTiA9IDQwO1xuY29uc3QgS0VZX0VOVEVSID0gMTM7XG5jb25zdCBLRVlfQUNUSU9OX0JVVFRPTiA9IEtFWV9FTlRFUjtcbmNvbnN0IFZJRVdfV0lEVEggPSAxOTIwO1xuY29uc3QgVklFV19IRUlHSFQgPSAxMDgwO1xuY29uc3QgR1JPVU5EX0hFSUdIVCA9IFZJRVdfSEVJR0hUIC0gMTI4O1xuY29uc3QgU1RBVFNfQkFSX0hFSUdIVCA9IDIwO1xuY29uc3QgU1RBVFNfQkFSX1dJRFRIID0gMjAwO1xuY29uc3QgU1RBVFNfUk9XX0hFSUdIVCA9IDYwO1xuXG5jb25zdCBHUkVFTl9UVVJUTEVfU1BFRUQgPSA4MDtcbmNvbnN0IFJFRF9UVVJUTEVfU1BFRUQgPSA4MDtcbmNvbnN0IFBMQVlFUl9NQVhfSFNQRUVEID0gNDUwO1xuY29uc3QgUExBWUVSX0pVTVBfVlNQRUVEID0gLTI1O1xuY29uc3QgUExBWUVSX0dSQVZJVFkgPSAxO1xuY29uc3QgUExBWUVSX0lOVklOQ0lCSUxJVFlfRFVSQVRJT04gPSAzMDAwO1xuY29uc3QgUExBWUVSX0lOSlVSWV9KVU1QX1ZTUEVFRCA9IC0xMDtcblxuLy9yb3V0ZXNcbmNvbnN0IFJPVVRFUyA9IFtcblx0J2luZGV4Jyxcblx0J3N0YWdlJyxcblx0J2xvYmJ5Jyxcblx0J3Nob3AnLFxuXHQnZ3ltJ1xuXTtcblxuY29uc3QgQkFTRV9JVEVNUyA9IFtcblx0J3BsdXNoaWUnLFxuXHQnY2hhaXInLFxuXHQndGFibGUnLFxuXHQnZmFuJyxcblx0J2ZyaWRnZScsXG5cdCdoYXQnXG5dO1xuXG4vL3BsYXllciBzdGF0c1xuY29uc3QgQkFTRV9NT05FWSA9IDA7XG5jb25zdCBCQVNFX0lOSlVSWSA9IDA7XG5jb25zdCBCQVNFX0hVTkdFUiA9IDA7XG5jb25zdCBCQVNFX1NUUkVOR1RIID0gMDtcbmNvbnN0IEJBU0VfRU5FUkdZID0gMTAwO1xuXG4vL3BsYXllciBzdGF0ZXNcbmNvbnN0IEJBU0VfSEFQUElORVNTID0gMDtcblxuLy9nZW5lcmFsXG5jb25zdCBNQVhfVFJBSU5JTkdTID0gMztcbmNvbnN0IEJBU0VfR1lNX0ZFRSA9IDE4O1xuY29uc3QgTUFYX1NUUkVOR1RIID0gMTAwO1xuY29uc3QgTUFYX0lOSlVSWSA9IDEwMDtcbmNvbnN0IE1BWF9UUkFJTkVEID0gMTAwO1xuY29uc3QgTUFYX0hVTkdFUiA9IDEwMDtcblxuY29uc3QgTVVTSFJPT01fTU9ERV9USU1FT1VUID0gMTAwMCAqIDEwOyAvLyAxMCBzZWNvbmRzXG4iLCJjbGFzcyBBcHBsaWNhdGlvbiBleHRlbmRzIFBJWEkuQXBwbGljYXRpb24ge1xuXHRjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG5cdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHR0aGlzLnNreSA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cdFx0dGhpcy5za3kuYmVnaW5GaWxsKDB4YzRlMWVhLCAxKTtcblx0XHR0aGlzLnNreS5kcmF3UmVjdCgwLCAwLCBWSUVXX1dJRFRILCBWSUVXX0hFSUdIVCk7XG5cdFx0dGhpcy5za3kuZW5kRmlsbCgpO1xuXHRcdHRoaXMuc3RhZ2UuYWRkQ2hpbGQodGhpcy5za3kpO1xuXG5cdFx0dGhpcy5tdXNocm9vbU1vZGUgPSBmYWxzZTtcblx0XHR0aGlzLm11c2hyb29tU291bmQgPSBhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ3Z5bWF6Jyk7XG5cblx0XHR0aGlzLmJhY2tncm91bmQgPSBuZXcgUElYSS5Db250YWluZXIoKTtcblx0XHR0aGlzLmJhY2tncm91bmQubmFtZSA9ICdiYWNrZ3JvdW5kJztcblx0XHR0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuYmFja2dyb3VuZCk7XG5cblx0XHR0aGlzLmNsb3VkcyA9IG5ldyBQSVhJLmV4dHJhcy5UaWxpbmdTcHJpdGUoYXNzZXRTdG9yYWdlLmdldFRleHR1cmUoJ0Nsb3VkcycpLCAxOTIwLCAyMzMpO1xuXHRcdHRoaXMuY2xvdWRzLnkgPSAyMDA7XG5cdFx0dGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmNsb3Vkcyk7XG5cblx0XHR0aGlzLmZsb29yID0gbmV3IFBJWEkuU3ByaXRlKGFzc2V0U3RvcmFnZS5nZXRUZXh0dXJlKCdGbG9vcicpKTtcblx0XHR0aGlzLmZsb29yLmFuY2hvci55ID0gMTtcblx0XHR0aGlzLmZsb29yLnBvc2l0aW9uLnNldCgwLCBWSUVXX0hFSUdIVCk7XG5cdFx0dGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmZsb29yKTtcblxuXHRcdHRoaXMuaHVkID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG5cdFx0dGhpcy5odWQubmFtZSA9ICdodWQnO1xuXHRcdHRoaXMud29ybGQgPSBuZXcgUElYSS5Db250YWluZXIoKTtcblx0XHR0aGlzLndvcmxkLm5hbWUgPSAnd29ybGQnO1xuXG5cdFx0dGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLndvcmxkKTtcblx0XHR0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuaHVkKTtcblxuXHRcdHRoaXMubWFwU2VjdGlvbnMgPSBbXTtcblx0XHR0aGlzLndvcmxkV2lkdGggPSAwO1xuXHRcdHRoaXMubGVkZ2VzID0gW107XG5cdFx0dGhpcy5ibG9ja3MgPSBbXTtcblxuXHRcdHRoaXMuYmFja2dyb3VuZE11c2ljVHJhY2tzID0gW1xuXHRcdFx0YXNzZXRTdG9yYWdlLmdldFNvdW5kKCdiYW5kX3MyJyksXG5cdFx0XHRhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ2JhbmRfczJiJyksXG5cdFx0XHRhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ2JhbmRfczJiZCcpLFxuXHRcdFx0YXNzZXRTdG9yYWdlLmdldFNvdW5kKCdiYW5kX3NiJyksXG5cdFx0XHRhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ2JhbmRfc2JkJyksXG5cdFx0XHRhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ2JhbmRfc2QnKVxuXHRcdF07XG5cblx0XHR0aGlzLmJhY2tncm91bmRNdXNpYyA9IEhlbHBlcnMuY2hvb3NlKHRoaXMuYmFja2dyb3VuZE11c2ljVHJhY2tzKTtcblx0XHR0aGlzLmJhY2tncm91bmRNdXNpYy5sb29wID0gdHJ1ZTtcblx0XHR0aGlzLmJhY2tncm91bmRNdXNpYy5jdXJyZW50VGltZSA9IDA7XG5cdFx0dGhpcy5iYWNrZ3JvdW5kTXVzaWMucGxheSgpO1xuXG5cdFx0Y29uc3Qgc2NyZWVuQ2VudGVyID0gbmV3IFBJWEkuUG9pbnQoVklFV19XSURUSCAvIDIsIFZJRVdfSEVJR0hUIC8gMik7XG5cblx0XHR0aGlzLnJnYlNwbGl0RmlsdGVyID0gbmV3IFBJWEkuZmlsdGVycy5SR0JTcGxpdEZpbHRlcihcblx0XHRcdG5ldyBQSVhJLlBvaW50KDAsIDApLFxuXHRcdFx0bmV3IFBJWEkuUG9pbnQoMCwgMCksXG5cdFx0XHRuZXcgUElYSS5Qb2ludCgwLCAwKVxuXHRcdCk7XG5cdFx0dGhpcy5zaG9ja3dhdmVGaWx0ZXIgPSBuZXcgUElYSS5maWx0ZXJzLlNob2Nrd2F2ZUZpbHRlcihzY3JlZW5DZW50ZXIsIHtcblx0XHRcdGFtcGxpdHVkZTogMCxcblx0XHRcdHdhdmVsZW5ndGg6IDYwMCxcblx0XHRcdHJhZGl1czogLTEsXG5cdFx0XHRzcGVlZDogNDAwXG5cdFx0fSk7XG5cdFx0dGhpcy56b29tQmx1ckZpbHRlciA9IG5ldyBQSVhJLmZpbHRlcnMuWm9vbUJsdXJGaWx0ZXIoMCwgc2NyZWVuQ2VudGVyLCAwLCAtMSk7XG5cblx0XHR0aGlzLnN0YWdlLmZpbHRlckFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgVklFV19XSURUSCwgVklFV19IRUlHSFQpO1xuXHRcdHRoaXMuc3RhZ2UuZmlsdGVycyA9IFtdO1xuXG5cdFx0bGV0IHNob2Nrd2F2ZVRpbWUgPSAwO1xuXG5cdFx0dGhpcy50aWNrZXIuYWRkKCgpID0+IHtcblx0XHRcdHRoaXMuY2xvdWRzLnRpbGVQb3NpdGlvbi54IC09IDAuNTtcblxuXHRcdFx0c2hvY2t3YXZlVGltZSArPSBhcHBsaWNhdGlvbi50aWNrZXIuZWxhcHNlZE1TIC8gMWUzO1xuXHRcdFx0c2hvY2t3YXZlVGltZSAlPSA0O1xuXHRcdFx0dGhpcy5zaG9ja3dhdmVGaWx0ZXIudGltZSA9IHNob2Nrd2F2ZVRpbWU7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmh1bmdlckludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0R2FtZUFwcC52dWUuJHN0b3JlLmNvbW1pdCgndXBkYXRlUGxheWVyU3RhdCcsIHtcblx0XHRcdFx0c3RhdDogJ2h1bmdlcicsXG5cdFx0XHRcdHZhbHVlOiBNYXRoLm1pbihNQVhfSFVOR0VSLCBHYW1lQXBwLnZ1ZS4kc3RvcmUuc3RhdGUucGxheWVyLnN0YXRzLmh1bmdlciArIDAuNilcblx0XHRcdH0pO1xuXHRcdH0sIDEwMDApO1xuXHR9XG5cblx0ZW5hYmxlTXVzaHJvb21Nb2RlKCkge1xuXHRcdGlmICh0aGlzLm11c2hyb29tTW9kZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuc3RhZ2UuZmlsdGVycyA9IFtcblx0XHRcdHRoaXMuem9vbUJsdXJGaWx0ZXIsXG5cdFx0XHR0aGlzLnJnYlNwbGl0RmlsdGVyLFxuXHRcdFx0dGhpcy5zaG9ja3dhdmVGaWx0ZXJcblx0XHRdO1xuXG5cdFx0dGhpcy5tdXNocm9vbVNvdW5kLnZvbHVtZSA9IDA7XG5cdFx0dGhpcy5tdXNocm9vbVNvdW5kLmN1cnJlbnRUaW1lID0gMDtcblx0XHR0aGlzLm11c2hyb29tU291bmQucGxheSgpO1xuXG5cdFx0VHdlZW5NYXgudG8odGhpcy5tdXNocm9vbVNvdW5kLCAxLCB7dm9sdW1lOiAxfSk7XG5cdFx0VHdlZW5NYXgudG8odGhpcy5yZ2JTcGxpdEZpbHRlci5yZWQsIDEsIHt4OiAtNSwgeTogLTEwfSk7XG5cdFx0VHdlZW5NYXgudG8odGhpcy5yZ2JTcGxpdEZpbHRlci5ncmVlbiwgMSwge3g6IDUsIHk6IDEwfSk7XG5cdFx0VHdlZW5NYXgudG8odGhpcy5zaG9ja3dhdmVGaWx0ZXIsIDEsIHthbXBsaXR1ZGU6IDMwfSk7XG5cdFx0VHdlZW5NYXgudG8odGhpcy56b29tQmx1ckZpbHRlciwgMSwge3N0cmVuZ3RoOiAwLjF9KTtcblx0XHR0aGlzLm11c2hyb29tTW9kZSA9IHRydWU7XG5cblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuZGlzYWJsZU11c2hyb29tTW9kZSgpO1xuXHRcdH0sIE1VU0hST09NX01PREVfVElNRU9VVClcblx0fVxuXG5cdGRpc2FibGVNdXNocm9vbU1vZGUoKSB7XG5cdFx0aWYgKCF0aGlzLm11c2hyb29tTW9kZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdFR3ZWVuTWF4LnRvKHRoaXMubXVzaHJvb21Tb3VuZCwgMSwge3ZvbHVtZTogMH0pO1xuXHRcdFR3ZWVuTWF4LnRvKHRoaXMucmdiU3BsaXRGaWx0ZXIucmVkLCAxLCB7eDogMCwgeTogMH0pO1xuXHRcdFR3ZWVuTWF4LnRvKHRoaXMucmdiU3BsaXRGaWx0ZXIuZ3JlZW4sIDEsIHt4OiAwLCB5OiAwfSk7XG5cdFx0VHdlZW5NYXgudG8odGhpcy5zaG9ja3dhdmVGaWx0ZXIsIDEsIHthbXBsaXR1ZGU6IDB9KTtcblx0XHRUd2Vlbk1heC50byh0aGlzLnpvb21CbHVyRmlsdGVyLCAxLCB7XG5cdFx0XHRzdHJlbmd0aDogMCwgb25Db21wbGV0ZTogKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnN0YWdlLmZpbHRlcnMgPSBbXTtcblx0XHRcdFx0dGhpcy5tdXNocm9vbVNvdW5kLnBhdXNlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5tdXNocm9vbU1vZGUgPSBmYWxzZTtcblx0fVxuXG5cdGFkZE1hcFNlY3Rpb24oc2VjdGlvbikge1xuXHRcdHRoaXMubWFwU2VjdGlvbnMucHVzaChzZWN0aW9uKTtcblx0XHR0aGlzLndvcmxkLmFkZENoaWxkKHNlY3Rpb24pO1xuXHRcdHNlY3Rpb24ueCA9IHRoaXMud29ybGRXaWR0aDtcblx0XHRzZWN0aW9uLmxlZGdlcy5mb3JFYWNoKChsZWRnZSkgPT4ge1xuXHRcdFx0bGVkZ2UueCArPSB0aGlzLndvcmxkV2lkdGg7XG5cdFx0XHR0aGlzLmxlZGdlcy5wdXNoKGxlZGdlKTtcblx0XHR9KTtcblx0XHRzZWN0aW9uLmJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xuXHRcdFx0dGhpcy5ibG9ja3MucHVzaChibG9jayk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLndvcmxkV2lkdGggKz0gc2VjdGlvbi5zZWN0aW9uV2lkdGg7XG5cdH1cblxuXHRnZXRHYW1lT2JqZWN0cygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXBTZWN0aW9ucy5yZWR1Y2UoKHJlcywgc2VjdGlvbikgPT4gcmVzLmNvbmNhdChzZWN0aW9uLmNoaWxkcmVuKSwgW10pO1xuXHR9XG5cblx0Z2V0TGVkZ2VzKCkge1xuXHRcdHJldHVybiB0aGlzLmxlZGdlcztcblx0fVxuXG5cdGdldEJsb2NrcygpIHtcblx0XHRyZXR1cm4gdGhpcy5ibG9ja3M7XG5cdH1cbn0iLCJjbGFzcyBBc3NldFN0b3JhZ2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl90ZXh0dXJlU3RvcmFnZSA9IG5ldyBNYXAoKTtcblx0XHR0aGlzLl9zb3VuZFN0b3JhZ2UgPSBuZXcgTWFwKCk7XG5cdH1cblxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdGxvYWRUZXh0dXJlcygpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGNvbnN0IGxvYWRlciA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XG5cblx0XHRcdGxvYWRlci5hZGQoJ0Zsb29yJywgJ2Fzc2V0cy9pbWcvRmxvb3IucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdDbG91ZHMnLCAnYXNzZXRzL2ltZy9DbG91ZHMucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpHcmVlblR1cnRsZTowJywgJ2Fzc2V0cy9pbWcvR3JlZW5UdXJ0bGUwLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6R3JlZW5UdXJ0bGU6MScsICdhc3NldHMvaW1nL0dyZWVuVHVydGxlMS5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOlJlZFR1cnRsZTowJywgJ2Fzc2V0cy9pbWcvUmVkVHVydGxlMC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOlJlZFR1cnRsZToxJywgJ2Fzc2V0cy9pbWcvUmVkVHVydGxlMS5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ0NvaW5zJywgJ2Fzc2V0cy9pbWcvQ29pbnMucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpQbGF5ZXI6MCcsICdhc3NldHMvaW1nL1BsYXllcjAucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpQbGF5ZXI6MScsICdhc3NldHMvaW1nL1BsYXllcjEucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpQbGF5ZXI6MicsICdhc3NldHMvaW1nL1BsYXllcjIucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpQbGF5ZXI6MycsICdhc3NldHMvaW1nL1BsYXllcjMucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdQbGF5ZXItc3RhdGljJywgJ2Fzc2V0cy9pbWcvUGxheWVyLXN0YXRpYy5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ1JlZE11c2hyb29tJywgJ2Fzc2V0cy9pbWcvUmVkTXVzaHJvb20ucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdHcmVlbk11c2hyb29tJywgJ2Fzc2V0cy9pbWcvR3JlZW5NdXNocm9vbS5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ1NtYWxsVHJlZScsICdhc3NldHMvaW1nL1NtYWxsVHJlZS5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ1RhbGxUcmVlJywgJ2Fzc2V0cy9pbWcvVGFsbFRyZWUucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdQb29wJywgJ2Fzc2V0cy9pbWcvUG9vcC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ0Zsb3dlcicsICdhc3NldHMvaW1nL0Zsb3dlci5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ0R1bXBzdGVyJywgJ2Fzc2V0cy9pbWcvRHVtcHN0ZXIucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdUcmFzaGJhZ3MnLCAnYXNzZXRzL2ltZy9UcmFzaGJhZ3MucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdXYWxsJywgJ2Fzc2V0cy9pbWcvV2FsbC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ0NpdHlCdWlsZGluZ1dpZGUnLCAnYXNzZXRzL2ltZy9DaXR5QnVpbGRpbmdXaWRlLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnQ2l0eUJ1aWxkaW5nTmFycm93JywgJ2Fzc2V0cy9pbWcvQ2l0eUJ1aWxkaW5nTmFycm93LnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6RmluaXNoSG91c2U6MCcsICdhc3NldHMvaW1nL0ZpbmlzaEhvdXNlMC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOkZpbmlzaEhvdXNlOjEnLCAnYXNzZXRzL2ltZy9GaW5pc2hIb3VzZTEucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpGaW5pc2hIb3VzZToyJywgJ2Fzc2V0cy9pbWcvRmluaXNoSG91c2UyLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6RmluaXNoSG91c2U6MycsICdhc3NldHMvaW1nL0ZpbmlzaEhvdXNlMy5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOkZpbmlzaEhvdXNlOjQnLCAnYXNzZXRzL2ltZy9GaW5pc2hIb3VzZTQucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpGaW5pc2hIb3VzZTo1JywgJ2Fzc2V0cy9pbWcvRmluaXNoSG91c2U1LnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6RmluaXNoSG91c2U6NicsICdhc3NldHMvaW1nL0ZpbmlzaEhvdXNlNi5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOk1hbmhvbGU6MCcsICdhc3NldHMvaW1nL01hbmhvbGUwLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6TWFuaG9sZToxJywgJ2Fzc2V0cy9pbWcvTWFuaG9sZTEucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpFcGljU2F4R3V5OjAnLCAnYXNzZXRzL2ltZy9FcGljU2F4R3V5MC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOkVwaWNTYXhHdXk6MScsICdhc3NldHMvaW1nL0VwaWNTYXhHdXkxLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6RXBpY1NheEd1eToyJywgJ2Fzc2V0cy9pbWcvRXBpY1NheEd1eTIucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpFcGljU2F4R3V5OjMnLCAnYXNzZXRzL2ltZy9FcGljU2F4R3V5My5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOkVwaWNTYXhHdXk6NCcsICdhc3NldHMvaW1nL0VwaWNTYXhHdXk0LnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6RXBpY1NheEd1eTo1JywgJ2Fzc2V0cy9pbWcvRXBpY1NheEd1eTUucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdBaXJDb25kaXRpb25pbmcnLCAnYXNzZXRzL2ltZy9BaXJDb25kaXRpb25pZy5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ0FpckNvbmRpdGlvbmluZ0ZhbicsICdhc3NldHMvaW1nL0FpckNvbmRpdGlvbmlnRmFuLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnQWlyQ29uZGl0aW9uaW5nR3JpbGwnLCAnYXNzZXRzL2ltZy9BaXJDb25kaXRpb25pZ0dyaWxsLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6QmFzc0dpcmw6MCcsICdhc3NldHMvaW1nL0Jhc3NHaXJsMC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2FuaW1hdGVkOkJhc3NHaXJsOjEnLCAnYXNzZXRzL2ltZy9CYXNzR2lybDEucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdhbmltYXRlZDpCYXNzR2lybDoyJywgJ2Fzc2V0cy9pbWcvQmFzc0dpcmwyLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnYW5pbWF0ZWQ6QmFzc0dpcmw6MycsICdhc3NldHMvaW1nL0Jhc3NHaXJsMy5wbmcnKTtcblxuXHRcdFx0Ly9sb2JieVxuXHRcdFx0bG9hZGVyLmFkZCgnTG9iYnlXYWxsJywgJ2Fzc2V0cy9pbWcvbG9iYnkvTG9iYnlXYWxsLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnQmVkJywgJ2Fzc2V0cy9pbWcvZnVybml0dXJlL2JlZC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ1RhYmxlJywgJ2Fzc2V0cy9pbWcvZnVybml0dXJlL3RhYmxlLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnQ2hhaXInLCAnYXNzZXRzL2ltZy9mdXJuaXR1cmUvY2hhaXIucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdGcmlkZ2UnLCAnYXNzZXRzL2ltZy9mdXJuaXR1cmUvZnJpZGdlLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnRmFuJywgJ2Fzc2V0cy9pbWcvZnVybml0dXJlL2Zhbi5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ0xhbXAnLCAnYXNzZXRzL2ltZy9mdXJuaXR1cmUvbGFtcC5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ1BsdXNoaWUnLCAnYXNzZXRzL2ltZy9mdXJuaXR1cmUvcGx1c2hpZS5wbmcnKTtcblx0XHRcdGxvYWRlci5hZGQoJ0hhdCcsICdhc3NldHMvaW1nL2Z1cm5pdHVyZS9oYXQucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdUZWxlc2NvcGUnLCAnYXNzZXRzL2ltZy9mdXJuaXR1cmUvdGVsZXNjb3BlLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnUGljdHVyZScsICdhc3NldHMvaW1nL2Z1cm5pdHVyZS9waWN0dXJlLnBuZycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnUmFkaW8nLCAnYXNzZXRzL2ltZy9mdXJuaXR1cmUvcmFkaW8ucG5nJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdUYXBlJywgJ2Fzc2V0cy9pbWcvZnVybml0dXJlL3RhcGUucG5nJyk7XG5cblx0XHRcdGxvYWRlclxuXHRcdFx0XHQubG9hZCgobGRyLCByZXNvdXJjZXMpID0+IHtcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhyZXNvdXJjZXMpLmZvckVhY2goKHJlcykgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5fdGV4dHVyZVN0b3JhZ2Uuc2V0KHJlcywgcmVzb3VyY2VzW3Jlc10udGV4dHVyZSk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGFuaW1hdGVkTWF0Y2hlcyA9IHJlcy5tYXRjaCgvYW5pbWF0ZWQ6KFstXFx3XFwvXSspOihcXGQrKS8pO1xuXG5cdFx0XHRcdFx0XHRpZiAoYW5pbWF0ZWRNYXRjaGVzKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBhbmltYXRlZFNwcml0ZXMgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHRpZiAoIXRoaXMuX3RleHR1cmVTdG9yYWdlLmhhcygnYW5pbWF0ZWQ6JyArIGFuaW1hdGVkTWF0Y2hlc1sxXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRlZFNwcml0ZXMgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl90ZXh0dXJlU3RvcmFnZS5zZXQoJ2FuaW1hdGVkOicgKyBhbmltYXRlZE1hdGNoZXNbMV0sIGFuaW1hdGVkU3ByaXRlcyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0YW5pbWF0ZWRTcHJpdGVzID0gdGhpcy5fdGV4dHVyZVN0b3JhZ2UuZ2V0KCdhbmltYXRlZDonICsgYW5pbWF0ZWRNYXRjaGVzWzFdKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGFuaW1hdGVkU3ByaXRlc1thbmltYXRlZE1hdGNoZXNbMl1dID0gcmVzb3VyY2VzW3Jlc10udGV4dHVyZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRsb2FkZXIuZGVzdHJveSgpO1xuXHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0fSlcblx0XHRcdDtcblx0XHR9KTtcblx0fVxuXG5cdGxvYWRTb3VuZHMoKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgUElYSS5sb2FkZXJzLkxvYWRlcigpO1xuXG5cdFx0XHRsb2FkZXIuYWRkKCdjaXR5JywgJ2Fzc2V0cy9zb3VuZC9jaXR5Lm1wMycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnZWF0JywgJ2Fzc2V0cy9zb3VuZC9lYXQubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdmaXgnLCAnYXNzZXRzL3NvdW5kL2ZpeC5tcDMnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2p1bXAnLCAnYXNzZXRzL3NvdW5kL2p1bXAubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdsYW5kJywgJ2Fzc2V0cy9zb3VuZC9sYW5kLm1wMycpO1xuXHRcdFx0bG9hZGVyLmFkZCgncGlja3VwJywgJ2Fzc2V0cy9zb3VuZC9waWNrdXAubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdyaW5nJywgJ2Fzc2V0cy9zb3VuZC9yaW5nLm1wMycpO1xuXHRcdFx0bG9hZGVyLmFkZCgndnltYXonLCAnYXNzZXRzL3NvdW5kL3Z5bWF6Lm1wMycpO1xuXHRcdFx0bG9hZGVyLmFkZCgnd2FsaycsICdhc3NldHMvc291bmQvd2Fsay5tcDMnKTtcblx0XHRcdGxvYWRlci5hZGQoJ3dhcnAnLCAnYXNzZXRzL3NvdW5kL3dhcnAubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdtZXRhbGhlYWQnLCAnYXNzZXRzL3NvdW5kL21ldGFsaGVhZC5tcDMnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2JhbmRfczInLCAnYXNzZXRzL3NvdW5kL2JhbmRfczIubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdiYW5kX3MyYicsICdhc3NldHMvc291bmQvYmFuZF9zMmIubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdiYW5kX3MyYmQnLCAnYXNzZXRzL3NvdW5kL2JhbmRfczJiZC5tcDMnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2JhbmRfc2JkJywgJ2Fzc2V0cy9zb3VuZC9iYW5kX3NiZC5tcDMnKTtcblx0XHRcdGxvYWRlci5hZGQoJ2JhbmRfc2InLCAnYXNzZXRzL3NvdW5kL2JhbmRfc2IubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdiYW5kX3NkJywgJ2Fzc2V0cy9zb3VuZC9iYW5kX3NkLm1wMycpO1xuXHRcdFx0bG9hZGVyLmFkZCgndHVydGxlJywgJ2Fzc2V0cy9zb3VuZC90dXJ0bGUubXAzJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdmY2tteWxpZmUnLCAnYXNzZXRzL3NvdW5kL2Zja215bGlmZS5tcDMnKTtcblx0XHRcdGxvYWRlci5hZGQoJ3JhZGlvJywgJ2Fzc2V0cy9zb3VuZC9yYWRpby5tcDMnKTtcblxuXHRcdFx0bG9hZGVyXG5cdFx0XHRcdC5sb2FkKChsZHIsIHJlc291cmNlcykgPT4ge1xuXHRcdFx0XHRcdE9iamVjdC5rZXlzKHJlc291cmNlcykuZm9yRWFjaCgocmVzKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zb3VuZFN0b3JhZ2Uuc2V0KHJlcywgcmVzb3VyY2VzW3Jlc10uZGF0YSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bG9hZGVyLmRlc3Ryb3koKTtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cdFx0fSk7XG5cdH1cblxuXHRnZXRUZXh0dXJlKGFzc2V0TmFtZSkge1xuXHRcdGlmICghdGhpcy5fdGV4dHVyZVN0b3JhZ2UuaGFzKGFzc2V0TmFtZSkpIHtcblx0XHRcdHJldHVybiBQSVhJLlRleHR1cmUuV0hJVEU7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl90ZXh0dXJlU3RvcmFnZS5nZXQoYXNzZXROYW1lKTtcblx0fVxuXG5cdGdldEFuaW1hdGVkVGV4dHVyZShhc3NldE5hbWUpIHtcblx0XHRyZXR1cm4gdGhpcy5fdGV4dHVyZVN0b3JhZ2UuZ2V0KCdhbmltYXRlZDonICsgYXNzZXROYW1lKTtcblx0fVxuXG5cdGdldFNvdW5kKHNvdW5kTmFtZSkge1xuXHRcdHJldHVybiB0aGlzLl9zb3VuZFN0b3JhZ2UuZ2V0KHNvdW5kTmFtZSk7XG5cdH1cbn1cbiIsImNsYXNzIENvbnRyb2xzIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5pc0Rpc2FibGVkID0gZmFsc2U7XG5cdFx0dGhpcy5rZXlNYXAgPSBuZXcgU2V0KCk7XG5cdFx0dGhpcy5jYWxsYmFja3MgPSB7XG5cdFx0XHRrZXl1cDogbmV3IE1hcCgpLFxuXHRcdFx0a2V5ZG93bjogbmV3IE1hcCgpXG5cdFx0fTtcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc0Rpc2FibGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLmlzUHJlc3NlZChlLmtleUNvZGUpICYmIHRoaXMuY2FsbGJhY2tzLmtleWRvd24uaGFzKGUua2V5Q29kZSkpIHtcblx0XHRcdFx0dGhpcy5jYWxsYmFja3Mua2V5ZG93bi5nZXQoZS5rZXlDb2RlKS5mb3JFYWNoKChjYikgPT4gY2IoKSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmtleU1hcC5hZGQoZS5rZXlDb2RlKTtcblx0XHR9KTtcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNEaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMua2V5TWFwLmRlbGV0ZShlLmtleUNvZGUpO1xuXHRcdFx0aWYgKHRoaXMuY2FsbGJhY2tzLmtleXVwLmhhcyhlLmtleUNvZGUpKSB7XG5cdFx0XHRcdHRoaXMuY2FsbGJhY2tzLmtleXVwLmdldChlLmtleUNvZGUpLmZvckVhY2goKGNiKSA9PiBjYigpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGlzUHJlc3NlZChrZXlDb2RlKSB7XG5cdFx0cmV0dXJuIHRoaXMua2V5TWFwLmhhcyhrZXlDb2RlKTtcblx0fVxuXG5cdG9uKGV2ZW50VHlwZSwga2V5Q29kZSwgY2FsbGJhY2spIHtcblx0XHRpZiAoIXRoaXMuY2FsbGJhY2tzW2V2ZW50VHlwZV0uaGFzKGtleUNvZGUpKSB7XG5cdFx0XHR0aGlzLmNhbGxiYWNrc1tldmVudFR5cGVdLnNldChrZXlDb2RlLCBbXSk7XG5cdFx0fVxuXHRcdHRoaXMuY2FsbGJhY2tzW2V2ZW50VHlwZV0uZ2V0KGtleUNvZGUpLnB1c2goY2FsbGJhY2spO1xuXHR9XG5cblx0ZGlzYWJsZUNvbnRyb2xzKCkge1xuXHRcdHRoaXMuaXNEaXNhYmxlZCA9IHRydWU7XG5cdFx0dGhpcy5rZXlNYXAuY2xlYXIoKTtcblx0fVxufSIsImNsYXNzIExlZGdlIGV4dGVuZHMgUElYSS5Qb2ludCB7XG5cdGNvbnN0cnVjdG9yKHgsIHksIGxlbmd0aCkge1xuXHRcdHN1cGVyKHgsIHkpO1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHR9XG59IiwiY2xhc3MgQmxvY2sgZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cdGNvbnN0cnVjdG9yKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcblx0XHRzdXBlcihQSVhJLlRleHR1cmUuRU1QVFkpO1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdH1cbn0iLCJjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBQSVhJLmV4dHJhcy5BbmltYXRlZFNwcml0ZSB7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVzKSB7XG5cdFx0c3VwZXIodGV4dHVyZXMpO1xuXG5cdFx0dGhpcy50ZXh0dXJlU3RvcmFnZSA9IHtcblx0XHRcdG1vdmluZzogdGV4dHVyZXMsXG5cdFx0XHRzdGF0aWM6IFthc3NldFN0b3JhZ2UuZ2V0VGV4dHVyZSgnUGxheWVyLXN0YXRpYycpXVxuXHRcdH07XG5cblx0XHR0aGlzLnZTcGVlZCA9IDA7XG5cdFx0dGhpcy5pc0luQWlyID0gZmFsc2U7XG5cdFx0dGhpcy5hbmltYXRpb25TcGVlZCA9IDAuMTtcblx0XHR0aGlzLmlzSW52aW5jaWJsZSA9IGZhbHNlO1xuXHRcdHRoaXMuc291bmRzID0ge1xuXHRcdFx0d2FsazogYXNzZXRTdG9yYWdlLmdldFNvdW5kKCd3YWxrJyksXG5cdFx0XHRqdW1wOiBhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ2p1bXAnKSxcblx0XHRcdGxhbmQ6IGFzc2V0U3RvcmFnZS5nZXRTb3VuZCgnbGFuZCcpLFxuXHRcdFx0bWV0YWxoZWFkOiBhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ21ldGFsaGVhZCcpLFxuXHRcdFx0cGlja3VwOiBhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ3BpY2t1cCcpLFxuXHRcdFx0Zml4OiBhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ2ZpeCcpLFxuXHRcdFx0ZmNrbXlsaWZlOiBhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ2Zja215bGlmZScpLFxuXHRcdFx0dHVydGxlOiBhc3NldFN0b3JhZ2UuZ2V0U291bmQoJ3R1cnRsZScpLFxuXHRcdH07XG5cdFx0dGhpcy5zb3VuZHMud2Fsay5sb29wID0gdHJ1ZTtcblxuXHRcdHRoaXMuYW5jaG9yLnkgPSAxO1xuXHRcdHRoaXMuYW5jaG9yLnggPSAwLjU7XG5cdFx0dGhpcy5sYXN0WCA9IHRoaXMueDtcblx0XHR0aGlzLnBsYXkoKTtcblx0XHR0aGlzLnN0YXRzID0ge307XG5cdFx0dGhpcy5pc1BsYXllck9uTGVkZ2UgPSBmYWxzZTtcblx0XHR0aGlzLnN1bW1hcnkgPSB7XG5cdFx0XHRtb25leTogQkFTRV9NT05FWSxcblx0XHRcdGluanVyeTogQkFTRV9JTkpVUlksXG5cdFx0XHRodW5nZXI6IEJBU0VfSFVOR0VSXG5cdFx0fTtcblxuXHRcdGNvbnN0IHRpY2tlckhhbmRsZXIgPSAoKSA9PiB7XG5cdFx0XHRjb25zdCBsZWRnZXMgPSBhcHBsaWNhdGlvbi5nZXRMZWRnZXMoKTtcblx0XHRcdHRoaXMuaXNQbGF5ZXJPbkxlZGdlID0gbGVkZ2VzLnNvbWUoKGxlZGdlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLnZTcGVlZCA+PSAwXG5cdFx0XHRcdFx0JiYgbGVkZ2UueCA8PSB0aGlzLnhcblx0XHRcdFx0XHQmJiBsZWRnZS54ICsgbGVkZ2UubGVuZ3RoID4gdGhpcy54XG5cdFx0XHRcdFx0JiYgbGVkZ2UueSA+PSB0aGlzLnlcblx0XHRcdFx0XHQmJiBsZWRnZS55IDw9IHRoaXMueSArIHRoaXMudlNwZWVkXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMuc3RvcEZhbGxpbmcoKTtcblx0XHRcdFx0XHR0aGlzLnkgPSBsZWRnZS55O1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICghdGhpcy5pc1BsYXllck9uTGVkZ2UgJiYgdGhpcy55IDwgR1JPVU5EX0hFSUdIVCAmJiAhdGhpcy53b3VsZENsaXBBdFBvc2l0aW9uKHRoaXMueCwgdGhpcy55ICsgMSkpIHtcblx0XHRcdFx0dGhpcy5pc0luQWlyID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuaXNJbkFpcikge1xuXHRcdFx0XHR0aGlzLnZTcGVlZCArPSBQTEFZRVJfR1JBVklUWTtcblxuXHRcdFx0XHRpZiAodGhpcy52U3BlZWQgPiAwICYmIHRoaXMueSArIHRoaXMudlNwZWVkID49IEdST1VORF9IRUlHSFQpIHtcblx0XHRcdFx0XHR0aGlzLnN0b3BGYWxsaW5nKCk7XG5cdFx0XHRcdFx0dGhpcy55ID0gR1JPVU5EX0hFSUdIVDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGJsb2NrQWJvdmVCZWxvdyA9IHRoaXMud291bGRDbGlwQXRQb3NpdGlvbih0aGlzLngsIHRoaXMueSArIHRoaXMudlNwZWVkKTtcblxuXHRcdFx0XHRpZiAoYmxvY2tBYm92ZUJlbG93KSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMudlNwZWVkID4gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5zdG9wRmFsbGluZygpO1xuXHRcdFx0XHRcdFx0dGhpcy55ID0gYmxvY2tBYm92ZUJlbG93Lnk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnZTcGVlZCA8IDApIHtcblx0XHRcdFx0XHRcdHRoaXMudlNwZWVkID0gMDtcblx0XHRcdFx0XHRcdHRoaXMueSA9IGJsb2NrQWJvdmVCZWxvdy55ICsgYmxvY2tBYm92ZUJlbG93LmhlaWdodCArIHRoaXMuaGVpZ2h0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnkgKz0gdGhpcy52U3BlZWQ7XG5cdFx0XHR0aGlzLmxhc3RYID0gdGhpcy54O1xuXG5cdFx0XHRjb25zdCB4TW90aW9uID0gYXBwbGljYXRpb24udGlja2VyLmRlbHRhVGltZSAvIGFwcGxpY2F0aW9uLnRpY2tlci5GUFMgKiBQTEFZRVJfTUFYX0hTUEVFRDtcblx0XHRcdGNvbnN0IGtleUxlZnQgPSBjb250cm9scy5pc1ByZXNzZWQoS0VZX0xFRlQpO1xuXHRcdFx0Y29uc3Qga2V5UmlnaHQgPSBjb250cm9scy5pc1ByZXNzZWQoS0VZX1JJR0hUKTtcblxuXG5cdFx0XHRpZiAoa2V5TGVmdCkge1xuXHRcdFx0XHRpZiAoIXRoaXMud291bGRDbGlwQXRQb3NpdGlvbih0aGlzLnggLSB4TW90aW9uLCB0aGlzLnkpKSB7XG5cdFx0XHRcdFx0dGhpcy54IC09IHhNb3Rpb247XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS54ID0gLTE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGtleVJpZ2h0KSB7XG5cdFx0XHRcdGlmICghdGhpcy53b3VsZENsaXBBdFBvc2l0aW9uKHRoaXMueCArIHhNb3Rpb24sIHRoaXMueSkpIHtcblx0XHRcdFx0XHR0aGlzLnggKz0geE1vdGlvbjtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnggPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMueCA9IE1hdGgubWluKE1hdGgubWF4KDAsIHRoaXMueCksIGFwcGxpY2F0aW9uLndvcmxkV2lkdGgpO1xuXG5cdFx0XHRpZiAodGhpcy5sYXN0WCAhPT0gdGhpcy54KSB7XG5cdFx0XHRcdGNvbnN0IGlzU3RhcnRpbmdNb3ZlbWVudCA9IHRoaXMudGV4dHVyZXMgPT09IHRoaXMudGV4dHVyZVN0b3JhZ2Uuc3RhdGljO1xuXG5cdFx0XHRcdGlmIChpc1N0YXJ0aW5nTW92ZW1lbnQpIHtcblx0XHRcdFx0XHR0aGlzLnRleHR1cmVzID0gdGhpcy50ZXh0dXJlU3RvcmFnZS5tb3Zpbmc7XG5cdFx0XHRcdFx0dGhpcy5nb3RvQW5kUGxheSgwKTtcblx0XHRcdFx0XHR0aGlzLmFuaW1hdGlvblNwZWVkID0gMC4xO1xuXHRcdFx0XHRcdHRoaXMuc291bmRzLndhbGsucGxheSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIXRoaXMuc291bmRzLndhbGsucGF1c2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5zb3VuZHMud2Fsay5jdXJyZW50VGltZSA9IDA7XG5cdFx0XHRcdFx0dGhpcy5zb3VuZHMud2Fsay5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMudGV4dHVyZXMgPSB0aGlzLnRleHR1cmVTdG9yYWdlLnN0YXRpYztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zb3VuZHMud2Fsay5tdXRlZCA9IHRoaXMuaXNJbkFpcjtcblx0XHR9O1xuXG5cdFx0YXBwbGljYXRpb24udGlja2VyLmFkZCh0aWNrZXJIYW5kbGVyKTtcblxuXHRcdGNvbnRyb2xzLm9uKCdrZXlkb3duJywgS0VZX1VQLCAoKSA9PiB7XG5cdFx0XHRpZiAoIXRoaXMuaXNJbkFpcikge1xuXHRcdFx0XHR0aGlzLmp1bXAoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGNvbnRyb2xzLm9uKCdrZXlkb3duJywgS0VZX0RPV04sICgpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzUGxheWVyT25MZWRnZSAmJiAhdGhpcy53b3VsZENsaXBBdFBvc2l0aW9uKHRoaXMueCwgdGhpcy55ICsgMSkpIHtcblx0XHRcdFx0dGhpcy55ICs9IDE7XG5cdFx0XHRcdHRoaXMuaXNJbkFpciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRjb2xsaXNpb25NYW5hZ2VyLm9uKHRoaXMsIEZpbmlzaCwgKG9iamVjdCkgPT4ge1xuXHRcdFx0b2JqZWN0LmlzQ29sbGlzaW9uRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0d2luZG93LmNvbnRyb2xzLmRpc2FibGVDb250cm9scygpO1xuXHRcdFx0YXBwbGljYXRpb24uZGlzYWJsZU11c2hyb29tTW9kZSgpO1xuXHRcdFx0dGhpcy5zb3VuZHMuZml4LmN1cnJlbnRUaW1lID0gMDtcblx0XHRcdHRoaXMuc291bmRzLmZpeC5wbGF5KCk7XG5cblx0XHRcdGNvbnN0IHRsID0gbmV3IFRpbWVsaW5lTWF4KCk7XG5cdFx0XHR0bFxuXHRcdFx0XHQudG8odGhpcywgMC41LCB7YWxwaGE6IDB9KVxuXHRcdFx0XHQuYWRkKCgpID0+IHtcblx0XHRcdFx0XHR3aW5kb3cuZXZlbnRIdWIuJGVtaXQoJ2xldmVsRmluaXNoZWQnKTtcblx0XHRcdFx0fSwgJys9MS41Jyk7XG5cdFx0fSk7XG5cblx0XHRjb2xsaXNpb25NYW5hZ2VyLm9uKHRoaXMsIEFpckNvbmRpdGlvbmluZywgKG9iamVjdCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3SW5qdXJ5U3RhdCA9IEdhbWVBcHAudnVlLiRzdG9yZS5zdGF0ZS5wbGF5ZXIuc3RhdHMuaW5qdXJ5ICsgNSA+PSBNQVhfSU5KVVJZID9cblx0XHRcdFx0TUFYX0lOSlVSWSA6XG5cdFx0XHRcdEdhbWVBcHAudnVlLiRzdG9yZS5zdGF0ZS5wbGF5ZXIuc3RhdHMuaW5qdXJ5ICsgNTtcblxuXHRcdFx0R2FtZUFwcC52dWUuJHN0b3JlLmNvbW1pdCgndXBkYXRlUGxheWVyU3RhdCcsIHtcblx0XHRcdFx0c3RhdDogJ2luanVyeScsXG5cdFx0XHRcdHZhbHVlOiBuZXdJbmp1cnlTdGF0XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc3VtbWFyeS5pbmp1cnkgKz0gNTtcblx0XHRcdG9iamVjdC5pc0NvbGxpc2lvbkVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRvYmplY3QuaXNDb2xsaXNpb25FbmFibGVkID0gdHJ1ZTtcblx0XHRcdH0sIDMwMCk7XG5cdFx0XHR0aGlzLnNvdW5kcy5tZXRhbGhlYWQuY3VycmVudFRpbWUgPSAwO1xuXHRcdFx0dGhpcy5zb3VuZHMubWV0YWxoZWFkLnBsYXkoKTtcblx0XHR9KTtcblxuXHRcdGNvbGxpc2lvbk1hbmFnZXIub24odGhpcywgQ29pbnMsIChvYmplY3QpID0+IHtcblx0XHRcdEdhbWVBcHAudnVlLiRzdG9yZS5jb21taXQoJ3VwZGF0ZVBsYXllclN0YXRlJywge1xuXHRcdFx0XHRzdGF0ZTogJ21vbmV5Jyxcblx0XHRcdFx0dmFsdWU6IEdhbWVBcHAudnVlLiRzdG9yZS5zdGF0ZS5wbGF5ZXIuc3RhdGVzLm1vbmV5ICsgNVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnN1bW1hcnkubW9uZXkgKz0gNTtcblx0XHRcdG9iamVjdC5kZXN0cm95KCk7XG5cblx0XHRcdHRoaXMuc291bmRzLnBpY2t1cC5jdXJyZW50VGltZSA9IDA7XG5cdFx0XHR0aGlzLnNvdW5kcy5waWNrdXAucGxheSgpO1xuXHRcdH0pO1xuXG5cdFx0Y29sbGlzaW9uTWFuYWdlci5vbih0aGlzLCBSZWRNdXNocm9vbSwgKG9iamVjdCkgPT4ge1xuXHRcdFx0YXBwbGljYXRpb24uZW5hYmxlTXVzaHJvb21Nb2RlKCk7XG5cdFx0XHRvYmplY3QuZGVzdHJveSgpO1xuXHRcdH0pO1xuXG5cdFx0Y29sbGlzaW9uTWFuYWdlci5vbih0aGlzLCBSZWRUdXJ0bGUsIChvYmplY3QpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzSW52aW5jaWJsZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0luanVyeVN0YXQgPSBHYW1lQXBwLnZ1ZS4kc3RvcmUuc3RhdGUucGxheWVyLnN0YXRzLmluanVyeSArIDUgPj0gTUFYX0lOSlVSWSA/XG5cdFx0XHRcdE1BWF9JTkpVUlkgOlxuXHRcdFx0XHRHYW1lQXBwLnZ1ZS4kc3RvcmUuc3RhdGUucGxheWVyLnN0YXRzLmluanVyeSArIDU7XG5cblx0XHRcdEdhbWVBcHAudnVlLiRzdG9yZS5jb21taXQoJ3VwZGF0ZVBsYXllclN0YXQnLCB7XG5cdFx0XHRcdHN0YXQ6ICdpbmp1cnknLFxuXHRcdFx0XHR2YWx1ZTogbmV3SW5qdXJ5U3RhdFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnN1bW1hcnkuaW5qdXJ5ICs9IDU7XG5cdFx0XHR0aGlzLmlzSW52aW5jaWJsZSA9IHRydWU7XG5cdFx0XHR0aGlzLmluanVyeUp1bXAoKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmlzSW52aW5jaWJsZSA9IGZhbHNlO1xuXHRcdFx0fSwgUExBWUVSX0lOVklOQ0lCSUxJVFlfRFVSQVRJT04pO1xuXHRcdH0pO1xuXHR9XG5cblx0aW5qdXJ5SnVtcCgpIHtcblx0XHR0aGlzLnNvdW5kcy5mY2tteWxpZmUuY3VycmVudFRpbWUgPSAwO1xuXHRcdHRoaXMuc291bmRzLmZja215bGlmZS52b2x1bWUgPSAwLjc7XG5cdFx0dGhpcy5zb3VuZHMuZmNrbXlsaWZlLnBsYXkoKTtcblx0XHR0aGlzLnZTcGVlZCA9IFBMQVlFUl9JTkpVUllfSlVNUF9WU1BFRUQ7XG5cdFx0dGhpcy5pc0luQWlyID0gdHJ1ZTtcblx0fVxuXG5cdGp1bXAoKSB7XG5cdFx0dGhpcy52U3BlZWQgPSBQTEFZRVJfSlVNUF9WU1BFRUQ7XG5cdFx0dGhpcy5pc0luQWlyID0gdHJ1ZTtcblx0XHR0aGlzLnNvdW5kcy5qdW1wLmN1cnJlbnRUaW1lID0gMDtcblx0XHR0aGlzLnNvdW5kcy5qdW1wLnBsYXkoKTtcblx0fVxuXG5cdHdvdWxkQ2xpcEF0UG9zaXRpb24oeCwgeSkge1xuXHRcdGNvbnN0IGN1cnJlbnRQb3NpdGlvbiA9IG5ldyBQSVhJLlBvaW50KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFBJWEkuUG9pbnQoeCwgeSk7XG5cblx0XHRjb25zdCBib3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xuXHRcdGNvbnN0IGJsb2NrID0gYXBwbGljYXRpb24uZ2V0QmxvY2tzKCkuZmluZCgoYmxvY2spID0+IGJvdW5kcy5pbnRlcnNlY3RzKGJsb2NrLmdldEJvdW5kcygpKSk7XG5cblx0XHR0aGlzLnBvc2l0aW9uID0gY3VycmVudFBvc2l0aW9uO1xuXHRcdHJldHVybiBibG9jaztcblx0fVxuXG5cdHN0b3BGYWxsaW5nKCkge1xuXHRcdHRoaXMuaXNJbkFpciA9IGZhbHNlO1xuXHRcdGlmICh0aGlzLnZTcGVlZCA+IDApIHtcblx0XHRcdHRoaXMuc291bmRzLmxhbmQuY3VycmVudFRpbWUgPSAwO1xuXHRcdFx0dGhpcy5zb3VuZHMubGFuZC5wbGF5KCk7XG5cdFx0fVxuXHRcdHRoaXMudlNwZWVkID0gMDtcblx0fVxufSIsImNsYXNzIENhbWVyYSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMub2Zmc2V0ID0gMDtcblx0XHR0aGlzLnNwZWVkID0gMDtcblx0XHR0aGlzLm1heENlbnRlclBsYXllck9mZnNldCA9IFZJRVdfV0lEVEggLyAyICogNCAvIDU7XG5cblx0XHRhcHBsaWNhdGlvbi50aWNrZXIuYWRkKCgpID0+IHtcblx0XHRcdGlmIChwbGF5ZXIpIHtcblx0XHRcdFx0Y29uc3QgY2VudGVyID0gdGhpcy5nZXRDZW50ZXJPZmZzZXQoKTtcblx0XHRcdFx0dGhpcy5zcGVlZCA9IChwbGF5ZXIueCAtIGNlbnRlcikgLyB0aGlzLm1heENlbnRlclBsYXllck9mZnNldCAqIFBMQVlFUl9NQVhfSFNQRUVEIC8gMTA7XG5cblx0XHRcdFx0dGhpcy5jZW50ZXJBdChjZW50ZXIgKyB0aGlzLnNwZWVkKTtcblxuXHRcdFx0XHRhcHBsaWNhdGlvbi53b3JsZC54ID0gLXRoaXMub2Zmc2V0O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Y2VudGVyQXQoeCkge1xuXHRcdHRoaXMub2Zmc2V0ID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgeCAtIFZJRVdfV0lEVEggLyAyKSwgYXBwbGljYXRpb24ud29ybGRXaWR0aCAtIFZJRVdfV0lEVEgpO1xuXHR9XG5cblx0Z2V0Q2VudGVyT2Zmc2V0KCkge1xuXHRcdHJldHVybiB0aGlzLm9mZnNldCArIFZJRVdfV0lEVEggLyAyO1xuXHR9XG59IiwiY2xhc3MgQ29sbGlzaW9uTWFuYWdlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuY2FsbGJhY2tzID0gW107XG5cblx0XHRhcHBsaWNhdGlvbi50aWNrZXIuYWRkKCgpID0+IHtcblx0XHRcdGNvbnN0IGdhbWVPYmplY3RzID0gdGhpcy5nZXRDb2xsaWRhYmxlT2JqZWN0cygpO1xuXG5cdFx0XHR0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRjb25zdCBib3VuZHMgPSBjYi5vYmplY3QuZ2V0Qm91bmRzKCk7XG5cblx0XHRcdFx0Z2FtZU9iamVjdHNcblx0XHRcdFx0XHQuZmlsdGVyKChnYW1lT2JqZWN0KSA9PiBnYW1lT2JqZWN0IGluc3RhbmNlb2YgY2Iub3RoZXJDbGFzcylcblx0XHRcdFx0XHQuZm9yRWFjaCgoZ2FtZU9iamVjdCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb3RoZXJCb3VuZHMgPSBnYW1lT2JqZWN0LmdldEJvdW5kcygpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIWJvdW5kcy5pbnRlcnNlY3RzKG90aGVyQm91bmRzKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNiLmhhbmRsZXIoZ2FtZU9iamVjdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdG9uKG9iamVjdCwgb3RoZXJDbGFzcywgaGFuZGxlcikge1xuXHRcdHRoaXMuY2FsbGJhY2tzLnB1c2goe29iamVjdCwgb3RoZXJDbGFzcywgaGFuZGxlcn0pO1xuXHR9XG5cblx0Z2V0KG9iamVjdCwgb3RoZXJDbGFzcykge1xuXHRcdGNvbnN0IGJvdW5kcyA9IG9iamVjdC5nZXRCb3VuZHMoKTtcblxuXHRcdHJldHVybiB0aGlzXG5cdFx0XHQuZ2V0Q29sbGlkYWJsZU9iamVjdHMoKVxuXHRcdFx0LmZpbHRlcigoZ2FtZU9iamVjdCkgPT4gZ2FtZU9iamVjdCBpbnN0YW5jZW9mIG90aGVyQ2xhc3MpXG5cdFx0XHQuZmluZCgoZ2FtZU9iamVjdCkgPT4gYm91bmRzLmludGVyc2VjdHMoZ2FtZU9iamVjdC5nZXRCb3VuZHMoKSkpO1xuXHR9XG5cblx0Z2V0Q29sbGlkYWJsZU9iamVjdHMoKSB7XG5cdFx0cmV0dXJuIGFwcGxpY2F0aW9uLmdldEdhbWVPYmplY3RzKCkuZmlsdGVyKChnYW1lT2JqZWN0KSA9PiBnYW1lT2JqZWN0LmlzQ29sbGlzaW9uRW5hYmxlZCk7XG5cdH1cblxufSIsImNsYXNzIE1hcFNlY3Rpb24gZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLm5hbWUgPSAnJztcblx0XHR0aGlzLnNlY3Rpb25XaWR0aCA9IDA7XG5cdFx0dGhpcy5sZWRnZXMgPSBbXTtcblx0XHR0aGlzLmJsb2NrcyA9IFtdO1xuXHR9XG5cblx0dXNlU2VjdGlvbihuYW1lKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHRjb25zdCBzZWN0aW9uID0gbWFwU2VjdGlvblN0b3JhZ2UuZ2V0KG5hbWUpO1xuXHRcdHRoaXMuc2VjdGlvbldpZHRoID0gc2VjdGlvbi53aWR0aDtcblx0XHRzZWN0aW9uLm9iamVjdHMuZm9yRWFjaCgob2JqZWN0RGF0YSkgPT4ge1xuXHRcdFx0Y29uc3Qgb2JqZWN0ID0gR2FtZU9iamVjdEZhY3RvcnkuY3JlYXRlKG9iamVjdERhdGEudHlwZSwgb2JqZWN0RGF0YSk7XG5cdFx0XHRvYmplY3QucG9zaXRpb24uc2V0KC4uLnRoaXMuZmxpcFkob2JqZWN0RGF0YS5wb3NpdGlvbikpO1xuXHRcdFx0dGhpcy5hZGRDaGlsZChvYmplY3QpO1xuXHRcdH0pO1xuXHRcdHNlY3Rpb24ubGVkZ2VzLmZvckVhY2goKGxlZGdlRGF0YSkgPT4ge1xuXHRcdFx0Y29uc3QgbGVkZ2UgPSBuZXcgTGVkZ2UoLi4udGhpcy5mbGlwWShsZWRnZURhdGEucG9zaXRpb24pLCBsZWRnZURhdGEubGVuZ3RoKTtcblx0XHRcdHRoaXMubGVkZ2VzLnB1c2gobGVkZ2UpO1xuXHRcdH0pO1xuXHRcdHNlY3Rpb24uYmxvY2tzLmZvckVhY2goKGJsb2NrRGF0YSkgPT4ge1xuXHRcdFx0Y29uc3QgYmxvY2sgPSBuZXcgQmxvY2soYmxvY2tEYXRhLnBvc2l0aW9uWzBdLCBHUk9VTkRfSEVJR0hUIC0gYmxvY2tEYXRhLnBvc2l0aW9uWzFdIC0gYmxvY2tEYXRhLnNpemVbMV0sIC4uLmJsb2NrRGF0YS5zaXplKTtcblx0XHRcdHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xuXHRcdFx0dGhpcy5hZGRDaGlsZChibG9jayk7XG5cdFx0fSk7XG5cdH1cblxuXHRmbGlwWShwb3NpdGlvbikge1xuXHRcdHJldHVybiBbcG9zaXRpb25bMF0sIEdST1VORF9IRUlHSFQgLSBwb3NpdGlvblsxXV07XG5cdH1cbn0iLCJjbGFzcyBNYXBTZWN0aW9uU3RvcmFnZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX3N0b3JhZ2UgPSBuZXcgTWFwKCk7XG5cdH1cblxuXHQvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdGxvYWRNYXBTZWN0aW9ucygpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGNvbnN0IGxvYWRlciA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XG5cblx0XHRcdGxvYWRlci5hZGQoJ3N0YXJ0JywgJ2Fzc2V0cy9tYXBfc2VjdGlvbnMvc3RhcnQuanNvbicpO1xuXHRcdFx0bG9hZGVyLmFkZCgnbXVzaWNiYW5kJywgJ2Fzc2V0cy9tYXBfc2VjdGlvbnMvbXVzaWNiYW5kLmpzb24nKTtcblx0XHRcdGxvYWRlci5hZGQoJ2NpdHkwMScsICdhc3NldHMvbWFwX3NlY3Rpb25zL2NpdHkwMS5qc29uJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdjaXR5MDInLCAnYXNzZXRzL21hcF9zZWN0aW9ucy9jaXR5MDIuanNvbicpO1xuXHRcdFx0bG9hZGVyLmFkZCgnY2l0eTAzJywgJ2Fzc2V0cy9tYXBfc2VjdGlvbnMvY2l0eTAzLmpzb24nKTtcblx0XHRcdGxvYWRlci5hZGQoJ2NpdHkwNCcsICdhc3NldHMvbWFwX3NlY3Rpb25zL2NpdHkwNC5qc29uJyk7XG5cdFx0XHRsb2FkZXIuYWRkKCdjaXR5MDUnLCAnYXNzZXRzL21hcF9zZWN0aW9ucy9jaXR5MDUuanNvbicpO1xuXHRcdFx0bG9hZGVyLmFkZCgnZmluaXNoJywgJ2Fzc2V0cy9tYXBfc2VjdGlvbnMvZmluaXNoLmpzb24nKTtcblxuXHRcdFx0bG9hZGVyXG5cdFx0XHRcdC5sb2FkKChsZHIsIHJlc291cmNlcykgPT4ge1xuXHRcdFx0XHRcdE9iamVjdC5rZXlzKHJlc291cmNlcykuZm9yRWFjaCgocmVzKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zdG9yYWdlLnNldChyZXMsIHJlc291cmNlc1tyZXNdLmRhdGEpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGxvYWRlci5kZXN0cm95KCk7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdGdldChhc3NldE5hbWUpIHtcblx0XHRyZXR1cm4gdGhpcy5fc3RvcmFnZS5nZXQoYXNzZXROYW1lKTtcblx0fVxufSIsImNsYXNzIEdhbWVPYmplY3RGYWN0b3J5IHtcblx0c3RhdGljIGNyZWF0ZSh0eXBlLCBkYXRhKSB7XG5cdFx0Y29uc3Qgb2JqZWN0Q2xhc3MgPSBHYW1lT2JqZWN0RmFjdG9yeS5jbGFzc0xpc3RbdHlwZV07XG5cdFx0Y29uc3QgdGV4dHVyZXMgPSBvYmplY3RDbGFzcy5pc0FuaW1hdGVkID8gYXNzZXRTdG9yYWdlLmdldEFuaW1hdGVkVGV4dHVyZSh0eXBlKSA6IFthc3NldFN0b3JhZ2UuZ2V0VGV4dHVyZSh0eXBlKV07XG5cdFx0cmV0dXJuIG5ldyBvYmplY3RDbGFzcyh0ZXh0dXJlcywgZGF0YSk7XG5cdH1cbn1cblxuR2FtZU9iamVjdEZhY3RvcnkuY2xhc3NMaXN0ID0ge1xuXHQnQWlyQ29uZGl0aW9uaW5nJzogQWlyQ29uZGl0aW9uaW5nLFxuXHQnR3JlZW5UdXJ0bGUnOiBHcmVlblR1cnRsZSxcblx0J1JlZFR1cnRsZSc6IFJlZFR1cnRsZSxcblx0J0NvaW4nOiBDb2luLFxuXHQnQ29pbnMnOiBDb2lucyxcblx0J0ZpbmlzaEhvdXNlJzogRmluaXNoSG91c2UsXG5cdCdGaW5pc2gnOiBGaW5pc2gsXG5cdCdSZWRNdXNocm9vbSc6IFJlZE11c2hyb29tLFxuXHQnR3JlZW5NdXNocm9vbSc6IEdyZWVuTXVzaHJvb20sXG5cdCdQb29wJzogUG9vcCxcblx0J01hbmhvbGUnOiBNYW5ob2xlLFxuXHQnU21hbGxUcmVlJzogU21hbGxUcmVlLFxuXHQnVGFsbFRyZWUnOiBUYWxsVHJlZSxcblx0J0NpdHlCdWlsZGluZ1dpZGUnOiBDaXR5QnVpbGRpbmdXaWRlLFxuXHQnQ2l0eUJ1aWxkaW5nTmFycm93JzogQ2l0eUJ1aWxkaW5nTmFycm93LFxuXHQnRHVtcHN0ZXInOiBEdW1wc3Rlcixcblx0J1RyYXNoYmFncyc6IFRyYXNoYmFncyxcblx0J1dhbGwnOiBXYWxsLFxuXHQnRXBpY1NheEd1eSc6IEVwaWNTYXhHdXksXG5cdCdCYXNzR2lybCc6IEJhc3NHaXJsXG59OyIsImNsYXNzIExvYmJ5QXBwbGljYXRpb24gZXh0ZW5kcyBQSVhJLkFwcGxpY2F0aW9uIHtcblx0Y29uc3RydWN0b3IoLi4uYXJncykge1xuXHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0dGhpcy5iYWNrZ3JvdW5kID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG5cdFx0dGhpcy5iYWNrZ3JvdW5kLm5hbWUgPSAnTG9iYnlCYWNrZ3JvdW5kJztcblx0XHR0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuYmFja2dyb3VuZCk7XG5cblx0XHR0aGlzLmJnID0gbmV3IFBJWEkuU3ByaXRlKGFzc2V0U3RvcmFnZS5nZXRUZXh0dXJlKCdMb2JieVdhbGwnKSk7XG5cdFx0dGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmJnKTtcblxuXHRcdHRoaXMuYmVkID0gbmV3IFBJWEkuU3ByaXRlKGFzc2V0U3RvcmFnZS5nZXRUZXh0dXJlKCdCZWQnKSk7XG5cdFx0dGhpcy5iZWQueCA9IDEwMDA7XG5cdFx0dGhpcy5iZWQueSA9IDY1MDtcblx0XHR0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuYmVkKTtcblxuXHRcdHRoaXMuaXRlbUNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuXHRcdHRoaXMuaXRlbUNvbnRhaW5lci5uYW1lID0gJ2l0ZW1jb250YWluZXInO1xuXG5cdFx0dGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLml0ZW1Db250YWluZXIpO1xuXG5cdFx0aWYgKEdhbWVBcHAudnVlLiRzdG9yZS5zdGF0ZS5yZXBvc2Vzc2lvbikge1xuXHRcdFx0R2FtZUFwcC52dWUuJHN0b3JlLmNvbW1pdCgncGVuZGluZ1JlcG9zZXNzaW9uJywgZmFsc2UpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHRoaXMudGFrZUF3YXlJdGVtKEdhbWVBcHAudnVlLiRzdG9yZS5zdGF0ZS5wbGF5ZXIub3duZWRJdGVtc1swXSlcblx0XHRcdH0sIDEwMDApO1xuXHRcdH1cblxuXHRcdHRoaXMucmFkaW9BdWRpbyA9IGFzc2V0U3RvcmFnZS5nZXRTb3VuZCgncmFkaW8nKTtcblx0XHR0aGlzLnJhZGlvQXVkaW8ubG9vcCA9IHRydWU7XG5cdFx0dGhpcy5yYWRpb0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcblxuXHRcdHRoaXMucGxheVJhZGlvKCk7XG5cdH1cblxuXHRkaXNwbGF5T3duZWRJdGVtKHNwcml0ZU5hbWUsIHBvc2l0aW9uKSB7XG5cdFx0Y29uc3Qgc2x1ZyA9IHNwcml0ZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmIChHYW1lQXBwLnZ1ZS4kc3RvcmUuc3RhdGUucGxheWVyLm93bmVkSXRlbXMuaW5kZXhPZihzbHVnKSA9PT0gLTEpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzW3NsdWddID0gbmV3IFBJWEkuU3ByaXRlKGFzc2V0U3RvcmFnZS5nZXRUZXh0dXJlKHNwcml0ZU5hbWUpKTtcblxuXHRcdHRoaXNbc2x1Z10ueCA9IHBvc2l0aW9uLng7XG5cdFx0dGhpc1tzbHVnXS55ID0gcG9zaXRpb24ueTtcblxuXHRcdHRoaXMuaXRlbUNvbnRhaW5lci5hZGRDaGlsZCh0aGlzW3NsdWddKTtcblx0fVxuXG5cdHBsYXlSYWRpbygpIHtcblx0XHRpZiAoR2FtZUFwcC52dWUuJHN0b3JlLnN0YXRlLnBsYXllci5vd25lZEl0ZW1zLmluZGV4T2YoJ3JhZGlvJykgIT09IC0xKSB7XG5cdFx0XHR0aGlzLnJhZGlvQXVkaW8ucGxheSgpO1xuXHRcdH1cblx0fVxuXG5cdHN0b3BSYWRpbygpIHtcblx0XHR0aGlzLnJhZGlvQXVkaW8ucGF1c2UoKTtcblx0fVxuXG5cdHRha2VBd2F5SXRlbShzcHJpdGVOYW1lKSB7XG5cdFx0Y29uc3Qgc2x1ZyA9IHNwcml0ZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmIChzbHVnID09PSAnd2lsbCB0byBsaXZlJykge1xuXHRcdFx0c3dhbCh7XG5cdFx0XHRcdHRleHQ6ICdIb3cgY2FuIHlvdSB0YWtlIHNvbWV0aGluZyB0aGF0IEkgbmV2ZXIgaGFkPydcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChHYW1lQXBwLnZ1ZS4kc3RvcmUuc3RhdGUucGxheWVyLm93bmVkSXRlbXMuaW5kZXhPZihzbHVnKSA9PT0gLTEpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRHYW1lQXBwLnZ1ZS4kc3RvcmUuY29tbWl0KCdyZW1vdmVQbGF5ZXJJdGVtJywgc2x1Zyk7XG5cblx0XHQvL2luaXQgZm9yIGZ1dHVyZSB1c2Vcblx0XHRjb25zdCB0YXBlID0gbmV3IFBJWEkuU3ByaXRlKGFzc2V0U3RvcmFnZS5nZXRUZXh0dXJlKCdUYXBlJykpO1xuXHRcdHRhcGUuYW5jaG9yLnNldCgwLjUsIDAuNSk7XG5cblx0XHR0aGlzW3NsdWddLmFkZENoaWxkKHRhcGUpO1xuXHRcdHRhcGUucG9zaXRpb24uc2V0KHRoaXNbc2x1Z10ud2lkdGggLyAyLCB0aGlzW3NsdWddLmhlaWdodCAvIDIpO1xuXHRcdHRhcGUuc2NhbGUuc2V0KHRoaXNbc2x1Z10ud2lkdGggLyB0YXBlLndpZHRoICogMS4yKTtcblxuXHRcdFR3ZWVuTWF4LmZyb21Ubyh0YXBlLCAuMywge2FscGhhOiAwfSwge2FscGhhOiAxfSk7XG5cblx0XHR0aGlzW3NsdWddLm9uKCdyZW1vdmVkJywgKCkgPT4ge1xuXHRcdFx0d2luZG93LmV2ZW50SHViLiRlbWl0KCdsb2JieS5pdGVtUmVtb3ZlZCcpO1xuXHRcdH0pO1xuXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRUd2Vlbk1heC50byh0aGlzW3NsdWddLCAuMywge1xuXHRcdFx0XHRhbHBoYTogMCwgb25Db21wbGV0ZTogKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuaXRlbUNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzW3NsdWddKTtcblxuXHRcdFx0XHRcdGlmIChHYW1lQXBwLnZ1ZS4kc3RvcmUuc3RhdGUucGxheWVyLm93bmVkSXRlbXMubGVuZ3RoIDw9IDApIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5ldmVudEh1Yi4kZW1pdCgnZ2FtZU92ZXInKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKEdhbWVBcHAudnVlLiRzdG9yZS5zdGF0ZS5wbGF5ZXIub3duZWRJdGVtcy5pbmRleE9mKCdyYWRpbycpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zdG9wUmFkaW8oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sIDIwMDApO1xuXHR9XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
