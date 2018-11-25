<template>
	<div class="vue-app">
		<canvas ref="canvas" id="app-canvas"></canvas>
		<div class="overlay-spacer"></div>
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	module.exports = {
		name: 'Lobby',
		data() {
			return {
				isLoading: false,
			};
		},
		computed: {
			player() {
				return this.$store.state.player;
			}
		},
		beforeDestroy() {
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
					x: 835,
					y: 884
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
