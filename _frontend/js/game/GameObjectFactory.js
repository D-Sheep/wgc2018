class GameObjectFactory {
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
	'Coins': Coins,
	'FinishHouse': FinishHouse,
	'Finish': Finish,
	'RedMushroom': RedMushroom
};