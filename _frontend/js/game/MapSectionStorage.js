class MapSectionStorage {
	constructor() {
		this._storage = new Map();
	}

	//======================================================

	loadMapSections() {
		return new Promise((resolve) => {
			const loader = new PIXI.loaders.Loader();

			loader.add('start', 'assets/map_sections/start.json');
			loader.add('musicband', 'assets/map_sections/musicband.json');
			loader.add('city01', 'assets/map_sections/city01.json');
			loader.add('city02', 'assets/map_sections/city02.json');
			loader.add('city03', 'assets/map_sections/city03.json');
			loader.add('finish', 'assets/map_sections/finish.json');

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