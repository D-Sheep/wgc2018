<template>
	<div class="player__states">
		<ul>
			<li>Lives: {{ lives }}</li>
			<li v-for="(value, slug) in states">
				{{ slug + ': ' + value }}
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
	.player {
		&__states {
			position: fixed;
			top: 10px;
			right: 10px;

			ul {
				padding: 0;
				margin: 0;
				list-style-type: none;
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'PlayerStates',
		props: ['states', 'lives'],
	}
</script>