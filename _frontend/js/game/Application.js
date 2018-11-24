class Application extends PIXI.Application {
    constructor(...args) {
        super(...args);

        this.hud = new PIXI.Container();
        this.hud.name = 'hud';
        this.world = new PIXI.Container();
        this.world.name = 'world';

        this.stage.addChild(this.world);
        this.stage.addChild(this.hud);

        this.mapSections = [];
        this.worldWidth = 0;
    }

    addMapSection(section) {
        this.mapSections.push(section);
        section.x = this.worldWidth;
        this.worldWidth += section.sectionWidth;
        this.world.addChild(section);
    }

    getGameObjects() {
        return this.mapSections.reduce((res, section) => res.concat(section.children), []);
    }
}