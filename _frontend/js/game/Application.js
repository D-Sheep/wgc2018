class Application extends PIXI.Application {
	constructor(...args) {
		super(...args);

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

		this.ticker.add(() => {
			this.clouds.tilePosition.x -= 0.5;
		});
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