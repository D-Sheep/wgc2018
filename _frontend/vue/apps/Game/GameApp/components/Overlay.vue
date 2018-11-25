<template>
	<div class="overlay">
		<player-stats :stats="player.stats" :states="player.states" :lives="player.ownedItems.length"/>
	</div>
</template>

<style lang="scss" scoped>
	.overlay {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		pointer-events: none;
	}
</style>

<script>
	module.exports = {
		name: 'Overlay',
		components: {
			'player-stats': require('./PlayerStats.vue'),
			'player-states': require('./PlayerStates.vue')
		},
		computed: {
			player() {
				return this.$store.state.player;
			},
		},
	}
</script>