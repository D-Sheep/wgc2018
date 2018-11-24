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
			object.position.set(...objectData.position);
			this.addChild(object);
		});
		section.ledges.forEach((ledgeData) => {
			const ledge = new Ledge(...ledgeData.position, ledgeData.length);
			this.ledges.push(ledge);
			this.addChild(ledge);
		});
		section.blocks.forEach((blockData) => {
			const block = new Block(...blockData.position, ...blockData.size);
			this.blocks.push(block);
			this.addChild(block);
		});
	}
}