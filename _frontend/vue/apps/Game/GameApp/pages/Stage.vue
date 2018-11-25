<template>
	<div class="vue-app">
		<canvas ref="canvas" id="app-canvas"></canvas>
		<popup
			v-if="displayPopup"
			@closePopup="closePopup"
		/>
	</div>
</template>

<style lang="scss" scoped>
</style>

<script>
	module.exports = {
		name: 'Stage',
		components: {
			popup: require('../components/stage/Popup.vue')
		},
		computed: {
			route: {
				get() {
					return this.$store.state.route;
				},
				set($event) {
					this.$store.commit('navigateTo', $event);
				}
			},
		},
		data() {
			return {
				isLoading: false,
				displayPopup: false,
			};
		},
		watch: {},
		mounted() {
			this.$store.dispatch('fetchAssets').then(() => {
				window.controls = new Controls();
				window.application = new Application({
					view: this.$refs.canvas,
					width: VIEW_WIDTH,
					height: VIEW_HEIGHT
				});
				window.camera = new Camera();
				window.collisionManager = new CollisionManager();
				window.player = new Player(assetStorage.getAnimatedTexture('Player'));
				window.player.position.set(200, 400);
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

				const bgNoise = window.assetStorage.getSound('city');
				bgNoise.loop = true;
				bgNoise.play();
			});

			this.setupEventListeners();
		},
		methods: {
			setupEventListeners() {
				window.eventHub.$on('levelFinished', () => {
					this.displayPopup = true;
					window.controls.disableControls();
				});
			},
			closePopup() {
				if (this.displayPopup) {
					this.route = 'lobby';
				}
			}
		}
	}
</script>
