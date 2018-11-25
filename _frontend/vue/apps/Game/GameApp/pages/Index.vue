<template>
	<div class="vue-container">
		<navigation v-if="isDebug"/>
		<welcome v-if="route === 'index'"/>
		<stage v-if="route === 'stage'"/>
		<lobby v-if="route === 'lobby'"/>
		<shop v-if="route === 'shop'"/>
		<gym v-if="route === 'gym'"/>
		<overlay v-if="route !== 'index'"/>
	</div>
</template>

<style lang="scss" scoped>
	.vue-container {
		width: 1920px;
		height: 1080px;
		position: relative;
	}
</style>

<script>
	module.exports = {
		name: 'Index',
		components: {
			navigation: require('../../../../components/Navigation.vue'),
			overlay: require('../components/Overlay.vue'),
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
			window.assetStorage = new AssetStorage();
			window.mapSectionStorage = new MapSectionStorage();

			this.$store.dispatch('fetchAssets');
			this.$store.commit('updatePlayerState', {state: 'money', value: 0});

		},
		methods: {}
	}
</script>
