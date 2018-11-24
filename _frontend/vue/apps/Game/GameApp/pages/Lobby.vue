<template>
	<div class="vue-app">
		<player-stats :stats="player.stats"/>
		<player-states :states="player.states"/>
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	module.exports = {
		name: 'Lobby',
		components: {
			'player-stats': require('../components/lobby/PlayerStats.vue'),
			'player-states': require('../components/lobby/PlayerStates.vue')
		},
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
		mounted() {
		}
	}
</script>
