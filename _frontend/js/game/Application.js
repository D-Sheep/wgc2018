class Application extends PIXI.Application {
	constructor(...args) {
		super(...args);

		this.sky = new PIXI.Graphics();
		this.sky.beginFill(0xc4e1ea, 1);
		this.sky.drawRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
		this.sky.endFill();
		this.stage.addChild(this.sky);

		this.mushroomMode = false;

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
				value: Math.min(MAX_HUNGER, GameApp.vue.$store.state.player.stats.hunger + 3)
			});

			if (GameApp.vue.$store.state.player.stats.hunger >= MAX_HUNGER) {
				clearInterval(this.hungerInterval);
				eventHub.$emit('gameOver', {
					reason: 'You starved to death'
				});
			}
		}, 1000);
	}

	enableMushroomMode() {
		this.stage.filters = [
			this.zoomBlurFilter,
			this.rgbSplitFilter,
			this.shockwaveFilter
		];

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
		TweenMax.to(this.rgbSplitFilter.red, 1, {x: 0, y: 0});
		TweenMax.to(this.rgbSplitFilter.green, 1, {x: 0, y: 0});
		TweenMax.to(this.shockwaveFilter, 1, {amplitude: 0});
		TweenMax.to(this.zoomBlurFilter, 1, {
			strength: 0, onComplete: () => {
				this.stage.filters = [];
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
}