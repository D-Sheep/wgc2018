<template>
	<div class="vue-app">
		<canvas ref="canvas" id="app-canvas"></canvas>
	</div>
</template>

<style lang="scss" scoped>
</style>

<script>
	module.exports = {
		name: 'Stage',
		data() {
			return {
				isLoading: false,
			};
		},
		watch: {
		    '$store.state.player.stats': {
		        handler(newVal) {
		            window.stats.update(newVal);
				},
		        deep: true
			}
		},
		mounted() {
            window.assetStorage = new AssetStorage();
            window.mapSectionStorage = new MapSectionStorage();
            window.controls = new Controls();
            window.application = new Application({
                view: this.$refs.canvas,
                width: VIEW_WIDTH,
                height: VIEW_HEIGHT
            });
            window.camera = new Camera();
            window.collisionManager = new CollisionManager();
            window.stats = new Stats();
            window.player = null;
            Promise.all([
                assetStorage.loadSprites(),
                mapSectionStorage.loadMapSections()
			]).then(() => {
                window.stats.update(this.$store.state.player.stats);

                window.player = new Player(assetStorage.get('sheep'));
                window.player.position.set(200, 600);
                application.world.addChild(window.player);

                for (let i = 0; i < 5; i++) {
                    const mapSection = new MapSection();
                    mapSection.useSection('city01');
                    application.addMapSection(mapSection);
                }

            });
        },
		methods: {}
	}
</script>
