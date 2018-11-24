class AssetStorage {
    constructor() {
        this._storage = new Map();
    }

    //======================================================

    loadSprites() {
        return new Promise((resolve) => {
            const loader = new PIXI.loaders.Loader();

            loader.add('sheep', 'assets/img/sheep.png');
            loader.add('AirConditioning', 'assets/img/AirConditioning.png');
            loader.add('GreenTurtle', 'assets/img/GreenTurtle.png');
            loader.add('Coins', 'assets/img/Coins.png');

            loader
                .load((ldr, resources) => {

                    Object.keys(resources).forEach((res) => {
                        this._storage.set(res, resources[res].texture);

                        const animatedMatches = res.match(/animated:([-\w\/]+):(\d+)/);

                        if (animatedMatches) {
                            let animatedSprites = null;
                            if (!this._storage.has('animated:' + animatedMatches[1])) {
                                animatedSprites = [];
                                this._storage.set('animated:' + animatedMatches[1], animatedSprites);
                            } else {
                                animatedSprites = this._storage.get('animated:' + animatedMatches[1]);
                            }

                            animatedSprites[animatedMatches[2]] = resources[res].texture;
                        }
                    });
                    loader.destroy();
                    resolve();
                })
            ;
        });
    }

    get(assetName) {
        if (!this._storage.has(assetName)) {
            return PIXI.Texture.WHITE;
        }
        return this._storage.get(assetName);
    }

    getAnimated(assetName) {
        return this._storage.get('animated:' + assetName);
    }
}
