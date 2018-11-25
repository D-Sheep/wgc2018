<template>
	<div class="level__complete">
		<img class="level__complete-heading" src="assets/img/level_complete.png" alt="">
		<div class="level__complete-texts">
			<ul>
				<li>You got {{ summary.money }} coins</li>
				<li>You suffered {{ summary.injury }} damage</li>
			</ul>
		</div>
		<div class="level__complete-continue" @click="$emit('closePopup')">

		</div>
	</div>
</template>

<style lang="scss" scoped>
	.level__complete {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(#204361, 0.8);

		color: #ffffff;

		&-texts {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%);
			font-size: 60px;
			text-align: center;

			ul {
				padding: 0;
				margin: 0;
				list-style-type: none;
			}
		}

		&-reason {
			font-size: 60px;
			margin-bottom: 1.5em;
		}

		&-text {
			font-size: 40px;
			line-height: 1.5em;
		}

		&-heading {
			position: absolute;
			top: 30%;
			left: 50%;
			transform: translateX(-50%);
		}

		&-continue {
			position: absolute;

			bottom: 200px;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;

			background-image: url('assets/img/continue.png');
			width: 491px;
			height: 112px;

			&:hover {
				cursor: pointer;
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'Popup',
		computed: {
			summary() {
				return window.player.summary;
			}
		}
	}
</script>