<template>
	<div class="vue-app">
		<div class="logo"></div>
		<div class="play-button" @click.prevent="route = 'stage'"></div>
		<div class="help-button"></div>
	</div>
</template>

<style lang="scss" scoped>
	.vue-app {
		margin: 0;
		padding: 0;

		width: 100%;
		height: 100%;

		background-image: url('assets/img/title.png');
		background-position: 50% 50%;
		background-repeat: no-repeat;

		.play-button {
			position: absolute;

			top: 494px;
			right: 364px;

			width: 527px;
			height: 154px;
			background-image: url('assets/img/play_button.png');

			&:hover {
				cursor: pointer;
			}
		}

		.help-button {
			position: absolute;

			top: 696px;
			right: 446px;

			width: 368px;
			height: 107px;
			background-image: url('assets/img/help_button.png');

			&:hover {
				cursor: pointer;
			}
		}

		.logo {
			position: absolute;

			top: 123px;
			right: 330px;

			width: 598px;
			height: 296px;

			background-image: url('assets/img/logo.png');
		}
	}
</style>

<script>
	module.exports = {
		name: 'Welcome',
		computed: {
			route: {
				get() {
					return this.$store.state.route;
				},
				set($event) {
					this.$store.commit('navigateTo', $event);
				}
			},
		}
	}
</script>