<template>
	<div class="player__stats">

		<div class="player__stats-navigation">
			<navigation :navigation-items="{shop: 'Shop', gym: 'Gym'}"/>
		</div>

		<ul class="player__stats-graph">

			<li v-for="(value, slug) in stats" :style="{height: getStatBarHeight(value)}">
				{{ value }}
				<span :title="slug">{{ slug.slice(0, 1) }}</span>
			</li>

		</ul>

	</div>
</template>

<style lang="scss" scoped>
	.player__stats {
		position: fixed;
		width: 100%;
		height: 162px;
		bottom: 0;

		&-navigation {
			background: white;

			border-top: 2px solid black;
			border-right: 2px solid black;
			position: absolute;
			bottom: 0;
			right: 0;
			width: calc(100% - 204px);
			height: 50px;
		}

		&-graph {
			background: white;

			border-top: 2px solid black;
			border-left: 2px solid black;
			border-right: 2px solid black;

			position: absolute;
			height: calc(100% - 4px);
			width: 200px;

			list-style-type: none;
			padding: 2px 0;
			margin: 0;

			display: inline-flex;
			align-items: flex-end;

			li {
				transition: ease height .3s;
				color: white;

				max-height: calc(100% - 16px);
				min-height: 20%;
				width: calc(25% - 16px);

				padding: 2px;
				margin: 6px 8px;

				border: 1px solid black;

				vertical-align: bottom;
				background: #007cff;

				display: inline-flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'PlayerStats',
		props: ['stats'],
		components: {
			navigation: require('./Navigation.vue')
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
		methods: {
			getStatBarHeight(value) {
				return (20 + 80 * value / 100) + '%';
			},
		}
	}
</script>