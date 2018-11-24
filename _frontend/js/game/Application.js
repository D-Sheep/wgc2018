class Application extends PIXI.Application {
    constructor(...args) {
        super(...args);

        this.hud = new PIXI.Container();
        this.hud.name = 'hud';
        this.world = new PIXI.Container();
        this.world.name = 'world';

        this.stage.addChild(this.world);
        this.stage.addChild(this.hud);
    }
}