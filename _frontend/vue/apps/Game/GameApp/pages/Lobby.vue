<template>
	<div class="vue-app">
		<div class="overlay-spacer"></div>
		<overlay/>
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	module.exports = {
		name: 'Lobby',
		components: {
			overlay: require('../components/Overlay.vue'),
		},
		data() {
			return {
				isLoading: false,
			};
		},
		mounted() {
		}
	}
</script>
