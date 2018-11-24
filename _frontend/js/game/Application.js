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
        this.ledges = [];
        this.blocks = [];
    }

    addMapSection(section) {
        this.mapSections.push(section);
        this.world.addChild(section);
        section.x = this.worldWidth;
        section.ledges.forEach((ledge) => {
            ledge.x += this.worldWidth;
            this.ledges.push(ledge);
        });
        section.blocks.forEach((block) => {
            this.blocks.push(block);
        });

        this.worldWidth += section.sectionWidth;
    }

    getGameObjects() {
        return this.mapSections.reduce((res, section) => res.concat(section.children), []);
    }

    getLedges() {
        return this.ledges;
    }

    getBlocks() {
        return this.blocks;
    }
}