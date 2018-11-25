class AirConditioning extends GameObject {
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

/*AirConditioning.isAnimated = true;*/