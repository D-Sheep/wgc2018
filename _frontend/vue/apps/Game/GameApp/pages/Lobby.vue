<template>
	<div class="vue-app">
		<scene/>
		<player-stats :stats="player.stats"/>
		<player-states :states="player.states" :lives="player.ownedItems.length"/>
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	module.exports = {
		name: 'Lobby',
		components: {
			'player-stats': require('../components/lobby/PlayerStats.vue'),
			'player-states': require('../components/lobby/PlayerStates.vue'),
			scene: require('../components/lobby/Scene.vue')
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
