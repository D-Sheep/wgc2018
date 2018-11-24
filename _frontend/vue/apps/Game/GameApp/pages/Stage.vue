<template>
	<div class="vue-app">
		<navigation/>
		<canvas ref="canvas" id="app-canvas"></canvas>
	</div>
</template>

<style lang="scss" scoped>
</style>

<script>
	module.exports = {
		name: 'Stage',
		components: {
			'navigation': require('../../../../components/Navigation.vue')
		},
		data() {
			return {
				isLoading: false,
			};
		},
		mounted() {
            window.assetStorage = new AssetStorage();
            window.controls = new Controls();
            window.application = new Application({
                view: this.$refs.canvas,
                width: ROOM_WIDTH,
                height: ROOM_HEIGHT
            });
            assetStorage.loadSprites().then(() => {
                const player = new Player(assetStorage.get('sheep'));
                player.position.set(200, 600);
                application.stage.addChild(player);
            });
        },
		methods: {}
	}
</script>
