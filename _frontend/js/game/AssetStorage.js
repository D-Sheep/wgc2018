class AssetStorage {
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
			loader.add('AirConditioning', 'assets/img/AirConditioning.png');
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
