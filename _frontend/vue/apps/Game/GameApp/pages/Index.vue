<template>
	<div class="vue-app">
		<navigation/>
		<welcome v-if="route === 'index'"/>
		<lobby v-if="route === 'lobby'"/>
		<stage v-if="route === 'stage'"/>
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
			lobby: require('./Lobby.vue'),
			stage: require('./Stage.vue')
		},
		data() {
			return {
				isLoading: false,
			};
		},
		computed: {
			route: {
				get() {
					return this.$store.state.route;
				},
				set($event) {
					this.$store.commit('updateRoute', $event);
				}
			}
		},
		mounted() {
		},
		methods: {}
	}
</script>
