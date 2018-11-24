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
            window.controls = new Controls();
            window.application = new Application({
                view: this.$refs.canvas,
                width: ROOM_WIDTH,
                height: ROOM_HEIGHT
            });
            window.stats = new Stats();
            assetStorage.loadSprites().then(() => {
                const player = new Player(assetStorage.get('sheep'));
                player.position.set(200, 600);
                application.world.addChild(player);
                window.stats.update(this.$store.state.player.stats);
            });
        },
		methods: {}
	}
</script>
