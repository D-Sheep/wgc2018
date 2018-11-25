class AssetStorage {
	constructor() {
		this._textureStorage = new Map();
		this._soundStorage = new Map();
	}

	//======================================================

	loadTextures() {
		return new Promise((resolve) => {
			const loader = new PIXI.loaders.Loader();

			loader.add('sheep', 'assets/img/sheep.png');
			loader.add('AirConditioning', 'assets/img/AirConditioning.png');
			loader.add('GreenTurtle', 'assets/img/GreenTurtle.png');
			loader.add('RedTurtle', 'assets/img/RedTurtle.png');
			loader.add('Coins', 'assets/img/Coins.png');
			loader.add('animated:Player:0', 'assets/img/Player0.png');
			loader.add('animated:Player:1', 'assets/img/Player1.png');
			loader.add('animated:Player:2', 'assets/img/Player2.png');
			loader.add('animated:Player:3', 'assets/img/Player3.png');
			loader.add('Player-static', 'assets/img/Player-static.png');

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

			loader
				.load((ldr, resources) => {
					Object.keys(resources).forEach((res) => {
						this._soundStorage.set(res, resources[res].data);
						console.log(resources[res]);
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
