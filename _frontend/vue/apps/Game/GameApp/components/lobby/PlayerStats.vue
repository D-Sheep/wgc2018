<template>
	<div class="player__stats">
		<ul class="player__stats-graph">
			<li v-for="(value, slug) in stats" :style="{height: getStatBarHeight(value)}">
				{{ value }}
				<span :title="slug">{{ slug.slice(0, 1) }}</span>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
	.player {
		&__stats {
			position: fixed;
			bottom: 10px;
			height: 300px;
			width: 150px;
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
				color: white;

				max-height: calc(100% - 6px);
				min-height: 15%;
				width: calc(25% - 4px);

				padding: 2px;
				margin: 0 2px;

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
		methods: {
			getStatBarHeight(value) {
				return (15 + 85 * value / 100) + '%';
			}
		}
	}
</script>