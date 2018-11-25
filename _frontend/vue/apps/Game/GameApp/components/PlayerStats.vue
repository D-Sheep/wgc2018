<template>
	<div class="player__stats">
		<div class="player__stats-item" v-for="(value, slug) in stats">
			<span class="player__stats-icon" :class="'player__stats-icon--' + slug"></span>
			<span class="player__stats-bar-wrap">
				<span class="player__stats-bar" :style="{width: getStatBarWidth(value)}"></span>
			</span>
		</div>
		<div class="player__stats-item">
			<span class="player__stats-icon player__stats-icon--money"></span>
			<span class="player__stats-number">{{states.money}}</span>
		</div>

		<div class="player__stats-item">
			<span class="player__stats-icon player__stats-icon--lives"></span>
			<span class="player__stats-number">{{lives}}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.player__stats {
		position: absolute;
		width: 100%;
		bottom: 0;
		height: 100px;
		display: flex;
		align-items: center;
		padding-left: 50px;
		background-color: #204361;

		&-item {
			margin-right: 50px;
			display: inline-flex;
			align-items: center;
		}

		&-icon {
			display: inline-block;
			width: 50px;
			height: 50px;
			background-size: contain;
			background-position: center;
			background-repeat: no-repeat;
			margin-right: 10px;

			&--energy {
				background-image: url("assets/img/icons/energy.png");
			}
			&--hunger {
				background-image: url("assets/img/icons/hunger.png");
			}
			&--injury {
				background-image: url("assets/img/icons/injury.png");
			}
			&--strength {
				background-image: url("assets/img/icons/strength.png");
			}
			&--money {
				background-image: url("assets/img/icons/money.png");
			}
			&--lives {
				background-image: url("assets/img/icons/lives.png");
			}
		}

		&-number {
			font-size: 40px;
			color: #65869e;
		}

		&-bar {
			display: inline-block;
			background-color: #65869e;
			height: 40px;

			&-wrap {
				height: 40px;
				display: inline-block;
				width: 200px;
				border: 4px solid white;
				background-color: #204361;
			}
		}

		> :last-child {
			margin-right: 0;
		}
	}
</style>

<script>
	module.exports = {
		name: 'PlayerStats',
		props: ['stats', 'states', 'lives'],
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
			getStatBarWidth(value) {
				return value + '%';
			},
		}
	}
</script>