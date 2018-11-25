<template>
	<div class="popup">
		<div class="popup-header">
			Level Complete!
		</div>
		<div class="popup-summary">
			<ul>
				<li>You got {{ summary.money }} coins</li>
				<li>You suffered {{ summary.injury }} damage</li>
			</ul>
		</div>
		<a
			href="#"
			class="popup-close"
			@click.prevent="$emit('closePopup')"
		>
			Continue
		</a>
	</div>
</template>

<style lang="scss" scoped>
	.popup {
		position: absolute;

		background: white;
		height: 80vh;
		width: 400px;

		top: 50px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;

		border: 4px solid black;
		border-radius: 3px;

		&-summary {
			text-align: center;

			ul {
				list-style-type: none;
				padding: 0;
				margin: 0;
			}
		}

		&-header {
			padding: 30px 0;
			width: 100%;
			text-align: center;
			font-size: 35px;
		}

		&-close {
			display: block;
			text-align: center;
			width: 100%;

			margin-top: 15px;
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