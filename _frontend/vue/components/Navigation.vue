<template>
	<nav>
		<router-link :to="{name: 'index'}">Index</router-link>
		<router-link :to="{name: 'lobby'}">Lobby</router-link>
		<router-link :to="{name: 'stage'}">Stage</router-link>
	</nav>
</template>

<style lang="scss" scoped>

</style>

<script>
	module.exports = {
		name: 'Navigation',
	}
</script>