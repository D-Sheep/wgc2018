<template>
	<div class="vue-app">
		<canvas ref="canvas" id="app-canvas"></canvas>
		<popup
			v-if="displayPopup"
			@closePopup="closePopup"
		/>
		<div class="app__hospitalized" v-if="displayHospitalized">
			<img class="app__hospitalized-heading" src="assets/img/Hospitalized.png" alt="">
			<div class="app__hospitalized-texts">
				<p class="app__hospitalized-reason">{{hospitalizedReason}}</p>
				<p v-if="canAffordHospitalization" class="app__hospitalized-text">Hospital costs: $40</p>
				<p v-else class="app__hospitalized-text">No money to pay bills.<br>Reposession imminent.</p>

			</div>

		</div>
	</div>
</template>

<style lang="scss" scoped>
	#app-canvas {
		display: block;
	}

	.app__hospitalized {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(#204361, 0.8);

		color: #ffffff;

		&-texts {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%);
			font-size: 60px;
			text-align: center;
		}

		&-reason {
			font-size: 60px;
			margin-bottom: 1.5em;
		}

		&-text {
			font-size: 40px;
			line-height: 1.5em;
		}

		&-heading {
			position: absolute;
			top: 30%;
			left: 50%;
			transform: translateX(-50%);
		}
	}
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

			canAffordHospitalization() {
				return this.$store.state.player.states.money >= 40;
			}
		},
		data() {
			return {
				isLoading: false,
				displayPopup: false,
				displayHospitalized: false,
				hospitalizedReason: ''
			};
		},
		watch: {
			'$store.state.player.stats.injury'(newVal) {
				if (newVal >= MAX_INJURY) {
					window.eventHub.$emit('hospitalized', {
						reason: 'You were severely injured.'
					});
				}
			},

			'$store.state.player.stats.hunger'(newVal) {
				if (newVal >= MAX_HUNGER) {
					window.eventHub.$emit('hospitalized', {
						reason: 'You almost starved to death.'
					});
				}
			}
		},
		beforeDestroy() {
			window.application.destroy();
		},
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

				const sections = [
					'city01',
					'city02',
					'city03',
					'city04',
					'city05'
                ];

				let mapSection = new MapSection();
				mapSection.useSection('start');
				application.addMapSection(mapSection);

				const countBefore = Helpers.rnd(5, 10);
				for (let i = 0; i < countBefore; i++) {
					mapSection = new MapSection();
					mapSection.useSection(Helpers.choose(sections));
					application.addMapSection(mapSection);
                }

				mapSection = new MapSection();
				mapSection.useSection('musicband');
				application.addMapSection(mapSection);

				const countAfter = Helpers.rnd(5, 10);
				for (let i = 0; i < countAfter; i++) {
					mapSection = new MapSection();
					mapSection.useSection(Helpers.choose(sections));
					application.addMapSection(mapSection);
				}

				mapSection = new MapSection();
				mapSection.useSection('finish');
				application.addMapSection(mapSection);

				application.world.addChild(window.player);

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
					clearTimeout(window.application.hungerInterval);
				});

				window.eventHub.$on('hospitalized', (data) => {
					window.controls.disableControls();
					this.displayHospitalized = true;
					this.hospitalizedReason = data.reason;
					clearInterval(window.application.hungerInterval);

					setTimeout(() => {
						this.healPlayer();
						if (this.canAffordHospitalization) {
							this.$store.commit('updatePlayerState', {
								state: 'money',
								value: this.$store.state.player.states.money - 40
							});
						} else {
							this.$store.commit('pendingReposession', true);
						}
						this.route = 'lobby';
					}, 4000);
				});
			},
			closePopup() {
				if (this.displayPopup) {
					this.route = 'lobby';
				}
			},
			healPlayer() {
				this.$store.commit('updatePlayerStat', {
					stat: 'injury',
					value: 0
				});
				this.$store.commit('updatePlayerStat', {
					stat: 'hunger',
					value: 0
				});
			}
		}
	}
</script>
