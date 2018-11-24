<template>
	<div class="overlay">
		<player-stats :stats="player.stats"/>
		<player-states :states="player.states" :lives="player.ownedItems.length"/>
	</div>
</template>

<style lang="scss" scoped>

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