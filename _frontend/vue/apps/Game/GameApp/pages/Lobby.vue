<template>
	<div class="vue-app">
		<navigation v-if="isDebug"/>
		<div class="player__states">
			<ul>
				<li v-for="(value, slug) in player.states">
					{{ slug + ': ' + value }}
				</li>
			</ul>
		</div>
		<div class="player__stats">
			<ul class="player__stats-graph">
				<li v-for="(value, slug) in player.stats" :style="{height: getStatBarHeight(value)}">
					{{ value }}
					<span>{{ slug.slice(0, 1) }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.player {
		&__states {
			position: fixed;
			top: 10px;
			right: 10px;
		}

		&__stats {
			position: fixed;
			bottom: 10px;
			background: red;
			height: 300px;
			width: 200px;
		}

		&__stats-graph {
			position: relative;

			list-style-type: none;
			padding: 2px 0;
			margin: 0;

			height: calc(100% - 4px);

			display: flex;
			align-items: flex-end;

			li {
				max-height: calc(100% - 6px);
				min-height: 15%;
				width: 30px;

				padding: 2px;
				margin: 0 2px;

				border: 1px solid black;

				vertical-align: bottom;
				background: blue;

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
		name: 'Lobby',
		components: {
			'navigation': require('../../../../components/Navigation.vue')
		},
		data() {
			return {
				isDebug: window.ENV.isDebug,
				isLoading: false,
			};
		},
		computed: {
			player() {
				return this.$store.state.player;
			}
		},
		mounted() {
		},
		methods: {
			getStatBarHeight(value) {
				return (15 + 85 * value / 100) + '%';
			}
		}
	}
</script>
