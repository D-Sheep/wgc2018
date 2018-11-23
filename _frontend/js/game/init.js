const application = new Application({
    view: document.getElementById('app-canvas')
});
const assetStorage = new AssetStorage();
const controls = new Controls();

assetStorage.loadSprites().then(() => {
    const player = new Player(assetStorage.get('sheep'));
    player.position.set(200, 600);
    application.stage.addChild(player);
});

