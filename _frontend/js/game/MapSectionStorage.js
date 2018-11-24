class MapSectionStorage {
    constructor() {
        this._storage = new Map();
    }

    //======================================================

    loadMapSections() {
        return new Promise((resolve) => {
            const loader = new PIXI.loaders.Loader();

            loader.add('city01', 'assets/map_sections/city01.json');

            loader
                .load((ldr, resources) => {
                    Object.keys(resources).forEach((res) => {
                        this._storage.set(res, resources[res].data);
                    });
                    loader.destroy();
                    resolve();
                });
        });
    }

    get(assetName) {
        return this._storage.get(assetName);
    }
}