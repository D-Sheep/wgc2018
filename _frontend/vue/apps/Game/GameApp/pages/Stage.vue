<template>
	<div class="vue-app">
		<navigation/>
		Hello Stage
	</div>
</template>

<style lang="scss" scoped>
</style>

<script>
	module.exports = {
		name: 'Stage',
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
