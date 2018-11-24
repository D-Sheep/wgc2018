<template>
	<div class="navigation">
		<ul>
			<li @click.prevent="route = item" v-for="(label, item) in navigationItems">{{ label }}</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
	.navigation {
		padding: 0;
		margin: 0;

		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;

		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;

			li {
				cursor: pointer;
				width: 250px;
				height: 50px;
				border: 2px solid burlywood;
				text-align: center;
				text-transform: uppercase;
				line-height: 50px;
				font-size: 30px;
				border-radius: 3px;
				margin: 10px;

				&:hover {
					background: darken(white, 10%);
				}
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'Navigation',
		props: ['navigationItems'],
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