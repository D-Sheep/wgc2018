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
	'CityBuildingNarrow': CityBuildingNarrow
};