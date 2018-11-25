<template>
	<div class="vue-app">
		<div class="play-button">
			play
		</div>
		<div class="help-button">
			help
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.vue-app {
		margin: 0;
		padding: 0;

		width: 100%;
		height: 100vh;

		background-image: url('assets/img/title.png');
		background-position: 50% 50%;
		background-repeat: no-repeat;
		background-size: contain;

		.play-button {
			padding: 0;
			color: #fff;
			text-align: center;
			text-transform: uppercase;
			font-weight: bold;
			background-color: #f09c7a;
			font-size: 75pt;
			line-height: 152px;
			width: 530px;
			border-radius: 50px;
			height: 152px;

			&:hover {
				cursor: pointer;
				background-color: darken(#f09c7a, 3%);
			}
		}

		.help-button {
			padding: 0;
			border: 6px solid #65869e;
			border-radius: 50px;
			font-size: 46pt;
			color: #65869e;
			line-height: 108px;
			text-transform: uppercase;
			text-align: center;

			width: 370px;
			height: 108px;

			&:hover {
				cursor: pointer;
				color: darken(#65869e, 3%);
				border: 6px solid darken(#65869e, 3%);
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'Welcome'
	}
</script>