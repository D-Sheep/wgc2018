<template>
	<div class="content">
		<navigation :navigation-items="{shop: 'Shop', gym: 'Gym'}"/>
	</div>
</template>

<style lang="scss" scoped>
	.content {
		padding: 0;
		margin: 0;
	}
</style>

<script>
	module.exports = {
		name: 'Scene',
		components: {
			navigation: require('./Navigation.vue')
		}
	}
</script>