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
		},
		mounted() {
            window.controls = new Controls();
            window.application = new Application({
                view: this.$refs.canvas,
                width: VIEW_WIDTH,
                height: VIEW_HEIGHT
            });
            window.camera = new Camera();
            window.collisionManager = new CollisionManager();
            window.player = null;

            this.$store.dispatch('fetchAssets').then(() => {
                window.player = new Player(assetStorage.get('sheep'));
                window.player.position.set(200, 600);
                application.world.addChild(window.player);

                let mapSection = new MapSection();
                mapSection.useSection('start');
                application.addMapSection(mapSection);

                for (let i = 0; i < 2; i++) {
                    mapSection = new MapSection();
                    mapSection.useSection('city01');
                    application.addMapSection(mapSection);
                }

                mapSection = new MapSection();
                mapSection.useSection('finish');
                application.addMapSection(mapSection);

            });
        },
		methods: {}
	}
</script>
