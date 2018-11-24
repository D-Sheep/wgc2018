<template>
	<div class="vue-container">
		<navigation v-if="isDebug"/>
		<welcome v-if="route === 'index'"/>
		<stage v-if="route === 'stage'"/>
		<lobby v-if="route === 'lobby'"/>
		<shop v-if="route === 'shop'"/>
		<gym v-if="route === 'gym'"/>
	</div>
</template>

<style lang="scss" scoped>
</style>

<script>
	module.exports = {
		name: 'Index',
		components: {
			navigation: require('../../../../components/Navigation.vue'),
			welcome: require('./Welcome.vue'),
			stage: require('./Stage.vue'),
			lobby: require('./Lobby.vue'),
			shop: require('./Shop.vue'),
			gym: require('./Gym.vue')
		},
		data() {
			return {
				isLoading: false,
				isDebug: window.ENV.isDebug
			};
		},
		computed: {
			route: {
				get() {
					return this.$store.state.route;
				},
				set($event) {
					this.$store.commit('navigateTo', $event);
				}
			}
		},
		mounted() {
			this.$store.commit('updatePlayerState', {state: 'money', value: 40});
			this.$store.commit('updatePlayerStat', {stat: 'hunger', value: 91});
		},
		methods: {}
	}
</script>
