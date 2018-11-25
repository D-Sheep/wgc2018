<template>
	<div class="vue-app">
		<div class="buttons">
			<div class="gym" @click="route = 'gym'"></div>
			<div class="shop" @click="route = 'shop'"></div>
		</div>
		<canvas ref="canvas" id="app-canvas"></canvas>
		<div class="app__game-over" v-if="displayGameOver">
			<img class="app__game-over-heading" src="assets/img/GameOver.png" alt="">
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.app__game-over {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(#204361, 0.8);

		&-heading {
			position: absolute;
			top: 30%;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.buttons {
		position: absolute;

		.gym,
		.shop {
			margin: 25px;
			cursor: pointer;

			width: 421px;
			height: 147px;
		}

		.gym {
			background-image: url('assets/img/lobby/gym.png');
		}

		.shop {
			background-image: url('assets/img/lobby/shop.png');
		}
	}
</style>

<script>
	module.exports = {
		name: 'Lobby',
		data() {
			return {
				isLoading: false,
				displayGameOver: false
			};
		},
		computed: {
			player() {
				return this.$store.state.player;
			},
			route: {
				get() {
					return this.$store.state.route;
				},
				set($event) {
					this.$store.commit('navigateTo', $event);
				}
			}
		},
		beforeDestroy() {
			window.application.stopRadio();
			window.application.destroy();
		},
		mounted() {
			this.$store
				.dispatch('fetchAssets')
				.then(() => {
					window.application = new LobbyApplication({
						view: this.$refs.canvas,
						width: VIEW_WIDTH,
						height: VIEW_HEIGHT
					});

					this.placeItems();
				});

			window.eventHub.$on('lobby.itemRemoved', () => {
				this.placeItems();
			});

			window.eventHub.$on('gameOver', () => {
				this.displayGameOver = true;
				setTimeout(() => {
					this.$store.commit('setPlayerItems', BASE_ITEMS.slice());
					this.route = 'index';
				}, 2000);
			});
		},
		methods: {
			playerHasItem(slug) {
				return this.player.ownedItems.indexOf(slug) !== -1;
			},
			placeItems() {
				window.application.itemContainer.removeChildren();

				window.application.displayOwnedItem('Fridge', {
					x: 1660,
					y: 650
				});

				window.application.displayOwnedItem('Hat', {
					x: 825,
					y: 854
				});

				window.application.displayOwnedItem('Telescope', {
					x: 469,
					y: 436
				});

				window.application.displayOwnedItem('Table', {
					x: 16,
					y: 716
				});

				window.application.displayOwnedItem('Chair', {
					x: 147,
					y: 809
				});

				window.application.displayOwnedItem('Picture', {
					x: 1180,
					y: 293
				});

				const radioPos = this.playerHasItem('table') ?
					{x: 222, y: 532} :
					{x: 222, y: 781};

				window.application.displayOwnedItem('Radio', radioPos);

				const lampPos = this.playerHasItem('table') ?
					{x: -28, y: 537} :
					{x: -28, y: 781};

				window.application.displayOwnedItem('Lamp', lampPos);

				const fanPos = this.playerHasItem('fridge') ?
					{x: 1690, y: 438} :
					{x: 1690, y: 741};

				window.application.displayOwnedItem('Fan', fanPos);

				window.application.displayOwnedItem('Plushie', {
					x: 1100,
					y: 617
				});
			}
		}
	}
</script>
