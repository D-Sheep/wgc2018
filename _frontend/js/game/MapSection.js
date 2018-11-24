class MapSection extends PIXI.Container {
    constructor() {
        super();
    }

    useSection(name) {
        this.name = name;
        const section = mapSectionStorage.get(name);
        section.objects.forEach((objectData) => {
             const object = GameObjectFactory.create(objectData.type, objectData);
             object.position.set(...objectData.position);
             this.addChild(object);
        });
        this.sectionWidth = section.width;
    }
}