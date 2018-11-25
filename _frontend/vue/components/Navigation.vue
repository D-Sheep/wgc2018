<template>
	<nav class="navigation">
		<a href="#" @click.prevent="route = slug" v-for="slug in routes">{{ slug }}</a>
	</nav>
</template>

<style lang="scss" scoped>
	.navigation {
		a {
			margin-right: 5px;
			font-size: 24px;

			&:last-child {
				margin-right: 0;
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'Navigation',
		data() {
			return {
				routes: ROUTES
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
		}
	}
</script>