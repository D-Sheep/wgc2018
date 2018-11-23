<template>
	<div class="vue-app">
		<navigation/>
		Hello Lobby
	</div>
</template>

<style lang="scss" scoped>
</style>

<script>
	module.exports = {
		name: 'Lobby',
		components: {
			'navigation': require('../../../../components/Navigation.vue')
		},
		data() {
			return {
				isLoading: false,
			};
		},
		mounted() {
		},
		methods: {}
	}
</script>
