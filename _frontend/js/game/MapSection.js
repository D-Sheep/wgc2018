class MapSection extends PIXI.Container {
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
}