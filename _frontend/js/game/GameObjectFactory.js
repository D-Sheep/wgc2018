class GameObjectFactory {
    static create(type, data) {
        const objectClass = GameObjectFactory.classList[type];
        const textures = objectClass.isAnimated ? assetStorage.getAnimated(type) : [assetStorage.get(type)];
        return new objectClass(textures, data);
    }
}

GameObjectFactory.classList = {
    'AirConditioning': AirConditioning,
    'GreenTurtle': GreenTurtle,
    'RedTurtle': RedTurtle,
    'Coins': Coins,
    'FinishHouse': FinishHouse,
    'Finish': Finish
};