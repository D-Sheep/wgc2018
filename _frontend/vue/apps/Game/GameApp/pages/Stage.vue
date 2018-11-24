<template>
	<div class="vue-app">
		<navigation/>
		<canvas id="app-canvas"></canvas>
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
            window.application = new Application({
                view: document.getElementById('app-canvas')
            });
            window.assetStorage = new AssetStorage();
            window.controls = new Controls();

            assetStorage.loadSprites().then(() => {
                const player = new Player(assetStorage.get('sheep'));
                player.position.set(200, 600);
                application.stage.addChild(player);
            });

        },
		methods: {}
	}
</script>
