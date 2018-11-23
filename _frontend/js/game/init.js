const application = new Application({
    view: document.getElementById('app-canvas')
});
const assetStorage = new AssetStorage();

assetStorage.loadSprites().then(() => {
    const sheepSprite = new PIXI.Sprite(assetStorage.get('sheep'));
    application.stage.addChild(sheepSprite);
});

